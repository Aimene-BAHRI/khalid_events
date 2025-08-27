// src/components/dashboard/UpcomingEvents.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function UpcomingEvents({
  bookings,
  clients,
  loading,
  language,
}: any) {
  const upcoming = bookings
    .filter((b: any) => new Date(b.weddingDate || b.date) > new Date())
    .slice(0, 5); // show next 5 only

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>
          {language === "ar" ? "الأحداث القادمة" : "Upcoming Events"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-500">
            {language === "ar" ? "لا توجد أحداث قادمة" : "No upcoming events"}
          </p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((b: any) => {
              const client = clients.find((c: any) => c.id === b.clientId);
              return (
                <li
                  key={b.id}
                  className="p-3 border rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium">{client?.fullName || "—"}</p>
                    <p className="text-sm text-gray-500">{b.email || "—"}</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">
                    {format(
                      new Date(b.weddingDate || b.weddingDate || b.date),
                      "d MMM yyyy",
                      {
                        locale: language === "ar" ? ar : enUS,
                      }
                    )}
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
