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
        from: 'onboarding@resend.dev',
        to: email,
        subject: "Your Exclusive Wedding Invitation & Venue Details!",
        html: `
          <div style="font-family: serif; text-align: center; color: #333; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #d1bfae;">We're overjoyed you're coming, ${name}!</h2>
            <p>Your seat has been securely reserved:</p>
            <div style="background: #fdfaf7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0; color: #333;">Table ${tableNumber}, Seat ${seatNumber}</h3>
            </div>
            <p>This invitation is strictly for you. Please do not share this confirmation.</p>
            <p style="margin-top: 40px; font-size: 12px; color: #888;">&copy; 2026 Lily & Ejoke Wedding</p>
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