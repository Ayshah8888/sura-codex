import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  useCreateEssay, useUpdateEssay, useGetEssay,
  useCreateNovel, useUpdateNovel, useGetNovel,
  getListEssaysQueryKey, getListNovelsQueryKey, getGetSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Link } from "wouter";
import { useUpload } from "@workspace/object-storage-web";

export default function AdminEditor() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const typeParam = searchParams.get("type") || "essay";
  const idParam = searchParams.get("id");
  
  const [type, setType] = useState<"essay" | "novel">(typeParam as "essay" | "novel");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState(""); // Also used for novel synopsis
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("tech");
  const [status, setStatus] = useState("draft");
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);

  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({
    basePath: "/api/storage",
    onSuccess: (res) => {
      setCoverImage(`/api/storage${res.objectPath}`);
      toast({ title: "Cover image uploaded" });
    },
    onError: (err) => toast({ title: "Upload failed", description: err.message, variant: "destructive" }),
  });
  
  const isEditing = !!idParam;
  const id = isEditing ? parseInt(idParam, 10) : 0;

  const { data: essayData } = useGetEssay(id, { query: { enabled: isEditing && type === "essay" } });
  const { data: novelData } = useGetNovel(id, { query: { enabled: isEditing && type === "novel" } });

  useEffect(() => {
    if (isEditing) {
      if (type === "essay" && essayData) {
        setTitle(essayData.title);
        setExcerpt(essayData.excerpt);
        setContent(essayData.content);
        setCategory(essayData.category);
        setCoverImage(essayData.coverImage || "");
        setFeatured(essayData.featured);
      } else if (type === "novel" && novelData) {
        setTitle(novelData.title);
        setExcerpt(novelData.synopsis);
        setContent(novelData.content);
        setStatus(novelData.status);
        setCoverImage(novelData.coverImage || "");
        setFeatured(novelData.featured);
      }
    }
  }, [essayData, novelData, isEditing, type]);

  const queryClient = useQueryClient();

  const createEssay = useCreateEssay();
  const updateEssay = useUpdateEssay();
  const createNovel = useCreateNovel();
  const updateNovel = useUpdateNovel();

  const handleSave = () => {
    if (!title || !content) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }

    if (type === "essay") {
      const data = {
        title, excerpt, content, category, 
        coverImage: coverImage || undefined, 
        featured, readingTime: Math.ceil(content.split(" ").length / 200) || 1
      };
      
      if (isEditing) {
        updateEssay.mutate({ id, data }, {
          onSuccess: () => {
            toast({ title: "Essay updated" });
            queryClient.invalidateQueries({ queryKey: getListEssaysQueryKey() });
          }
        });
      } else {
        createEssay.mutate({ data }, {
          onSuccess: () => {
            toast({ title: "Essay created" });
            queryClient.invalidateQueries({ queryKey: getListEssaysQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
            setLocation("/admin");
          }
        });
      }
    } else {
      const data = {
        title, synopsis: excerpt, content, status,
        coverImage: coverImage || undefined,
        featured, chaptersCount: 1 // Simplified for now
      };
      
      if (isEditing) {
        updateNovel.mutate({ id, data }, {
          onSuccess: () => {
            toast({ title: "Novel updated" });
            queryClient.invalidateQueries({ queryKey: getListNovelsQueryKey() });
          }
        });
      } else {
        createNovel.mutate({ data }, {
          onSuccess: () => {
            toast({ title: "Novel created" });
            queryClient.invalidateQueries({ queryKey: getListNovelsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetSummaryQueryKey() });
            setLocation("/admin");
          }
        });
      }
    }
  };

  const isPending = createEssay.isPending || updateEssay.isPending || createNovel.isPending || updateNovel.isPending;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Editor Header */}
      <div className="flex-none p-4 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="font-serif text-xl">{isEditing ? 'Edit Entry' : 'New Entry'}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 mr-4">
            <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
            <Label htmlFor="featured">Featured</Label>
          </div>
          <Button onClick={handleSave} disabled={isPending} className="bg-primary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" /> {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card/50 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v: "essay" | "novel") => !isEditing && setType(v)} disabled={isEditing}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essay">Essay</SelectItem>
                <SelectItem value="novel">Novel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="A remarkable title" />
          </div>

          {type === "essay" ? (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="journey">Journey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="serializing">Serializing</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>{type === "essay" ? "Excerpt" : "Synopsis"}</Label>
            <Textarea 
              value={excerpt} 
              onChange={e => setExcerpt(e.target.value)} 
              placeholder={`A short summary...`}
              className="resize-none h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            {coverImage ? (
              <div className="relative rounded overflow-hidden border border-border">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null}
            <label className="w-full flex items-center justify-center gap-2 rounded border border-dashed border-border bg-muted/40 hover:bg-muted px-3 py-2 text-sm text-muted-foreground transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading…" : coverImage ? "Replace image" : "Upload cover image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await uploadFile(file);
                  e.target.value = "";
                }}
              />
            </label>
            <Input
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="Or paste an image URL…"
              className="text-xs"
            />
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 overflow-hidden" data-color-mode="light">
          <MDEditor
            value={content}
            onChange={v => setContent(v || "")}
            height="100%"
            preview="live"
            className="border-none !rounded-none"
            style={{ borderRadius: 0 }}
          />
        </div>
      </div>
    </div>
  );
}