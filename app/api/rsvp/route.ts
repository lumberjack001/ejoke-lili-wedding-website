import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, tableNumber, seatNumber } = await req.json();

    // 1. Validation
    if (!name || !email || !tableNumber || !seatNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Security Check: Is this a "Blocked" table? (Tables 1-8)
    if (tableNumber >= 1 && tableNumber <= 8) {
      return NextResponse.json({ error: 'This table is reserved for family.' }, { status: 403 });
    }

    // 3. Check for Double-Booking (Database Level)
    const { data: existingSeat } = await supabase
      .from('reservations')
      .select('id')
      .eq('table_number', tableNumber)
      .eq('seat_number', seatNumber)
      .single();

    if (existingSeat) {
      return NextResponse.json({ error: 'This seat was just taken! Please pick another.' }, { status: 409 });
    }

    // 4. Inside your POST function in route.ts
    const lowerEmail = email.toLowerCase().trim();
    const lowerName = name.toLowerCase().trim();

    // Check if either the name OR the email already exists (Case-Insensitive)
    const { data: existingUser, error } = await supabase
      .from('reservations')
      .select('id')
      // .ilike handles the case-insensitivity automatically
      .or(`email.ilike.${lowerEmail},name.ilike.${lowerName}`)
      .maybeSingle(); // maybeSingle is safer than .single() as it doesn't throw an error if 0 results

    if (existingUser) {
      return NextResponse.json(
        { error: "This name or email has already been used to reserve a seat." },
        { status: 400 }
      );
    }

    // 5. Check Global Capacity (170 public seats available)
    const { count } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });

    if (count !== null && count >= 170) {
      return NextResponse.json({ error: 'Sorry, the venue has reached full capacity.' }, { status: 400 });
    }

    // 6. Save to Supabase
    const { error: insertError } = await supabase
      .from('reservations')
      .insert([{
        name,
        email,
        table_number: tableNumber,
        seat_number: seatNumber
      }]);

    if (insertError) {
      // Check if the user already RSVP'd with that email
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'You have already reserved a seat!' }, { status: 400 });
      }
      throw insertError;
    }

    // 7. Send Confirmation Email
    if (resend) {
      await resend.emails.send({
        from: 'You Are Invited!!! <rsvp@lilywedsejoke.me>',
        to: email,
        subject: "Your Exclusive Wedding Invitation & Venue Details!",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
            <!-- Placeholder Invitation Header Image -->
            <div style="width: 100%; height: 280px; background-color: #f9f5f0; display: block; overflow: hidden; text-align: center;">
              <img src="https://unsplash.com/photos/text-p4IkVpz6NAA" alt="Lily & Ejoke Wedding Celebration" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            
            <div style="padding: 45px 40px;">
              <!-- Personalized Greeting -->
              <h1 style="color: #c79e70; text-align: center; font-family: 'Georgia', serif; font-size: 32px; font-weight: normal; margin-top: 0; letter-spacing: 0.5px;">
                Dearest ${name.split(' ')[0]},
              </h1>
              
              <p style="text-align: center; font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 35px;">
                We are absolutely overjoyed to confirm your attendance. It means the world to us to share the beginning of our forever with you by our side!
              </p>

              <!-- Elegant Reservation Box -->
              <div style="background-color: #fdfaf7; border-left: 4px solid #c79e70; border-right: 4px solid #c79e70; padding: 25px; border-radius: 8px; margin: 35px 0; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #a48259;">
                  Your Private Reservation
                </p>
                <h2 style="margin: 0; font-family: 'Georgia', serif; font-size: 26px; font-weight: normal; color: #333;">
                  Table ${tableNumber} &nbsp;&bull;&nbsp; Seat ${seatNumber}
                </h2>
              </div>

              <!-- Location & Map -->
              <div style="text-align: center; margin: 45px 0;">
                <h3 style="font-size: 18px; font-family: 'Georgia', serif; font-weight: normal; color: #333; margin-bottom: 12px;">The Venue</h3>
                <p style="font-size: 15px; color: #666; margin-bottom: 20px;">The ceremony and reception await you at our beautiful location. Click below for exact directions.</p>
                <a href="https://maps.google.com/?q=Wedding+Venue+Location" target="_blank" style="display: inline-block; background-color: #ffffff; color: #c79e70; border: 1px solid #c79e70; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 14px; letter-spacing: 1px; transition: all 0.3s;">
                  📍 Open Google Maps
                </a>
              </div>

              <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 40px 0;" />

              <!-- YouTube Stream Highlight -->
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="font-size: 18px; font-family: 'Georgia', serif; font-weight: normal; color: #333; margin-bottom: 12px;">Joining Virtually?</h3>
                <p style="font-size: 15px; color: #666; margin-bottom: 24px;">Celebrate with us from anywhere in the world on our live stream. It is scheduled to start at 12:00 PM WAT(Nigerian Time) on May 16, 2026.</p>
                <a href="https://youtube.com/live/TpxFaFDxBWQ?feature=share" target="_blank" style="display: inline-block; background-color: #c79e70; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 35px; font-weight: bold; font-size: 15px; letter-spacing: 1.5px; box-shadow: 0 4px 10px rgba(199, 158, 112, 0.4);">
                  ▶ WATCH LIVE STREAM
                </a>
              </div>

              <!-- Footer Notes -->
              <div style="background-color: #fafafa; padding: 25px; border-radius: 12px; text-align: center; margin-top: 45px;">
                <p style="margin: 0; font-size: 13px; color: #777; line-height: 1.6;">
                  This exclusive invitation is strictly dedicated to <strong style="color: #333;">${name}</strong>.<br/>
                  Please kindly keep your seat assignment private.
                </p>
              </div>

              <div style="text-align: center; margin-top: 35px;">
                <p style="font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">
                  &copy; 2026 Lily & Ejoke Wedding<br/><span style="font-size: 10px;">We can't wait to see you there!</span>
                </p>
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing RSVP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}