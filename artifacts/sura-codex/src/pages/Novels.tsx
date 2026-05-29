import { useListNovels } from "@workspace/api-client-react";
import EditorialCard from "@/components/EditorialCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Novels() {
  const { data: novels, isLoading } = useListNovels();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-16 text-center">
        <h1 className="font-serif text-5xl mb-4 text-foreground">Novels</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Long-form narratives blending speculative technology and human experience.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
        ) : novels?.length ? (
          novels.map(novel => (
            <EditorialCard
              key={novel.id}
              href={`/novels/${novel.id}`}
              title={novel.title}
              excerpt={novel.synopsis}
              status={novel.status}
              publishedAt={novel.publishedAt}
              coverImage={novel.coverImage}
              metaText={`${novel.chaptersCount || 0} Chapters`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No novels found.
          </div>
        )}
      </div>
    </div>
  );
}