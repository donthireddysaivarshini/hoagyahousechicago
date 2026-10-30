/**
 * API Service Adapter for Clover House Chicago (Hoagy House Chicago).
 * Connects the React/Vite storefront to the Django REST API.
 */

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export interface APICategory {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  count: number;
}

export interface APIProduct {
  id: number;
  clover_id?: string;
  name: string;
  categorySlug: string;
  subCategory?: string;
  details?: string;
  price: string;
  numericPrice: number;
  price_cents: number;
  img: string;
  is_in_stock: boolean;
  modifierGroups?: any[];
}

export interface CartCalculationResult {
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  subtotal_cents: number;
  tax_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  tax_rate_percentage: number;
}

export interface PaymentConfig {
  apiAccessKey: string;
  merchantId: string;
  env: string;
  sdkUrl: string;
  taxRate: number;
  deliveryRadiusMiles: number;
  deliveryFee: number;
}

/**
 * Generic JSON request wrapper
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
    credentials: "include", // For session cookies
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error || errorBody.detail || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

// ----------------- CATALOG -----------------
export async function getCategories(): Promise<APICategory[]> {
  return apiRequest<APICategory[]>("/catalog/categories/");
}

export async function getProducts(categorySlug?: string, search?: string): Promise<APIProduct[]> {
  const params = new URLSearchParams();
  if (categorySlug && categorySlug !== "all") {
    params.set("category", categorySlug);
  }
  if (search) {
    params.set("search", search);
  }
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<APIProduct[]>(`/catalog/products/${query}`);
}

export async function getProductDetail(id: number): Promise<APIProduct> {
  return apiRequest<APIProduct>(`/catalog/products/${id}/`);
}

// ----------------- CART & CHECKOUT -----------------
export async function calculateCart(
  items: Array<{ product_id: number; quantity: number; modifier_ids?: number[] }>,
  fulfillmentType: "PICKUP" | "DELIVERY" = "PICKUP"
): Promise<CartCalculationResult> {
  return apiRequest<CartCalculationResult>("/cart/calculate/", {
    method: "POST",
    body: JSON.stringify({
      items,
      fulfillment_type: fulfillmentType,
    }),
  });
}

export async function createCheckoutOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  fulfillment_type: "PICKUP" | "DELIVERY";
  delivery_address?: string;
  order_notes?: string;
  items: Array<{ product_id: number; quantity: number; modifier_ids?: number[] }>;
}): Promise<{
  order_id: number;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  total_cents: number;
}> {
  return apiRequest("/cart/checkout-order/", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// ----------------- PAYMENTS -----------------
export async function getPaymentConfig(): Promise<PaymentConfig> {
  return apiRequest<PaymentConfig>("/payments/config/");
}

export async function processCharge(chargeData: {
  source: string;
  amount_cents: number;
  order_id?: number;
  idempotency_key?: string;
}): Promise<{
  success: boolean;
  charge_id: string;
  status: string;
  message: string;
  order_id?: number;
}> {
  return apiRequest("/payments/charge/", {
    method: "POST",
    body: JSON.stringify(chargeData),
  });
}

// ----------------- ORDERS -----------------
export async function getOrderDetail(orderId: number): Promise<any> {
  return apiRequest(`/orders/${orderId}/`);
}

// ----------------- AUTHENTICATION -----------------
export async function authenticateWithGoogle(idToken: string): Promise<any> {
  return apiRequest("/auth/google/", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
}

export async function getCurrentUser(): Promise<any> {
  return apiRequest("/auth/me/");
}

export async function logoutUser(): Promise<any> {
  return apiRequest("/auth/logout/", { method: "POST" });
}

