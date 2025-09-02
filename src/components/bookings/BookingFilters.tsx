"use client";

import { t } from "@/i18n/useTranslate";

interface Client {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

type BookingFiltersProps = {
  filters: Record<string, any>;
  clients: Client[];
  onFiltersChange?: (filters: Record<string, any>) => void;
  language: "ar" | "en" | "fr";
};

export default function BookingFilters({
  filters,
  clients,
  onFiltersChange,
  language,
}: BookingFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange?.(newFilters);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-luxury">
      <h3 className="text-xl font-semibold mb-4 text-brand">
        {t("bookingFilters", language)}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Client Filter */}
        <select
          className="border rounded-lg p-2"
          value={filters.client || ""}
          onChange={(e) => updateFilter("client", e.target.value)}
        >
          <option value="">{t("selectClient", language)}</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.fullName}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="border rounded-lg p-2"
          value={filters.status || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">{t("selectStatus", language)}</option>
          <option value="confirmed">{t("confirmed", language)}</option>
          <option value="pending">{t("pending", language)}</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          className="border rounded-lg p-2"
          value={filters.date || ""}
          onChange={(e) => updateFilter("date", e.target.value)}
        />
      </div>
    </div>
  );
}
