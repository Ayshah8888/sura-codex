import { Router } from "express";
import { db, novelsTable, insertNovelSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { featured } = req.query;
    let results = await db.select().from(novelsTable);
    if (featured !== undefined) results = results.filter((n) => n.featured === (featured === "true"));
    results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    res.json(results.map(toApi));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || slugify(body.title);
    const data = insertNovelSchema.parse({
      title: body.title,
      slug,
      synopsis: body.synopsis,
      content: body.content,
      coverImage: body.coverImage || null,
      featured: body.featured ?? false,
      status: body.status || "draft",
      chaptersCount: body.chaptersCount ?? 1,
    });
    const [novel] = await db.insert(novelsTable).values(data).returning();
    res.status(201).json(toApi(novel));
  } catch (err: any) {
    if (err?.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [novel] = await db.select().from(novelsTable).where(eq(novelsTable.id, id));
    if (!novel) return res.status(404).json({ error: "Not found" });
    res.json(toApi(novel));
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
    if (body.synopsis !== undefined) update.synopsis = body.synopsis;
    if (body.content !== undefined) update.content = body.content;
    if (body.coverImage !== undefined) update.coverImage = body.coverImage;
    if (body.featured !== undefined) update.featured = body.featured;
    if (body.status !== undefined) update.status = body.status;
    if (body.chaptersCount !== undefined) update.chaptersCount = body.chaptersCount;
    const [novel] = await db.update(novelsTable).set(update).where(eq(novelsTable.id, id)).returning();
    if (!novel) return res.status(404).json({ error: "Not found" });
    res.json(toApi(novel));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(novelsTable).where(eq(novelsTable.id, id));
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

function toApi(n: typeof novelsTable.$inferSelect) {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    synopsis: n.synopsis,
    content: n.content,
    coverImage: n.coverImage,
    publishedAt: n.publishedAt.toISOString(),
    featured: n.featured,
    status: n.status,
    chaptersCount: n.chaptersCount,
  };
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default router;
