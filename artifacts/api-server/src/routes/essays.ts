import { Router } from "express";
import { db, essaysTable, insertEssaySchema, likesTable, commentsTable, sharesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function withCounts(essay: typeof essaysTable.$inferSelect) {
  const [likes, comments, shares] = await Promise.all([
    db.select().from(likesTable).where(eq(likesTable.essayId, essay.id)),
    db.select().from(commentsTable).where(eq(commentsTable.essayId, essay.id)),
    db.select().from(sharesTable).where(eq(sharesTable.essayId, essay.id)),
  ]);
  return {
    ...toApi(essay),
    likeCount: likes.length,
    commentCount: comments.filter((c) => c.isApproved).length,
    shareCount: shares.length,
  };
}

router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    let results = await db.select().from(essaysTable);
    if (category) results = results.filter((e) => e.category === category);
    if (featured !== undefined) results = results.filter((e) => e.featured === (featured === "true"));
    results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const withC = await Promise.all(results.map(withCounts));
    res.json(withC);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || slugify(body.title);
    const data = insertEssaySchema.parse({
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category || "writing",
      coverImage: body.coverImage || null,
      featured: body.featured ?? false,
      readingTime: body.readingTime ?? estimateReadingTime(body.content),
    });
    const [essay] = await db.insert(essaysTable).values(data).returning();
    res.status(201).json(await withCounts(essay));
  } catch (err: any) {
    if (err?.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [essay] = await db.select().from(essaysTable).where(eq(essaysTable.id, id));
    if (!essay) return res.status(404).json({ error: "Not found" });
    res.json(await withCounts(essay));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.excerpt !== undefined) update.excerpt = body.excerpt;
    if (body.content !== undefined) {
      update.content = body.content;
      if (!body.readingTime) update.readingTime = estimateReadingTime(body.content);
    }
    if (body.category !== undefined) update.category = body.category;
    if (body.coverImage !== undefined) update.coverImage = body.coverImage;
    if (body.featured !== undefined) update.featured = body.featured;
    if (body.readingTime !== undefined) update.readingTime = body.readingTime;
    const [essay] = await db.update(essaysTable).set(update).where(eq(essaysTable.id, id)).returning();
    if (!essay) return res.status(404).json({ error: "Not found" });
    res.json(await withCounts(essay));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(essaysTable).where(eq(essaysTable.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

function toApi(e: typeof essaysTable.$inferSelect) {
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    excerpt: e.excerpt,
    content: e.content,
    category: e.category,
    coverImage: e.coverImage,
    publishedAt: e.publishedAt.toISOString(),
    featured: e.featured,
    readingTime: e.readingTime,
  };
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function estimateReadingTime(content: string) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default router;
