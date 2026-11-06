export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
};

export type DeliveryDetails = {
  date: string | null;
  time: string | null;
};

export type StructuredOrder = {
  customer: string | null;
  items: OrderItem[];
  delivery: DeliveryDetails;
  specialInstructions: string | null;
  confidence: number | null;
};

export type OrderUnderstandingResponse = {
  order: StructuredOrder;
};
