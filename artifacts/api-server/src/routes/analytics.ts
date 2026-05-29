import { Router } from "express";
import { db, essaysTable, novelsTable, likesTable, sharesTable, commentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [essays, novels, likes, shares, comments] = await Promise.all([
      db.select().from(essaysTable),
      db.select().from(novelsTable),
      db.select().from(likesTable),
      db.select().from(sharesTable),
      db.select().from(commentsTable),
    ]);

    function countFor(items: { essayId: number | null; novelId: number | null }[], essayId?: number, novelId?: number) {
      return items.filter((i) =>
        essayId !== undefined ? i.essayId === essayId : i.novelId === novelId
      ).length;
    }

    const allItems = [
      ...essays.map((e) => ({
        id: e.id, type: "essay", title: e.title, slug: e.slug,
        likeCount: countFor(likes, e.id, undefined),
        shareCount: countFor(shares, e.id, undefined),
        commentCount: countFor(comments as any[], e.id, undefined),
      })),
      ...novels.map((n) => ({
        id: n.id, type: "novel", title: n.title, slug: n.slug,
        likeCount: countFor(likes, undefined, n.id),
        shareCount: countFor(shares, undefined, n.id),
        commentCount: countFor(comments as any[], undefined, n.id),
      })),
    ];

    const topLiked = [...allItems].sort((a, b) => b.likeCount - a.likeCount).slice(0, 10).map((i) => ({ id: i.id, type: i.type, title: i.title, slug: i.slug, count: i.likeCount }));
    const topShared = [...allItems].sort((a, b) => b.shareCount - a.shareCount).slice(0, 10).map((i) => ({ id: i.id, type: i.type, title: i.title, slug: i.slug, count: i.shareCount }));
    const topCommented = [...allItems].sort((a, b) => b.commentCount - a.commentCount).slice(0, 10).map((i) => ({ id: i.id, type: i.type, title: i.title, slug: i.slug, count: i.commentCount }));

    res.json({ topLiked, topShared, topCommented });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
