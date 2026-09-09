"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Clock,
  CalendarCheck,
  X,
  Loader2,
  Search,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
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

export default function MembersPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isAdmin = session?.user?.role === "ADMIN";

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "", role: "MEMBER" });
        setSuccessMessage("Member added successfully!");
        const data = await res.json();
        setFormError(data.error || "יצירת חבר נכשלה");
      }
    } catch {
      setFormError("משהו השתבש");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full bg-white border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-brand-black mb-2">
              גישה מוגבלת
            </h2>
            <p className="text-gray-500">
              רק מנהלים יכולים לנהל חברים.
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
          <h1 className="text-2xl font-bold text-brand-black">חברים</h1>
          <p className="text-gray-500 text-sm mt-1">
            נהל את חברי קהילת ההאב
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-blue hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/25"
        >
          <UserPlus className="w-4 h-4 me-2" />
          הוסף חבר
        </Button>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-black">
                  {members.filter((m) => m.role === "MEMBER").length}
                </p>
                <p className="text-xs text-gray-500">חברים פעילים</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-yellow/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-black">
                  {members.filter((m) => m.role === "ADMIN").length}
                </p>
                <p className="text-xs text-gray-500">מנהלים</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-black">
                  {members.length}
                </p>
                <p className="text-xs text-gray-500">סך כל החברים</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="חפש חברים לפי שם או אימייל..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ps-10 h-11 bg-white border-0 shadow-sm"
        />
      </div>

      {/* Members List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-3"
        >
          {filteredMembers.map((member) => (
            <motion.div key={member.id} variants={itemVariants}>
              <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-brand-blue">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-brand-black truncate">
                          {member.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            member.role === "ADMIN"
                              ? "bg-brand-yellow/20 text-yellow-700"
                              : "bg-brand-blue/10 text-brand-blue"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          הצטרף ב-{" "}
                          {new Date(member.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery ? "אין חברים התואמים את החיפוש" : "אין חברים עדיין"}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-md bg-white border-0 shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">הוסף חבר חדש</CardTitle>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        שם מלא
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                        className="text-start"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        אימייל
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        required
                        className="text-start"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        סיסמה
                      </label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Temporary password"
                        required
                        className="text-start"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        תפקיד
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="MEMBER">חבר</option>
                        <option value="ADMIN">מנהל</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowAddModal(false)}
                      >
                        ביטול
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-brand-blue hover:bg-brand-blue/90"
                        disabled={formLoading}
                      >
                        {formLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin me-2" />
                        ) : (
                          <UserPlus className="w-4 h-4 me-2" />
                        )}
                        {formLoading ? "מוסיף..." : "הוסף חבר"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
