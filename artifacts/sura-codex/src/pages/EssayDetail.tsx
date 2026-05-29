import { useGetEssay, useGetLikeCounts, useToggleLike, useRecordShare, getGetEssayQueryKey, getGetLikeCountsQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import CommentSection from "@/components/CommentSection";

export default function EssayDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: essay, isLoading } = useGetEssay(id, {
    query: { enabled: !!id }
  });

  const { data: likeCounts } = useGetLikeCounts({ essayId: id }, {
    query: { enabled: !!id }
  });

  const toggleLike = useToggleLike();
  const recordShare = useRecordShare();

  const handleLike = () => {
    toggleLike.mutate({ data: { essayId: id } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetEssayQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getGetLikeCountsQueryKey({ essayId: id }) });
      }
    });
  };

  const handleShare = () => {
    recordShare.mutate({ data: { essayId: id } }, {
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

  if (!essay) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="font-serif text-3xl mb-4">Essay not found</h1>
        <Link href="/essays" className="text-primary hover:underline">
          Return to Essays
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/essays" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Essays
      </Link>

      <header className="mb-12 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Badge variant="secondary" className="bg-[#e5d0be] text-[#5c4a3d] font-normal border-none">
            {essay.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {format(new Date(essay.publishedAt), "MMMM d, yyyy")}
          </span>
          <span className="text-sm text-muted-foreground">&bull;</span>
          <span className="text-sm text-muted-foreground">
            {essay.readingTime} min read
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6">
          {essay.title}
        </h1>
        {essay.excerpt && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic mb-8">
            {essay.excerpt}
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

      {essay.coverImage && (
        <figure className="mb-12">
          <img src={essay.coverImage} alt={essay.title} className="w-full h-auto max-h-[600px] object-cover" />
        </figure>
      )}

      <div className="bg-card p-8 md:p-12 border border-border/50 shadow-sm">
        <MarkdownRenderer content={essay.content} />
      </div>

      <CommentSection essayId={id} />
    </article>
  );
}