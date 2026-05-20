import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  categories,
  transactions,
  transactionsCategories,
} from "./schema";
import { hashPassword } from "../services/auth.service";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Users
  const [{ insertId: userId }] = await db.insert(users).values({
    email: "test@example.com",
    passwordHash: await hashPassword("password123"),
    firstName: "John",
    lastName: "Doe",
  });
  console.log("✓ Users inserted");

  // 2. Categories
  await db
    .insert(categories)
    .values([
      { name: "groceries" },
      { name: "school" },
      { name: "stationary" },
      { name: "home" },
      { name: "outing" },
      { name: "trade" },
      { name: "transport" },
      { name: "work" },
      { name: "special occasion" },
    ]);

  const allCategories = await db.select().from(categories);
  const categoryByName = Object.fromEntries(
    allCategories.map((c) => [c.name, c.id]),
  );
  console.log("✓ Categories inserted");

  // 3. Transactions
  await db.insert(transactions).values([
    {
      userId,
      date: new Date("2026-05-09"),
      title: "Buy cake for birthday",
      amount: "24.99",
      type: "expense",
    },
    {
      userId,
      date: new Date("2026-05-01"),
      title: "Weekly grocery run",
      amount: "87.5",
      type: "expense",
    },
    {
      userId,
      date: new Date("2026-05-02"),
      title: "Textbooks for next semester",
      amount: "145.0",
      type: "expense",
    },
    {
      userId,
      date: new Date("2026-05-03"),
      title: "Sold old textbook to classmate",
      amount: "40.0",
      type: "earning",
    },
    {
      userId,
      date: new Date("2026-05-04"),
      title: "Notebooks and highlighters",
      amount: "12.3",
      type: "expense",
    },
    {
      userId,
      date: new Date("2026-05-05"),
      title: "Movie night with friends",
      amount: "18.5",
      type: "expense",
    },
    {
      userId,
      date: new Date("2026-05-06"),
      title: "Weekly subway pass",
      amount: "32.0",
      type: "expense",
    },
    {
      userId,
      date: new Date("2026-05-07"),
      title: "Freelance design project payout",
      amount: "450.0",
      type: "earning",
    },
    {
      userId,
      date: new Date("2026-05-08"),
      title: "Housewarming gift for Sarah",
      amount: "35.0",
      type: "expense",
    },
    {
      userId,
      date: new Date("2026-05-10"),
      title: "Sold handmade pottery craft",
      amount: "65.0",
      type: "earning",
    },
  ]);

  console.log("✓ Transactions inserted");

  // 4. Link transactions to categories
  await db.insert(transactionsCategories).values([
    { transactionId: 1, categoryId: categoryByName["groceries"]! },
    { transactionId: 1, categoryId: categoryByName["special occasion"]! },
    { transactionId: 2, categoryId: categoryByName["groceries"]! },
    { transactionId: 2, categoryId: categoryByName["home"]! },
    { transactionId: 3, categoryId: categoryByName["school"]! },
    { transactionId: 4, categoryId: categoryByName["trade"]! },
    { transactionId: 4, categoryId: categoryByName["school"]! },
    { transactionId: 5, categoryId: categoryByName["school"]! },
    { transactionId: 5, categoryId: categoryByName["stationary"]! },
    { transactionId: 6, categoryId: categoryByName["outing"]! },
    { transactionId: 7, categoryId: categoryByName["transport"]! },
    { transactionId: 8, categoryId: categoryByName["work"]! },
    { transactionId: 9, categoryId: categoryByName["special occasion"]! },
    { transactionId: 10, categoryId: categoryByName["trade"]! },
  ]);
  console.log("✓ Transaction categories linked");

  console.log("✅ Seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
