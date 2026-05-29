import { Router } from "express";
import { db, commentsTable, notificationsTable, essaysTable, novelsTable } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { essayId, novelId } = req.query;
    let rows: typeof commentsTable.$inferSelect[] = [];
    if (essayId) {
      rows = await db.select().from(commentsTable).where(eq(commentsTable.essayId, Number(essayId)));
    } else if (novelId) {
      rows = await db.select().from(commentsTable).where(eq(commentsTable.novelId, Number(novelId)));
    }
    const approved = rows.filter((c) => c.isApproved);
    const topLevel = approved.filter((c) => !c.parentId);
    const replies = approved.filter((c) => !!c.parentId);
    const threaded = topLevel.map((c) => ({
      ...toApi(c),
      replies: replies.filter((r) => r.parentId === c.id).map(toApi),
    }));
    res.json(threaded);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { essayId, novelId, parentId, authorName, content } = req.body;
    if (!authorName || !content) return res.status(400).json({ error: "authorName and content required" });
    const userId = req.isAuthenticated() ? req.user.id : null;
    const userImage = req.isAuthenticated() ? req.user.profileImageUrl : null;
    const isApproved = true;
    const [comment] = await db.insert(commentsTable).values({
      essayId: essayId ?? null,
      novelId: novelId ?? null,
      parentId: parentId ?? null,
      userId,
      authorName,
      authorImage: userImage,
      content,
      isApproved,
    }).returning();
    let contentTitle = "content";
    if (essayId) {
      const [e] = await db.select().from(essaysTable).where(eq(essaysTable.id, Number(essayId)));
      if (e) contentTitle = e.title;
    } else if (novelId) {
      const [n] = await db.select().from(novelsTable).where(eq(novelsTable.id, Number(novelId)));
      if (n) contentTitle = n.title;
    }
    await db.insert(notificationsTable).values({
      type: "comment",
      message: `New comment from ${authorName} on "${contentTitle}"`,
      essayId: essayId ?? null,
      novelId: novelId ?? null,
    });
    res.status(201).json({ ...toApi(comment), replies: [] });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(commentsTable).where(eq(commentsTable.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/approve", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [comment] = await db.update(commentsTable).set({ isApproved: true }).where(eq(commentsTable.id, id)).returning();
    if (!comment) return res.status(404).json({ error: "Not found" });
    res.json({ ...toApi(comment), replies: [] });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

function toApi(c: typeof commentsTable.$inferSelect) {
  return {
    id: c.id,
    essayId: c.essayId,
    novelId: c.novelId,
    parentId: c.parentId,
    userId: c.userId,
    authorName: c.authorName,
    authorImage: c.authorImage,
    content: c.content,
    isApproved: c.isApproved,
    createdAt: c.createdAt.toISOString(),
  };
}

export default router;
