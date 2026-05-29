import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

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
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/editor" component={AdminEditor} />
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