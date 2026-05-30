import { useListFeatured, useListEssays, useListNovels } from "@workspace/api-client-react";
import EditorialCard from "@/components/EditorialCard";
import AdSlot from "@/components/AdSlot";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useListFeatured();
  const { data: essays, isLoading: loadingEssays } = useListEssays();
  const { data: novels, isLoading: loadingNovels } = useListNovels();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (emblaApi) {
      const interval = setInterval(() => emblaApi.scrollNext(), 5000);
      return () => clearInterval(interval);
    }
  }, [emblaApi]);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="pt-20 pb-10 text-center max-w-3xl mx-auto px-4">
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6 leading-tight">
          A Sanctuary for Code <br/> &amp; Literature
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          The Sura Codex is a digital literary platform for programmer-writers who code with literary depth and write with technical precision.
        </p>
      </section>

      <AdSlot slot="header" />

      {/* Featured Carousel */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl mb-8 flex items-center justify-center">
          <span className="h-px bg-border flex-1 mr-4"></span>
          Featured
          <span className="h-px bg-border flex-1 ml-4"></span>
        </h2>
        {loadingFeatured ? (
          <div className="h-[400px] bg-muted animate-pulse"></div>
        ) : featured && featured.length > 0 ? (
          <div className="overflow-hidden relative group" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {featured.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_80%] lg:flex-[0_0_60%]">
                  <Link href={`/${item.type}s/${item.id}`} className="block relative h-[400px] overflow-hidden">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="font-serif text-6xl text-muted-foreground/30">{item.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xs uppercase tracking-wider font-semibold opacity-80">{item.type}</span>
                        {item.category && <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-sm">{item.category}</span>}
                      </div>
                      <h3 className="font-serif text-3xl mb-2">{item.title}</h3>
                      <p className="text-white/80 line-clamp-2 max-w-2xl">{item.excerpt}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" onClick={() => emblaApi?.scrollPrev()}>&larr;</button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" onClick={() => emblaApi?.scrollNext()}>&rarr;</button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No featured items yet.</p>
        )}
      </section>

      {/* Latest Essays */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl">Latest Essays</h2>
          <Link href="/essays" className="text-primary hover:underline flex items-center text-sm">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingEssays ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
          ) : essays?.slice(0, 3).map(essay => (
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
          ))}
        </div>
      </section>

      {/* Latest Novels */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl">Latest Novels</h2>
          <Link href="/novels" className="text-primary hover:underline flex items-center text-sm">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingNovels ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
          ) : novels?.slice(0, 3).map(novel => (
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
          ))}
        </div>
      </section>
    </div>
  );
}