"use client";

import { useState } from "react";

export default function BookingFilters({
  filters,
  onFiltersChange,
  language,
}: any) {
  const [localFilters, setLocalFilters] = useState(filters || {});

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-luxury">
      <h3 className="text-xl font-semibold mb-4 text-brand">
        {language === "ar" ? "فلاتر الحجوزات" : "Booking Filters"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client Filter */}
        <select
          className="border rounded-lg p-2"
          value={localFilters.client || ""}
          onChange={(e) => updateFilter("client", e.target.value)}
        >
          <option value="">
            {language === "ar" ? "اختر العميل" : "Select Client"}
          </option>
          <option value="client1">Client 1</option>
          <option value="client2">Client 2</option>
        </select>

        {/* Status Filter */}
        <select
          className="border rounded-lg p-2"
          value={localFilters.status || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">
            {language === "ar" ? "اختر الحالة" : "Select Status"}
          </option>
          <option value="confirmed">
            {language === "ar" ? "مؤكد" : "Confirmed"}
          </option>
          <option value="pending">
            {language === "ar" ? "قيد الانتظار" : "Pending"}
          </option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          className="border rounded-lg p-2"
          value={localFilters.date || ""}
          onChange={(e) => updateFilter("date", e.target.value)}
        />
      </div>
    </div>
  );
}
