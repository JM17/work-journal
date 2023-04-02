import { db } from "~/utils/db.server";

export async function getEntries(userId?: string) {
  return await db.entry.findMany({ where: { userId: userId } });
}

export async function getEntry(id: string) {
  return await db.entry.findUnique({ where: { id: id } });
}

export async function createEntry(data: any) {
  return await db.entry.create({ data });
}

export async function updateEntry(id: string, data: any) {
  return await db.entry.update({ where: { id }, data });
}

export async function deleteEntry(id: string) {
  return await db.entry.delete({ where: { id } });
}

export async function deleteEntries(userId: string) {
  return await db.entry.deleteMany({ where: { userId } });
}
