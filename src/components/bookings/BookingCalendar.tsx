"use client";

import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import arLocale from "@fullcalendar/core/locales/ar";
import enLocale from "@fullcalendar/core/locales/en-gb";
import { t } from "@/i18n/useTranslate";

type Booking = {
  id: string;
  title?: string;
  client?: { fullName?: string };
  weddingDate: string;
  [key: string]: any;
};

export default function BookingCalendar({
  bookings,
  clients,
  loading,
  language,
  onEditBooking,
  user,
}: any) {
  const calendarRef = useRef<any>(null);

  const events = bookings.map((b: Booking) => ({
    id: b.id,
    title: b.title || b.client?.fullName || "Wedding",
    start: b.weddingDate,
    end: b.weddingDate,
    extendedProps: {
      ...b,
    },
  }));

  const handleDateSelect = (info: any) => {
    // New booking → pass default booking object to parent
    const newBooking = {
      date: info.startStr,
      clientId: "",
      timeSlot: "EVENING",
      status: "INQUIRY",
      totalPrice: "",
      paidAmount: "",
      notes: "",
    };
    onEditBooking?.(newBooking);
  };

  const handleEventClick = (info: any) => {
    // Editing an existing booking → pass full booking back to parent
    onEditBooking?.(info.event.extendedProps);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold mb-4">
        {t("bookingCalendar", language as "ar" | "en" | "fr")}
      </h3>

      {loading ? (
        <p className="text-gray-500">
          {t("loading", language as "ar" | "en" | "fr")}
        </p>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[arLocale, enLocale]}
          locale={language === "ar" ? "ar" : "en-gb"}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
        />
      )}
    </div>
  );
}
