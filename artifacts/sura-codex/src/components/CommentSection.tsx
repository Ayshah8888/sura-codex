import React, { useState } from "react";
import { useListComments, useCreateComment, useDeleteComment, getListCommentsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentSectionProps {
  essayId?: number;
  novelId?: number;
}

export default function CommentSection({ essayId, novelId }: CommentSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [authorName, setAuthorName] = useState(user?.firstName || "");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const { data: comments, isLoading } = useListComments({ essayId, novelId });
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const handleSubmit = (e: React.FormEvent, parentId?: number) => {
    e.preventDefault();
    if (!content.trim() || (!user && !authorName.trim())) return;

    createComment.mutate({
      data: { 
        essayId, 
        novelId, 
        authorName: user?.firstName || authorName, 
        content, 
        parentId 
      }
    }, {
      onSuccess: () => {
        setContent("");
        setReplyTo(null);
        toast({ title: "Comment posted" });
        queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey({ essayId, novelId }) });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete comment?")) return;
    deleteComment.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Comment deleted" });
        queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey({ essayId, novelId }) });
      }
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: any, isReply?: boolean }) => (
    <div className={`flex gap-4 ${isReply ? 'ml-12 mt-4' : 'mt-6'}`}>
      <Avatar className="w-10 h-10 border border-border">
        {comment.authorImage ? <AvatarImage src={comment.authorImage} /> : <AvatarFallback className="bg-[#C5A58A] text-white">{comment.authorName[0]?.toUpperCase()}</AvatarFallback>}
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="font-medium text-foreground">{comment.authorName}</span>
            <span className="text-sm text-muted-foreground ml-2">{format(new Date(comment.createdAt), "MMM d, yyyy")}</span>
          </div>
          {user?.role === 'admin' && (
            <Button variant="ghost" size="icon" onClick={() => handleDelete(comment.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">{comment.content}</p>
        
        {!isReply && (
          <Button variant="link" className="px-0 py-0 h-auto text-xs mt-2 text-muted-foreground hover:text-primary" onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}>
            Reply
          </Button>
        )}

        {replyTo === comment.id && !isReply && (
          <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4 space-y-3">
            {!user && (
              <Input 
                placeholder="Name" 
                value={authorName} 
                onChange={e => setAuthorName(e.target.value)} 
                className="max-w-xs"
              />
            )}
            <Textarea 
              placeholder="Write a reply..." 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={createComment.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Post Reply
              </Button>
              <Button type="button" variant="ghost" onClick={() => setReplyTo(null)}>Cancel</Button>
            </div>
          </form>
        )}

        {comment.replies?.map((reply: any) => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-16 pt-8 border-t border-border/50">
      <h3 className="font-serif text-2xl mb-8 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Comments ({comments?.length || 0})
      </h3>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 mb-10 bg-card p-6 border border-border/50 shadow-sm">
        <h4 className="font-medium">Leave a comment</h4>
        <div className="grid gap-4">
          {!user && (
            <Input 
              placeholder="Your name" 
              value={authorName} 
              onChange={e => setAuthorName(e.target.value)} 
              className="max-w-xs bg-background"
            />
          )}
          <Textarea 
            placeholder="Share your thoughts..." 
            value={replyTo === null ? content : ""} 
            onChange={e => {
              if (replyTo === null) setContent(e.target.value);
            }} 
            className="min-h-[100px] bg-background"
            disabled={replyTo !== null}
          />
          <div>
            <Button type="submit" disabled={createComment.isPending || replyTo !== null} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {createComment.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-border rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-border w-1/4 rounded" />
                <div className="h-4 bg-border w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {comments?.map((comment: any) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}