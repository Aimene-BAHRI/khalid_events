"use client";

import { t } from "@/i18n/useTranslate";
import { format } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale"; // 👈 add French
import { BookingStatus } from "@/types/bookings"; // assuming you exported your enum

type Language = "ar" | "en" | "fr";

const bookingStatusLabels: Record<BookingStatus, Record<Language, string>> = {
  [BookingStatus.INQUIRY]: {
    ar: "استعلام",
    en: "Inquiry",
    fr: "Demande",
  },
  [BookingStatus.RESERVED]: {
    ar: "محجوز",
    en: "Reserved",
    fr: "Réservé",
  },
  [BookingStatus.DEPOSIT_PAID]: {
    ar: "دفعة مقدمة مدفوعة",
    en: "Deposit Paid",
    fr: "Acompte payé",
  },
  [BookingStatus.CONFIRMED]: {
    ar: "مؤكد",
    en: "Confirmed",
    fr: "Confirmé",
  },
  [BookingStatus.FULLY_PAID]: {
    ar: "مدفوع بالكامل",
    en: "Fully Paid",
    fr: "Entièrement payé",
  },
  [BookingStatus.CANCELLED]: {
    ar: "ملغى",
    en: "Cancelled",
    fr: "Annulé",
  },
};

function getStatusLabel(status: BookingStatus, language: Language) {
  return bookingStatusLabels[status]?.[language] ?? status;
}

function getStatusClass(status: BookingStatus) {
  switch (status) {
    case BookingStatus.CONFIRMED:
    case BookingStatus.FULLY_PAID:
      return "bg-green-100 text-green-700";
    case BookingStatus.CANCELLED:
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function BookingList({ bookings = [], loading, language }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-luxury">
      <h3 className="text-xl font-semibold mb-4 text-brand">
        {t("bookingList", language as Language)}
      </h3>

      {loading ? (
        <p className="text-gray-400">{t("loading", language as Language)}</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">
          {t("noBookingsFound", language as Language)}
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand text-white">
              <th className="p-2 text-left">{t("client", language)}</th>
              <th className="p-2 text-left">{t("date", language)}</th>
              <th className="p-2 text-left">{t("status", language)}</th>
              <th className="p-2 text-left">{t("amount", language)}</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any, idx: number) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{b.client?.fullName || "—"}</td>
                <td className="p-2">
                  {b.weddingDate
                    ? format(new Date(b.weddingDate), "PPP", {
                        locale:
                          language === "ar"
                            ? ar
                            : language === "fr"
                            ? fr
                            : enUS,
                      })
                    : "—"}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusClass(
                      b.status as BookingStatus
                    )}`}
                  >
                    {getStatusLabel(b.status as BookingStatus, language)}
                  </span>
                </td>
                <td className="p-2 text-brand">{b.amount || 0} دج</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
