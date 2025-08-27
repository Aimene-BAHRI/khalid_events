"use client";

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function BookingList({ bookings = [], loading, language }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-luxury">
      <h3 className="text-xl font-semibold mb-4 text-brand">
        {language === "ar" ? "قائمة الحجوزات" : "Booking List"}
      </h3>

      {loading ? (
        <p className="text-gray-400">
          {language === "ar" ? "جار التحميل..." : "Loading..."}
        </p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">
          {language === "ar" ? "لا توجد حجوزات" : "No bookings found"}
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand text-white">
              <th className="p-2 text-left">
                {language === "ar" ? "العميل" : "Client"}
              </th>
              <th className="p-2 text-left">
                {language === "ar" ? "التاريخ" : "Date"}
              </th>
              <th className="p-2 text-left">
                {language === "ar" ? "الحالة" : "Status"}
              </th>
              <th className="p-2 text-left">
                {language === "ar" ? "المبلغ" : "Amount"}
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any, idx: number) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{b.client?.fullName || "—"}</td>
                <td className="p-2">
                  {b.weddingDate
                    ? format(new Date(b.weddingDate), "PPP", {
                        locale: language === "ar" ? ar : enUS,
                      })
                    : "—"}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {language === "ar"
                      ? b.status === "confirmed"
                        ? "مؤكد"
                        : "قيد الانتظار"
                      : b.status}
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
