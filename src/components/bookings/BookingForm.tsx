import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
          {language === "ar" ? "نموذج الحجز" : "Booking Form"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === "ar" ? "العميل" : "Client"}
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
                {language === "ar" ? "اختر عميل" : "Select client"}
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
                {language === "ar" ? "التاريخ" : "Date"}
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
                {language === "ar" ? "الفترة" : "Time Slot"}
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
                  {language === "ar" ? "الصباح" : "Morning"}
                </option>
                <option value="EVENING">
                  {language === "ar" ? "المساء" : "Evening"}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "الحالة" : "Status"}
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
                  {language === "ar" ? "استفسار" : "Inquiry"}
                </option>
                <option value="RESERVED">
                  {language === "ar" ? "محجوز" : "Reserved"}
                </option>
                <option value="DEPOSIT_PAID">
                  {language === "ar" ? "الدفعة الأولى مدفوعة" : "Deposit Paid"}
                </option>
                <option value="CONFIRMED">
                  {language === "ar" ? "مؤكد" : "Confirmed"}
                </option>
                <option value="FULLY_PAID">
                  {language === "ar" ? "مدفوع بالكامل" : "Fully Paid"}
                </option>
                <option value="CANCELLED">
                  {language === "ar" ? "ملغى" : "Cancelled"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "السعر الإجمالي" : "Total Price"}
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
              {language === "ar" ? "المبلغ المدفوع" : "Paid Amount"}
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
              {language === "ar" ? "ملاحظات" : "Notes"}
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
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              {language === "ar" ? "حفظ" : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
