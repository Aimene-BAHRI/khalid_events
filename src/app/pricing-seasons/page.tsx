// src/app/pricing-seasons/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingSeason {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  morningPrice: number;
  eveningPrice: number;
  isActive: boolean;
}

export default function PricingSeasons() {
  const [seasons, setSeasons] = useState<PricingSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [showForm, setShowForm] = useState(false);
  const [editingSeason, setEditingSeason] = useState<PricingSeason | null>(
    null
  );

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

      const response = await fetch("/api/pricing-seasons");
      if (response.ok) {
        const seasonsData = await response.json();
        setSeasons(seasonsData);
      }
    } catch (error) {
      console.error("Error loading pricing seasons:", error);
    }
    setLoading(false);
  };

  const handleDeleteSeason = async (id: string) => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من حذف هذا الموسم؟"
          : "Are you sure you want to delete this season?"
      )
    ) {
      try {
        const response = await fetch(`/api/pricing-seasons/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setSeasons(seasons.filter((season) => season.id !== id));
        }
      } catch (error) {
        console.error("Error deleting season:", error);
      }
    }
  };

  const toggleSeasonStatus = async (season: PricingSeason) => {
    try {
      const response = await fetch(`/api/pricing-seasons/${season.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...season,
          isActive: !season.isActive,
        }),
      });

      if (response.ok) {
        const updatedSeason = await response.json();
        setSeasons(
          seasons.map((s) => (s.id === updatedSeason.id ? updatedSeason : s))
        );
      }
    } catch (error) {
      console.error("Error updating season:", error);
    }
  };

  const currentDate = new Date();
  const currentSeason = seasons.find((season) => {
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);
    return currentDate >= start && currentDate <= end && season.isActive;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {language === "ar" ? "الأسعار الموسمية" : "Pricing Seasons"}
          </h1>
          <p className="text-orange-600/70">
            {language === "ar"
              ? "إدارة أسعار المواسم المختلفة"
              : "Manage pricing for different seasons"}
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === "ar" ? "موسم جديد" : "New Season"}
        </Button>
      </div>

      {/* Current Season Info */}
      {currentSeason && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              {language === "ar" ? "الموسم الحالي" : "Current Season"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-green-600">
                  {language === "ar" ? "اسم الموسم" : "Season Name"}
                </p>
                <p className="font-semibold text-green-800">
                  {currentSeason.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-600">
                  {language === "ar" ? "الفترة" : "Period"}
                </p>
                <p className="font-semibold text-green-800">
                  {new Date(currentSeason.startDate).toLocaleDateString()} -{" "}
                  {new Date(currentSeason.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-600">
                  {language === "ar" ? "الأسعار" : "Prices"}
                </p>
                <p className="font-semibold text-green-800">
                  {language === "ar" ? "صباح: " : "Morning: "}
                  {currentSeason.morningPrice.toLocaleString()} دج
                  <br />
                  {language === "ar" ? "مساء: " : "Evening: "}
                  {currentSeason.eveningPrice.toLocaleString()} دج
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seasons List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "ar" ? "قائمة المواسم" : "Seasons List"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
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
          ) : seasons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg">
                {language === "ar"
                  ? "لا توجد مواسم أسعار"
                  : "No pricing seasons found"}
              </p>
              <p className="text-sm mt-2">
                {language === "ar"
                  ? "انقر على زر إضافة موسم لبدء إدارة الأسعار الموسمية"
                  : "Click the Add Season button to start managing seasonal pricing"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {seasons.map((season) => (
                <div
                  key={season.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {season.name}
                      </h4>
                      <Badge
                        variant={season.isActive ? "success" : "secondary"}
                      >
                        {season.isActive
                          ? language === "ar"
                            ? "نشط"
                            : "Active"
                          : language === "ar"
                          ? "غير نشط"
                          : "Inactive"}
                      </Badge>
                      {currentDate >= new Date(season.startDate) &&
                        currentDate <= new Date(season.endDate) && (
                          <Badge variant="default">
                            {language === "ar" ? "حالي" : "Current"}
                          </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">
                          {language === "ar" ? "من:" : "From:"}
                        </span>{" "}
                        {new Date(season.startDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === "ar" ? "إلى:" : "To:"}
                        </span>{" "}
                        {new Date(season.endDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === "ar" ? "الأسعار:" : "Prices:"}
                        </span>{" "}
                        {language === "ar" ? "صباح " : "Morning "}
                        {season.morningPrice.toLocaleString()} دج
                        {", "}
                        {language === "ar" ? "مساء " : "Evening "}
                        {season.eveningPrice.toLocaleString()} دج
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSeasonStatus(season)}
                      className={
                        season.isActive
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }
                    >
                      {season.isActive
                        ? language === "ar"
                          ? "تعطيل"
                          : "Disable"
                        : language === "ar"
                        ? "تفعيل"
                        : "Enable"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSeason(season)}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSeason(season.id)}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Season Form Modal */}
      {showForm && (
        <SeasonForm
          season={editingSeason}
          onSave={() => {
            setShowForm(false);
            setEditingSeason(null);
            loadData();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingSeason(null);
          }}
          language={language}
        />
      )}
    </div>
  );
}

// Season Form Component
function SeasonForm({ season, onSave, onCancel, language }: any) {
  const [formData, setFormData] = useState({
    name: season?.name || "",
    startDate: season?.startDate
      ? new Date(season.startDate).toISOString().split("T")[0]
      : "",
    endDate: season?.endDate
      ? new Date(season.endDate).toISOString().split("T")[0]
      : "",
    morningPrice: season?.morningPrice || "",
    eveningPrice: season?.eveningPrice || "",
    isActive: season?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = season
        ? `/api/pricing-seasons/${season.id}`
        : "/api/pricing-seasons";

      const method = season ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          morningPrice: parseFloat(formData.morningPrice as string),
          eveningPrice: parseFloat(formData.eveningPrice as string),
        }),
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving season:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {season
                ? language === "ar"
                  ? "تعديل الموسم"
                  : "Edit Season"
                : language === "ar"
                ? "موسم جديد"
                : "New Season"}
            </span>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "ar" ? "اسم الموسم" : "Season Name"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "تاريخ البداية" : "Start Date"}
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "تاريخ النهاية" : "End Date"}
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar"
                    ? "سعر الصباح (دج)"
                    : "Morning Price (DZD)"}
                </label>
                <input
                  type="number"
                  value={formData.morningPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, morningPrice: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar"
                    ? "سعر المساء (دج)"
                    : "Evening Price (DZD)"}
                </label>
                <input
                  type="number"
                  value={formData.eveningPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, eveningPrice: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === "ar" ? "موسم نشط" : "Active Season"}
                </span>
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
              >
                {language === "ar" ? "حفظ" : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
