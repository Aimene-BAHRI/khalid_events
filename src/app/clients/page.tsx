"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

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
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        return "warning"; // ✅ changed from "outline"
      case "COMPLETED":
        return "success"; // ✅ maybe better than "default"?
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
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-amber-50/20">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                <Heart className="h-5 w-5 text-secondary fill-secondary" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-primary">
                  Client Management
                </h1>
                <p className="text-xs text-muted-foreground">
                  Bella Vista Venue
                </p>
              </div>
            </div>
          </div>
          <Dialog
            open={isClientDialogOpen}
            onOpenChange={setIsClientDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Add New Client
                </DialogTitle>
              </DialogHeader>
              <ClientForm
                onClose={() => setIsClientDialogOpen(false)}
                onSuccess={fetchClients}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 border-secondary/20 bg-secondary/10">
            <AlertDescription className="text-secondary-foreground">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-card/60 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 bg-card/60 backdrop-blur-sm px-3 rounded"
            >
              <option value="all">All Status</option>
              <option value="RESERVED">Reserved</option>
              <option value="DEPOSIT_PAID">Deposit Paid</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="no-booking">No Booking</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-primary">
                  {clients.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/10 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Bookings
                </p>
                <p className="text-2xl font-bold text-secondary">
                  {
                    clients.filter(
                      (c) =>
                        getClientStatus(c) !== "COMPLETED" &&
                        getClientStatus(c) !== "no-booking"
                    ).length
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-secondary" />
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-accent/10 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-accent">
                  $
                  {clients
                    .reduce((sum, c) => sum + getTotalPaid(c), 0)
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-destructive/10 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Payments
                </p>
                <p className="text-2xl font-bold text-destructive">
                  $
                  {clients
                    .reduce((sum, c) => sum + getRemainingBalance(c), 0)
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>
        </div>

        {/* Client Table */}
        <Card className="bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              Client List ({filteredClients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Latest Booking</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
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
                        <p className="text-sm">{client.email || "No email"}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.phoneNumber || "No phone"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {latestBooking ? (
                          <p className="text-sm">
                            {new Date(latestBooking.date).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No booking
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.guestCount || "Not specified"}
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
                        >
                          {latestBooking?.status.replace("_", " ") ||
                            "No Booking"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedClient(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Link href={`/calendar?client=${client.id}`}>
                          <Button variant="ghost" size="sm">
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                        </Link>
                        {client.phoneNumber && (
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {client.email && (
                          <Button variant="ghost" size="sm">
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
      </div>
    </div>
  );
}

// --- ClientForm remains mostly unchanged, same as your current code ---
function ClientForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
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
        setError(data.error || "Failed to create client");
      }
    } catch (error) {
      setError("An error occurred while creating the client");
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
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Enter first name"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Enter last name"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="phone">Phone Number</Label>
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
        <Label htmlFor="guestCount">Number of Guests</Label>
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
        <Label htmlFor="menuDetails">Menu Details</Label>
        <Textarea
          id="menuDetails"
          value={formData.menuDetails}
          onChange={(e) =>
            setFormData({ ...formData, menuDetails: e.target.value })
          }
          placeholder="Special dietary requirements, menu preferences..."
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Special Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any special requirements or notes..."
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
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
