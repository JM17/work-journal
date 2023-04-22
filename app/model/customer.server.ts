import { db } from "~/utils/db.server";

export async function getCustomers() {
  return await db.customer.findMany();
}

export async function getCustomer(id: string) {
  return await db.customer.findUnique({ where: { id: id } });
}
export async function deleteCustomer(id: string) {
  return await db.customer.delete({ where: { id } });
}
