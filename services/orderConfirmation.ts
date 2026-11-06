export async function generateOrderConfirmation(
  order: unknown
): Promise<string> {
  return `Order confirmation: ${JSON.stringify(order)}`;
}
