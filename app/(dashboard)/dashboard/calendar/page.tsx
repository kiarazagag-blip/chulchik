"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Loader2,
  BookOpen,
  MessageSquare,
  MoreHorizontal,
  Edit3,
  Trash2,
  Check,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: "LECTURE" | "DILEMMA" | "OTHER";
  isMandatory: boolean;
}

const eventTypeConfig = {
  LECTURE: { color: "bg-brand-blue", lightColor: "bg-brand-blue/10", textColor: "text-brand-blue", icon: BookOpen, label: "Lecture" },
  DILEMMA: { color: "bg-brand-yellow", lightColor: "bg-brand-yellow/10", textColor: "text-yellow-700", icon: MessageSquare, label: "Dilemma" },
  OTHER: { color: "bg-gray-400", lightColor: "bg-gray-100", textColor: "text-gray-600", icon: MoreHorizontal, label: "Other" },
};

function EventModal({
  isOpen,
  onClose,
  event,
  selectedDate,
  onSave,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  selectedDate: Date;
  onSave: (data: Partial<CalendarEvent>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [type, setType] = useState<CalendarEvent["type"]>(event?.type || "LECTURE");
  const [date, setDate] = useState(event ? format(new Date(event.date), "yyyy-MM-dd") : format(selectedDate, "yyyy-MM-dd"));
  const [isMandatory, setIsMandatory] = useState(event?.isMandatory ?? true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setType(event.type);
      setDate(format(new Date(event.date), "yyyy-MM-dd"));
      setIsMandatory(event.isMandatory);
    } else {
      setTitle("");
      setDescription("");
      setType("LECTURE");
      setDate(format(selectedDate, "yyyy-MM-dd"));
      setIsMandatory(true);
    }
  }, [event, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      id: event?.id,
      title,
      description,
      type,
      date: new Date(date).toISOString(),
      isMandatory,
    });
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-brand-black">
              {event ? "Edit Event" : "New Event"}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" required />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 min-h-[80px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CalendarEvent["type"])}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <option value="LECTURE">Lecture</option>
                  <option value="DILEMMA">Dilemma</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMandatory}
                onChange={(e) => setIsMandatory(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
              />
              <span className="text-sm text-gray-700">Mandatory event</span>
            </label>

            <div className="flex gap-3 pt-2">
              {event && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => { onDelete(event.id); onClose(); }}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </Button>
              )}
              <Button type="submit" disabled={isSaving} className="flex-1 bg-brand-blue hover:bg-brand-blue/90">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Check className="w-4 h-4 mr-1.5" />}
                {event ? "Update" : "Create"} Event
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AttendanceModal({
  isOpen,
  onClose,
  event,
  onMarkAttendance,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
  onMarkAttendance: (eventId: string, status: string) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMark = async (status: string) => {
    setIsSubmitting(true);
    await onMarkAttendance(event.id, status);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const config = eventTypeConfig[event.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          <div className="p-6">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.lightColor} ${config.textColor} mb-3`}>
              <config.icon className="w-3.5 h-3.5" />
              {config.label}
            </div>
            <h2 className="text-lg font-semibold text-brand-black">{event.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
            </p>
            {event.description && (
              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
            )}

            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">Mark your attendance:</p>
              <Button
                onClick={() => handleMark("ATTENDED")}
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Check className="w-4 h-4 mr-1.5" /> I Attended
              </Button>
              <Button
                onClick={() => handleMark("EXCUSED")}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
              >
                Excused Absence
              </Button>
              <Button onClick={onClose} variant="ghost" className="w-full text-gray-500">
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch {
      // Failed to fetch events
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSaveEvent = async (data: Partial<CalendarEvent>) => {
    try {
      if (data.id) {
        await fetch(`/api/events/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      await fetchEvents();
    } catch {
      // Save failed
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      await fetchEvents();
    } catch {
      // Delete failed
    }
  };

  const handleMarkAttendance = async (eventId: string, status: string) => {
    try {
      await fetch("/api/attendance/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status }),
      });
    } catch {
      // Attendance marking failed
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    if (isAdmin) {
      setSelectedEvent(null);
      setShowEventModal(true);
    }
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdmin) {
      setSelectedEvent(event);
      setSelectedDate(new Date(event.date));
      setShowEventModal(true);
    } else if (isPast(new Date(event.date))) {
      setSelectedEvent(event);
      setShowAttendanceModal(true);
    }
  };

  // Calendar grid construction
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-black">Calendar</h1>
            <p className="text-gray-500 mt-1">View and manage hub events</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => { setSelectedEvent(null); setSelectedDate(new Date()); setShowEventModal(true); }}
              className="bg-brand-blue hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Event
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Card className="border-0 shadow-sm overflow-hidden">
          {/* Month navigation */}
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <CardTitle className="text-xl">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
              </div>
            ) : (
              <>
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {dayNames.map((name) => (
                    <div key={name} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">
                      {name}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
                  {days.map((d, i) => {
                    const dayEvents = getEventsForDay(d);
                    const inMonth = isSameMonth(d, currentMonth);
                    const today = isToday(d);

                    return (
                      <div
                        key={i}
                        onClick={() => handleDayClick(d)}
                        className={`min-h-[100px] p-2 bg-white transition-colors ${
                          inMonth ? "cursor-pointer hover:bg-blue-50/50" : "bg-gray-50/50"
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          !inMonth ? "text-gray-300" : today
                            ? "w-7 h-7 flex items-center justify-center rounded-full bg-brand-blue text-white mx-auto sm:mx-0"
                            : "text-gray-700"
                        }`}>
                          {format(d, "d")}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => {
                            const config = eventTypeConfig[event.type];
                            return (
                              <button
                                key={event.id}
                                onClick={(e) => handleEventClick(event, e)}
                                className={`w-full text-left px-1.5 py-0.5 rounded text-xs font-medium truncate ${config.color} text-white hover:opacity-80 transition-opacity`}
                              >
                                {event.title}
                              </button>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <p className="text-xs text-gray-400 pl-1">+{dayEvents.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  {Object.entries(eventTypeConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                      {config.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      {isAdmin && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => { setShowEventModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {!isAdmin && selectedEvent && (
        <AttendanceModal
          isOpen={showAttendanceModal}
          onClose={() => { setShowAttendanceModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
          onMarkAttendance={handleMarkAttendance}
        />
      )}
    </div>
  );
}
