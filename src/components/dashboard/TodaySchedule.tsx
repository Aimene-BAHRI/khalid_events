// src/components/dashboard/TodaySchedule.tsx
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function TodaySchedule({
  bookings,
  clients,
  loading,
  language,
}: any) {
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(
    (b: any) =>
      new Date(b.weddingDate || b.date).toISOString().split("T")[0] === today
  );

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>
          {language === "ar" ? "جدول اليوم" : "Today's Schedule"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : todayBookings.length === 0 ? (
          <p className="text-gray-500">
            {language === "ar"
              ? "لا توجد مواعيد اليوم"
              : "No appointments today"}
          </p>
        ) : (
          <ul className="space-y-3">
            {todayBookings.map((b: any) => {
              const client = clients.find((c: any) => c.id === b.clientId);
              return (
                <li
                  key={b.id}
                  className="p-3 bg-gray-50 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium">{client?.fullName || "—"}</p>
                    <p className="text-sm text-gray-500">
                      {client?.email || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {client?.phoneNumber || "—"}
                    </p>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">
                    {format(new Date(b.weddingDate || b.weddingDate), "p", {
                      locale: language === "ar" ? ar : enUS,
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
