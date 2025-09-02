// src/app/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Users,
  CreditCard,
  Settings,
  LayoutDashboard,
  Heart,
  Menu,
  Globe,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "./globals.css";
import Image from "next/image";
import { t } from "@/i18n/useTranslate";
import { fr } from "date-fns/locale";
const navigationItems = [
  { key: "navDashboard", url: "/dashboard", icon: LayoutDashboard },
  { key: "navBookings", url: "/bookings", icon: Calendar },
  { key: "navClients", url: "/clients", icon: Users },
  { key: "navPayments", url: "/payments", icon: CreditCard },
  { key: "navPricingSeasons", url: "/pricing-seasons", icon: Settings },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [language, setLanguage] = useState("ar");
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = language === "ar";

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        setLanguage(user.language || "ar");
      }
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    if (user) {
      // Update user language in localStorage
      const updatedUser = { ...user, language: newLanguage };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/login";

  return (
    <html lang={language} dir={isRTL ? "rtl" : "ltr"}>
      <body className="min-h-screen">
        <div className="min-h-screen flex w-full gradient-rose">
          {/* Sidebar */}
          {!isLoginPage && (
            <div
              className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-sm border-r border-orange-100/50 transform transition-transform lg:relative lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="border-b border-orange-100/50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 from-orange-400 to-rose-500 rounded-xl flex items-center justify-center shadow-luxury">
                      <Image
                        src="/khalid-events-transparent-logo.png"
                        alt="khalid events"
                        className="w-6 h-6"
                        width={34}
                        height={34}
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gradient">
                        {t("appName", language as "ar" | "en" | "fr")}
                      </h2>
                      <p className="text-xs text-orange-600/70">
                        {t("appDesc", language as "ar" | "en" | "fr")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto">
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-orange-700/80 uppercase tracking-wider px-3 py-3">
                      {t("navigation", language as "ar" | "en" | "fr")}
                    </h3>
                    <nav className="space-y-1">
                      {navigationItems.map((item) => (
                        <a
                          key={item.url}
                          href={item.url}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                            pathname === item.url
                              ? "bg-gradient-to-r from-orange-50 to-rose-50 text-orange-700 shadow-sm border border-orange-100"
                              : "hover:bg-orange-50 hover:text-orange-700"
                          }`}
                        >
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">
                            {t(item.key as keyof typeof translations, language)}
                          </span>
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="border-t border-orange-100/50 p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="h-8 text-xs border border-orange-200 rounded-md focus:border-orange-400 px-2 bg-white"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  {user && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.username?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-orange-900 text-sm truncate">
                            {user.username || "Staff"}
                          </p>
                          <p className="text-xs text-orange-600 truncate">
                            {user.role === "ADMIN"
                              ? t("roleAdmin", language as "ar" | "en" | "fr")
                              : t("roleStaff", language as "ar" | "en" | "fr")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="h-8 w-8 hover:bg-orange-100 hover:text-orange-700"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 flex flex-col lg:ml-64">
            {!isLoginPage && (
              <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100/50 px-6 py-4 lg:hidden">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hover:bg-orange-100 p-2 rounded-xl transition-colors duration-200"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-gradient">
                    {t("appName", language as "ar" | "en" | "fr")}
                  </h1>
                </div>
              </header>
            )}
            <div className="flex-1 overflow-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
