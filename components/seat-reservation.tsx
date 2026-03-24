'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Reveal } from '@/components/ui/reveal';
import { ArrowLeft } from 'lucide-react';

interface Seat {
  id: string;
  tableNumber: number;
  seatNumber: number;
  status: 'available' | 'reserved' | 'selected';
}

interface Table {
  id: string;
  tableNumber: number;
  status: 'available' | 'reserved';
  seats: Seat[];
}

const TOTAL_TABLES = 25;
const SEATS_PER_TABLE = 10;
const RESERVED_TABLES = 8; // First 8 tables are fully reserved

interface SeatReservationProps {
  onBack?: () => void;
}

export function SeatReservation({ onBack }: SeatReservationProps = {}) {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inside your Component
  // const [reservedSeats, setReservedSeats] = useState<{ table: number, seat: number }[]>([]);

  // useEffect(() => {
  //   async function fetchReservations() {
  //     const { data } = await supabase
  //       .from('reservations')
  //       .select('table_number, seat_number');

  //     if (data) {
  //       setReservedSeats(data.map(r => ({ table: r.table_number, seat: r.seat_number })));
  //     }
  //   }
  //   fetchReservations();
  // }, []);

  // Initialize tables and seats
  useEffect(() => {
    const initializeTables: Table[] = [];

    for (let t = 1; t <= TOTAL_TABLES; t++) {
      const isTableReserved = t <= RESERVED_TABLES;
      const seats: Seat[] = [];

      let allSeatsReserved = true;

      for (let s = 1; s <= SEATS_PER_TABLE; s++) {
        // For tables that aren't fully bulk-reserved, randomly reserve ~15% of individual seats for organic realism
        const isSeatReserved = isTableReserved ? true : Math.random() < 0.15;
        if (!isSeatReserved) allSeatsReserved = false;

        seats.push({
          id: `T${t}-S${s}`,
          tableNumber: t,
          seatNumber: s,
          status: isSeatReserved ? 'reserved' : 'available',
        });
      }

      initializeTables.push({
        id: `T${t}`,
        tableNumber: t,
        status: isTableReserved || allSeatsReserved ? 'reserved' : 'available',
        seats: seats
      });
    }

    setTables(initializeTables);
  }, []);

  const handleTableClick = (table: Table) => {
    if (table.status === 'available') {
      setActiveTable(table);
      setSelectedSeat(null); // Reset seat selection if switching tables
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat);
    }
  };

  const handleConfirmSeat = async () => {
    if (selectedSeat && activeTable && guestName && guestEmail) {
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/rsvp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: guestName,
            email: guestEmail,
            tableNumber: activeTable.tableNumber,
            seatNumber: selectedSeat.seatNumber,
          }),
        });

        if (response.ok) {
          setTables((prevTables) =>
            prevTables.map((table) => {
              if (table.id === activeTable.id) {
                return {
                  ...table,
                  seats: table.seats.map(s => s.id === selectedSeat.id ? { ...s, status: 'selected' } : s)
                };
              }
              return table;
            })
          );

          setActiveTable((prev) =>
            prev ? {
              ...prev,
              seats: prev.seats.map(s => s.id === selectedSeat.id ? { ...s, status: 'selected' } : s)
            } : null
          );

          setShowConfirmation(false);

          setTimeout(() => {
            alert(`Thank you, ${guestName}! Table ${activeTable.tableNumber}, Seat ${selectedSeat.seatNumber} is exclusively yours. Please check your email for the secret venue details!`);
            setSelectedSeat(null);
            setActiveTable(null);
            setGuestName('');
            setGuestEmail('');
          }, 500);
        } else {
          throw new Error('Failed to process RSVP');
        }
      } catch (error) {
        console.error('RSVP submission error:', error);
        alert('There was an error securely confirming your seat. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getSeatColor = (status: Seat['status']) => {
    switch (status) {
      case 'available':
        return 'bg-secondary/50 hover:bg-secondary border-accent/30 hover:border-accent/60 cursor-pointer shadow-sm hover:shadow-md';
      case 'reserved':
        return 'bg-muted border-muted-foreground/20 cursor-not-allowed opacity-60';
      case 'selected':
        return 'bg-primary border-primary text-primary-foreground shadow-md';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-3xl mx-auto">
      {/* Table & Seat Selection Section */}
      <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-3xl p-6 sm:p-10 border border-accent/20 min-h-[450px]">

        {/* Header & Legend */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <Reveal delay={0}>
            <h3 className="text-2xl sm:text-3xl font-serif text-foreground shrink-0">
              {activeTable ? `Table ${activeTable.tableNumber} Seats` : 'Select a Table'}
            </h3>
          </Reveal>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-5">
            <Reveal delay={100}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary/50 border border-accent/30" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-light">Available</span>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/20 opacity-60" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-light">Reserved</span>
              </div>
            </Reveal>
            {activeTable && (
              <Reveal delay={300}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary border border-primary" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-light">Your Seat</span>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* View toggling */}
        {!activeTable ? (
          /* Tables Grid */
          <div className="space-y-10">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
              {tables.map((table, i) => (
                <Reveal key={table.id} delay={100 + (i * 10)}>
                  <button
                    onClick={() => handleTableClick(table)}
                    disabled={table.status === 'reserved'}
                    title={table.status === 'reserved' ? 'Fully Reserved' : 'View Available Seats'}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${table.status === 'reserved'
                      ? 'bg-muted border border-muted-foreground/20 cursor-not-allowed opacity-60'
                      : 'bg-secondary/50 hover:bg-secondary border border-accent/30 hover:border-accent/60 cursor-pointer shadow-sm hover:shadow-md hover:scale-105'
                      }`}
                  >
                    <span className="text-sm sm:text-base font-medium">T{table.tableNumber}</span>
                  </button>
                </Reveal>
              ))}
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center justify-center mx-auto gap-2 text-xs sm:text-sm tracking-widest text-muted-foreground uppercase hover:text-foreground transition-colors py-2 px-4 rounded-full border border-transparent hover:border-accent/20 bg-white/50 hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
            )}
          </div>

        ) : (
          /* Seats Grid for chosen Table */
          <div className="animate-fade-in space-y-10">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 max-w-sm mx-auto">
              {activeTable.seats.map((seat, i) => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.status === 'reserved'}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border transition-all duration-300 flex items-center justify-center ${getSeatColor(seat.status)} ${seat.status === 'available' ? 'hover:scale-105' : ''}`}
                  title={`Seat ${seat.seatNumber}`}
                >
                  <span className="text-sm sm:text-base font-medium">{seat.seatNumber}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setActiveTable(null); setSelectedSeat(null); }}
              className="flex items-center justify-center mx-auto gap-2 text-xs sm:text-sm tracking-widest text-muted-foreground uppercase hover:text-foreground transition-colors py-2 px-4 rounded-full border border-transparent hover:border-accent/20 bg-white/50 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back to Tables
            </button>
          </div>
        )}
      </div>

      {/* Selected Seat Info & Confirm Button */}
      {selectedSeat && activeTable && (
        <div className="text-center animate-fade-in py-6">
          <Reveal delay={0}>
            <p className="text-xl font-serif text-foreground mb-6">
              You selected: <span className="font-bold text-primary">Table {activeTable.tableNumber}, Seat {selectedSeat.seatNumber}</span>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Button
              onClick={() => setShowConfirmation(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-light rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Confirm Reservation
            </Button>
          </Reveal>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="rounded-3xl border-accent/20 max-w-md">
          <AlertDialogTitle className="font-serif text-3xl mb-2 text-center">Confirm Your Seat</AlertDialogTitle>
          <AlertDialogDescription className="font-light text-base text-center leading-relaxed">
            You are about to securely reserve Table {activeTable?.tableNumber}, Seat {selectedSeat?.seatNumber}. This confirms your attendance at our wedding!
          </AlertDialogDescription>

          <div className="space-y-4 my-6 text-left">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Lily Doe"
                className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-secondary/10 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="lily@example.com"
                className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-secondary/10 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <AlertDialogCancel disabled={isSubmitting} className="rounded-full px-8 py-6 w-full sm:w-auto mt-0 border-accent/30 hover:bg-secondary/20">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSeat}
              disabled={!guestName.trim() || !guestEmail.trim() || isSubmitting}
              className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6 w-full sm:w-auto text-primary-foreground shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Confirming...' : "Yes, I'll be there!"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
