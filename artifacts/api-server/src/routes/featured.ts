import { Router } from "express";
import { db, essaysTable, novelsTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [essays, novels] = await Promise.all([
      db.select().from(essaysTable),
      db.select().from(novelsTable),
    ]);

    const featuredEssays = essays
      .filter((e) => e.featured)
      .map((e) => ({
        id: e.id,
        type: "essay" as const,
        title: e.title,
        slug: e.slug,
        excerpt: e.excerpt,
        coverImage: e.coverImage,
        publishedAt: e.publishedAt.toISOString(),
        category: e.category,
      }));

    const featuredNovels = novels
      .filter((n) => n.featured)
      .map((n) => ({
        id: n.id,
        type: "novel" as const,
        title: n.title,
        slug: n.slug,
        excerpt: n.synopsis,
        coverImage: n.coverImage,
        publishedAt: n.publishedAt.toISOString(),
        category: null,
      }));

    const combined = [...featuredEssays, ...featuredNovels].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    res.json(combined);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
