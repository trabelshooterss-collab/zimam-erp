
/**
 * This file represents the "Database Schema" requested.
 * In a Python/Django backend, these would be classes in models.py.
 */

export enum InvoiceType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE'
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED'
}

// Regional Compliance Model
export interface ComplianceMetadata {
  zatca_uuid?: string; // KSA
  zatca_hash?: string; // KSA
  eta_uuid?: string; // Egypt
  qr_code_data?: string; // Both
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number; // Static baseline
  aiSuggestedReorderPoint?: number; // Dynamic AI field
  costPrice: number;
  sellingPrice: number;
  lastRestocked: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  type: InvoiceType;
  customerName: string; // Or Vendor Name
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  taxAmount: number;
  status: PaymentStatus;
  compliance: ComplianceMetadata;
}

export interface FinancialSnapshot {
  month: string;
  revenue: number;
  expenses: number;
  cashFlow: number;
  burnRate: number;
}

// AI Response Types
export interface InventoryPrediction {
  productId: string;
  productName: string;
  suggestedReorderPoint: number;
  reasoning: string; // "Eid is coming..."
  confidenceScore: number;
}

export interface FinancialInsight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  actionItem: string;
}

export interface MarketPulseResult {
  content: string;
  sources: { title: string; uri: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
}

export interface Person {
  id: string;
  type: 'customer' | 'supplier';
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  expectedDate: string;
  items: { productId: string; productName: string; qty: number; cost: number }[];
  totalAmount: number;
  status: 'Ordered' | 'Received';
}

// --- Genius Mode Types ---

export interface SimulationResult {
  scenario: string;
  impactOnRevenue: string;
  impactOnProfit: string;
  recommendation: string;
}

export interface VisualAuditResult {
  detectedCount: number;
  discrepancy: number;
  advice: string;
}

export interface VoiceCommandAction {
  intent: 'ADD_TO_CART' | 'CHECK_STOCK' | 'NAVIGATE' | 'CHECKOUT' | 'UPDATE_QTY' | 'REMOVE_ITEM' | 'UNKNOWN';
  data: any;
  response: string;
}

// --- Offline Sync Types ---

export interface SyncAction {
  id: string;
  type: 'PROCESS_ORDER' | 'ADJUST_STOCK' | 'RECEIVE_STOCK' | 'REFUND_INVOICE' | 'ADD_PERSON';
  payload: any;
  timestamp: number;
}
