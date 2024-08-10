import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createUser() {
  const email = "test123@gmail.com"; 
  const plainPassword = "password123"; 

  // Hashes the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Creates the user in the database
  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  console.log("User created:", user);
}

createUser()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
