import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@workspace/replit-auth-web";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Pages
import Home from "@/pages/Home";
import Essays from "@/pages/Essays";
import EssayDetail from "@/pages/EssayDetail";
import Novels from "@/pages/Novels";
import NovelDetail from "@/pages/NovelDetail";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminEditor from "@/pages/AdminEditor";
import Archive from "@/pages/Archive";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminUsers from "@/pages/AdminUsers";

const queryClient = new QueryClient();

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }
  return <>{children}</>;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/essays" component={Essays} />
          <Route path="/essays/:id" component={EssayDetail} />
          <Route path="/novels" component={Novels} />
          <Route path="/novels/:id" component={NovelDetail} />
          <Route path="/archive" component={Archive} />
          
          <Route path="/admin">
            <AdminGuard><AdminDashboard /></AdminGuard>
          </Route>
          <Route path="/admin/editor">
            <AdminGuard><AdminEditor /></AdminGuard>
          </Route>
          <Route path="/admin/analytics">
            <AdminGuard><AdminAnalytics /></AdminGuard>
          </Route>
          <Route path="/admin/users">
            <AdminGuard><AdminUsers /></AdminGuard>
          </Route>
          
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;