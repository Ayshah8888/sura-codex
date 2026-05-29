import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const users = await db.select().from(usersTable);
    res.json(users.map(toApi));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/role", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["admin", "visitor"].includes(role)) return res.status(400).json({ error: "Invalid role" });
    const [user] = await db.update(usersTable).set({ role }).where(eq(usersTable.id, id)).returning();
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(toApi(user));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/ban", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;
    const [user] = await db.update(usersTable).set({ isBanned: !!banned }).where(eq(usersTable.id, id)).returning();
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(toApi(user));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

function toApi(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    profileImageUrl: u.profileImageUrl,
    role: u.role,
    isBanned: u.isBanned,
    createdAt: u.createdAt.toISOString(),
  };
}

export default router;
