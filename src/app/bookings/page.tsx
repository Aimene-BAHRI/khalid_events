// src/app/bookings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

import BookingForm from "@/components/bookings/BookingForm";
import BookingList from "@/components/bookings/BookingList";
import BookingCalendar from "@/components/bookings/BookingCalendar";
import BookingFilters from "@/components/bookings/BookingFilters";
import { t } from "@/i18n/useTranslate";
import { useLanguage } from "../context/languageContext";
export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: "all",
    timeSlot: "all",
    dateRange: "all",
  });
  const [view, setView] = useState("calendar");

  useEffect(() => {
    loadData();
  }, []);

  const exportBookingsCSV = async () => {
    try {
      const res = await fetch("/api/bookings/export");
      if (!res.ok) throw new Error("Failed to export CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Create temporary link to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "bookings.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export bookings CSV");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      }

      const [bookingsRes, clientsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/clients"),
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
    setLoading(false);
  };

  const handleSaveBooking = async (bookingData: any) => {
    try {
      const res = await fetch("/api/bookings", {
        method: editingBooking && editingBooking.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Failed to save booking");

      await loadData();
      setShowForm(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleEditBooking = (booking: any) => {
    // If it's a new booking (from calendar date click), booking won’t have an id
    if (!booking.id) {
      setEditingBooking({
        ...booking,
        timeSlot: booking.timeSlot || "EVENING",
        status: booking.status || "INQUIRY",
      });
    } else {
      setEditingBooking(booking);
    }
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBooking(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {t("bookingManagement", language)}
          </h1>
          <p className="text-orange-600/70">
            {t("viewAndManageAllVenueBookings", language)}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex rounded-lg border border-orange-200 p-1">
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
              className={
                view === "calendar"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "hover:bg-orange-50"
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t("Calendar", language)}
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className={
                view === "list"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "hover:bg-orange-50"
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              {t("List", language)}
            </Button>
          </div>

          <Button
            onClick={() =>
              handleEditBooking({
                date: new Date().toISOString().split("T")[0],
                clientId: "",
                timeSlot: "EVENING",
                status: "INQUIRY",
                totalPrice: "",
                paidAmount: "",
                notes: "",
              })
            }
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("newBooking", language)}
          </Button>
          <Button
            onClick={exportBookingsCSV}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            {t("exportCSV", language)}
          </Button>
        </div>
      </div>

      {/* Booking Form */}
      {showForm && (
        <BookingForm
          booking={editingBooking}
          clients={clients}
          onSave={handleSaveBooking}
          onCancel={handleCancelForm}
          user={user}
        />
      )}

      {/* Filters for list view */}
      {view === "list" && (
        <BookingFilters
          filters={filters}
          clients={clients}
          onFiltersChange={(newFilters) =>
            setFilters((prev) => ({ ...prev, ...newFilters }))
          }
          language={language}
        />
      )}

      {/* Calendar / List view */}
      {view === "calendar" ? (
        <BookingCalendar
          bookings={bookings}
          clients={clients}
          onEditBooking={handleEditBooking} // 🔑 connected here
          loading={loading}
          language={language}
          user={user}
        />
      ) : (
        <BookingList
          bookings={bookings}
          clients={clients}
          filters={filters}
          onEditBooking={handleEditBooking}
          loading={loading}
          language={language}
        />
      )}
    </div>
  );
}
