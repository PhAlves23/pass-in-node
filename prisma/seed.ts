import { prisma } from "./../src/lib/prisma";
async function seed() {
  await prisma.event.create({
    data: {
      id: "6094b633-a9f2-4168-948e-51e1eee6557a",
      title: "Unite Summit",
      slug: "unite-summit",
      details: "A conference for Unity developers",
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.log("Database seeded!");
  prisma.$disconnect();
});
