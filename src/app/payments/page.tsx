// src/app/payments/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  amount: number;
  method: string;
  type: string;
  status: string;
  paymentDate: string;
  notes?: string;
  booking: {
    id: string;
    title?: string;
    client: {
      fullName: string;
    };
  };
  staff: {
    username: string;
  };
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [filters, setFilters] = useState({
    method: "all",
    type: "all",
    status: "all",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setLanguage(user.language || "ar");
      }

      const response = await fetch("/api/payments");
      if (response.ok) {
        const paymentsData = await response.json();
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
    }
    setLoading(false);
  };

  const translateMethod = (method: string) => {
    const methodMap: { [key: string]: { ar: string; en: string } } = {
      CASH: { ar: "نقدي", en: "Cash" },
      CARD: { ar: "بطاقة", en: "Card" },
      BANK_TRANSFER: { ar: "تحويل بنكي", en: "Bank Transfer" },
      CHECK: { ar: "شيك", en: "Check" },
    };
    return methodMap[method]?.[language as "ar" | "en"] || method;
  };

  const translateType = (type: string) => {
    const typeMap: { [key: string]: { ar: string; en: string } } = {
      DEPOSIT: { ar: "عربون", en: "Deposit" },
      PARTIAL: { ar: "جزئي", en: "Partial" },
      FULL: { ar: "كامل", en: "Full" },
    };
    return typeMap[type]?.[language as "ar" | "en"] || type;
  };

  const translateStatus = (status: string) => {
    const statusMap: { [key: string]: { ar: string; en: string } } = {
      PENDING: { ar: "قيد الانتظار", en: "Pending" },
      COMPLETED: { ar: "مكتمل", en: "Completed" },
      FAILED: { ar: "فاشل", en: "Failed" },
      REFUNDED: { ar: "تم الاسترجاع", en: "Refunded" },
    };
    return statusMap[status]?.[language as "ar" | "en"] || status;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "error";
      case "REFUNDED":
        return "secondary";
      default:
        return "default";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (filters.method !== "all" && payment.method !== filters.method)
      return false;
    if (filters.type !== "all" && payment.type !== filters.type) return false;
    if (filters.status !== "all" && payment.status !== filters.status)
      return false;
    return true;
  });

  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const exportToCSV = () => {
    const csvContent = [
      ["Client", "Amount", "Method", "Type", "Status", "Date"],
      ...filteredPayments.map((payment) => [
        payment.booking.client.fullName,
        payment.amount,
        translateMethod(payment.method),
        translateType(payment.type),
        translateStatus(payment.status),
        new Date(payment.paymentDate).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {language === "ar" ? "إدارة المدفوعات" : "Payments Management"}
          </h1>
          <p className="text-orange-600/70">
            {language === "ar"
              ? "عرض وتتبع جميع المدفوعات"
              : "View and track all payments"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {language === "ar" ? "تصدير" : "Export"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  {language === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {totalRevenue.toLocaleString()} دج
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  {language === "ar" ? "المدفوعات" : "Total Payments"}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {payments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  {language === "ar" ? "معلقة" : "Pending"}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {payments.filter((p) => p.status === "PENDING").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  {language === "ar" ? "مكتملة" : "Completed"}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter((p) => p.status === "COMPLETED").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {language === "ar" ? "فلاتر المدفوعات" : "Payment Filters"}
            </span>
            <Filter className="w-5 h-5 text-orange-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "ar" ? "طريقة الدفع" : "Payment Method"}
              </label>
              <select
                value={filters.method}
                onChange={(e) =>
                  setFilters({ ...filters, method: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">
                  {language === "ar" ? "الكل" : "All"}
                </option>
                <option value="CASH">{translateMethod("CASH")}</option>
                <option value="CARD">{translateMethod("CARD")}</option>
                <option value="BANK_TRANSFER">
                  {translateMethod("BANK_TRANSFER")}
                </option>
                <option value="CHECK">{translateMethod("CHECK")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "ar" ? "نوع الدفع" : "Payment Type"}
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">
                  {language === "ar" ? "الكل" : "All"}
                </option>
                <option value="DEPOSIT">{translateType("DEPOSIT")}</option>
                <option value="PARTIAL">{translateType("PARTIAL")}</option>
                <option value="FULL">{translateType("FULL")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "ar" ? "الحالة" : "Status"}
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">
                  {language === "ar" ? "الكل" : "All"}
                </option>
                <option value="PENDING">{translateStatus("PENDING")}</option>
                <option value="COMPLETED">
                  {translateStatus("COMPLETED")}
                </option>
                <option value="FAILED">{translateStatus("FAILED")}</option>
                <option value="REFUNDED">{translateStatus("REFUNDED")}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ar" ? "قائمة المدفوعات" : "Payments List"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-pulse"
                >
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg">
                {language === "ar" ? "لا توجد مدفوعات" : "No payments found"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {payment.booking.client.fullName}
                      </h4>
                      {payment.booking.title && (
                        <span className="text-sm text-gray-600">
                          ({payment.booking.title})
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>{translateMethod(payment.method)}</span>
                      <span>{translateType(payment.type)}</span>
                      <span>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </span>
                      <span>{payment.staff.username}</span>
                    </div>
                    {payment.notes && (
                      <p className="text-sm text-gray-500 mt-2">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {payment.amount.toLocaleString()} دج
                    </p>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {translateStatus(payment.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
