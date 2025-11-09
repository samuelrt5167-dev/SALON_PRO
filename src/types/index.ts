// User Types
export type UserRole = 'platform_admin' | 'salon_admin' | 'stylist' | 'client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: UserRole;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
}

// Salon Types
export type SalonType = 'hair' | 'beauty' | 'spa' | 'barbershop' | 'nails';
export type SalonSize = 'solo' | 'small' | 'medium' | 'large';

export interface Salon {
  id: string;
  name: string;
  description: string;
  owner: string; // user id
  logo?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  salonType: SalonType;
  size: SalonSize;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  salonId: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: string;
}

// Staff Types
export type StaffRole = 'stylist' | 'receptionist' | 'manager';

export interface Staff {
  id: string;
  userId: string;
  salonId: string;
  branchId?: string;
  role: StaffRole;
  specialization?: string;
  commissionPercentage: number;
  isActive: boolean;
  hireDate: string;
  createdAt: string;
}

// Service Types
export type CommissionType = 'percentage' | 'fixed';

export interface ServiceCategory {
  id: string;
  salonId: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  salonId: string;
  categoryId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  commissionType: CommissionType;
  commissionValue: number;
  isActive: boolean;
  createdAt: string;
}

// Appointment Types
export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  salonId: string;
  branchId: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  status: AppointmentStatus;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  salonId: string;
  branchId?: string;
  name: string;
  description?: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  supplier?: string;
  createdAt: string;
}

// Payment Types
export type PaymentMethod = 'cash' | 'card' | 'chapa' | 'telebirr' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

// Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalAppointments: number;
  appointmentsChange: number;
  totalClients: number;
  clientsChange: number;
  averageRating: number;
  ratingChange: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
}

export interface ServicePerformance {
  serviceId: string;
  serviceName: string;
  bookings: number;
  revenue: number;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  appointments: number;
  revenue: number;
  rating: number;
}
