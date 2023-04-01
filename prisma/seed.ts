import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getEntries().map((entry) => {
      return db.entry.create({ data: entry });
    })
  );
}

seed();

function getEntries() {
  return [
    {
      type: "learning",
      text: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
      date: new Date("2021-01-01"),
    },
    {
      type: "work",
      text: `I was wondering why the frisbee was getting bigger, then it hit me.`,
      date: new Date("2021-01-01"),
    },
    {
      type: "interesting-thing",
      text: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
      date: new Date("2021-01-01"),
    },
  ];
}
