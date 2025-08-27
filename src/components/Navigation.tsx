// src/components/Navigation.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavigationProps {
  userRole: string;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export default function Navigation({
  userRole,
  currentSection,
  setCurrentSection,
}: NavigationProps) {
  const router = useRouter();

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    // You can add logic to change the main content based on the section
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">
          <Image
            src="/khalid-events-transparent-logo.png"
            alt="VenueFlow Logo"
            className="w-16 h-16 mx-auto mb-4"
            width={64}
            height={64}
          />
        </h1>
        <nav className="space-y-2">
          <button
            onClick={() => handleSectionChange("overview")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              currentSection === "overview"
                ? "bg-purple-100 text-purple-600"
                : "hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => handleSectionChange("bookings")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              currentSection === "bookings"
                ? "bg-purple-100 text-purple-600"
                : "hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            📅 Reservations
          </button>
          <button
            onClick={() => handleSectionChange("calendar")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              currentSection === "calendar"
                ? "bg-purple-100 text-purple-600"
                : "hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            🗓️ Calendar
          </button>
          <button
            onClick={() => handleSectionChange("clients")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              currentSection === "clients"
                ? "bg-purple-100 text-purple-600"
                : "hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            👥 Clients
          </button>

          {userRole === "admin" && (
            <>
              <button
                onClick={() => handleSectionChange("staff")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentSection === "staff"
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                👨‍💼 Staff Management
              </button>
              <button
                onClick={() => handleSectionChange("reports")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentSection === "reports"
                    ? "bg-purple-100 text-purple-600"
                    : "hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                📈 Reports
              </button>
            </>
          )}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
