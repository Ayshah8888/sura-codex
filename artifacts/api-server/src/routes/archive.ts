import { Router } from "express";
import { db, essaysTable, novelsTable, likesTable, commentsTable } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type, category, q } = req.query;
    const [essays, novels, likes, comments] = await Promise.all([
      db.select().from(essaysTable),
      db.select().from(novelsTable),
      db.select().from(likesTable),
      db.select().from(commentsTable),
    ]);

    function likesFor(essayId?: number, novelId?: number) {
      return likes.filter((l) => essayId !== undefined ? l.essayId === essayId : l.novelId === novelId).length;
    }
    function commentsFor(essayId?: number, novelId?: number) {
      return comments.filter((c: any) => essayId !== undefined ? c.essayId === essayId : c.novelId === novelId && c.isApproved).length;
    }

    let items: any[] = [];

    if (!type || type === "essay") {
      items.push(...essays
        .filter((e) => !category || e.category === category)
        .filter((e) => !q || e.title.toLowerCase().includes(String(q).toLowerCase()) || e.excerpt.toLowerCase().includes(String(q).toLowerCase()))
        .map((e) => ({
          id: e.id, type: "essay", title: e.title, slug: e.slug,
          excerpt: e.excerpt, coverImage: e.coverImage,
          publishedAt: e.publishedAt.toISOString(),
          category: e.category,
          likeCount: likesFor(e.id, undefined),
          commentCount: commentsFor(e.id, undefined),
        })));
    }

    if (!type || type === "novel") {
      items.push(...novels
        .filter((n) => !q || n.title.toLowerCase().includes(String(q).toLowerCase()) || n.synopsis.toLowerCase().includes(String(q).toLowerCase()))
        .map((n) => ({
          id: n.id, type: "novel", title: n.title, slug: n.slug,
          excerpt: n.synopsis, coverImage: n.coverImage,
          publishedAt: n.publishedAt.toISOString(),
          category: null,
          likeCount: likesFor(undefined, n.id),
          commentCount: commentsFor(undefined, n.id),
        })));
    }

    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    res.json(items);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
