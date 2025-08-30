"use client";

import { useState } from "react";
import BookingCalendar from "@/components/bookings/BookingCalendar";
import BookingList from "@/components/bookings/BookingList";

interface BookingDashboardProps {
  language?: string;
  user: any; // Replace 'any' with a more specific type if available
}

export default function BookingDashboard({
  language = "en",
  user,
}: BookingDashboardProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBookingCreated = (newBooking: any) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  const handleBookingUpdated = (updated: any) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleBookingDeleted = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <BookingCalendar
          bookings={bookings}
          loading={loading}
          language={language}
          onBookingCreated={handleBookingCreated}
          onBookingUpdated={handleBookingUpdated}
          onBookingDeleted={handleBookingDeleted}
          user={user}
        />
      </div>
      <div>
        <BookingList
          bookings={bookings}
          loading={loading}
          language={language}
        />
      </div>
    </div>
  );
}
