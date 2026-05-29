import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type CardProps = {
  href: string;
  title: string;
  excerpt?: string;
  category?: string;
  publishedAt: string;
  coverImage?: string | null;
  metaText?: string;
  status?: string;
};

export default function EditorialCard({
  href,
  title,
  excerpt,
  category,
  publishedAt,
  coverImage,
  metaText,
  status
}: CardProps) {
  const getCategoryColor = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case "tech": return "bg-[#d4bca4] text-[#4a3b2c]";
      case "writing": return "bg-[#e5d0be] text-[#5c4a3d]";
      case "journey": return "bg-[#c5a58a] text-[#3e2f23]";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Link href={href} className="group block">
      <div className="h-full flex flex-col overflow-hidden bg-card border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
        {coverImage ? (
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
            <img src={coverImage} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full flex items-center justify-center bg-muted/30 border-b border-border/30 p-6 text-center">
            <span className="font-serif text-2xl text-muted-foreground/60 opacity-50 group-hover:opacity-100 transition-opacity">
              {title.charAt(0)}
            </span>
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            {category && (
              <Badge variant="secondary" className={cn("text-xs font-normal border-none", getCategoryColor(category))}>
                {category}
              </Badge>
            )}
            {status && (
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                {status}
              </Badge>
            )}
          </div>
          <h3 className="font-serif text-xl mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1 leading-relaxed">
              {excerpt}
            </p>
          )}
          <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
            <span>{format(new Date(publishedAt), "MMM d, yyyy")}</span>
            {metaText && <span>{metaText}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}