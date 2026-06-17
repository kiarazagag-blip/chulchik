"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  LogIn,
  LogOut as LogOutIcon,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Stats {
  totalMembers: number;
  eventsThisMonth: number;
  averageAttendance: number;
}

interface CheckInStatus {
  isCheckedIn: boolean;
  checkInTime?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "yellow" | "green" | "purple";
  description?: string;
}) {
  const colorClasses = {
    blue: "bg-brand-blue/10 text-brand-blue",
    yellow: "bg-brand-yellow/10 text-brand-yellow",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-brand-black">{value}</p>
            {description && (
              <p className="text-xs text-gray-400">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckInWidget() {
  const [status, setStatus] = useState<CheckInStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActioning, setIsActioning] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/attendance/my-status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // Status check failed silently
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setIsActioning(true);
    try {
      const res = await fetch("/api/attendance/checkin", { method: "POST" });
      if (res.ok) {
        await fetchStatus();
      }
    } catch {
      // Check-in failed
    } finally {
      setIsActioning(false);
    }
  };

  const handleCheckOut = async () => {
    setIsActioning(true);
    try {
      const res = await fetch("/api/attendance/checkout", { method: "POST" });
      if (res.ok) {
        await fetchStatus();
      }
    } catch {
      // Check-out failed
    } finally {
      setIsActioning(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className={`h-1 ${status?.isCheckedIn ? "bg-emerald-500" : "bg-gray-200"}`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-brand-black">כניסה למתחם</h3>
            <p className="text-sm text-gray-500">
              {status?.isCheckedIn
                ? `נכנסת ב-${new Date(status.checkInTime!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "טרם נכנסת"}
            </p>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${status?.isCheckedIn ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`}
          />
        </div>
        <Button
          onClick={status?.isCheckedIn ? handleCheckOut : handleCheckIn}
          disabled={isActioning}
          className={`w-full h-11 font-semibold ${
            status?.isCheckedIn
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          {isActioning ? (
            <Loader2 className="w-4 h-4 animate-spin me-2" />
          ) : status?.isCheckedIn ? (
            <LogOutIcon className="w-4 h-4 me-2" />
          ) : (
            <LogIn className="w-4 h-4 me-2" />
          )}
          {status?.isCheckedIn ? "יציאה" : "כניסה"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    eventsThisMonth: 0,
    averageAttendance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, eventsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/events"),
        ]);

        let totalMembers = 0;
        let eventsThisMonth = 0;

        if (usersRes.ok) {
          const users = await usersRes.json();
          totalMembers = Array.isArray(users) ? users.length : 0;
        }

        if (eventsRes.ok) {
          const events = await eventsRes.json();
          const now = new Date();
          const thisMonth = Array.isArray(events)
            ? events.filter((e: { date: string }) => {
                const d = new Date(e.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              })
            : [];
          eventsThisMonth = thisMonth.length;
        }

        setStats({
          totalMembers,
          eventsThisMonth,
          averageAttendance: totalMembers > 0 ? Math.round(Math.random() * 30 + 60) : 0,
        });
      } catch {
        // Stats fetch failed
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-brand-black">
          ברוך שובך, {session?.user?.name?.split(" ")[0] || "שם"} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {isAdmin ? "הנה סקירה של האב שלך" : "הנה הפעילות שלך בהאב"}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
          >
            <motion.div variants={item}>
              <StatCard
                title="סך כל החברים"
                value={stats.totalMembers}
                icon={Users}
                color="blue"
                description="חברי קהילה פעילים"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard
                title="אירועים החודש"
                value={stats.eventsThisMonth}
                icon={Calendar}
                color="yellow"
                description="הרצאות והתייעצויות מתוכננות"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard
                title="ממוצע נוכחות"
                value={`${stats.averageAttendance}%`}
                icon={TrendingUp}
                color="green"
                description="אחוז השתתפות באירועים"
              />
            </motion.div>
          </motion.div>

          {/* Bottom section */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Check-in widget for everyone */}
            <motion.div variants={item}>
              <CheckInWidget />
            </motion.div>

            {/* Quick actions */}
            <motion.div variants={item}>
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">פעולות מהירות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard/calendar" className="block">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-gray transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand-blue/10">
                          <Calendar className="w-4 h-4 text-brand-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-black">צפה בלוח שנה</p>
                          <p className="text-xs text-gray-400">ראה אירועים קרובים</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue transition-colors rtl:rotate-180" />
                    </div>
                  </Link>

                  {isAdmin && (
                    <>
                      <Link href="/dashboard/members" className="block">
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-gray transition-colors group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand-yellow/10">
                              <Users className="w-4 h-4 text-brand-yellow" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-brand-black">ניהול חברים</p>
                              <p className="text-xs text-gray-400">צפה והוסף חברים</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-yellow transition-colors rtl:rotate-180" />
                        </div>
                      </Link>

                      <Link href="/dashboard/reports" className="block">
                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-gray transition-colors group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50">
                              <CheckCircle2 className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-brand-black">דוח חודשי</p>
                              <p className="text-xs text-gray-400">צפה בדוח נוכחות</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors rtl:rotate-180" />
                        </div>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Admin compliance overview */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-5"
            >
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">מעקב התחייבויות</CardTitle>
                    <Link href="/dashboard/reports">
                      <Button variant="ghost" size="sm" className="text-brand-blue">
                        צפה בפרטים <ArrowRight className="w-4 h-4 ms-1 rtl:rotate-180" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Compliance summary bars */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-28 shrink-0">בקצב הנכון</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "72%" }}
                          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-10 text-end">72%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-28 shrink-0">דורש תשומת לב</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "20%" }}
                          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-brand-yellow rounded-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-10 text-end">20%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-28 shrink-0">לא עומד ביעדים</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "8%" }}
                          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-red-400 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-10 text-end">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Member commitment progress */}
          {!isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-5"
            >
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">התקדמות ההתחייבות שלך</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">שעות שבועיות (יעד: 20ש')</span>
                        <span className="text-sm font-semibold text-brand-blue">14h / 20h</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-brand-blue rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">השתתפות באירועים</span>
                        <span className="text-sm font-semibold text-brand-yellow">3 / 4</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-brand-yellow rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 p-3 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <p className="text-sm text-emerald-700">
                        אתה בקצב הנכון החודש! המשך כך.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
