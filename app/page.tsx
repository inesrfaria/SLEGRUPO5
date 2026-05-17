"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  BookOpen, 
  TrendingDown, 
  Home, 
  BarChart3, 
  Activity, 
  ChevronRight, 
  Info,
  Maximize2,
  Filter,
  ChevronDown,
  Globe
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";

// Type for the active view
type AnalysisView = 
  | "poverty" 
  | "deprivation" 
  | "education" 
  | "intensity" 
  | "household";

const VIEW_CONFIG = {
  poverty: { title: "Taxas de Pobreza", icon: TrendingDown, color: "text-indigo-500" },
  deprivation: { title: "Privação Social", icon: Activity, color: "text-fuchsia-500" },
  education: { title: "Nível Escolar", icon: BookOpen, color: "text-amber-500" },
  intensity: { title: "Intensidade Trabalho", icon: BarChart3, color: "text-cyan-500" },
  household: { title: "Agregado Familiar", icon: Home, color: "text-orange-500" },
};

const REGIMES = [
  "Social-Democrata",
  "Liberal",
  "Conservador",
  "Familialista",
  "Pós-Socialista",
];

const DATA = [
  {
    regime: "Social-Democrata",
    country: "Suécia",
    observation: "No regime social-democrata, a Suécia apresenta desafios específicos na integração de políticas de bem-estar. A relação entre pobreza relativa e a taxa de trabalhadores pobres reflete a eficácia das transferências sociais no mercado de trabalho.",
    povertyRate2023: 7.3,
    workingPoorRate2023: 7.0,
    deprivation: {
      total: [{ year: 2023, value: 4.2 }, { year: 2024, value: 4.4 }, { year: 2025, value: 4.5 }],
      female: [{ year: 2023, value: 3.7 }, { year: 2024, value: 4.6 }, { year: 2025, value: 4.1 }],
      male: [{ year: 2023, value: 3.7 }, { year: 2024, value: 4.6 }, { year: 2025, value: 4.1 }],
      age16_24: [{ year: 2023, value: 5.3 }, { year: 2024, value: 6.8 }, { year: 2025, value: 3.8 }],
      age25_54: [{ year: 2023, value: 4.7 }, { year: 2024, value: 4.3 }, { year: 2025, value: 5.0 }],
      age55Plus: [{ year: 2023, value: 2.1 }, { year: 2024, value: 3.7 }, { year: 2025, value: 3.0 }],
    },
    education: {
      low: [{ year: 2023, value: 13.1 }, { year: 2024, value: 14.8 }, { year: 2025, value: 15.6 }],
      medium: [{ year: 2023, value: 6.1 }, { year: 2024, value: 7.4 }, { year: 2025, value: 6.8 }],
      high: [{ year: 2023, value: 5.3 }, { year: 2024, value: 5.1 }, { year: 2025, value: 4.6 }],
    },
    intensity: {
      high: [{ year: 2023, value: 4.6 }, { year: 2024, value: 4.7 }, { year: 2025, value: 4.3 }],
      medium: [{ year: 2023, value: 23.9 }, { year: 2024, value: 24.6 }, { year: 2025, value: 20.4 }],
    },
    household: {
      sp: [{ year: 2023, value: 9.9 }, { year: 2024, value: 12.7 }, { year: 2025, value: 10.2 }],
      spd: [{ year: 2023, value: 12.3 }, { year: 2024, value: 14.5 }, { year: 2025, value: 20.6 }],
      h: [{ year: 2023, value: 6.9 }, { year: 2024, value: 8.1 }, { year: 2025, value: 6.8 }],
      hd: [{ year: 2023, value: 7.3 }, { year: 2024, value: 7.1 }, { year: 2025, value: 7.6 }],
    },
  },
  {
    regime: "Liberal",
    country: "Irlanda",
    observation: "No regime liberal, a Irlanda apresenta desafios específicos na integração de políticas de bem-estar. A relação entre pobreza relativa e a taxa de trabalhadores pobres reflete a eficácia das transferências sociais no mercado de trabalho.",
    povertyRate2023: 7.0,
    workingPoorRate2023: 5.6,
    deprivation: {
      total: [{ year: 2023, value: 5.8 }, { year: 2024, value: 5.4 }, { year: 2025, value: 5.9 }],
      female: [{ year: 2023, value: 5.4 }, { year: 2024, value: 4.1 }, { year: 2025, value: 5.5 }],
      male: [{ year: 2023, value: 5.4 }, { year: 2024, value: 4.1 }, { year: 2025, value: 5.5 }],
      age16_24: [{ year: 2023, value: 12.6 }, { year: 2024, value: 3.9 }, { year: 2025, value: 9.4 }],
      age25_54: [{ year: 2023, value: 5.6 }, { year: 2024, value: 5.9 }, { year: 2025, value: 5.9 }],
      age55Plus: [{ year: 2023, value: 2.8 }, { year: 2024, value: 3.7 }, { year: 2025, value: 3.7 }],
    },
    education: {
      low: [{ year: 2023, value: 9.7 }, { year: 2024, value: 11.1 }, { year: 2025, value: 10.8 }],
      medium: [{ year: 2023, value: 6.9 }, { year: 2024, value: 7.2 }, { year: 2025, value: 6.2 }],
      high: [{ year: 2023, value: 3.6 }, { year: 2024, value: 2.9 }, { year: 2025, value: 4.3 }],
    },
    intensity: {
      high: [{ year: 2023, value: 2.9 }, { year: 2024, value: 2.6 }, { year: 2025, value: 2.5 }],
      medium: [{ year: 2023, value: 20.3 }, { year: 2024, value: 12.1 }, { year: 2025, value: 20.2 }],
    },
    household: {
      sp: [{ year: 2023, value: 15.7 }, { year: 2024, value: 12.9 }, { year: 2025, value: 12.9 }],
      spd: [{ year: 2023, value: 13.0 }, { year: 2024, value: 18.0 }, { year: 2025, value: 17.2 }],
      h: [{ year: 2023, value: 4.0 }, { year: 2024, value: 4.0 }, { year: 2025, value: 3.2 }],
      hd: [{ year: 2023, value: 7.0 }, { year: 2024, value: 6.6 }, { year: 2025, value: 7.9 }],
    },
  },
  {
    regime: "Conservador",
    country: "Áustria",
    observation: "No regime conservador, a Áustria apresenta desafios específicos na integração de políticas de bem-estar. A relação entre pobreza relativa e a taxa de trabalhadores pobres reflete a eficácia das transferências sociais no mercado de trabalho.",
    povertyRate2023: 10.8,
    workingPoorRate2023: 7.7,
    deprivation: {
      total: [{ year: 2023, value: 4.9 }, { year: 2024, value: 5.0 }, { year: 2025, value: 3.9 }],
      female: [{ year: 2023, value: 4.7 }, { year: 2024, value: 4.9 }, { year: 2025, value: 3.4 }],
      male: [{ year: 2023, value: 4.7 }, { year: 2024, value: 4.9 }, { year: 2025, value: 3.4 }],
      age16_24: [{ year: 2023, value: 5.5 }, { year: 2024, value: 4.9 }, { year: 2025, value: 7.1 }],
      age25_54: [{ year: 2023, value: 4.9 }, { year: 2024, value: 5.1 }, { year: 2025, value: 4.2 }],
      age55Plus: [{ year: 2023, value: 4.4 }, { year: 2024, value: 4.5 }, { year: 2025, value: 2.5 }],
    },
    education: {
      low: [{ year: 2023, value: 19.8 }, { year: 2024, value: 19.5 }, { year: 2025, value: 21.8 }],
      medium: [{ year: 2023, value: 5.8 }, { year: 2024, value: 6.5 }, { year: 2025, value: 8.2 }],
      high: [{ year: 2023, value: 7.0 }, { year: 2024, value: 6.2 }, { year: 2025, value: 7.4 }],
    },
    intensity: {
      high: [{ year: 2023, value: 4.6 }, { year: 2024, value: 5.1 }, { year: 2025, value: 5.9 }],
      medium: [{ year: 2023, value: 16.5 }, { year: 2024, value: 11.3 }, { year: 2025, value: 18.4 }],
    },
    household: {
      sp: [{ year: 2023, value: 13.1 }, { year: 2024, value: 14.3 }, { year: 2025, value: 13.2 }],
      spd: [{ year: 2023, value: 28.9 }, { year: 2024, value: 19.5 }, { year: 2025, value: 28.6 }],
      h: [{ year: 2023, value: 5.7 }, { year: 2024, value: 6.8 }, { year: 2025, value: 6.9 }],
      hd: [{ year: 2023, value: 10.2 }, { year: 2024, value: 8.6 }, { year: 2025, value: 11.5 }],
    },
  },
  {
    regime: "Familialista",
    country: "Espanha",
    observation: "No regime familialista, a Espanha apresenta desafios específicos na integração de políticas de bem-estar. A relação entre pobreza relativa e a taxa de trabalhadores pobres reflete a eficácia das transferências sociais no mercado de trabalho.",
    povertyRate2023: 15.1,
    workingPoorRate2023: 11.3,
    deprivation: {
      total: [{ year: 2023, value: 13.9 }, { year: 2024, value: 13.0 }, { year: 2025, value: 12.7 }],
      female: [{ year: 2023, value: 14.7 }, { year: 2024, value: 13.6 }, { year: 2025, value: 13.4 }],
      male: [{ year: 2023, value: 13.3 }, { year: 2024, value: 12.5 }, { year: 2025, value: 12.0 }],
      age16_24: [{ year: 2023, value: 20.0 }, { year: 2024, value: 15.7 }, { year: 2025, value: 13.8 }],
      age25_54: [{ year: 2023, value: 14.3 }, { year: 2024, value: 13.4 }, { year: 2025, value: 13.1 }],
      age55Plus: [{ year: 2023, value: 11.4 }, { year: 2024, value: 10.6 }, { year: 2025, value: 10.7 }],
    },
    education: {
      low: [{ year: 2023, value: 19.6 }, { year: 2024, value: 18.2 }, { year: 2025, value: 19.5 }],
      medium: [{ year: 2023, value: 13.9 }, { year: 2024, value: 14.1 }, { year: 2025, value: 12.4 }],
      high: [{ year: 2023, value: 5.5 }, { year: 2024, value: 5.6 }, { year: 2025, value: 5.9 }],
    },
    intensity: {
      high: [{ year: 2023, value: 6.2 }, { year: 2024, value: 6.1 }, { year: 2025, value: 5.7 }],
      medium: [{ year: 2023, value: 28.2 }, { year: 2024, value: 26.7 }, { year: 2025, value: 27.8 }],
    },
    household: {
      sp: [{ year: 2023, value: 13.2 }, { year: 2024, value: 13.0 }, { year: 2025, value: 12.9 }],
      spd: [{ year: 2023, value: 33.7 }, { year: 2024, value: 29.2 }, { year: 2025, value: 30.5 }],
      h: [{ year: 2023, value: 7.6 }, { year: 2024, value: 7.9 }, { year: 2025, value: 7.8 }],
      hd: [{ year: 2023, value: 15.1 }, { year: 2024, value: 14.6 }, { year: 2025, value: 14.9 }],
    },
  },
  {
    regime: "Pós-Socialista",
    country: "Roménia",
    observation: "No regime pós-socialista, a Roménia apresenta desafios específicos na integração de políticas de bem-estar. A relação entre pobreza relativa e a taxa de trabalhadores pobres reflete a eficácia das transferências sociais no mercado de trabalho.",
    povertyRate2023: 16.8,
    workingPoorRate2023: 15.0,
    deprivation: {
      total: [{ year: 2023, value: 23.4 }, { year: 2024, value: 18.2 }, { year: 2025, value: 17.5 }],
      female: [{ year: 2023, value: 20.5 }, { year: 2024, value: 15.8 }, { year: 2025, value: 15.0 }],
      male: [{ year: 2023, value: 25.5 }, { year: 2024, value: 20.0 }, { year: 2025, value: 19.2 }],
      age16_24: [{ year: 2023, value: 32.5 }, { year: 2024, value: 25.2 }, { year: 2025, value: 19.5 }],
      age25_54: [{ year: 2023, value: 22.5 }, { year: 2024, value: 17.5 }, { year: 2025, value: 16.5 }],
      age55Plus: [{ year: 2023, value: 25.7 }, { year: 2024, value: 20.9 }, { year: 2025, value: 21.3 }],
    },
    education: {
      low: [{ year: 2023, value: 52.0 }, { year: 2024, value: 38.0 }, { year: 2025, value: 41.4 }],
      medium: [{ year: 2023, value: 12.6 }, { year: 2024, value: 9.5 }, { year: 2025, value: 8.1 }],
      high: [{ year: 2023, value: 2.1 }, { year: 2024, value: 1.3 }, { year: 2025, value: 0.6 }],
    },
    intensity: {
      high: [{ year: 2023, value: 7.9 }, { year: 2024, value: 5.6 }, { year: 2025, value: 5.7 }],
      medium: [{ year: 2023, value: 36.0 }, { year: 2024, value: 36.7 }, { year: 2025, value: 29.2 }],
    },
    household: {
      sp: [{ year: 2023, value: 18.2 }, { year: 2024, value: 10.4 }, { year: 2025, value: 8.2 }],
      spd: [{ year: 2023, value: 12.1 }, { year: 2024, value: 14.3 }, { year: 2025, value: 13.0 }],
      h: [{ year: 2023, value: 13.4 }, { year: 2024, value: 8.3 }, { year: 2025, value: 8.5 }],
      hd: [{ year: 2023, value: 16.8 }, { year: 2024, value: 13.0 }, { year: 2025, value: 12.5 }],
    },
  },
];

