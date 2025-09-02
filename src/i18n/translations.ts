import RecentPayments from "@/components/dashboard/RecentPayments";
import { PaymentType } from "@prisma/client";

export const translations = {
  loading: {
    en: "Loading...",
    ar: "جاري التحميل...",
    fr: "Chargement...",
  },
  welcome: {
    en: "Welcome",
    ar: "مرحبا",
    fr: "Bienvenue",
  },
  appName: {
    ar: "فعاليات خالد",
    en: "Khalid Events",
    fr: "Événements Khalid",
  },
  appDesc: {
    ar: "إدارة الحفلات",
    en: "Event Management",
    fr: "Gestion d’événements",
  },
  navigation: {
    ar: "التنقل",
    en: "Navigation",
    fr: "Navigation",
  },
  roleAdmin: {
    ar: "مدير",
    en: "Admin",
    fr: "Administrateur",
  },
  roleStaff: {
    ar: "موظف",
    en: "Staff",
    fr: "Employé",
  },
  // add more keys here
  bookingManagement: {
    ar: "إدارة الحجوزات",
    en: "Booking Management",
    fr: "Gestion des réservations",
  },
  viewAndManageAllVenueBookings: {
    ar: "عرض وإدارة جميع حجوزات القاعة",
    en: "View and manage all venue bookings",
    fr: "Voir et gérer toutes les réservations de la salle",
  },
  Calendar: {
    ar: "التقويم",
    en: "Calendar",
    fr: "Calendrier",
  },
  List: {
    ar: "القائمة",
    en: "List",
    fr: "Liste",
  },
  newBooking: {
    ar: "حجز جديد",
    en: "New Booking",
    fr: "Nouvelle réservation",
  },
  exportCSV: {
    ar: "تصدير CSV",
    en: "Export CSV",
    fr: "Exporter CSV",
  },
  // Navigation items - keep keys consistent with src/app/layout.tsx
  navDashboard: { ar: "لوحة التحكم", en: "Dashboard", fr: "Tableau de bord" },
  navBookings: { ar: "الحجوزات", en: "Bookings", fr: "Réservations" },
  navClients: { ar: "العملاء", en: "Clients", fr: "Clients" },
  navPayments: { ar: "المدفوعات", en: "Payments", fr: "Paiements" },
  navPricingSeasons: { ar: "الأسعار الموسمية", en: "Pricing Seasons", fr: "Saisons tarifaires" },
  // dashboard page
  dashboard: { ar: "لوحة التحكم", en: "Dashboard", fr: "Tableau de bord" },
  WelcomeMessage: {
    ar: "مرحباً بك في نظام إدارة قاعة الحفلات خالد إيفنتس",
    en: "Welcome to the Khaled Events Banquet Hall Management System",
    fr: "Bienvenue dans le système de gestion du banquet Khaled Events",
  },
  // dashboard stats
  todayAppointments: { ar: "مواعيد اليوم", en: "Today's Events", fr: "Événements d'aujourd'hui" },
  monthlyRevenue: { ar: "إيرادات الشهر", en: "Monthly Revenue", fr: "Revenu mensuel" },
  upcomingEvents: { ar: "الأحداث القادمة", en: "Upcoming Events", fr: "Événements à venir" },
  pendingPayments: { ar: "مدفوعات معلقة", en: "Pending Payments", fr: "Paiements en attente" },
  // dashboard TodaySchedule component
  todaysSchedule: { ar: "جدول اليوم", en: "Today's Schedule", fr: "Programme du jour" },
  Loading: { ar: "جاري التحميل...", en: "Loading...", fr: "Chargement..." },
  noAppointmentsToday: { ar: "لا توجد مواعيد اليوم", en: "No appointments today", fr: "Aucun rendez-vous aujourd'hui" },
  // dashboard UpcomingEvents component
  noUpcomingEvents: { ar: "لا توجد أحداث قادمة", en: "No upcoming events", fr: "Aucun événement à venir" },
  // dasboard Recent Payments component
  recentPayments: { ar: "المدفوعات الأخيرة", en: "Recent Payments", fr: "Paiements récents" },
  noPaymentsYet: { ar: "لا توجد مدفوعات حتى الآن", en: "No payments yet", fr: "Pas encore de paiements" },
  booking: { ar: "الحجز#", en: "Booking #", fr: "Réservation #" },
  
  
  // PricingSeasons page
  deleteSeasonConfirmation: {
    ar: "هل أنت متأكد أنك تريد حذف هذا الموسم؟",
    en: "Are you sure you want to delete this season?",
    fr: "Êtes-vous sûr de vouloir supprimer cette saison ?",
  },
  pricingSeasons: { ar: "المواسم السعرية", en: "Pricing Seasons", fr: "Saisons tarifaires" },
  managePricingForDifferentSeasons: {
    ar: "إدارة الأسعار لمواسم مختلفة",
    en: "Manage pricing for different seasons",
    fr: "Gérer les prix pour différentes saisons",
  },
  newSeason: { ar: "موسم جديد", en: "New Season", fr: "Nouvelle saison" },
  currentSeason: { ar: "الموسم الحالي", en: "Current Season", fr: "Saison actuelle" },
  seasonName: { ar: "اسم الموسم", en: "Season Name", fr: "Nom de la saison" },
  period: { ar: "الفترة", en: "Period", fr: "Période" },
  prices: { ar: "الأسعار", en: "Prices", fr: "Prix" },
  morning: { ar: "صباحاً", en: "Morning", fr: "Matin" },
  evening: { ar: "مساءً", en: "Evening", fr: "Soir" },
  seasonsList: { ar: "قائمة المواسم", en: "Seasons List", fr: "Liste des saisons" },
  noSeasonsFound: { ar: "لم يتم العثور على مواسم سعرية", en: "No pricing seasons found", fr: "Aucune saison tarifaire trouvée" },
  createYourFirstSeason: {
    ar: "انقر على زر إضافة موسم للبدء في إدارة الأسعار الموسمية",
    en: "Click the Add Season button to start managing seasonal pricing",
    fr: "Cliquez sur le bouton Ajouter une saison pour commencer à gérer les prix saisonniers",
  },
  active: { ar: "نشط", en: "Active", fr: "Actif" },
  inactive: { ar: "غير نشط", en: "Inactive", fr: "Inactif" },
  current: { ar: "الحالي", en: "Current", fr: "Actuel" },
  from: { ar: "من", en: "From", fr: "De" },
  to: { ar: "إلى", en: "To", fr: "À" },
  disabled: { ar: "معطل", en: "Disabled", fr: "Désactivé" },
  enabled: { ar: "مفعل", en: "Enabled", fr: "Activé" },
  editSeason: { ar: "تعديل الموسم", en: "Edit Season", fr: "Modifier la saison" },
  startDate: { ar: "تاريخ البدء", en: "Start Date", fr: "Date de début" },
  endDate: { ar: "تاريخ الانتهاء", en: "End Date", fr: "Date de fin" },
  morningPrice: { ar: "سعر الصباح (دج)", en: "Morning Price (DZD)", fr: "Prix du matin (DZD)" },
  eveningPrice: { ar: "سعر المساء (دج)", en: "Evening Price (DZD)", fr: "Prix du soir (DZD)" },
  activeSeason: { ar: "الموسم النشط", en: "Active Season", fr: "Saison active" },
  
  // bookings page
  bookingCalendar: { ar: "تقويم الحجوزات", en: "Booking Calendar", fr: "Calendrier des réservations" },
  // bookings filters component
  bookingFilters: { ar: "مرشحات الحجز", en: "Booking Filters", fr: "Filtres de réservation" },
  selectClient: { ar: "اختر العميل", en: "Select Client", fr: "Sélectionner le client" },
  selectStatus: { ar: "اختر الحالة", en: "Select Status", fr: "Sélectionner le statut" },
  confirmed : { ar: "مؤكد", en: "Confirmed", fr: "Confirmé" },
  pending : { ar: "قيد الانتظار", en: "Pending", fr: "En attente" },
  // booking form component
  bookingForm: { ar: "نموذج الحجز", en: "Booking Form", fr: "Formulaire de réservation" },
  client: { ar: "العميل", en: "Client", fr: "Client" },
  date: { ar: "التاريخ", en: "Date", fr: "Date" },
  timeSlot: { ar: "الفترة الزمنية", en: "Time Slot", fr: "Créneau horaire" },
  status: { ar: "الحالة", en: "Status", fr: "Statut" },
  inquiry: { ar: "استفسار", en: "Inquiry", fr: "Demande" },
  reserved: { ar: "محجوز", en: "Reserved", fr: "Réservé" },
  depositPaid: { ar: "تم دفع العربون", en: "Deposit Paid", fr: "Acompte payé" },
  fullyPaid: { ar: "مدفوع بالكامل", en: "Fully Paid", fr: "Entièrement payé" },
  cancelled: { ar: "ملغي", en: "Cancelled", fr: "Annulé" },
  totalPrice: { ar: "السعر الإجمالي (دج)", en: "Total Price (DZD)", fr: "Prix total (DZD)" },
  paidAmount: { ar: "المبلغ المدفوع (دج)", en: "Paid Amount (DZD)", fr: "Montant payé (DZD)" },
  notes: { ar: "ملاحظات", en: "Notes", fr: "Remarques" },
  // booking list component
  bookingList: { ar: "قائمة الحجوزات", en: "Booking List", fr: "Liste des réservations" },
  noBookingsFound: { ar: "لم يتم العثور على حجوزات", en: "No bookings found", fr: "Aucune réservation trouvée" },
  amount: { ar: "المبلغ", en: "Amount", fr: "Montant" },
  // common
  save: { ar: "حفظ", en: "Save", fr: "Enregistrer" },
  cancel: { ar: "إلغاء", en: "Cancel", fr: "Annuler" },
  edit: { ar: "تعديل", en: "Edit", fr: "Modifier" },
  delete: { ar: "حذف", en: "Delete", fr: "Supprimer" },





  // clients page

  // payments page
  paymentsManagement: { ar: "إدارة المدفوعات", en: "Payments Management", fr: "Gestion des paiements" },
  viewAndManageAllPayments: {
    ar: "عرض وإدارة جميع المدفوعات",
    en: "View and manage all payments",
    fr: "Voir et gérer tous les paiements",
  },
  export: { ar: "تصدير", en: "Export", fr: "Exporter" },
  totalRevenue: { ar: "إجمالي الإيرادات", en: "Total Revenue", fr: "Revenu total" },
  totalPayments: { ar: "إجمالي المدفوعات", en: "Total Payments", fr: "Total des paiements" },
  totalPending: { ar: "إجمالي المبلغ المعلق", en: "Total Pending Amount", fr: "Montant total en attente" },
  completedPayments: { ar: "المدفوعات المكتملة", en: "Completed Payments", fr: "Paiements terminés" },
  paymentFilters: { ar: "مرشحات الدفع", en: "Payment Filters", fr: "Filtres de paiement" },
  all: { ar: "الكل", en: "All", fr: "Tous" },
  paymentMethod: { ar: "طريقة الدفع", en: "Payment Method", fr: "Méthode de paiement" },
  cash: { ar: "نقداً", en: "Cash", fr: "Espèces" },
  card: { ar: "بطاقة", en: "Card", fr: "Carte" },
  bankTransfer: { ar: "تحويل بنكي", en: "Bank Transfer", fr: "Virement bancaire" },
  check: { ar: "شيك", en: "Check", fr: "Chèque" },
  paymentType: { ar: "نوع الدفع", en: "Payment Type", fr: "Type de paiement" },
  deposit: { ar: "عربون", en: "Deposit", fr: "Dépôt" },
  partial: { ar: "جزئي", en: "Partial", fr: "Partiel" },
  full: { ar: "كامل", en: "Full", fr: "Complet" },
  paymentStatus: { ar: "حالة الدفع", en: "Payment Status", fr: "Statut du paiement" },
  completed: { ar: "مكتمل", en: "Completed", fr: "Terminé" },
  failed: { ar: "فاشل", en: "Failed", fr: "Échoué" },
  refunded: { ar: "تم الاسترجاع", en: "Refunded", fr: "Remboursé" },
  paymentList: { ar: "قائمة المدفوعات", en: "Payment List", fr: "Liste des paiements" },
  NoPaymentsFound: { ar: "لم يتم العثور على مدفوعات", en: "No payments found", fr: "Aucun paiement trouvé" },

  }
export type SupportedLang = keyof typeof translations["loading"]; // "en" | "ar" | "fr"
