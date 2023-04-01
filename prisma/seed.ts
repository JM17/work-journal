import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  const john = await db.user.create({
    data: {
      username: "johndoe",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  await Promise.all(
    getEntries().map((entry) => {
      const data = { userId: john.id, ...entry };
      return db.entry.create({ data });
    })
  );
}

seed();

function getEntries() {
  return [
    {
      type: "learning",
      text: `Lorem ipsum`,
      date: new Date("2021-01-01"),
    },
    {
      type: "work",
      text: `Lorem ipsum`,
      date: new Date("2021-01-01"),
    },
    {
      type: "interesting-thing",
      text: `Lorem ipsum`,
      date: new Date("2021-01-01"),
    },
  ];
}
