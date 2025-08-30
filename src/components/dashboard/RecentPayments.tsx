// src/components/dashboard/RecentPayments.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RecentPayments({
  payments,
  bookings,
  loading,
  language,
}: any) {
  const recent = payments.slice(0, 5);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>
          {language === "ar" ? "المدفوعات الأخيرة" : "Recent Payments"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : recent.length === 0 ? (
          <p className="text-gray-500">
            {language === "ar" ? "لا توجد مدفوعات" : "No payments yet"}
          </p>
        ) : (
          <ul className="space-y-3">
            {recent.map((p: any) => {
              const booking = bookings.find(
                (b: any) => b.id === p.reservationId
              );
              return (
                <li
                  key={p.id}
                  className="p-3 border rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {language === "ar" ? "حجز #" : "Booking #"} {booking?.id}
                    </p>
                    <p className="text-sm text-gray-500">{p.type || "—"}</p>
                  </div>
                  <span className="text-sm text-green-600 font-bold">
                    {p.amount.toLocaleString()} دج
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
