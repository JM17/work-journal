import { db } from "~/utils/db.server";

export async function getCustomers() {
  return await db.customer.findMany();
}

export async function getCustomer(id: string) {
  return await db.customer.findUnique({ where: { id: id } });
}
