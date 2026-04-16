'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader
} from '@/components/ui/alert-dialog';
import { Reveal } from '@/components/ui/reveal';
import { ArrowLeft, Loader2, Check, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
const BLOCKED_TABLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

interface SeatReservationProps {
  onBack?: () => void;
  onTrouble?: () => void;
}

export function SeatReservation({ onBack, onTrouble }: SeatReservationProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    async function loadSeatingData() {
      setIsLoadingData(true);
      try {
        const { data: dbReservations, error } = await supabase
          .from('reservations')
          .select('table_number, seat_number');

        if (error) throw error;

        const generatedTables: Table[] = [];
        for (let t = 1; t <= TOTAL_TABLES; t++) {
          const isFamilyTable = BLOCKED_TABLE_NUMBERS.includes(t);
          const seats: Seat[] = [];
          let takenSeatsCount = 0;

          for (let s = 1; s <= SEATS_PER_TABLE; s++) {
            const isReservedInDB = dbReservations?.some(
              (r) => r.table_number === t && r.seat_number === s
            );
            const isReserved = isFamilyTable || isReservedInDB;
            if (isReserved) takenSeatsCount++;

            seats.push({
              id: `T${t}-S${s}`,
              tableNumber: t,
              seatNumber: s,
              status: isReserved ? 'reserved' : 'available',
            });
          }

          generatedTables.push({
            id: `T${t}`,
            tableNumber: t,
            status: takenSeatsCount === SEATS_PER_TABLE ? 'reserved' : 'available',
            seats: seats,
          });
        }
        setTables(generatedTables);
      } catch (err) {
        console.error("Error loading seating:", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadSeatingData();
  }, []);

  const handleTableClick = (table: Table) => {
    if (BLOCKED_TABLE_NUMBERS.includes(table.tableNumber)) return;
    if (table.status === 'available') {
      setActiveTable(table);
      setSelectedSeat(null);
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat);
    }
  };

  const handleConfirmSeat = async () => {
    if (!selectedSeat || !activeTable || !guestName || !guestEmail) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName,
          email: guestEmail,
          tableNumber: activeTable.tableNumber,
          seatNumber: selectedSeat.seatNumber,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to process RSVP');

      // Update local UI
      setTables(prev => prev.map(t => {
        if (t.tableNumber === activeTable.tableNumber) {
          return {
            ...t,
            seats: t.seats.map(s => s.seatNumber === selectedSeat.seatNumber ? { ...s, status: 'reserved' } : s)
          };
        }
        return t;
      }));

      setSubmitStatus('success');
      setSubmitMessage(`Sharp!
        You just reserved Table ${activeTable.tableNumber}, Seat ${selectedSeat.seatNumber} all to yourself. \n
        please make sure to check your emails and spam for your reservation details\n
        Can't wait to see you there!`);
    } catch (error: any) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeatColor = (status: Seat['status'], isCurrentSelection: boolean, tNum: number) => {
    if (BLOCKED_TABLE_NUMBERS.includes(tNum)) return 'bg-muted border-muted-foreground/20 cursor-not-allowed opacity-40';
    if (isCurrentSelection) return 'bg-primary border-primary text-primary-foreground shadow-md scale-110';

    switch (status) {
      case 'available': return 'bg-secondary/50 hover:bg-secondary border-accent/30 cursor-pointer shadow-sm';
      case 'reserved': return 'bg-muted border-muted-foreground/20 cursor-not-allowed opacity-60';
      default: return '';
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-serif text-muted-foreground">Loading seating chart...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-3xl p-6 sm:p-10 border border-accent/20 min-h-[450px]">

        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <Reveal delay={0}>
            <h3 className="text-2xl sm:text-3xl font-serif text-foreground shrink-0">
              {!activeTable ? 'Select a Table' : selectedSeat ? 'Confirm Selection' : `Table ${activeTable.tableNumber} Seats`}
            </h3>
          </Reveal>
          {/* Legend */}
          {!selectedSeat && (
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary/50 border border-accent/30" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/20 opacity-60" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Reserved</span>
              </div>
              {activeTable && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Your Selection</span>
                </div>
              )}
            </div>
          )}
        </div>

        {!activeTable ? (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
              {tables.map((table) => {
                const isBlocked = BLOCKED_TABLE_NUMBERS.includes(table.tableNumber);
                return (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    disabled={table.status === 'reserved' || isBlocked}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all ${(table.status === 'reserved' || isBlocked)
                      ? 'bg-muted border border-muted-foreground/20 cursor-not-allowed opacity-60'
                      : 'bg-secondary/50 hover:bg-secondary border border-accent/30 cursor-pointer shadow-sm hover:scale-105'
                      }`}
                  >
                    <span className="text-sm font-medium">T{table.tableNumber}</span>
                    {isBlocked && <span className="text-[8px] uppercase font-bold text-muted-foreground">VIP</span>}
                  </button>
                );
              })}
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="mt-4 mx-auto flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Go back
              </button>
            )}
          </div>
        ) : !selectedSeat ? (
          <div className="animate-fade-in space-y-10">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 max-w-sm mx-auto">
              {activeTable.seats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.status === 'reserved'}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border transition-all duration-300 flex items-center justify-center ${getSeatColor(seat.status, false, activeTable.tableNumber)}`}
                >
                  <span className="text-sm font-medium">{seat.seatNumber}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setActiveTable(null); setSelectedSeat(null); }}
              className="mx-auto flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Tables
            </button>
          </div>
        ) : (
          <div className="text-center animate-fade-in py-10 flex flex-col items-center">
            <Reveal delay={0}>
              <p className="text-xl sm:text-2xl font-serif text-foreground mb-8">
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
            <Reveal delay={400}>
              <button
                onClick={() => setSelectedSeat(null)}
                className="mt-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change Seat
              </button>
            </Reveal>
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={(open) => {
        if (!open) {
          if (submitStatus === 'success') {
            setSelectedSeat(null);
            setActiveTable(null);
            setGuestName('');
            setGuestEmail('');
          }
          setSubmitStatus('idle');
          setSubmitMessage('');
        }
        setShowConfirmation(open);
      }}>
        <AlertDialogContent className="rounded-3xl border-accent/20 max-w-md">
          {submitStatus === 'idle' ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif text-3xl mb-2 text-center">Confirm Your Seat</AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  Please enter your details to reserve Table {activeTable?.tableNumber}, Seat {selectedSeat?.seatNumber}.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 my-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="space-y-1">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 ${guestEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)
                      ? "border-red-500/50 focus:ring-red-500/50"
                      : "border-accent/20"
                      }`}
                  />
                  {guestEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail) && (
                    <p className="text-xs text-red-500/90 pl-2">Please enter a valid email address.</p>
                  )}
                </div>
              </div>

              <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
                <AlertDialogCancel disabled={isSubmitting} className="rounded-full">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleConfirmSeat();
                  }}
                  disabled={!guestName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail) || isSubmitting}
                  className="bg-primary hover:bg-primary/90 rounded-full"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm RSVP"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : submitStatus === 'success' ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100/50 rounded-full flex items-center justify-center mb-6 border border-green-200">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <AlertDialogTitle className="text-2xl mb-2 text-center">Reservation Confirmed!</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm mb-8 text-muted-foreground w-80">
                {submitMessage}
              </AlertDialogDescription>
              <AlertDialogAction className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 w-[50%] sm:w-auto text-lg" onClick={() => setShowConfirmation(false)}>
                Awesome!
              </AlertDialogAction>
            </div>
          ) : (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100/50 rounded-full flex items-center justify-center mb-6 border border-red-200">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <AlertDialogTitle className=" text-2xl mb-2 text-center">Oops!</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm mb-8 text-red-600/90">
                {submitMessage}
              </AlertDialogDescription>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <AlertDialogCancel className="rounded-full px-8 py-6 w-full sm:w-auto" onClick={() => setSubmitStatus('idle')}>Try Again</AlertDialogCancel>
                {onTrouble && (
                  <AlertDialogAction className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 w-full sm:w-auto" onClick={() => { setShowConfirmation(false); onTrouble(); }}>Need help?</AlertDialogAction>
                )}
                {!onTrouble && (
                  <AlertDialogAction className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 w-full sm:w-auto " onClick={() => setShowConfirmation(false)}>Close</AlertDialogAction>
                )}
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}