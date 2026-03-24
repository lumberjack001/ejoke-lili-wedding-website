import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Provide a mock client if no API key is present for development
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, tableNumber, seatNumber } = await req.json();

    if (!name || !email || !tableNumber || !seatNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the private venue link (using env variable or relative path)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const venueLink = `${siteUrl}/celebration-venue`;

    if (resend) {
      // Send the email realistically
      await resend.emails.send({
        from: 'Lily & Ejoke Wedding <rsvp@your-wedding-domain.com>', // Replace with verified domain
        to: email,
        subject: "Your Exclusive Wedding Invitation & Venue Details!",
        html: `
          <div style="font-family: serif; text-align: center; color: #333;">
            <h2>We're overjoyed you're coming, ${name}!</h2>
            <p>Your seat has been securely reserved:</p>
            <h3 style="color: #d1bfae;">Table ${tableNumber}, Seat ${seatNumber}</h3>
            <p>As promised, here is the exclusive link to our celebration venue details and schedule:</p>
            <a href="${venueLink}" style="display: inline-block; padding: 12px 24px; background-color: #d1bfae; color: #fff; text-decoration: none; border-radius: 50px; margin-top: 20px; font-weight: bold;">View Venue Details</a>
            <p style="margin-top: 40px; font-size: 12px; color: #888;">This invitation is strictly for you. Please do not share this link.</p>
          </div>
        `,
      });
    } else {
      console.log(`\n\x1b[32m[MOCK EMAIL NOTIFICATION]\x1b[0m`);
      console.log(`To: \x1b[36m${email}\x1b[0m`);
      console.log(`Name: ${name}`);
      console.log(`Reservation: Table ${tableNumber}, Seat ${seatNumber}`);
      console.log(`Venue Details Access Link: ${venueLink}\n`);
    }

    return NextResponse.json({ success: true, venueLink });
  } catch (error) {
    console.error('Error sending RSVP email:', error);
    return NextResponse.json({ error: 'Failed to complete RSVP notification' }, { status: 500 });
  }
}
