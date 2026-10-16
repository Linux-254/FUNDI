import React, { useState } from 'react';
import { Project, SiteLogEntry, AttendanceRecord, UserRole } from '../../types';
import { api } from '../../lib/api';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  MapPin, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  UserCheck, 
  Calendar, 
  Plus, 
  Sun,
  ShieldCheck
} from 'lucide-react';

interface SiteLogAttendanceProps {
  project: Project;
  currency: 'KES' | 'USD';
  currentUserRole: UserRole;
  onProjectUpdated: () => void;
}

export const SiteLogAttendance: React.FC<SiteLogAttendanceProps> = ({
  project,
  currency,
  currentUserRole,
  onProjectUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'photos'>('attendance');
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [siteLogs, setSiteLogs] = useState<SiteLogEntry[]>([]);
  const [newLogModal, setNewLogModal] = useState(false);
  const [newLogNotes, setNewLogNotes] = useState('');
  const [newLogWorkers, setNewLogWorkers] = useState(12);
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null);

  React.useEffect(() => {
    api.getAttendance(project.id).then(setAttendanceList);
    api.getSiteLogs(project.id).then(setSiteLogs);
  }, [project.id]);

  const handlePayWorker = async (workerId: string, workerName: string, rateMinor: number) => {
    try {
      await api.markAttendancePayout(workerId);
      confetti({ particleCount: 40, spread: 50 });
      setPayoutMessage(`M-Pesa B2C instant disbursement of ${api.formatMoney(rateMinor, 'KES')} sent to ${workerName}.`);
      api.getAttendance(project.id).then(setAttendanceList);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNotes.trim()) return;

    try {
      await api.addSiteLog(project.id, {
        projectId: project.id,
        date: new Date().toISOString().split('T')[0],
        weather: 'Clear & Sunny',
        notes: newLogNotes,
        authorName: 'Eng. Ochieng (Site Engineer)',
        role: 'Contractor Site Rep',
        workersPresentCount: newLogWorkers,
        photos: [
          {
            id: `p-${Date.now()}`,
            url: '/src/assets/images/site_inspection_foundation_1792155229622.jpg',
            caption: 'On-site progress photo logged with GPS metadata',
            geotag: 'Karen Plot LR 330/512 (-1.3214°, 36.7118°)',
            timestamp: new Date().toLocaleTimeString()
          }
        ]
      });
      setNewLogModal(false);
      setNewLogNotes('');
      api.getSiteLogs(project.id).then(setSiteLogs);
      onProjectUpdated();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Site Field Command */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#2B4560]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2B4560]/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B2C]">
                MOBILE-FIRST FIELD APPLICATION
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                Geo-Fence Active (Karen Site)
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1B2B] mt-1">
              Site Evidence & Fundi Wage Payroll
            </h3>
            <p className="text-xs text-[#2B4560]/70 mt-0.5">
              Daily geotagged photo logs and daily muster roll. Weekly wage pots disburse directly to craftspersons' M-Pesa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewLogModal(true)}
              className="py-2 px-3.5 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#C8A24A]" />
              <span>Capture Site Photo Log</span>
            </button>
          </div>
        </div>

        {payoutMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1E9E6A]" />
              <span>{payoutMessage}</span>
            </div>
            <button onClick={() => setPayoutMessage(null)}>✕</button>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-[#0B1B2B] text-white'
                : 'text-[#2B4560] hover:bg-black/5'
            }`}
          >
            Today's Attendance Muster Roll ({attendanceList.length})
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-[#0B1B2B] text-white'
                : 'text-[#2B4560] hover:bg-black/5'
            }`}
          >
            Site Inspection Photo Log ({siteLogs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Attendance & Wage Muster Roll */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl shadow-xs border border-[#2B4560]/15 overflow-hidden">
          <div className="p-4 bg-[#F4F1EA] border-b border-[#2B4560]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-display font-bold text-[#0B1B2B] block">
                Daily Verified Worker Muster Roll
              </span>
              <span className="text-[11px] text-[#2B4560]/70">
                Gang Lead: Fundi Peter Maina · Geo-fence GPS timestamp verified
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#0B1B2B] font-bold">
              Total Day Payroll: {api.formatMoney(attendanceList.reduce((s, a) => s + a.dailyRateMinor, 0), currency)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#2B4560]/10 bg-white text-[#2B4560]/80 font-mono text-[11px]">
                  <th className="py-2.5 px-4 font-semibold">Craftsperson</th>
                  <th className="py-2.5 px-4 font-semibold">Trade</th>
                  <th className="py-2.5 px-4 font-semibold">Check-In Time</th>
                  <th className="py-2.5 px-4 font-semibold">Daily Rate</th>
                  <th className="py-2.5 px-4 font-semibold">M-Pesa Payout</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B4560]/10 font-mono">
                {attendanceList.map((worker) => {
                  const isPaid = worker.payoutStatus === 'Paid_MPesa';

                  return (
                    <tr key={worker.id} className="hover:bg-[#F4F1EA]/50 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-[#0B1B2B]">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#1E9E6A]" />
                          <span>{worker.workerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#2B4560] font-sans">
                        {worker.trade}
                      </td>
                      <td className="py-3 px-4 text-[#2B4560]">
                        {worker.checkedInAt} (GPS Verified)
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0B1B2B]">
                        {api.formatMoney(worker.dailyRateMinor, currency)}
                      </td>
                      <td className="py-3 px-4 text-[#2B4560] text-[11px]">
                        {worker.mpesaPhoneMasked}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPaid ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Paid via M-Pesa
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePayWorker(worker.workerId, worker.workerName, worker.dailyRateMinor)}
                            className="py-1 px-2.5 bg-[#1E9E6A] hover:bg-emerald-700 text-white text-[11px] font-bold rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>Release Wage</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Site Inspection Photo Log */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-[#2B4560]/15 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs text-[#2B4560]/80">
                  <span className="font-mono font-bold text-[#0B1B2B]">{log.date}</span>
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{log.weather}</span>
                  </span>
                </div>

                <p className="text-xs text-[#0B1B2B] leading-relaxed">
                  {log.notes}
                </p>

                {log.photos && log.photos.length > 0 && (
                  <div className="space-y-1.5">
                    <img
                      src={log.photos[0].url}
                      alt="Site Inspection"
                      className="w-full h-44 object-cover rounded-lg border border-[#2B4560]/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-[10px] text-[#2B4560]/70 font-mono flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF6B2C]" />
                        <span>{log.photos[0].geotag}</span>
                      </span>
                      <span>{log.photos[0].timestamp}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[#2B4560]/10 flex items-center justify-between text-[11px] text-[#2B4560]/70">
                  <span>Author: {log.authorName}</span>
                  <span className="font-mono">{log.workersPresentCount} workers on site</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Site Log */}
      {newLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#2B4560]/20 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#FF6B2C]" />
                <h3 className="font-display font-bold text-base text-[#0B1B2B]">
                  Log Daily Site Inspection Entry
                </h3>
              </div>
              <button onClick={() => setNewLogModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1B2B] mb-1">
                  Site Observations & Work Completed
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Completed level 1 wall setting out. Inspected block compressive strength certificates..."
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#2B4560]/20 focus:outline-[#1F6FEB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1B2B] mb-1">
                  Workers Present on Site
                </label>
                <input
                  type="number"
                  min="1"
                  value={newLogWorkers}
                  onChange={(e) => setNewLogWorkers(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-[#2B4560]/20 font-mono"
                />
              </div>

              <div className="p-3 bg-[#F4F1EA] rounded-lg text-[11px] text-[#2B4560]/80">
                A geotagged inspection photo will be automatically attached with GPS coordinates (-1.3214°, 36.7118°).
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewLogModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-[#2B4560] border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#0B1B2B] hover:bg-[#1F6FEB] rounded-lg shadow-sm"
                >
                  Save Entry & Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
