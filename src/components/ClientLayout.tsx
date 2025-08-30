// src/components/ClientLayout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Users,
  CreditCard,
  Settings,
  LayoutDashboard,
  Menu,
  Globe,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from "next-auth/react";

const navigationItems = [
  {
    title: { ar: "لوحة التحكم", en: "Dashboard" },
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: { ar: "الحجوزات", en: "Bookings" },
    url: "/bookings",
    icon: Calendar,
  },
  {
    title: { ar: "العملاء", en: "Clients" },
    url: "/clients",
    icon: Users,
  },
  {
    title: { ar: "المدفوعات", en: "Payments" },
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: { ar: "الأسعار الموسمية", en: "Pricing Seasons" },
    url: "/pricing-seasons",
    icon: Settings,
  },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [language, setLanguage] = useState("ar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = language === "ar";

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);

    // Update user language in database
    if (session) {
      try {
        await fetch("/api/user/language", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: newLanguage }),
        });
      } catch (error) {
        console.error("Failed to update language preference:", error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/login";

  // Show loading state while session is being checked
  if (status === "loading" && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-rose">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full gradient-rose">
      {/* Sidebar */}
      {!isLoginPage && session && (
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
                    {language === "ar" ? "فعاليات خالد" : "khalid events"}
                  </h2>
                  <p className="text-xs text-orange-600/70">
                    {language === "ar" ? "إدارة الحفلات" : "Event Management"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-orange-700/80 uppercase tracking-wider px-3 py-3">
                  {language === "ar" ? "التنقل" : "Navigation"}
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
                        {item.title[language as keyof typeof item.title]}
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
                </select>
              </div>

              {session.user && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-orange-900 text-sm truncate">
                        {session.user.name || "Staff"}
                      </p>
                      <p className="text-xs text-orange-600 truncate">
                        {session.user.role === "ADMIN"
                          ? language === "ar"
                            ? "مدير"
                            : "Admin"
                          : language === "ar"
                          ? "موظف"
                          : "Staff"}
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
        {!isLoginPage && session && (
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100/50 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-orange-100 p-2 rounded-xl transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gradient">
                {language === "ar" ? "فعاليات خالد" : "khalid events"}
              </h1>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
