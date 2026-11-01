/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { TrustEscrowPage } from './pages/TrustEscrowPage';
import { PricingPage } from './pages/PricingPage';
import { InvestorDemoPage } from './pages/InvestorDemoPage';
import { LegalPage } from './pages/LegalPage';
import { SmartBriefWizardPage } from './pages/SmartBriefWizardPage';
import { AdminConsolePage } from './pages/AdminConsolePage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { ProjectDashboardPage } from './pages/ProjectDashboardPage';
import { BlueprintPage } from './pages/BlueprintPage';
import { SkillsPage } from './pages/SkillsPage';
import { SiteShowcasePage } from './pages/SiteShowcasePage';
import { api } from './lib/api';
import { UserRole } from './types';
import { Building2, Home, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(api.getActiveRole());
  const [currency, setCurrency] = useState<'KES' | 'USD'>(api.getCurrency());

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    api.setActiveRole(role);
  };

  const handleCurrencyToggle = () => {
    const nextCur = currency === 'KES' ? 'USD' : 'KES';
    setCurrency(nextCur);
    api.setCurrency(nextCur);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#0B1B2B] w-full max-w-full overflow-x-hidden">
        {/* Universal Top Navigation with Top Bar Contract */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          currency={currency}
          onCurrencyToggle={handleCurrencyToggle}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage currency={currency} onSelectRole={handleRoleChange} />} 
            />
            <Route 
              path="/dashboard" 
              element={<ProjectDashboardPage currency={currency} currentUserRole={currentRole} onSelectRole={handleRoleChange} />} 
            />
            <Route 
              path="/projects" 
              element={<ProjectDashboardPage currency={currency} currentUserRole={currentRole} onSelectRole={handleRoleChange} />} 
            />
            <Route 
              path="/blueprint" 
              element={<BlueprintPage currency={currency} />} 
            />
            <Route 
              path="/design" 
              element={<BlueprintPage currency={currency} />} 
            />
            <Route 
              path="/skills" 
              element={<SkillsPage currency={currency} />} 
            />
            <Route 
              path="/instagram" 
              element={<SiteShowcasePage currency={currency} />} 
            />
            <Route 
              path="/feed" 
              element={<SiteShowcasePage currency={currency} />} 
            />
            <Route 
              path="/marketplace" 
              element={<MarketplacePage currency={currency} />} 
            />
            <Route 
              path="/knowledge-base" 
              element={<KnowledgeBasePage />} 
            />
            <Route 
              path="/trust" 
              element={<TrustEscrowPage />} 
            />
            <Route 
              path="/pricing" 
              element={<PricingPage />} 
            />
            <Route 
              path="/investors" 
              element={<InvestorDemoPage />} 
            />
            <Route 
              path="/legal/*" 
              element={<LegalPage />} 
            />
            <Route 
              path="/app/projects/:id" 
              element={<ProjectWorkspacePage currency={currency} currentUserRole={currentRole} />} 
            />
            <Route 
              path="/app/projects/new" 
              element={<SmartBriefWizardPage currency={currency} />} 
            />
            <Route 
              path="/app/site" 
              element={<ProjectWorkspacePage currency={currency} currentUserRole={currentRole} />} 
            />
            <Route 
              path="/app" 
              element={<Navigate to="/app/projects/proj-karen-villa" replace />} 
            />
            <Route 
              path="/admin" 
              element={<AdminConsolePage />} 
            />

            {/* Custom Branded 404 Page (Website Quality Checklist Requirement) */}
            <Route 
              path="*" 
              element={
                <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-[#2B4560]/15 shadow-sm space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0B1B2B] text-[#C8A24A] flex items-center justify-center mx-auto">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1F6FEB] uppercase block">
                      404 · PAGE NOT FOUND
                    </span>
                    <h2 className="font-display font-bold text-xl text-[#0B1B2B]">
                      This foundation is yet to be surveyed.
                    </h2>
                    <p className="text-xs text-[#2B4560]/80">
                      The requested route does not exist or has been moved. You can return to the homepage or explore the Karen Villa workspace.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Link
                        to="/"
                        className="flex-1 py-2 px-3 bg-[#0B1B2B] hover:bg-[#1F6FEB] text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Back to Home
                      </Link>
                      <Link
                        to="/app/projects/proj-karen-villa"
                        className="flex-1 py-2 px-3 bg-[#F4F1EA] hover:bg-gray-200 text-[#0B1B2B] text-xs font-semibold rounded-lg transition-colors"
                      >
                        Go to Workspace
                      </Link>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>

        {/* Global Compliant Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
