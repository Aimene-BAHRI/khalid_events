"use client";

import { t } from "@/i18n/useTranslate";
import { useState } from "react";

export default function BookingFilters({
  filters,
  clients,
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
        {t("bookingFilters", language as "ar" | "en" | "fr")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client Filter */}
        <select
          className="border rounded-lg p-2"
          value={localFilters.client || ""}
          onChange={(e) => updateFilter("client", e.target.value)}
        >
          <option value="">
            {t("selectClient", language as "ar" | "en" | "fr")}
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.fullName}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="border rounded-lg p-2"
          value={localFilters.status || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">
            {t("selectStatus", language as "ar" | "en" | "fr")}
          </option>
          <option value="confirmed">
            {t("confirmed", language as "ar" | "en" | "fr")}
          </option>
          <option value="pending">
            {t("pending", language as "ar" | "en" | "fr")}
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