export default function Dashboard() {
  const [selectedRegime, setSelectedRegime] = useState<string>(REGIMES[0]);
  const [activeView, setActiveView] = useState<AnalysisView>("poverty");
  const [isCompareMode, setIsCompareMode] = useState(false);

  const activeData = useMemo(() => 
    DATA.find(d => d.regime === selectedRegime)!, 
  [selectedRegime]);

  const regimeColors: Record<string, string> = {
    "Social-Democrata": "bg-cyan-500",
    "Liberal": "bg-indigo-500",
    "Conservador": "bg-amber-500",
    "Familialista": "bg-rose-500",
    "Pós-Socialista": "bg-emerald-500",
  };

  const regimeBorders: Record<string, string> = {
    "Social-Democrata": "border-cyan-500",
    "Liberal": "border-indigo-500",
    "Conservador": "border-amber-500",
    "Familialista": "border-rose-500",
    "Pós-Socialista": "border-emerald-500",
  };

  const renderPovertyView = () => {
    const compareData = DATA.map(d => ({
      name: d.country,
      regime: d.regime,
      poverty: d.povertyRate2023,
      workingPoor: d.workingPoorRate2023,
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-xl font-sans font-bold mb-6 flex items-center gap-2 text-slate-800">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Taxas de Pobreza (2023)
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} unit="%" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}
                />
                <Legend iconType="circle" />
                <Bar name="Pobreza Relativa" dataKey="poverty" radius={[6, 6, 0, 0]}>
                  {compareData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.regime === selectedRegime ? "#6366f1" : "#e0e7ff"} 
                    />
                  ))}
                </Bar>
                <Bar name="Trabalhadores Pobres" dataKey="workingPoor" radius={[6, 6, 0, 0]}>
                  {compareData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.regime === selectedRegime ? "#4f46e5" : "#c7d2fe"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wide italic">
            * REPRESENTANTE: PAÍSES COM MAIOR TAXA DE POBREZA RELATIVA POR REGIME SELECIONADO.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Indicadores do Cluster</h3>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${regimeColors[selectedRegime]}`}>
              {selectedRegime}
            </div>
          </div>
          
          <div className="flex flex-col gap-4 relative z-10 flex-1 justify-center">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-tight mb-2">Pobreza Relativa</p>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-bold leading-none">{activeData.povertyRate2023}%</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-indigo-400" style={{ width: `${activeData.povertyRate2023 * 2}%` }}></div>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-tight mb-2">Trabalhadores Pobres</p>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-bold text-fuchsia-400 leading-none">{activeData.workingPoorRate2023}%</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-fuchsia-400" style={{ width: `${activeData.workingPoorRate2023 * 2}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderDeprivationView = () => {
    const data: any[] = [
      { name: "Total", ...Object.fromEntries(activeData.deprivation.total.map(d => [d.year, d.value])) },
      { name: "Feminino", ...Object.fromEntries(activeData.deprivation.female.map(d => [d.year, d.value])) },
      { name: "Masculino", ...Object.fromEntries(activeData.deprivation.male.map(d => [d.year, d.value])) },
    ];

    const ageData: any[] = [
      { name: "16-24", ...Object.fromEntries(activeData.deprivation.age16_24.map(d => [d.year, d.value])) },
      { name: "25-54", ...Object.fromEntries(activeData.deprivation.age25_54.map(d => [d.year, d.value])) },
      { name: "55+", ...Object.fromEntries(activeData.deprivation.age55Plus.map(d => [d.year, d.value])) },
    ];

    return (
      <div className="flex flex-col gap-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
          >
            <h3 className="text-lg font-bold mb-6 flex justify-between items-center text-slate-800">
              <span className="flex items-center gap-3">
                <span className="w-2 h-6 bg-fuchsia-600 rounded-full"></span>
                Privação por Género
              </span>
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} unit="%" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="2023" fill="#f5d0fe" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2024" fill="#d946ef" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2025" fill="#a21caf" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
          >
            <h3 className="text-lg font-bold mb-6 flex justify-between items-center text-slate-800">
              <span className="flex items-center gap-3">
                <span className="w-2 h-6 bg-amber-600 rounded-full"></span>
                Privação por Idade
              </span>
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} unit="%" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="2023" fill="#fef3c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2024" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2025" fill="#b45309" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800 flex items-center gap-6 shadow-xl"
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Conclusão Analítica</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {activeData.country === "Espanha" ? "Em" : "Na"} {activeData.country}, a privação material e social tende a ser mais acentuada nos 
              {(() => {
                const v1 = activeData.deprivation.age16_24[2]?.value || 0;
                const v2 = activeData.deprivation.age25_54[2]?.value || 0;
                const v3 = activeData.deprivation.age55Plus[2]?.value || 0;
                const max = Math.max(v1, v2, v3);
                if (max === v1) return " escalões mais jovens (16-24 anos)";
                if (max === v2) return " escalões de idade ativa (25-54 ano)";
                return " escalões seniores (55+ anos)";
              })()}, 
              refletindo a vulnerabilidade de certos grupos no mercado de trabalho deste regime.
            </p>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderEducationView = () => {
    const data: any[] = [
      { name: "ISCED 0-2 (Baixa)", ...Object.fromEntries(activeData.education.low.map(d => [d.year, d.value])) },
      { name: "ISCED 3-4 (Média)", ...Object.fromEntries(activeData.education.medium.map(d => [d.year, d.value])) },
      { name: "ISCED 5-8 (Alta)", ...Object.fromEntries(activeData.education.high.map(d => [d.year, d.value])) },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-800">
            <span className="w-2 h-6 bg-amber-600 rounded-full"></span>
            Taxas por Nível de Escolaridade
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} unit="%" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: '1px solid #e2e8f0' }} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="2023" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1.5, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="2024" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706', strokeWidth: 1.5, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="2025" stroke="#92400e" strokeWidth={3} dot={{ r: 4, fill: '#92400e', strokeWidth: 1.5, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-[1.5rem] shadow-xl relative overflow-hidden flex-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-xl"></div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-slate-500">Relatório de Impacto</h4>
            <div className="space-y-3 relative z-10">
              <div className="pb-3 border-b border-white/5">
                <p className="text-slate-400 text-[9px] uppercase font-black tracking-tight mb-1">Gap Educacional (2025)</p>
                <p className="text-3xl font-bold text-amber-500">
                  {Math.round(activeData.education.low[2].value - activeData.education.high[2].value)}% <span className="text-[10px] font-normal text-slate-500 capitalize">Diferença</span>
                </p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                A escolaridade continua a ser o principal fator de proteção contra a pobreza laboral no regime {selectedRegime}.
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Conclusão por País</p>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                {(() => {
                  const low = activeData.education.low[2].value;
                  const high = activeData.education.high[2].value;
                  if (activeData.country === "Suécia") return `Na Suécia, a educação superior (ISCED 5-8) mantém o risco de pobreza laboral em patamares baixos (${high}%), confirmando a valorização do capital humano.`;
                  if (activeData.country === "Irlanda") return `Na Irlanda, verifica-se uma das menores taxas de pobreza do cluster para graduados do ensino superior (${high}%).`;
                  if (activeData.country === "Áustria") return `Na Áustria, as baixas qualificações (ISCED 0-2) apresentam um risco de ${low}%, sublinhando a necessidade de políticas de requalificação profissional.`;
                  if (activeData.country === "Espanha") return `Em Espanha, a disparidade entre o nível básico e o superior é de ${Math.round(low - high)}%, sublinhando o fosso educativo neste regime.`;
                  return `Na Roménia, regista-se o maior fosso educacional do cluster, com uma taxa de ${low}% para baixas qualificações frente a ${high}% no ensino superior.`;
                })()}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderIntensityView = () => {
    const data: any[] = [
      { name: "Muito Alta (IMA)", ...Object.fromEntries(activeData.intensity.high.map(d => [d.year, d.value])) },
      { name: "Média (IM)", ...Object.fromEntries(activeData.intensity.medium.map(d => [d.year, d.value])) },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-800">
            <span className="w-2 h-6 bg-cyan-600 rounded-full"></span>
            Pobreza vs Intensidade
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="2023" fill="#a5f3fc" radius={[0, 4, 4, 0]} />
                <Bar dataKey="2024" fill="#22d3ee" radius={[0, 4, 4, 0]} />
                <Bar dataKey="2025" fill="#0891b2" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 text-white p-8 rounded-[2rem] shadow-xl flex flex-col justify-center relative overflow-hidden group flex-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl group-hover:bg-cyan-500/20 transition-colors"></div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight relative z-10 text-slate-100">Intensidade Laboral</h3>
            <p className="text-base text-slate-300 leading-relaxed mb-4 relative z-10 font-medium">
              Uma intensidade <span className="font-black text-cyan-400">Muito Alta</span> reduz drasticamente o risco de pobreza.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-bold text-slate-400 relative z-10">
              No regime {selectedRegime}, trabalhar a tempo inteiro é crucial para reduzir a zona de risco.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-600 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Conclusão Analítica</p>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                {(() => {
                  const high = activeData.intensity.high[2].value;
                  const medium = activeData.intensity.medium[2].value;
                  if (activeData.country === "Suécia") return `Na Suécia, a Intensidade muito alta (IMA) garante um dos menores riscos de pobreza do cluster (${high}% em 2025).`;
                  if (activeData.country === "Irlanda") return `A Irlanda mostra que a plena ocupação laboral reduz o risco de pobreza para níveis residuais (${high}% em 2025).`;
                  if (activeData.country === "Áustria") return `Na Áustria, apesar da estabilidade, a intensidade média ainda expõe os agregados a um risco de ${medium}%.`;
                  if (activeData.country === "Espanha") return `Em Espanha, a intensidade média acarreta um risco elevado (${medium}% em 2025), refletindo a precariedade do emprego parcial.`;
                  return `Na Roménia, o fosso entre intensidade média (${medium}%) e muito alta (${high}%) é o mais acentuado, sublinhando a dependência do trabalho full-time.`;
                })()}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderHouseholdView = () => {
    const data: Array<{ name: string; "2023": number; "2024": number; "2025": number }> = [
      { name: "Solteiro (SP)", ...Object.fromEntries(activeData.household.sp.map(d => [d.year.toString(), d.value])) } as any,
      { name: "Família Monoparental (SPD)", ...Object.fromEntries(activeData.household.spd.map(d => [d.year.toString(), d.value])) } as any,
      { name: "Casal s/ Filhos (H)", ...Object.fromEntries(activeData.household.h.map(d => [d.year.toString(), d.value])) } as any,
      { name: "Casal c/ Filhos (HD)", ...Object.fromEntries(activeData.household.hd.map(d => [d.year.toString(), d.value])) } as any,
    ];

    return (
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-800">
            <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
            Tipologia de Agregado Familiar
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} unit="%" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px' }} />
                <Legend iconType="circle" />
                <Bar dataKey="2023" fill="#ffedd5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2024" fill="#fb923c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2025" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">{item.name}</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900">{item["2025"]}%</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${item["2025"] > item["2023"] ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {item["2025"] > item["2023"] ? '↑' : '↓'} {Math.abs(Math.round((item["2025"] - item["2023"]) * 10) / 10)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-0 selection:bg-indigo-100">
      
      {/* Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
            UE Trabalhadores Pobres e Estados de Bem-Estar Social
          </h1>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full border border-indigo-100 uppercase tracking-widest leading-none">
            Regimes Bem-Estar
          </div>
          <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {REGIMES.map(regime => (
              <button
                key={regime}
                onClick={() => setSelectedRegime(regime)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 ${
                  selectedRegime === regime 
                    ? `bg-white text-indigo-600 shadow-sm scale-105` 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {regime.split("-")[0]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)]">
        
        {/* Navigation Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Análise por Folha</div>
          {(Object.entries(VIEW_CONFIG) as [AnalysisView, typeof VIEW_CONFIG.poverty][]).map(([key, config], idx) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group relative ${
                activeView === key 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-0.5" 
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-colors ${
                activeView === key ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200"
              }`}>
                {idx + 1}
              </div>
              <span className="font-bold text-xs uppercase tracking-widest">{config.title}</span>
            </button>
          ))}

          <div className="mt-auto p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-3">Status Global</p>
            <p className="text-[11px] leading-relaxed font-bold text-slate-300 relative z-10">
              Sincronizado com base de dados Eurostat 2023-2025.
            </p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden relative z-10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                className="h-full bg-indigo-500"
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 p-8 min-w-0 bg-slate-50/50">
          
          {/* Cluster Status Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
            {DATA.map((d) => (
              <button
                key={d.regime}
                onClick={() => setSelectedRegime(d.regime)}
                className={`group flex flex-col justify-between p-4 rounded-2xl transition-all duration-300 text-left border relative overflow-hidden h-24 ${
                  selectedRegime === d.regime 
                    ? `${regimeColors[d.regime]} text-white border-transparent shadow-lg scale-[1.02] z-10` 
                    : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className={`absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl transition-transform group-hover:scale-125`}></div>
                <div className="relative z-10">
                  <div className={`text-[9px] font-black uppercase tracking-widest ${selectedRegime === d.regime ? 'text-white/60' : 'text-slate-400'}`}>
                    {d.regime}
                  </div>
                  <div className="text-base font-black truncate">{d.country}</div>
                </div>
                <div className="relative z-10 text-2xl font-black">{d.povertyRate2023}%</div>
              </button>
            ))}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView + selectedRegime}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeView === "poverty" && renderPovertyView()}
                {activeView === "deprivation" && renderDeprivationView()}
                {activeView === "education" && renderEducationView()}
                {activeView === "intensity" && renderIntensityView()}
                {activeView === "household" && renderHouseholdView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
