import { 
  useGetSummary, 
  useListEssays, 
  useListNovels,
  useDeleteEssay,
  useDeleteNovel,
  getListEssaysQueryKey,
  getListNovelsQueryKey,
  getGetSummaryQueryKey
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetSummary();
  const { data: essays, isLoading: loadingEssays } = useListEssays();
  const { data: novels, isLoading: loadingNovels } = useListNovels();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const deleteEssay = useDeleteEssay();
  const deleteNovel = useDeleteNovel();

  const handleDeleteEssay = async (id: number) => {
    if (!confirm("Are you sure you want to delete this essay?")) return;
    deleteEssay.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Essay deleted" });
        queryClient.invalidateQueries({ queryKey: getListEssaysQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
      }
    });
  };

  const handleDeleteNovel = async (id: number) => {
    if (!confirm("Are you sure you want to delete this novel?")) return;
    deleteNovel.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Novel deleted" });
        queryClient.invalidateQueries({ queryKey: getListNovelsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl text-foreground">Dashboard</h1>
        <Link href="/admin/editor">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> New Entry
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {loadingSummary ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Essays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-serif">{summary?.totalEssays || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Novels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-serif">{summary?.totalNovels || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Featured Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-serif">{summary?.totalFeatured || 0}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Essays List */}
        <div>
          <h2 className="font-serif text-2xl mb-6">Manage Essays</h2>
          <div className="space-y-4">
            {loadingEssays ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : essays?.length ? (
              essays.map(essay => (
                <div key={essay.id} className="flex items-center justify-between p-4 bg-card border border-border/50 shadow-sm">
                  <div>
                    <h3 className="font-medium text-foreground line-clamp-1">{essay.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{essay.category} &bull; {essay.featured ? 'Featured' : 'Standard'}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/admin/editor?type=essay&id=${essay.id}`}>
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEssay(essay.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No essays yet.</p>
            )}
          </div>
        </div>

        {/* Novels List */}
        <div>
          <h2 className="font-serif text-2xl mb-6">Manage Novels</h2>
          <div className="space-y-4">
            {loadingNovels ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : novels?.length ? (
              novels.map(novel => (
                <div key={novel.id} className="flex items-center justify-between p-4 bg-card border border-border/50 shadow-sm">
                  <div>
                    <h3 className="font-medium text-foreground line-clamp-1">{novel.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{novel.status} &bull; {novel.featured ? 'Featured' : 'Standard'}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/admin/editor?type=novel&id=${novel.id}`}>
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNovel(novel.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No novels yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}