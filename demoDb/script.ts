import { PrismaClient } from "./generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await resetDatabase();

  // Create Tags
  const tagNames = ["Tech", "Life", "AI", "Design", "Science"];
  const createdTags = await prisma.tag.createMany({
    data: tagNames.map((name) => ({ name })),
  });

  // Fetch tags with their IDs
  const tags = await prisma.tag.findMany();

  // Create Users with Profiles
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        profile: {
          create: {
            bio: faker.lorem.sentence(),
            avatarUrl: faker.image.avatar(),
          },
        },
      },
      include: { profile: true },
    });
    users.push(user);
  }

  // Create Teams and Memberships
  const teams = [];
  for (let i = 0; i < 3; i++) {
    const team = await prisma.team.create({
      data: {
        name: `Team ${faker.word.adjective()}`,
      },
    });
    teams.push(team);

    const teamMembers = faker.helpers.shuffle(users).slice(0, 5);

    for (const user of teamMembers) {
      await prisma.membership.create({
        data: {
          userId: user.id,
          teamId: team.id,
          role: "Member",
        },
      });
    }
  }

  // Create Projects and Tasks
  for (let i = 0; i < 5; i++) {
    const owner = users[i % users.length];
    const team = teams[i % teams.length];
    const project = await prisma.project.create({
      data: {
        name: `Project ${String(faker.company.name())}`,
        ownerId: owner.id,
        teamId: team.id,
      },
    });

    for (let t = 0; t < 4; t++) {
      const assigneeCount = Math.floor(Math.random() * 3) + 1;
      const assignees = [...Array(assigneeCount)].map(
        () => users[Math.floor(Math.random() * users.length)],
      );

      await prisma.task.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          projectId: project.id,
          status: ["TODO", "IN_PROGRESS", "DONE"][t % 3],
          dueDate: faker.date.future(),
          assignees: {
            connect: assignees.map((a) => ({ id: a.id })),
          },
        },
      });
    }
  }

  // Create Posts and Comments
  for (let i = 0; i < 15; i++) {
    const author = users[Math.floor(Math.random() * users.length)];
    const post = await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(2),
        authorId: author.id,
        tags: {
          connect: faker.helpers
            .shuffle(tags)
            .slice(0, 2)
            .map((tag) => ({ id: tag.id })),
        },
      },
    });

    for (let j = 0; j < 3; j++) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          authorId: users[Math.floor(Math.random() * users.length)].id,
          postId: post.id,
        },
      });
    }
  }

  // Create Chats and Messages
  for (let i = 0; i < 3; i++) {
    const chatUsers = faker.helpers.shuffle(users).slice(0, 4);

    const chat = await prisma.chat.create({
      data: {
        name: `Chat ${faker.word.noun()}`,
        members: {
          connect: chatUsers.map((u) => ({ id: u.id })),
        },
      },
    });

    for (let m = 0; m < 10; m++) {
      await prisma.message.create({
        data: {
          content: faker.lorem.sentence(),
          senderId: chatUsers[m % chatUsers.length].id,
          chatId: chat.id,
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("🌱 Seed complete.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export async function resetDatabase() {
  console.log("🧹 Resetting database...");

  await prisma.message.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  // Reset SQLite auto-increment counters

  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Message';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Chat';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Comment';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Post';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Task';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Project';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Membership';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Team';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Tag';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Profile';`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='User';`,
  );

  // etc...

  console.log("✅ Database cleaned.");
}
