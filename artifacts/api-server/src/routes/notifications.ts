import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(notificationsTable);
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(rows.map(toApi));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [n] = await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, id)).returning();
    if (!n) return res.status(404).json({ error: "Not found" });
    res.json(toApi(n));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

function toApi(n: typeof notificationsTable.$inferSelect) {
  return {
    id: n.id,
    type: n.type,
    message: n.message,
    essayId: n.essayId,
    novelId: n.novelId,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  };
}

export default router;
