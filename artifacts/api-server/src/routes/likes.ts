import { Router } from "express";
import { db, likesTable } from "@workspace/db";
import { and, eq, isNull } from "drizzle-orm";

const router = Router();

router.post("/toggle", async (req, res) => {
  try {
    const { essayId, novelId } = req.body;
    const userId = req.isAuthenticated() ? req.user.id : null;
    const sessionKey = !userId ? (req.ip ?? "anon") : null;

    let existing;
    if (essayId) {
      const rows = await db.select().from(likesTable).where(
        and(
          eq(likesTable.essayId, Number(essayId)),
          userId ? eq(likesTable.userId, userId) : eq(likesTable.sessionKey, sessionKey!),
        )
      );
      existing = rows[0];
    } else if (novelId) {
      const rows = await db.select().from(likesTable).where(
        and(
          eq(likesTable.novelId, Number(novelId)),
          userId ? eq(likesTable.userId, userId) : eq(likesTable.sessionKey, sessionKey!),
        )
      );
      existing = rows[0];
    }

    let liked: boolean;
    if (existing) {
      await db.delete(likesTable).where(eq(likesTable.id, existing.id));
      liked = false;
    } else {
      await db.insert(likesTable).values({
        essayId: essayId ?? null,
        novelId: novelId ?? null,
        userId,
        sessionKey,
      });
      liked = true;
    }

    let countRows;
    if (essayId) {
      countRows = await db.select().from(likesTable).where(eq(likesTable.essayId, Number(essayId)));
    } else {
      countRows = await db.select().from(likesTable).where(eq(likesTable.novelId, Number(novelId)));
    }

    res.json({ liked, count: countRows.length });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/counts", async (req, res) => {
  try {
    const { essayId, novelId } = req.query;
    const userId = req.isAuthenticated() ? req.user.id : null;
    const sessionKey = !userId ? (req.ip ?? "anon") : null;

    let rows;
    let userLiked = false;

    if (essayId) {
      rows = await db.select().from(likesTable).where(eq(likesTable.essayId, Number(essayId)));
      userLiked = rows.some((r) =>
        userId ? r.userId === userId : r.sessionKey === sessionKey
      );
    } else if (novelId) {
      rows = await db.select().from(likesTable).where(eq(likesTable.novelId, Number(novelId)));
      userLiked = rows.some((r) =>
        userId ? r.userId === userId : r.sessionKey === sessionKey
      );
    } else {
      return res.status(400).json({ error: "essayId or novelId required" });
    }

    res.json({ count: rows.length, userLiked });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
