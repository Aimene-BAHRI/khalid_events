// src/components/dashboard/UpcomingEvents.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { t } from "@/i18n/useTranslate";

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
          {t("upcomingEvents", language as "ar" | "en" | "fr")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500">
            {t("loading", language as "ar" | "en" | "fr")}
          </p>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-500">
            {t("noUpcomingEvents", language as "ar" | "en" | "fr")}
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
