import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, tableNumber, seatNumber, familyNames = [] } = await req.json();

    // 1. Validation
    if (!name || !email || !tableNumber || !seatNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Security Check: Blocked tables
    if (tableNumber >= 1 && tableNumber <= 8) {
      return NextResponse.json({ error: 'This table is reserved for family.' }, { status: 403 });
    }

    const totalSeatsRequired = 1 + familyNames.length;

    // 2.5 Abuse Prevention & Spam Limit (Max 5 seats per email)
    const { count: priorUserSeatsCount } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('booked_by_email', email.trim().toLowerCase());

    if (priorUserSeatsCount !== null && priorUserSeatsCount + totalSeatsRequired > 5) {
      return NextResponse.json({ error: 'To ensure all friends and family get a seat, each email is limited to 5 reservations maximum.' }, { status: 403 });
    }

    // 3. Check Global Capacity
    const { count } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });

    if (count !== null && count + totalSeatsRequired > 170) {
      return NextResponse.json({ error: 'Sorry, the venue has reached full capacity or cannot accommodate your entire group.' }, { status: 400 });
    }

    // 4. Verify selected seat is available
    const { data: existingTableSeats } = await supabase
      .from('reservations')
      .select('seat_number')
      .eq('table_number', tableNumber);

    const takenSeats = (existingTableSeats || []).map(r => r.seat_number);

    if (takenSeats.includes(seatNumber)) {
      return NextResponse.json({ error: 'Your primary seat was just taken! Please pick another.' }, { status: 409 });
    }

    // 5. Verify enough seats on the table for family
    const availableSeatsForFamily: number[] = [];
    for (let i = 1; i <= 10; i++) {
      if (i !== seatNumber && !takenSeats.includes(i)) {
        availableSeatsForFamily.push(i);
      }
    }

    if (familyNames.length > 0 && availableSeatsForFamily.length < familyNames.length) {
      return NextResponse.json({ error: `Not enough available seats on Table ${tableNumber} for your family. You need ${totalSeatsRequired} seats.` }, { status: 400 });
    }

    // 6. Build the inserts
    const groupId = randomUUID();
    const inserts: any[] = [];
    const assignedSeats = [seatNumber];

    inserts.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      table_number: tableNumber,
      seat_number: seatNumber,
      booked_by_email: email.trim().toLowerCase(),
      group_id: groupId
    });

    familyNames.forEach((famName: string, idx: number) => {
      const assigned = availableSeatsForFamily[idx];
      assignedSeats.push(assigned);
      inserts.push({
        name: famName.trim(),
        email: `family_seat_${assigned}_${email.trim().toLowerCase()}`,
        table_number: tableNumber,
        seat_number: assigned,
        booked_by_email: email.trim().toLowerCase(),
        group_id: groupId
      });
    });

    // 7. Save to Supabase
    const { error: insertError } = await supabase.from('reservations').insert(inserts);

    if (insertError) {
      console.error('Insert error details:', insertError);

      // Catch unique index violation (collision race condition)
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'Oops! Another guest snagged one of these seats a split-second ago. Please choose another!' }, { status: 409 });
      }

      return NextResponse.json({ error: `DB Error: ${insertError.message}` }, { status: 400 });
    }

    // 7.5. Optimistic Concurrency Control (Final strict capacity race check)
    const { count: finalCount } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });

    if (finalCount !== null && finalCount > 170) {
      // A race condition made us exceed 170! Rollback the transaction manually.
      await supabase.from('reservations').delete().eq('group_id', groupId);
      return NextResponse.json({ error: 'Sorry, the venue completely sold out at the exact second you clicked confirm!' }, { status: 400 });
    }

    // 8. Generate string of seats for email: e.g. "Seat 1, Seat 3, Seat 5"
    const seatsList = assignedSeats.join(', ');
    const receptionLink = `https://maps.app.goo.gl/7hbtrZ14sSfByCtQ7`;

    // 9. Send Confirmation Email to guests
    if (resend) {
      await resend.emails.send({
        from: 'Lilyfield & Ejoke <rsvp@lilywedsejoke.me>',
        to: email,
        subject: "Your Exclusive Wedding Invitation & Venue Details!",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">            
            <div style="padding: 45px 40px;">
              <h1 style="color: #c79e70; text-align: center; font-family: 'Georgia', serif; font-size: 32px; font-weight: normal; margin-top: 0; letter-spacing: 0.5px;">
                Dearest ${name.split(' ')[0]},
              </h1>
              
              <p style="text-align: center; font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 35px;">
                We are absolutely overjoyed to confirm your attendance. It means the world to us to share the beginning of our forever with you by our side!
              </p>

              <div style="background-color: #fdfaf7; border-left: 4px solid #c79e70; border-right: 4px solid #c79e70; padding: 25px; border-radius: 8px; margin: 35px 0; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #a48259;">
                  Your Private Reservation
                </p>
                <h2 style="margin: 0; font-family: 'Georgia', serif; font-size: 26px; font-weight: normal; color: #333;">
                  Table ${tableNumber} &nbsp;&bull;&nbsp; ${familyNames.length > 0 ? `Seats ${seatsList}` : `Seat ${seatNumber}`}
                </h2>
                ${familyNames.length > 0 ? `
                  <div style="margin-top: 20px; border-top: 1px solid #efe8df; padding-top: 15px;">
                    <p style="margin: 0; font-size: 14px; color: #333; font-weight: bold;">Group Booking Status: ${totalSeatsRequired} Guests Confirmed</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666; font-style: italic;">
                      ${[name, ...familyNames].join(', ')}
                    </p>
                  </div>
                ` : ''}
              </div>

              <div style="text-align: center; margin: 45px 0;">
                <h3 style="font-size: 18px; font-family: 'Georgia', serif; font-weight: normal; color: #333; margin-bottom: 12px;">The Venue</h3>
                <p style="font-size: 15px; color: #666; margin-bottom: 20px;">The ceremony and reception await you at our beautiful location. Click below for exact directions.</p>
                <a href="${receptionLink}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #c79e70; border: 1px solid #c79e70; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 14px; letter-spacing: 1px; transition: all 0.3s;">
                  📍 Open Google Maps
                </a>
              </div>

              <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 40px 0;" />

              <div style="text-align: center; margin: 40px 0;">
                <h3 style="font-size: 18px; font-family: 'Georgia', serif; font-weight: normal; color: #333; margin-bottom: 12px;">Joining Virtually?</h3>
                <p style="font-size: 15px; color: #666; margin-bottom: 24px;">Celebrate with us from anywhere in the world on our live stream. It is scheduled to start at 11:00 AM WAT(Nigerian Time) on May 16, 2026.</p>
                <a href="https://youtube.com/live/TpxFaFDxBWQ?feature=share" target="_blank" style="display: inline-block; background-color: #c79e70; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 35px; font-weight: bold; font-size: 15px; letter-spacing: 1.5px; box-shadow: 0 4px 10px rgba(199, 158, 112, 0.4);">
                  ▶ WATCH LIVE STREAM
                </a>
              </div>

              <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 40px 0;" />

              <div style="text-align: center; margin: 40px 0;">
                <h3 style="font-size: 18px; font-family: 'Georgia', serif; font-weight: normal; color: #333; margin-bottom: 12px;">Wedding Programme</h3>
                <p style="font-size: 15px; color: #666; margin-bottom: 24px;">Stay in the know — download the full order of events for the day so you don't miss a moment.</p>
                <!-- TODO: Replace the href below with your Cloudinary PDF/image link -->
                <a href="https://drive.google.com/file/d/1kjA9zyTGGOWhD273q97Qf0IzDX3MQ4-Z/view?usp=sharing" target="_blank" download style="display: inline-block; background-color: #ffffff; color: #c79e70; border: 2px solid #c79e70; text-decoration: none; padding: 14px 32px; border-radius: 35px; font-weight: bold; font-size: 15px; letter-spacing: 1.5px;">
                  Download Programme
                </a>
              </div>

              <div style="background-color: #fafafa; padding: 25px; border-radius: 12px; text-align: center; margin-top: 45px;">
                <p style="margin: 0; font-size: 13px; color: #777; line-height: 1.6;">
                  This exclusive invitation is strictly dedicated to <strong style="color: #333;">${name}${familyNames.length > 0 ? ` & Family` : ''}</strong>.<br/>
                  Please kindly keep your seat assignment private.
                </p>
              </div>

              <div style="text-align: center; margin-top: 35px;">
                <p style="font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">
                  &copy; 2026 Lilyfield & Ejoke Wedding<br/><span style="font-size: 10px;">We can't wait to see you there!</span>
                </p>
              </div>
            </div>
          </div>
        `,
      });

      // 10. Send Admin Push Notification
      await resend.emails.send({
        from: 'RSVP Alert <rsvp@lilywedsejoke.me>',
        to: ['vuwill7114@gmail.com', 'onalilly2012@gmail.com', 'itoya.shem2017@gmail.com'],
        subject: `🚨 New RSVP: ${name} reserved ${totalSeatsRequired} seat(s)!`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
            <div style="background-color: #2e8b57; color: white; padding: 18px; text-align: center; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h2 style="margin: 0; font-size: 22px;">New RSVP Received! 🎉</h2>
            </div>
            
            <div style="padding: 10px; color: #333; font-size: 15px;">
              <p style="margin-bottom: 10px;"><strong>Primary Guest:</strong> ${name}</p>
              <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
              <p style="margin-bottom: 10px;"><strong>Table:</strong> ${tableNumber}</p>
              <p style="margin-bottom: 10px;"><strong>Seats Assigned:</strong> ${totalSeatsRequired} <span style="color: #666; font-size: 14px;">(${familyNames.length > 0 ? `Seats ${seatsList}` : `Seat ${seatNumber}`})</span></p>
              
              ${familyNames.length > 0 ? `
                <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #2e8b57; border-radius: 0 6px 6px 0;">
                  <p style="margin: 0 0 8px 0; color: #2e8b57;"><strong>Family Members Included (${familyNames.length}):</strong></p>
                  <ul style="margin: 0; padding-left: 20px; color: #555;">
                    ${familyNames.map((f: string) => `<li style="margin-bottom: 4px;">${f}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
              <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">❤️Ejoke & Lilyfield Wedding System Alert</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, assignedSeats });

  } catch (error) {
    console.error('Error processing RSVP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}