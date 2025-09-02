// src/components/dashboard/RecentPayments.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { t } from "@/i18n/useTranslate";

export default function RecentPayments({ payments, loading, language }: any) {
  const recent = payments.slice(0, 5);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>
          {t("recentPayments", language as "ar" | "en" | "fr")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500">
            {t("loading", language as "ar" | "en" | "fr")}
          </p>
        ) : recent.length === 0 ? (
          <p className="text-gray-500">
            {t("noPaymentsYet", language as "ar" | "en" | "fr")}
          </p>
        ) : (
          <ul className="space-y-3">
            {recent.map((p: any, index: number) => {
              const booking = p.booking;
              return (
                <li
                  key={p.id}
                  className="p-3 border rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {t("booking", language as "ar" | "en" | "fr")}
                      {index + 1 || "—"} <br />
                      {booking?.title || booking?.client?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {p.type || "—"} •{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
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
