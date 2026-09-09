"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Calendar, Users, Shield, MapPin, Plus, Trash2 } from "lucide-react";
import { TripDetails, Traveler, OptionalCoverages } from "@/lib/insurance/types";

interface SearchBarProps {
  onCalculate: (trip: TripDetails, travelers: Traveler[]) => void;
}

export function SearchBar({ onCalculate }: SearchBarProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const [isUSA, setIsUSA] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState<Traveler[]>([{ id: "1", age: 30 }]);
  const [coverages, setCoverages] = useState<Record<keyof OptionalCoverages, boolean>>({
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

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenSection(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("נא למלא תאריכי נסיעה");
      setOpenSection("dates");
      return;
    }
    if (travelers.some((t) => t.age <= 0)) {
      alert("נא להזין גיל תקין לכל הנוסעים");
      setOpenSection("travelers");
      return;
    }
    
    setOpenSection(null);
    onCalculate(
      {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isUSA,
        coverages,
      },
      travelers
    );
  };

  const getDestinationLabel = () => isUSA ? "כולל ארה״ב" : "כל העולם (למעט ארה״ב)";
  
  const getDatesLabel = () => {
    if (!startDate || !endDate) return "בחירת תאריכי נסיעה";
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${s.getDate()}/${s.getMonth()+1} - ${e.getDate()}/${e.getMonth()+1} (${diffDays} ימים)`;
  };

  const getTravelersLabel = () => {
    if (travelers.length === 1) return `נוסע אחד (גיל ${travelers[0].age})`;
    return `${travelers.length} נוסעים`;
  };

  const getCoveragesLabel = () => {
    const active = Object.values(coverages).filter(Boolean).length;
    if (active === 0) return "בחירת הרחבות";
    return `${active} הרחבות נבחרו`;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto z-50" ref={wrapperRef}>
      {/* Search Bar Container */}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between divide-y md:divide-y-0 md:divide-x md:divide-x-reverse">
        
        {/* Section 1: Continent */}
        <div className="relative flex-1 group">
          <button 
            onClick={() => setOpenSection(openSection === "destination" ? null : "destination")}
            className="w-full text-start px-6 py-3 hover:bg-gray-50 rounded-full transition-colors flex flex-col items-center md:items-start"
          >
            <span className="text-sm font-bold text-gray-900">יבשת</span>
            <span className="text-sm text-gray-500 truncate">{getDestinationLabel()}</span>
          </button>
          
          {openSection === "destination" && (
            <div className="absolute top-full mt-4 w-64 bg-white rounded-2xl shadow-xl border p-4 right-0">
              <h4 className="font-bold mb-3 text-sm">לאיזו יבשת טסים?</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="radio" checked={!isUSA} onChange={() => setIsUSA(false)} className="text-[#57aaed] focus:ring-[#57aaed]" />
                  <span className="text-sm">אירופה ושאר העולם</span>
                </label>
                <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="radio" checked={isUSA} onChange={() => setIsUSA(true)} className="text-[#57aaed] focus:ring-[#57aaed]" />
                  <span className="text-sm">כולל ארצות הברית</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Dates */}
        <div className="relative flex-1 group">
          <button 
            onClick={() => setOpenSection(openSection === "dates" ? null : "dates")}
            className="w-full text-start px-6 py-3 hover:bg-gray-50 rounded-full transition-colors flex flex-col items-center md:items-start"
          >
            <span className="text-sm font-bold text-gray-900">תאריכים</span>
            <span className="text-sm text-gray-500 truncate">{getDatesLabel()}</span>
          </button>
          
          {openSection === "dates" && (
            <div className="absolute top-full mt-4 w-72 bg-white rounded-2xl shadow-xl border p-4 right-0 md:-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">יציאה</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">חזרה</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded p-2 text-sm" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Travelers */}
        <div className="relative flex-1 group">
          <button 
            onClick={() => setOpenSection(openSection === "travelers" ? null : "travelers")}
            className="w-full text-start px-6 py-3 hover:bg-gray-50 rounded-full transition-colors flex flex-col items-center md:items-start"
          >
            <span className="text-sm font-bold text-gray-900">מי?</span>
            <span className="text-sm text-gray-500 truncate">{getTravelersLabel()}</span>
          </button>
          
          {openSection === "travelers" && (
            <div className="absolute top-full mt-4 w-72 bg-white rounded-2xl shadow-xl border p-4 right-0 md:-right-12">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sm">נוסעים וגילאים</h4>
                <button onClick={() => setTravelers([...travelers, { id: Date.now().toString(), age: 30 }])} className="text-xs text-[#57aaed] flex items-center font-bold">
                  <Plus className="w-3 h-3 me-1"/> הוסף
                </button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {travelers.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm w-16">נוסע {i+1}</span>
                    <input type="number" min="0" max="120" value={t.age || ""} onChange={(e) => {
                      const newTravelers = [...travelers];
                      newTravelers[i].age = parseInt(e.target.value) || 0;
                      setTravelers(newTravelers);
                    }} className="w-16 border rounded p-1 text-center text-sm" placeholder="גיל" />
                    {travelers.length > 1 && (
                      <button onClick={() => setTravelers(travelers.filter(tr => tr.id !== t.id))} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Coverages */}
        <div className="relative flex-1 group">
          <button 
            onClick={() => setOpenSection(openSection === "coverages" ? null : "coverages")}
            className="w-full text-start px-6 py-3 hover:bg-gray-50 rounded-full transition-colors flex flex-col items-center md:items-start"
          >
            <span className="text-sm font-bold text-gray-900">הרחבות</span>
            <span className="text-sm text-gray-500 truncate">{getCoveragesLabel()}</span>
          </button>
          
          {openSection === "coverages" && (
            <div className="absolute top-full mt-4 w-[320px] bg-white rounded-2xl shadow-xl border p-4 left-0">
              <h4 className="font-bold mb-3 text-sm">הרחבות פופולריות</h4>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {[
                  { key: "searchAndRescue", label: "איתור וחילוץ" },
                  { key: "thirdParty", label: "צד ג'" },
                  { key: "cancellation", label: "ביטול נסיעה" },
                  { key: "baggage", label: "כבודה" },
                  { key: "laptop", label: "מחשב אישי" },
                  { key: "smartphone", label: "סמארטפון" },
                  { key: "pregnancy", label: "הריון" },
                  { key: "extremeSports", label: "ספורט אתגרי" },
                  { key: "winterSports", label: "ספורט חורף" },
                  { key: "rentalCarDeductible", label: "ביטול השתתפות עצמית" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={coverages[key as keyof typeof coverages]}
                      onChange={() => setCoverages({ ...coverages, [key]: !coverages[key as keyof typeof coverages] })}
                      className="text-[#57aaed] rounded focus:ring-[#57aaed]" 
                    />
                    <span className="text-xs">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-2 w-full md:w-auto">
          <button 
            onClick={handleSubmit}
            className="w-full md:w-auto bg-[#57aaed] hover:bg-[#458bc2] text-white rounded-full px-8 py-3 font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Search className="w-5 h-5" />
            להשוואה
          </button>
        </div>
        
      </div>
    </div>
  );
}
