"use client";

import { useState } from "react";
import { TripDetails, Traveler } from "@/lib/insurance/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MapPin, Plus, Trash2 } from "lucide-react";
import { addDays, format, differenceInDays } from "date-fns";

interface InsuranceFormProps {
  onCalculate: (tripDetails: TripDetails, travelers: Traveler[]) => void;
}

export function InsuranceForm({ onCalculate }: InsuranceFormProps) {
  const [startDate, setStartDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [isUSA, setIsUSA] = useState(false);
  const [travelers, setTravelers] = useState<Traveler[]>([{ id: "1", age: 30 }]);
  const [coverages, setCoverages] = useState({
    searchAndRescue: false,
    thirdParty: false,
    cancellation: false,
    baggage: false,
    laptop: false,
    smartphone: false,
    pregnancy: false,
    extremeSports: false,
    winterSports: false,
    rentalCarDeductible: false,
  });

  const addTraveler = () => {
    setTravelers([...travelers, { id: Date.now().toString(), age: 30 }]);
  };

  const removeTraveler = (id: string) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter((t) => t.id !== id));
    }
  };

  const updateTravelerAge = (id: string, age: number) => {
    setTravelers(travelers.map((t) => (t.id === id ? { ...t, age } : t)));
  };

  const toggleCoverage = (key: keyof typeof coverages) => {
    setCoverages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || travelers.length === 0) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      alert("תאריך חזרה אינו יכול להיות לפני תאריך יציאה");
      return;
    }

    onCalculate(
      {
        startDate: start,
        endDate: end,
        isUSA,
        coverages,
      },
      travelers
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">קבל הצעת מחיר לביטוח נסיעות</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue" />
              יעד הנסיעה
            </h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer flex-1 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="destination"
                  checked={!isUSA}
                  onChange={() => setIsUSA(false)}
                  className="text-brand-blue"
                />
                <span>כל העולם (למעט ארה"ב)</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer flex-1 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="destination"
                  checked={isUSA}
                  onChange={() => setIsUSA(true)}
                  className="text-brand-blue"
                />
                <span>כולל ארה"ב</span>
              </label>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-blue" />
              תאריכי הנסיעה
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">תאריך יציאה</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="text-start"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">תאריך חזרה</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="text-start"
                  dir="ltr"
                />
              </div>
            </div>
            {startDate && endDate && new Date(endDate) >= new Date(startDate) && (
              <p className="text-sm text-gray-500">
                סה"כ ימי נסיעה: <span className="font-bold">{differenceInDays(new Date(endDate), new Date(startDate)) + 1}</span>
              </p>
            )}
          </div>

          {/* Travelers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-blue" />
                נוסעים
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={addTraveler}>
                <Plus className="w-4 h-4 me-1" />
                הוסף נוסע
              </Button>
            </div>
            <div className="space-y-3">
              {travelers.map((traveler, index) => (
                <div key={traveler.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium w-20">נוסע {index + 1}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <label className="text-sm text-gray-500">גיל:</label>
                    <Input
                      type="number"
                      min="0"
                      max="120"
                      value={traveler.age}
                      onChange={(e) => updateTravelerAge(traveler.id, parseInt(e.target.value) || 0)}
                      required
                      className="w-24 text-center"
                    />
                  </div>
                  {travelers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTraveler(traveler.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Coverages */}
          <div className="space-y-3">
            <h3 className="font-semibold">הרחבות ותוספות (אופציונלי)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: "searchAndRescue", label: "איתור וחילוץ" },
                { key: "thirdParty", label: "צד ג'" },
                { key: "cancellation", label: "ביטול או קיצור נסיעה" },
                { key: "baggage", label: "כבודה" },
                { key: "laptop", label: "מחשב אישי" },
                { key: "smartphone", label: "טלפון נייד" },
                { key: "pregnancy", label: "הריון" },
                { key: "extremeSports", label: "ספורט אתגרי" },
                { key: "winterSports", label: "ספורט חורף" },
                { key: "rentalCarDeductible", label: "ביטול השתתפות עצמית רכב שכור" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                    coverages[key as keyof typeof coverages] ? "border-brand-blue bg-blue-50/50" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={coverages[key as keyof typeof coverages]}
                    onChange={() => toggleCoverage(key as keyof typeof coverages)}
                    className="rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 h-12 text-lg shadow-lg">
            השוואת מחירים
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
