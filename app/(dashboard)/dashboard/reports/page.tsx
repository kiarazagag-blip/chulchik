"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  CalendarCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";

interface MemberReport {
  id: string;
  name: string;
  email: string;
  totalHours: number;
  daysPresent: number;
  eventsAttended: number;
  totalEvents: number;
  complianceRate: number;
}

interface ReportData {
  month: string;
  year: number;
  totalMembers: number;
  members: MemberReport[];
  overallComplianceRate: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ReportsPage() {
  const { data: session } = useSession();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const isAdmin = session?.user?.role === "ADMIN";

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await fetch(
        `/api/reports/monthly?month=${month}&year=${year}`
      );
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    if (isAdmin) fetchReport();
  }, [isAdmin, fetchReport]);

  const handleSendReport = async () => {
    setSending(true);
    try {
      // In a production app this would call an email API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } finally {
      setSending(false);
    }
  };

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full bg-white border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-brand-black mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-500">
              Only administrators can view reports.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">
            Monthly Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track member commitment and attendance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSendReport}
            variant="brand"
            disabled={sending || !report}
            className="shadow-lg shadow-brand-yellow/25"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : sendSuccess ? (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {sending
              ? "Sending..."
              : sendSuccess
              ? "Sent!"
              : "Email Report"}
          </Button>
        </div>
      </div>

      {/* Month navigator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-brand-black min-w-[200px] text-center">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
        </div>
      ) : report ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-black">
                      {report.totalMembers}
                    </p>
                    <p className="text-xs text-gray-500">Total Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-black">
                      {report.overallComplianceRate}%
                    </p>
                    <p className="text-xs text-gray-500">Compliance Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-yellow/10 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-black">
                      {report.members.reduce(
                        (acc, m) => acc + m.eventsAttended,
                        0
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Events Attended</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-black">
                      {Math.round(
                        report.members.reduce(
                          (acc, m) => acc + m.totalHours,
                          0
                        ) / Math.max(report.members.length, 1)
                      )}h
                    </p>
                    <p className="text-xs text-gray-500">Avg Hours/Member</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Member Breakdown */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-blue" />
                Member-by-Member Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {report.members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No member data for this month
                  </div>
                ) : (
                  report.members.map((member) => (
                    <motion.div
                      key={member.id}
                      variants={itemVariants}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-blue/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-brand-blue">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-brand-black text-sm">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.complianceRate >= 80 ? (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Compliant
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                              <AlertTriangle className="w-3 h-3" />
                              Needs Attention
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Hours Logged
                          </p>
                          <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-brand-black">
                              {member.totalHours.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-400 mb-0.5">
                              hrs
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Days Present
                          </p>
                          <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-brand-black">
                              {member.daysPresent}
                            </span>
                            <span className="text-xs text-gray-400 mb-0.5">
                              days
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Events ({member.eventsAttended}/{member.totalEvents}
                            )
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="h-2 rounded-full bg-brand-blue transition-all duration-500"
                              style={{
                                width: `${
                                  member.totalEvents > 0
                                    ? (member.eventsAttended /
                                        member.totalEvents) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No report data available</p>
        </div>
      )}
    </motion.div>
  );
}
