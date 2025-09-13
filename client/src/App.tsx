import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import Subjects from "@/pages/subjects";
import Admissions from "@/pages/admissions";
import Contact from "@/pages/contact";
import AiChat from "@/pages/ai-chat";
import GroupChat from "@/pages/group-chat";
import ARLearning from "@/pages/ar-learning";
import EmotionalLearning from "@/pages/emotional-learning";
import Avatars from "@/pages/avatars";
import LMSStructure from "@/pages/lms-structure";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/programs" component={Programs} />
          <Route path="/subjects" component={Subjects} />
          <Route path="/admissions" component={Admissions} />
          <Route path="/contact" component={Contact} />
          <Route path="/ai-chat" component={AiChat} />
          <Route path="/group-chat" component={GroupChat} />
          <Route path="/ar-learning" component={ARLearning} />
          <Route path="/emotional-learning" component={EmotionalLearning} />
          <Route path="/avatars" component={Avatars} />
          <Route path="/lms-structure" component={LMSStructure} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
