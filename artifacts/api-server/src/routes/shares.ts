import { Router } from "express";
import { db, sharesTable, notificationsTable, essaysTable, novelsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { essayId, novelId } = req.body;
    const userId = req.isAuthenticated() ? req.user.id : null;
    await db.insert(sharesTable).values({
      essayId: essayId ?? null,
      novelId: novelId ?? null,
      userId,
    });

    let rows;
    let contentTitle = "content";
    if (essayId) {
      rows = await db.select().from(sharesTable).where(eq(sharesTable.essayId, Number(essayId)));
      const [e] = await db.select().from(essaysTable).where(eq(essaysTable.id, Number(essayId)));
      if (e) contentTitle = e.title;
    } else {
      rows = await db.select().from(sharesTable).where(eq(sharesTable.novelId, Number(novelId)));
      const [n] = await db.select().from(novelsTable).where(eq(novelsTable.id, Number(novelId)));
      if (n) contentTitle = n.title;
    }

    await db.insert(notificationsTable).values({
      type: "share",
      message: `"${contentTitle}" was shared`,
      essayId: essayId ?? null,
      novelId: novelId ?? null,
    });

    res.status(201).json({ shareCount: rows.length });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
