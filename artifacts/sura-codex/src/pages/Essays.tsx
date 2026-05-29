import { useListEssays } from "@workspace/api-client-react";
import EditorialCard from "@/components/EditorialCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Essays() {
  const [filter, setFilter] = useState<string>("all");
  const { data: essays, isLoading } = useListEssays(
    filter !== "all" ? { category: filter } : {}
  );

  const categories = ["all", "tech", "writing", "journey"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-5xl mb-4 text-foreground">Essays</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explorations in software, storytelling, and the spaces between.
        </p>
      </header>

      <div className="flex justify-center mb-10 space-x-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            className="capitalize"
            onClick={() => setFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
        ) : essays?.length ? (
          essays.map(essay => (
            <EditorialCard
              key={essay.id}
              href={`/essays/${essay.id}`}
              title={essay.title}
              excerpt={essay.excerpt}
              category={essay.category}
              publishedAt={essay.publishedAt}
              coverImage={essay.coverImage}
              metaText={`${essay.readingTime} min read`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No essays found.
          </div>
        )}
      </div>
    </div>
  );
}