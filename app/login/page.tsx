"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("אימייל או סיסמה שגויים");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("משהו השתבש. אנא נסה שנית.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue/5 via-white to-brand-yellow/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue to-brand-yellow" />

          {/* Logo / Branding */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/10 mb-4">
              <span className="text-3xl font-bold text-brand-blue">H</span>
            </div>
            <h1 className="text-2xl font-bold text-brand-black">האב מנג'ר</h1>
            <p className="text-sm text-gray-500 mt-1">התחבר לסביבת העבודה שלך</p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@thehub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-10 h-11 text-left"
                  dir="ltr"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-10 h-11 text-left"
                  dir="ltr"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-brand-blue hover:bg-brand-blue/90 transition-all duration-200 shadow-lg shadow-brand-blue/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin me-2" />
              ) : (
                <LogIn className="w-5 h-5 me-2" />
              )}
              {isLoading ? "מתחבר..." : "התחבר"}
            </Button>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xs text-center text-gray-400 mt-6"
          >
            מערכת ניהול מתחם העבודה Hub
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
