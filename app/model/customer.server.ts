import { db } from "~/utils/db.server";

export async function getCustomers() {
  return await db.customer.findMany();
}

export async function getCustomer(id: string) {
  return await db.customer.findUnique({ where: { id: id } });
}

export async function createCustomer(data: any) {
  return await db.customer.create({ data });
}

export async function updateCustomer(id: string, data: any) {
  return await db.customer.update({ where: { id }, data });
}
export async function deleteCustomer(id: string) {
  return await db.customer.delete({ where: { id } });
}
