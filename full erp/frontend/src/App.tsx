import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserProfile from "@/components/UserProfile";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import Fees from "./pages/Fees";
import Grades from "./pages/Grades";
import Messages from "./pages/Messages";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AIFeatures from "./pages/AIFeatures";
import AIProjects from "./pages/AIProjects";
import AIChatbot from "./components/AI/AIChatbot";
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarInset,
  SidebarHeader,
  SidebarSeparator
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Home,
  LogIn,
  User,
  Settings as SettingsIcon,
  Sparkles,
  Code
} from "lucide-react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  const location = window.location;
  const navigate = (path: string) => window.location.pathname !== path && (window.location.href = path);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between w-full">
              <span className="text-lg font-bold pl-2 pt-2 pb-2">Student ERP</span>
              {user && <UserProfile />}
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={location.pathname === "/"} onClick={() => navigate("/")}> <Home /> Home </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={location.pathname === "/courses"} onClick={() => navigate("/courses")}> <BookOpen /> My Courses </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={location.pathname === "/attendance"} onClick={() => navigate("/attendance")}> <Calendar /> Attendance </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={location.pathname === "/grades"} onClick={() => navigate("/grades")}> <FileText /> Grades </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={location.pathname === "/messages"} onClick={() => navigate("/messages")}> <MessageSquare /> Messages </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={location.pathname === "/tuition"} onClick={() => navigate("/tuition")}> <CreditCard /> Pay Fees </SidebarMenuButton>
              </SidebarMenuItem>
              {user && (
                <>
                  <SidebarSeparator />
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={location.pathname === "/profile"} onClick={() => navigate("/profile")}> <User /> Profile </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={location.pathname === "/settings"} onClick={() => navigate("/settings")}> <SettingsIcon /> Settings </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={location.pathname === "/ai-features"} onClick={() => navigate("/ai-features")}> <Sparkles /> AI Features </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={location.pathname === "/ai-projects"} onClick={() => navigate("/ai-projects")}> <Code /> AI Projects </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              {!user && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/auth")}> <LogIn /> Sign In </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Main content container */}
            <div className="relative z-10 w-full h-full p-6">
              <div className="max-w-7xl mx-auto h-full">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/tuition" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
                  <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/ai-features" element={<ProtectedRoute><AIFeatures /></ProtectedRoute>} />
                  <Route path="/ai-projects" element={<ProtectedRoute><AIProjects /></ProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </div>
        </SidebarInset>
        <AIChatbot />
      </div>
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
