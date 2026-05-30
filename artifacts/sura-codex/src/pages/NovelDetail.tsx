import { useGetNovel, useGetLikeCounts, useToggleLike, useRecordShare, getGetNovelQueryKey, getGetLikeCountsQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import AdSlot from "@/components/AdSlot";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import CommentSection from "@/components/CommentSection";

export default function NovelDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: novel, isLoading } = useGetNovel(id, {
    query: { enabled: !!id }
  });

  const { data: likeCounts } = useGetLikeCounts({ novelId: id }, {
    query: { enabled: !!id }
  });

  const toggleLike = useToggleLike();
  const recordShare = useRecordShare();

  const handleLike = () => {
    toggleLike.mutate({ data: { novelId: id } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetNovelQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getGetLikeCountsQueryKey({ novelId: id }) });
      }
    });
  };

  const handleShare = () => {
    recordShare.mutate({ data: { novelId: id } }, {
      onSuccess: () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied to clipboard!" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="font-serif text-3xl mb-4">Novel not found</h1>
        <Link href="/novels" className="text-primary hover:underline">
          Return to Novels
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/novels" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Novels
      </Link>

      <header className="mb-12 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Badge variant="outline" className="font-normal uppercase tracking-wider">
            {novel.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Started {format(new Date(novel.publishedAt), "MMMM yyyy")}
          </span>
          <span className="text-sm text-muted-foreground">&bull;</span>
          <span className="text-sm text-muted-foreground">
            {novel.chaptersCount} Chapters
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6">
          {novel.title}
        </h1>
        {novel.synopsis && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic mb-8">
            {novel.synopsis}
          </p>
        )}
        
        <div className="flex items-center justify-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLike}
            className={`rounded-full ${likeCounts?.userLiked ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
          >
            <Heart className={`w-4 h-4 mr-2 ${likeCounts?.userLiked ? 'fill-current' : ''}`} />
            {likeCounts?.count || 0}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="rounded-full">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </header>

      <AdSlot slot="inline" />

      {novel.coverImage && (
        <figure className="mb-12">
          <img src={novel.coverImage} alt={novel.title} className="w-full h-auto max-h-[600px] object-cover" />
        </figure>
      )}

      <div className="bg-card p-8 md:p-12 border border-border/50 shadow-sm">
        <MarkdownRenderer content={novel.content} />
      </div>

      <CommentSection novelId={id} />
    </article>
  );
}