import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
// @ts-ignore
import logo from "../../../image/logo/logo.svg";
import {
  LayoutDashboard,
  Package,
  FileText,
  Lightbulb,
  ImageIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  MonitorPlay,
  Layers,
  LayoutTemplate,
  MessageSquare,
  Star,
  HelpCircle,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function check() {
      if (!isSupabaseConfigured()) {
        navigate("/admin");
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin");
      } else {
        setUser(data.session.user);
      }
      setChecking(false);
    }
    check();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Services", path: "/admin/dashboard/products", icon: Package },
    { name: "Blogs", path: "/admin/dashboard/blogs", icon: FileText },
    { name: "Solutions", path: "/admin/dashboard/solutions", icon: Lightbulb },
    { name: "Gallery", path: "/admin/dashboard/gallery", icon: ImageIcon },
    { name: "Hero Images", path: "/admin/dashboard/hero", icon: MonitorPlay },
    { name: "Core Services", path: "/admin/dashboard/core-services", icon: Layers },
    { name: "Page Banners", path: "/admin/dashboard/page-banners", icon: LayoutTemplate },
    { name: "Contact Queries", path: "/admin/dashboard/contact-queries", icon: MessageSquare },
    { name: "Feedback", path: "/admin/dashboard/feedback", icon: Star },
    { name: "FAQ", path: "/admin/dashboard/faq", icon: HelpCircle },
    { name: "Visitor Leads", path: "/admin/dashboard/leads", icon: Users },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">Loading…</div>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#030213] border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="block">
            <img 
              src={logo} 
              alt="Pacific Products & Solutions" 
              className="h-16 w-auto object-contain mb-1 rounded-full bg-white/5 p-2"
            />
            <p className="text-[10px] tracking-wider text-gray-500">
              ADMIN PANEL
            </p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path)
                  ? "bg-[#7FB706]/15 text-[#7FB706]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {isActive(item.path) && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-[#7FB706] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">
                {user?.email || "Admin"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-[#030213]/80 backdrop-blur-lg border-b border-white/5 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              {navItems.find((i) => isActive(i.path))?.name || "Dashboard"}
            </h2>
          </div>
          <Link
            to="/"
            target="_blank"
            className="text-sm text-gray-400 hover:text-[#7FB706] transition-colors"
          >
            View Site →
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
