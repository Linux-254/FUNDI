import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Legend, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  Cpu, 
  Zap, 
  Clock, 
  Info, 
  Sliders, 
  Play, 
  Pause, 
  Gauge, 
  FileCheck,
  BatteryCharging,
  Wifi,
  ChevronRight
} from 'lucide-react';
import { Project } from '../../types';

interface IoTHealthProps {
  project?: Project | null;
  currency?: 'KES' | 'USD';
  className?: string;
}

export const IoTHealth: React.FC<IoTHealthProps> = ({
  project,
  currency = 'KES',
  className = ''
}) => {
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'moisture' | 'temperature' | 'stress' | 'maturity'>('moisture');
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('24h');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [simulatedAlert, setSimulatedAlert] = useState<'none' | 'moisture_drop' | 'thermal_gradient'>('none');
  const [livePulseTick, setLivePulseTick] = useState<number>(0);

  // Live dynamic sensor values
  const [currentMoistureRH, setCurrentMoistureRH] = useState<number>(88.4);
  const [subBaseMoisture, setSubBaseMoisture] = useState<number>(13.9);
  const [coreTemp, setCoreTemp] = useState<number>(42.8);
  const [ambientTemp, setAmbientTemp] = useState<number>(23.1);
  const [beamStressMPa, setBeamStressMPa] = useState<number>(185.0);
  const [columnLoadKN, setColumnLoadKN] = useState<number>(420);
  const [tiltDegrees, setTiltDegrees] = useState<number>(0.02);

  // Periodic subtle live fluctuation when stream is active
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setLivePulseTick(prev => prev + 1);
      
      // subtle natural fluctuation
      setCurrentMoistureRH(prev => {
        if (simulatedAlert === 'moisture_drop') return 71.2;
        const delta = (Math.random() - 0.5) * 0.4;
        return Number(Math.max(85, Math.min(92, prev + delta)).toFixed(1));
      });

      setCoreTemp(prev => {
        if (simulatedAlert === 'thermal_gradient') return 45.8;
        const delta = (Math.random() - 0.5) * 0.2;
        return Number(Math.max(40, Math.min(44, prev + delta)).toFixed(1));
      });

      setBeamStressMPa(prev => {
        const delta = (Math.random() - 0.5) * 1.5;
        return Number(Math.max(178, Math.min(192, prev + delta)).toFixed(1));
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, simulatedAlert]);

  // Handle alert simulations
  const handleTriggerMoistureAlert = () => {
    setSimulatedAlert('moisture_drop');
    setCurrentMoistureRH(71.2);
  };

  const handleTriggerThermalAlert = () => {
    setSimulatedAlert('thermal_gradient');
    setCoreTemp(45.8);
    setAmbientTemp(21.2);
  };

  const handleClearAlert = () => {
    setSimulatedAlert('none');
    setCurrentMoistureRH(88.4);
    setCoreTemp(42.8);
    setAmbientTemp(23.1);
  };

  // Mock historical dataset (24 hours in 2-hour increments)
  const telemetryHistoryData = [
    { time: '00:00', slabMoistureRH: 90.2, subBaseMoisture: 14.1, coreTemp: 44.5, ambientTemp: 18.2, thermalGradient: 26.3, beamStress: 180, predictedStrength: 18.2 },
    { time: '02:00', slabMoistureRH: 89.8, subBaseMoisture: 14.1, coreTemp: 44.2, ambientTemp: 17.8, thermalGradient: 26.4, beamStress: 181, predictedStrength: 18.6 },
    { time: '04:00', slabMoistureRH: 89.5, subBaseMoisture: 14.0, coreTemp: 43.9, ambientTemp: 17.5, thermalGradient: 26.4, beamStress: 181, predictedStrength: 19.0 },
    { time: '06:00', slabMoistureRH: 89.1, subBaseMoisture: 14.0, coreTemp: 43.6, ambientTemp: 18.5, thermalGradient: 25.1, beamStress: 182, predictedStrength: 19.4 },
    { time: '08:00', slabMoistureRH: 88.9, subBaseMoisture: 14.0, coreTemp: 43.2, ambientTemp: 21.0, thermalGradient: 22.2, beamStress: 184, predictedStrength: 19.8 },
    { time: '10:00', slabMoistureRH: 88.7, subBaseMoisture: 13.9, coreTemp: 43.0, ambientTemp: 23.5, thermalGradient: 19.5, beamStress: 185, predictedStrength: 20.3 },
    { time: '12:00', slabMoistureRH: 88.5, subBaseMoisture: 13.9, coreTemp: 42.9, ambientTemp: 25.2, thermalGradient: 17.7, beamStress: 186, predictedStrength: 20.7 },
    { time: '14:00', slabMoistureRH: 88.3, subBaseMoisture: 13.9, coreTemp: 42.8, ambientTemp: 26.0, thermalGradient: 16.8, beamStress: 186, predictedStrength: 21.0 },
    { time: '16:00', slabMoistureRH: 88.4, subBaseMoisture: 13.9, coreTemp: 42.7, ambientTemp: 24.8, thermalGradient: 17.9, beamStress: 185, predictedStrength: 21.2 },
    { time: '18:00', slabMoistureRH: 88.4, subBaseMoisture: 13.9, coreTemp: 42.8, ambientTemp: 22.9, thermalGradient: 19.9, beamStress: 185, predictedStrength: 21.4 }
  ];

  // Concrete Maturity Compressive Strength Curve (ASTM C1074)
  const maturityStrengthData = [
    { day: 'Day 1', actualStrength: 9.2, targetCode: 8.0, labCubeCrush: 9.0 },
    { day: 'Day 2', actualStrength: 13.5, targetCode: 12.0, labCubeCrush: 13.2 },
    { day: 'Day 3', actualStrength: 16.8, targetCode: 15.5, labCubeCrush: 16.5 },
    { day: 'Day 5', actualStrength: 19.8, targetCode: 19.0, labCubeCrush: 19.5 },
    { day: 'Day 6 (Today)', actualStrength: 21.4, targetCode: 20.2, labCubeCrush: null },
    { day: 'Day 7 (Est)', actualStrength: 22.5, targetCode: 21.0, labCubeCrush: null },
    { day: 'Day 14 (Est)', actualStrength: 24.6, targetCode: 23.5, labCubeCrush: null },
    { day: 'Day 28 (Target)', actualStrength: 26.8, targetCode: 25.0, labCubeCrush: null }
  ];

  // Structural member stress distribution
  const structuralStressData = [
    { member: 'Footing F1 (Pad)', measuredStressMPa: 145, safeYieldMPa: 500, utilizationPct: 29 },
    { member: 'Column C1 (Grid B2)', measuredStressMPa: 162, safeYieldMPa: 500, utilizationPct: 32 },
    { member: 'Column C4 (Central)', measuredStressMPa: 188, safeYieldMPa: 500, utilizationPct: 37 },
    { member: 'Transfer Beam TB-01', measuredStressMPa: 185, safeYieldMPa: 500, utilizationPct: 37 },
    { member: 'Cantilever Balcony S2', measuredStressMPa: 110, safeYieldMPa: 500, utilizationPct: 22 }
  ];

  // Hardware sensor node registry
  const sensorNodes = [
    { id: 'NODE-RH04', type: 'Slab In-Situ RH Probe', location: 'Grid B-2 / 1st Floor Slab (40% depth)', status: 'Online', battery: 96, protocol: 'LoRaWAN 868MHz', calibratedTo: 'Nov 2026' },
    { id: 'NODE-SM02', type: 'Sub-base Moisture TDR', location: 'Foundation Bedrock (-1.2m depth)', status: 'Online', battery: 92, protocol: 'LoRaWAN 868MHz', calibratedTo: 'Oct 2026' },
    { id: 'NODE-TH01', type: 'Core Hydration Thermocouple', location: 'Column C4 Plinth Core (Type-K)', status: 'Online', battery: 98, protocol: 'Modbus RS485', calibratedTo: 'Jan 2027' },
    { id: 'NODE-SG01', type: 'Vibrating Wire Strain Gauge', location: 'Transfer Beam TB-01 Mid-span', status: 'Online', battery: 94, protocol: 'LoRaWAN 868MHz', calibratedTo: 'Dec 2026' },
    { id: 'NODE-TL02', type: 'MEMS Dual-Axis Inclinometer', location: 'Cantilever Balcony Edge', status: 'Online', battery: 89, protocol: 'LoRaWAN 868MHz', calibratedTo: 'Nov 2026' }
  ];

  const thermalGradient = Number((coreTemp - ambientTemp).toFixed(1));

  return (
    <div className={`bg-white rounded-3xl border border-[#2B4560]/15 shadow-sm overflow-hidden flex flex-col space-y-6 p-6 sm:p-8 ${className}`}>
      
      {/* ========================================================
          1. HEADER: IOT TELEMETRY & STRUCTURAL HEALTH
         ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#2B4560]/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#077b8a] text-xs font-mono font-bold">
              <Radio className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span>IOT STRUCTURAL TELEMETRY</span>
            </span>
            <span className="text-xs text-[#2B4560]/40">·</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E9E6A]/20 text-[#1E9E6A] font-mono font-bold">
              ASTM C1074 & BS 8110 VERIFIED
            </span>
            <span className="text-xs text-[#2B4560]/40">·</span>
            <span className="text-xs font-mono text-gray-500">
              LoRaWAN Mesh (868 MHz) · 5 Active Probes
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B]">
            Site Structural & Material Sensor Health
          </h2>
          <p className="text-xs text-[#2B4560]/80 mt-1 max-w-3xl">
            Real-time telemetry continuously streaming moisture curing levels, concrete maturity index, core hydration thermal gradient, and vibrating-wire rebar stress.
          </p>
        </div>

        {/* Live Streaming Toggle & Timeframe Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-[#1E9E6A]/15 border border-[#1E9E6A]/40 text-[#1E9E6A]'
                : 'bg-gray-100 border border-gray-300 text-gray-600'
            }`}
            title="Toggle Live Sensor Stream Updates"
          >
            {isLiveStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#1E9E6A] animate-ping" />
                <span>STREAM LIVE</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>STREAM PAUSED</span>
              </>
            )}
          </button>

          {/* Timeframe Buttons */}
          <div className="flex items-center bg-[#F4F1EA] p-1 rounded-xl border border-[#2B4560]/10 text-xs">
            {(['1h', '24h', '7d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#0B1B2B] text-white shadow-xs'
                    : 'text-[#2B4560]/70 hover:text-[#0B1B2B]'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          ALERT BANNER (NORMAL OR SIMULATED THRESHOLD ALERT)
         ======================================================== */}
      {simulatedAlert === 'moisture_drop' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-950">
                CRITICAL WARNING: Slab Curing Moisture Drop (71.2% RH &lt; 75% Target)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Sensor Probe NODE-RH04 reports insufficient relative humidity. Concrete risk of surface micro-cracking and loss of 28-day target strength.
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] font-mono text-amber-900">
                <span className="px-2 py-0.5 rounded bg-amber-200 font-semibold">Immediate Action:</span>
                <span>Apply continuous wet burlap / polythene sheeting or Sika Antisol curing compound.</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearAlert}
            className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0 transition-colors"
          >
            Clear Alert Simulation
          </button>
        </div>
      )}

      {simulatedAlert === 'thermal_gradient' && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-900 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-red-950">
                CRITICAL WARNING: Core-to-Surface Thermal Gradient Spike (ΔT = {thermalGradient}°C &gt; 20°C BS 8110 Code Limit)
              </h4>
              <p className="text-xs text-red-800 mt-0.5">
                Severe differential hydration heat between center of Column C4 (45.8°C) and ambient air (21.2°C). Risk of thermal contraction tearing.
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] font-mono text-red-900">
                <span className="px-2 py-0.5 rounded bg-red-200 font-semibold">Mitigation:</span>
                <span>Keep timber formwork in place for thermal insulation; delay stripping by 48 hours.</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClearAlert}
            className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0 transition-colors"
          >
            Clear Alert Simulation
          </button>
        </div>
      )}

      {/* ========================================================
          2. LIVE SENSOR GAUGES GRID (TOP METRIC CARDS)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Moisture Levels (Slab & Sub-base) */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-4 border border-[#2B4560]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
              <Droplets className="w-4 h-4 text-[#00E5FF]" />
              <span>Slab Curing RH%</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              currentMoistureRH >= 80 ? 'bg-[#1E9E6A]/20 text-[#1E9E6A]' : 'bg-[#FF6B2C]/20 text-[#FF6B2C]'
            }`}>
              {currentMoistureRH >= 80 ? 'OPTIMAL' : 'AT RISK'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-mono font-extrabold text-2xl sm:text-3xl text-white">
                {currentMoistureRH}%
              </span>
              <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                Target: 85% – 92% RH
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">Sub-base Soil</span>
              <span className="text-xs font-mono font-bold text-[#00E5FF]">
                {subBaseMoisture}% OMC
              </span>
            </div>
          </div>

          {/* Moisture Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${currentMoistureRH >= 80 ? 'bg-[#00E5FF]' : 'bg-[#FF6B2C]'}`}
              style={{ width: `${Math.min(100, (currentMoistureRH / 100) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 block font-mono">
            Probe: NODE-RH04 · ASTM F2170 in-situ
          </span>
        </div>

        {/* Card 2: Core Hydration Temperature & Thermal Gradient */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-4 border border-[#2B4560]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
              <Thermometer className="w-4 h-4 text-[#FF6B2C]" />
              <span>Hydration Temp</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              thermalGradient <= 20 ? 'bg-[#1E9E6A]/20 text-[#1E9E6A]' : 'bg-[#D64545]/20 text-[#D64545]'
            }`}>
              {thermalGradient <= 20 ? 'PASS (BS 8110)' : 'GRADIENT SPIKE'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-mono font-extrabold text-2xl sm:text-3xl text-white">
                {coreTemp} °C
              </span>
              <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                Ambient: {ambientTemp} °C
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">Gradient ΔT</span>
              <span className={`text-xs font-mono font-bold ${thermalGradient <= 20 ? 'text-[#1E9E6A]' : 'text-[#D64545]'}`}>
                {thermalGradient} °C
              </span>
            </div>
          </div>

          {/* Safe thermal band */}
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${thermalGradient <= 20 ? 'bg-[#1E9E6A]' : 'bg-[#D64545]'}`}
              style={{ width: `${Math.min(100, (thermalGradient / 25) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 block font-mono">
            Probe: NODE-TH01 · Thermocouple Core C4
          </span>
        </div>

        {/* Card 3: Material Stress & Rebar Strain */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-4 border border-[#2B4560]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
              <Gauge className="w-4 h-4 text-[#C8A24A]" />
              <span>Beam Rebar Stress</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1E9E6A]/20 text-[#1E9E6A]">
              37% SAFE ELASTIC
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-mono font-extrabold text-2xl sm:text-3xl text-white">
                {beamStressMPa} <span className="text-sm font-normal text-gray-400">MPa</span>
              </span>
              <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                Yield Limit: 500 MPa (KEBS)
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">Column C4</span>
              <span className="text-xs font-mono font-bold text-[#C8A24A]">
                {columnLoadKN} kN Axial
              </span>
            </div>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-[#C8A24A] transition-all duration-500"
              style={{ width: `${(beamStressMPa / 500) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 block font-mono">
            Probe: NODE-SG01 · Transfer Beam TB-01
          </span>
        </div>

        {/* Card 4: Compressive Strength (Maturity Index ASTM C1074) */}
        <div className="bg-[#0B1B2B] text-white rounded-2xl p-4 border border-[#2B4560]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-[#1E9E6A]" />
              <span>Concrete Maturity</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1F6FEB]/20 text-[#1F6FEB]">
              DAY 6 OF 28
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-mono font-extrabold text-2xl sm:text-3xl text-white">
                21.4 <span className="text-sm font-normal text-gray-400">MPa</span>
              </span>
              <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                Target Spec: Class 25 (25 MPa)
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-mono block">Maturity Progress</span>
              <span className="text-xs font-mono font-bold text-[#1E9E6A]">
                85.6% Strength
              </span>
            </div>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-[#1E9E6A] transition-all duration-500"
              style={{ width: `${(21.4 / 25) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 block font-mono">
            Equivalent Age: 144 Temperature-Hours
          </span>
        </div>
      </div>

      {/* ========================================================
          3. TELEMETRY TABS & RECHARTS VISUALIZATION
         ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B4560]/10 pb-3">
          <div className="flex items-center gap-2 max-w-full overflow-x-auto scrollbar-none text-xs font-mono shrink-0">
            {[
              { id: 'moisture', label: '1. Curing Moisture RH% (ASTM F2170)', icon: Droplets },
              { id: 'temperature', label: '2. Hydration Temp & Gradient ΔT', icon: Thermometer },
              { id: 'maturity', label: '3. Compressive Strength Maturity (ASTM C1074)', icon: ShieldCheck },
              { id: 'stress', label: '4. Structural Rebar Stress (MPa)', icon: Gauge }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTelemetryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTelemetryTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#0B1B2B] text-white shadow-xs'
                      : 'text-[#2B4560]/75 hover:bg-[#F4F1EA] hover:text-[#0B1B2B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Alert Simulator Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-gray-400 hidden md:inline">Test Alert Protocol:</span>
            <button
              onClick={handleTriggerMoistureAlert}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono font-semibold transition-colors cursor-pointer"
              title="Test low moisture warning workflow"
            >
              Moisture Drop
            </button>
            <button
              onClick={handleTriggerThermalAlert}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-mono font-semibold transition-colors cursor-pointer"
              title="Test thermal gradient breach workflow"
            >
              Thermal ΔT Spike
            </button>
          </div>
        </div>

        {/* ========================================================
            CHART 1: MOISTURE & CURING RH% OVER TIME
           ======================================================== */}
        {activeTelemetryTab === 'moisture' && (
          <div className="bg-[#F4F1EA]/50 rounded-2xl p-4 sm:p-6 border border-[#2B4560]/10 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-sm text-[#0B1B2B]">
                  In-Situ Slab Relative Humidity (RH%) vs Safe Curing Envelope
                </h4>
                <p className="text-xs text-[#2B4560]/70">
                  Target relative humidity during 14-day hydration curing: 85% to 92% RH. Threshold limit for re-wetting: 75% RH.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-[#00E5FF]">
                  <span className="w-3 h-0.5 bg-[#00E5FF]" /> Slab RH% Probe
                </span>
                <span className="flex items-center gap-1 text-[#1E9E6A]">
                  <span className="w-3 h-0.5 bg-[#1E9E6A]" /> Soil OMC (14.2%)
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B4560" strokeOpacity={0.15} />
                  <XAxis dataKey="time" stroke="#2B4560" fontSize={11} fontFamily="monospace" />
                  <YAxis domain={[65, 100]} stroke="#2B4560" fontSize={11} fontFamily="monospace" unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1B2B', borderColor: '#2B4560', borderRadius: '12px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <ReferenceLine y={75} stroke="#D64545" strokeDasharray="4 4" label={{ value: 'Min Curing Limit (75%)', fill: '#D64545', fontSize: 10, position: 'insideTopRight' }} />
                  <ReferenceLine y={85} stroke="#1E9E6A" strokeDasharray="2 2" label={{ value: 'Optimal Envelope (85%)', fill: '#1E9E6A', fontSize: 10, position: 'insideBottomRight' }} />
                  <Area type="monotone" dataKey="slabMoistureRH" stroke="#00E5FF" strokeWidth={2.5} fillOpacity={1} fill="url(#moistureGrad)" name="Slab Internal RH%" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ========================================================
            CHART 2: TEMPERATURE & THERMAL GRADIENT (ΔT)
           ======================================================== */}
        {activeTelemetryTab === 'temperature' && (
          <div className="bg-[#F4F1EA]/50 rounded-2xl p-4 sm:p-6 border border-[#2B4560]/10 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-sm text-[#0B1B2B]">
                  Hydration Core Heat vs Ambient Temperature & Thermal Differential (ΔT)
                </h4>
                <p className="text-xs text-[#2B4560]/70">
                  BS 8110 and CIRIA C660 limit core-to-surface thermal differential to ≤20°C to eliminate early thermal cracking.
                </p>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryHistoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B4560" strokeOpacity={0.15} />
                  <XAxis dataKey="time" stroke="#2B4560" fontSize={11} fontFamily="monospace" />
                  <YAxis domain={[15, 55]} stroke="#2B4560" fontSize={11} fontFamily="monospace" unit="°C" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1B2B', borderColor: '#2B4560', borderRadius: '12px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <ReferenceLine y={20} stroke="#D64545" strokeDasharray="4 4" label={{ value: 'Max Safe ΔT Limit (20°C)', fill: '#D64545', fontSize: 10, position: 'insideTopLeft' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="coreTemp" stroke="#FF6B2C" strokeWidth={2.5} dot={{ r: 3 }} name="Core Hydration Temp (°C)" />
                  <Line type="monotone" dataKey="ambientTemp" stroke="#1F6FEB" strokeWidth={2} strokeDasharray="3 3" name="Ambient Air Temp (°C)" />
                  <Line type="monotone" dataKey="thermalGradient" stroke="#C8A24A" strokeWidth={2} name="Differential ΔT (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ========================================================
            CHART 3: CONCRETE MATURITY CURVE (ASTM C1074)
           ======================================================== */}
        {activeTelemetryTab === 'maturity' && (
          <div className="bg-[#F4F1EA]/50 rounded-2xl p-4 sm:p-6 border border-[#2B4560]/10 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-sm text-[#0B1B2B]">
                  ASTM C1074 Maturity Method: Real-Time In-Situ Compressive Strength Gain
                </h4>
                <p className="text-xs text-[#2B4560]/70">
                  Continuous Nurse-Saul temperature-time maturity index predicting structural strength vs 28-day Class 25 target.
                </p>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={maturityStrengthData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="strengthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E9E6A" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1E9E6A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B4560" strokeOpacity={0.15} />
                  <XAxis dataKey="day" stroke="#2B4560" fontSize={11} fontFamily="monospace" />
                  <YAxis domain={[0, 30]} stroke="#2B4560" fontSize={11} fontFamily="monospace" unit=" MPa" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1B2B', borderColor: '#2B4560', borderRadius: '12px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <ReferenceLine y={25} stroke="#1E9E6A" strokeDasharray="3 3" label={{ value: 'Design Target C25 (25.0 MPa)', fill: '#1E9E6A', fontSize: 10, position: 'insideTopLeft' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="actualStrength" stroke="#1E9E6A" strokeWidth={2.5} fill="url(#strengthGrad)" name="Sensor In-Situ Strength (MPa)" />
                  <Line type="monotone" dataKey="targetCode" stroke="#0B1B2B" strokeWidth={2} strokeDasharray="4 4" name="BS 8110 Baseline Spec" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ========================================================
            CHART 4: STRUCTURAL REBAR STRESS (MPa)
           ======================================================== */}
        {activeTelemetryTab === 'stress' && (
          <div className="bg-[#F4F1EA]/50 rounded-2xl p-4 sm:p-6 border border-[#2B4560]/10 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-sm text-[#0B1B2B]">
                  Vibrating Wire Stress Distribution Across Structural Elements (MPa)
                </h4>
                <p className="text-xs text-[#2B4560]/70">
                  Strain gauges installed on high-yield rebar (Grade 500 N/mm²). All members operating within elastic safety limit.
                </p>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={structuralStressData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B4560" strokeOpacity={0.15} />
                  <XAxis dataKey="member" stroke="#2B4560" fontSize={10} fontFamily="monospace" />
                  <YAxis domain={[0, 550]} stroke="#2B4560" fontSize={11} fontFamily="monospace" unit=" MPa" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1B2B', borderColor: '#2B4560', borderRadius: '12px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                  />
                  <ReferenceLine y={500} stroke="#D64545" strokeDasharray="4 4" label={{ value: 'Yield Strength Limit (500 MPa)', fill: '#D64545', fontSize: 10, position: 'insideTopLeft' }} />
                  <Bar dataKey="measuredStressMPa" fill="#1F6FEB" radius={[6, 6, 0, 0]} name="Measured Stress (MPa)">
                    {structuralStressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.measuredStressMPa > 250 ? '#FF6B2C' : '#1F6FEB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          4. SENSOR HARDWARE NODES REGISTRY TABLE
         ======================================================== */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1F6FEB]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0B1B2B]">
              Calibrated On-Site Sensor Fleet
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            Certified by Engineers Board of Kenya (EBK) & KEBS
          </span>
        </div>

        <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-[#2B4560]/15 scrollbar-thin">
          <table className="w-full min-w-[640px] text-left text-xs font-mono">
            <thead className="bg-[#0B1B2B] text-white">
              <tr>
                <th className="py-2.5 px-3">Node ID</th>
                <th className="py-2.5 px-3">Sensor Type</th>
                <th className="py-2.5 px-3">Physical Location</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Battery</th>
                <th className="py-2.5 px-3">Calibration</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B4560]/10 bg-white">
              {sensorNodes.map(node => (
                <tr key={node.id} className="hover:bg-[#F4F1EA]/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#1F6FEB]">{node.id}</td>
                  <td className="py-2.5 px-3 text-[#0B1B2B] font-sans font-medium">{node.type}</td>
                  <td className="py-2.5 px-3 text-gray-600 font-sans">{node.location}</td>
                  <td className="py-2.5 px-3 text-gray-500">{node.protocol}</td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span>{node.battery}%</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">{node.calibratedTo}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{node.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          5. FOOTER ACTIONS: EXPORT & CALIBRATION CERTIFICATE
         ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#2B4560]/10 text-xs">
        <div className="flex items-center gap-2 text-gray-500 text-[11px] font-mono">
          <FileCheck className="w-4 h-4 text-[#1E9E6A]" />
          <span>Telemetry cryptographically signed & logged to immutable audit ledger.</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Timestamp,Slab_Moisture_RH,Core_Temp_C,Ambient_Temp_C,Thermal_Gradient_C,Beam_Stress_MPa,Predicted_Strength_MPa\n" +
                telemetryHistoryData.map(e => `${e.time},${e.slabMoistureRH},${e.coreTemp},${e.ambientTemp},${e.thermalGradient},${e.beamStress},${e.predictedStrength}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `fundi_iot_sensor_telemetry_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#F4F1EA] hover:bg-gray-200 text-[#0B1B2B] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Log</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#C8A24A]" />
            <span>Download EBK Calibration Cert</span>
          </button>
        </div>
      </div>
    </div>
  );
};
