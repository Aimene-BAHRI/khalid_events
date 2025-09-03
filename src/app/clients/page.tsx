"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Crown,
  Heart,
  Users,
  Plus,
  CalendarPlus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Edit,
  Loader2,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/app/context/languageContext";
import { t } from "@/i18n/useTranslate";

interface Payment {
  id: string;
  amount: number;
  method?: string;
  createdAt: string;
}

interface Booking {
  id: string;
  title?: string | null;
  clientId: string;
  date: string;
  timeSlot: string;
  status: string;
  totalPrice: number;
  paidAmount: number;
  notes?: string;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface Client {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  guestCount?: number;
  notes?: string;
  createdAt: string;
  bookings: Booking[];
  payments: Payment[];
}

export default function ClientsPage() {
  const { language } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState("table");

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const exportClientsCSV = async () => {
    try {
      const res = await fetch("/api/clients/export");
      if (!res.ok) throw new Error("Failed to export CSV");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Create temporary link to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "clients.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to export clients CSV");
    }
  };

  const getClientStatus = (client: Client) => {
    if (!client.bookings || client.bookings.length === 0) return "no-booking";
    return client.bookings[0].status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "DEPOSIT_PAID":
        return "secondary";
      case "RESERVED":
        return "warning";
      case "COMPLETED":
        return "success";
      default:
        return "default";
    }
  };

  const getTotalPaid = (client: Client) => {
    return client.bookings.reduce(
      (sum, booking) => sum + booking.paidAmount,
      0
    );
  };

  const getTotalAmount = (client: Client) => {
    return client.bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );
  };

  const getRemainingBalance = (client: Client) =>
    getTotalAmount(client) - getTotalPaid(client);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email &&
        client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.phoneNumber && client.phoneNumber.includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" || getClientStatus(client) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {t("clientManagement", language)}
          </h1>
          <p className="text-orange-600/70">
            {t("viewAndManageAllClients", language)}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex rounded-lg border border-orange-200 p-1">
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("table")}
              className={
                view === "table"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "hover:bg-orange-50"
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              {t("Table", language)}
            </Button>
            <Button
              variant={view === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("cards")}
              className={
                view === "cards"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "hover:bg-orange-50"
              }
            >
              <Users className="w-4 h-4 mr-2" />
              {t("Cards", language)}
            </Button>
          </div>

          <Dialog
            open={isClientDialogOpen}
            onOpenChange={setIsClientDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" /> {t("newClient", language)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />{" "}
                  {t("addNewClient", language)}
                </DialogTitle>
              </DialogHeader>
              <ClientForm
                onClose={() => setIsClientDialogOpen(false)}
                onSuccess={fetchClients}
                language={language}
              />
            </DialogContent>
          </Dialog>
          <Button
            onClick={exportClientsCSV}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {t("exportCSV", language)}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-6 border-green-500/20 bg-green-500/10">
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchClients", language)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-3 rounded border"
          >
            <option value="all">{t("allStatus", language)}</option>
            <option value="RESERVED">{t("reserved", language)}</option>
            <option value="DEPOSIT_PAID">{t("depositPaid", language)}</option>
            <option value="CONFIRMED">{t("confirmed", language)}</option>
            <option value="COMPLETED">{t("completed", language)}</option>
            <option value="no-booking">{t("noBooking", language)}</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-orange-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("totalClients", language)}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {clients.length}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("activeBookings", language)}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  clients.filter(
                    (c) =>
                      getClientStatus(c) !== "COMPLETED" &&
                      getClientStatus(c) !== "no-booking"
                  ).length
                }
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("totalRevenue", language)}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                $
                {clients
                  .reduce((sum, c) => sum + getTotalPaid(c), 0)
                  .toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("pendingPayments", language)}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                $
                {clients
                  .reduce((sum, c) => sum + getRemainingBalance(c), 0)
                  .toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
      </div>

      {/* Client Table/Cards View */}
      {view === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t("clientList", language)} ({filteredClients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("client", language)}</TableHead>
                  <TableHead>{t("contact", language)}</TableHead>
                  <TableHead>{t("latestBooking", language)}</TableHead>
                  <TableHead>{t("guests", language)}</TableHead>
                  <TableHead>{t("payment", language)}</TableHead>
                  <TableHead>{t("status", language)}</TableHead>
                  <TableHead>{t("actions", language)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const latestBooking = client.bookings?.[0];
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <p className="font-medium">{client.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {client.id.slice(0, 8)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {client.email || t("noEmail", language)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {client.phoneNumber || t("noPhone", language)}
                        </p>
                      </TableCell>
                      <TableCell>
                        {latestBooking ? (
                          <p className="text-sm">
                            {new Date(latestBooking.date).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t("noBooking", language)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.guestCount || t("notSpecified", language)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">
                          ${getTotalPaid(client).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of ${getTotalAmount(client).toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(
                            latestBooking?.status || "no-booking"
                          )}
                          className={
                            latestBooking?.status === "RESERVED"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : latestBooking?.status === "COMPLETED"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : ""
                          }
                        >
                          {latestBooking?.status.replace("_", " ") ||
                            t("noBooking", language)}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedClient(client)}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Link href={`/calendar?client=${client.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                        </Link>
                        {client.phoneNumber && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {client.email && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const latestBooking = client.bookings?.[0];
            const status = latestBooking?.status || "no-booking";

            return (
              <Card key={client.id} className="border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{client.fullName}</CardTitle>
                    <Badge
                      variant={getStatusColor(status)}
                      className={
                        status === "RESERVED"
                          ? "bg-amber-100 text-amber-800"
                          : status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {status.replace("_", " ") || t("noBooking", language)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ID: {client.id.slice(0, 8)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("contact", language)}
                    </p>
                    <p className="text-sm">
                      {client.email || t("noEmail", language)}
                    </p>
                    <p className="text-sm">
                      {client.phoneNumber || t("noPhone", language)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {t("latestBooking", language)}
                    </p>
                    <p className="text-sm">
                      {latestBooking
                        ? new Date(latestBooking.date).toLocaleDateString()
                        : t("noBooking", language)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {t("guests", language)}
                    </p>
                    <p className="text-sm">
                      {client.guestCount || t("notSpecified", language)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {t("payment", language)}
                    </p>
                    <p className="text-sm">
                      ${getTotalPaid(client).toLocaleString()} of $
                      {getTotalAmount(client).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedClient(client)}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <Edit className="h-3 w-3 mr-1" /> {t("edit", language)}
                    </Button>
                    <Link href={`/calendar?client=${client.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        <CalendarPlus className="h-3 w-3 mr-1" />{" "}
                        {t("book", language)}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClientForm({
  onClose,
  onSuccess,
  language,
}: {
  onClose: () => void;
  onSuccess: () => void;
  language: string;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    guestCount: "",
    menuDetails: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guestCount: formData.guestCount
            ? Number.parseInt(formData.guestCount)
            : undefined,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || t("failedToCreateClient", language));
      }
    } catch (error) {
      setError(t("errorCreatingClient", language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("firstName", language)} *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder={t("enterFirstName", language)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("lastName", language)} *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder={t("enterLastName", language)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email", language)}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="client@example.com"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phoneNumber", language)}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="(555) 123-4567"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guestCount">{t("numberOfGuests", language)}</Label>
        <Input
          id="guestCount"
          type="number"
          value={formData.guestCount}
          onChange={(e) =>
            setFormData({ ...formData, guestCount: e.target.value })
          }
          placeholder="150"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="menuDetails">{t("menuDetails", language)}</Label>
        <Textarea
          id="menuDetails"
          value={formData.menuDetails}
          onChange={(e) =>
            setFormData({ ...formData, menuDetails: e.target.value })
          }
          placeholder={t("specialDietaryRequirements", language)}
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t("specialNotes", language)}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t("anySpecialRequirements", language)}
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          {t("cancel", language)}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("creating", language)}
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {t("addClient", language)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
