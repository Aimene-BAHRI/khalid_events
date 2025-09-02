import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { t } from "@/i18n/useTranslate";

interface BookingFormProps {
  booking?: any;
  clients: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
  language: string;
  user: any;
}

const BookingForm: React.FC<BookingFormProps> = ({
  booking,
  clients,
  onSave,
  onCancel,
  language,
  user,
}) => {
  const [formData, setFormData] = useState({
    clientId: booking?.clientId || "",
    userId: user?.id || "",
    date: booking?.date
      ? new Date(booking.date).toISOString().split("T")[0]
      : "",
    timeSlot: booking?.timeSlot || "EVENING",
    status: booking?.status || "PENDING",
    totalPrice: booking?.totalPrice || "",
    paidAmount: booking?.paidAmount || "",
    notes: booking?.notes || "",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="fixed inset-0 m-auto max-w-2xl h-fit max-h-[90vh] overflow-y-auto z-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {t("bookingForm", language as "ar" | "en" | "fr")}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("client", language as "ar" | "en" | "fr")}
            </label>
            <select
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("date", language as "ar" | "en" | "fr")}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("timeSlot", language as "ar" | "en" | "fr")}
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) =>
                  setFormData({ ...formData, timeSlot: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="MORNING">
                  {t("morning", language as "ar" | "en" | "fr")}
                </option>
                <option value="EVENING">
                  {t("evening", language as "ar" | "en" | "fr")}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("status", language as "ar" | "en" | "fr")}
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              >
                {/* bookig status option enum BookingStatus {
                  INQUIRY
                  RESERVED
                  DEPOSIT_PAID
                  CONFIRMED
                  FULLY_PAID
                  CANCELLED
                } */}
                <option value="INQUIRY">
                  {t("inquiry", language as "ar" | "en" | "fr")}
                </option>
                <option value="RESERVED">
                  {t("reserved", language as "ar" | "en" | "fr")}
                </option>
                <option value="DEPOSIT_PAID">
                  {t("depositPaid", language as "ar" | "en" | "fr")}
                </option>
                <option value="CONFIRMED">
                  {t("confirmed", language as "ar" | "en" | "fr")}
                </option>
                <option value="FULLY_PAID">
                  {t("fullyPaid", language as "ar" | "en" | "fr")}
                </option>
                <option value="CANCELLED">
                  {t("cancelled", language as "ar" | "en" | "fr")}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("totalPrice", language as "ar" | "en" | "fr")}
              </label>
              <input
                type="number"
                value={formData.totalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, totalPrice: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("paidAmount", language as "ar" | "en" | "fr")}
            </label>
            <input
              type="number"
              value={formData.paidAmount}
              onChange={(e) =>
                setFormData({ ...formData, paidAmount: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("notes", language as "ar" | "en" | "fr")}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel", language as "ar" | "en" | "fr")}
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              {t("save", language as "ar" | "en" | "fr")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
