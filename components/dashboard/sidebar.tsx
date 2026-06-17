"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/dashboard", label: "לוח בקרה", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "לוח שנה", icon: Calendar },
  { href: "/dashboard/members", label: "חברים", icon: Users },
  { href: "/dashboard/reports", label: "דוחות", icon: BarChart3 },
];

const memberLinks = [
  { href: "/dashboard", label: "לוח בקרה", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "לוח שנה", icon: Calendar },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const links = isAdmin ? adminLinks : memberLinks;
  const userName = session?.user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xl font-bold text-white">H</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">האב מנג'ר</h1>
            <p className="text-xs text-white/60">{isAdmin ? "לוח ניהול" : "אזור אישי"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-white/20 text-white shadow-lg shadow-black/10"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-brand-yellow" : "")} />
              <span>{link.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 mr-auto text-brand-yellow rtl:rotate-180" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-brand-black">{userInitial}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-white/50 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 rtl:rotate-180" />
          <span>התנתק</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <span className="text-sm font-bold text-white">H</span>
          </div>
          <span className="font-semibold text-brand-black">האב מנג'ר</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:start-0 z-30">
        <div className="flex flex-col flex-1 bg-gradient-to-b from-brand-blue to-blue-700 rounded-e-2xl overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 end-0 z-50 w-72 bg-gradient-to-b from-brand-blue to-blue-700 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
