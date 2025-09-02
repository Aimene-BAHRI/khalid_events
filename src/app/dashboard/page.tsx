// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, Clock, Heart, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

import StatsCard from "@/components/dashboard/StatsCard";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import RecentPayments from "@/components/dashboard/RecentPayments";
import { t } from "@/i18n/useTranslate";

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState("ar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // get user (localStorage or future auth)
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setLanguage(parsed.language || "ar");
      }

      // fetch all dashboard data
      const [bookingsRes, paymentsRes, clientsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/payments"),
        fetch("/api/clients"),
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setLoading(false);
  };

  const getStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const todayBookings = bookings.filter(
      (b: any) =>
        new Date(b.weddingDate || b.date).toISOString().split("T")[0] === today
    );

    const monthlyPayments = payments.filter((p: any) => {
      const d = new Date(p.paymentDate || p.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const upcomingBookings = bookings.filter(
      (b: any) => new Date(b.weddingDate || b.date) > new Date()
    );

    const pendingPayments = bookings.filter(
      (b: any) => (b.totalPrice || 0) > (b.paidAmount || 0)
    );

    const monthlyRevenue = monthlyPayments.reduce(
      (sum: number, p: any) => sum + (p.amount || 0),
      0
    );

    return {
      todayAppointments: todayBookings.length,
      monthlyRevenue,
      upcomingEvents: upcomingBookings.length,
      pendingPayments: pendingPayments.length,
    };
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {t("dashboard", language as "ar" | "fr" | "en")}
          </h1>
          <p className="text-orange-600/70">
            {t("WelcomeMessage", language as "ar" | "fr" | "en")}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-orange-600">
          <Heart className="w-4 h-4" />
          <span>
            {language === "ar"
              ? format(new Date(), "EEEE، d MMMM yyyy", { locale: ar })
              : format(new Date(), "EEEE, MMMM d, yyyy", { locale: enUS })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t("todayAppointments", language as "ar" | "fr" | "en")}
          value={stats.todayAppointments}
          icon={Calendar}
          color="orange"
          loading={loading}
          language={language}
        />
        <StatsCard
          title={t("monthlyRevenue", language as "ar" | "fr" | "en")}
          value={`${stats.monthlyRevenue.toLocaleString()} دج`}
          icon={DollarSign}
          color="green"
          loading={loading}
          language={language}
        />
        <StatsCard
          title={t("upcomingEvents", language as "ar" | "fr" | "en")}
          value={stats.upcomingEvents}
          icon={Clock}
          color="blue"
          loading={loading}
          language={language}
        />
        <StatsCard
          title={t("pendingPayments", language as "ar" | "fr" | "en")}
          value={stats.pendingPayments}
          icon={TrendingUp}
          color="rose"
          loading={loading}
          language={language}
        />
      </div>

      {/* Widgets */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodaySchedule
            bookings={bookings}
            clients={clients}
            loading={loading}
            language={language}
          />
          <UpcomingEvents
            bookings={bookings}
            clients={clients}
            loading={loading}
            language={language}
          />
        </div>

        <div>
          <RecentPayments
            payments={payments}
            bookings={bookings}
            loading={loading}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
