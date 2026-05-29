import { Router } from "express";
import { db, essaysTable, novelsTable } from "@workspace/db";

const router = Router();

router.get("/summary", async (_req, res) => {
  try {
    const [essays, novels] = await Promise.all([
      db.select().from(essaysTable),
      db.select().from(novelsTable),
    ]);

    const categoryCounts: Record<string, number> = {};
    for (const e of essays) {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    }

    const totalFeatured = essays.filter((e) => e.featured).length + novels.filter((n) => n.featured).length;

    res.json({
      totalEssays: essays.length,
      totalNovels: novels.length,
      totalFeatured,
      categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
