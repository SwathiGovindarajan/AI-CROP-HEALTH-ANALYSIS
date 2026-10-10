/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DiagnosisRecord,
  INITIAL_DIAGNOSIS_HISTORY,
  PageId,
  USER_ACCOUNTS,
  UserRole,
} from './data/agroData';
import { Header } from './components/Header';
import { HomeScanCrop } from './components/HomeScanCrop';
import { DiagnosisHistoryPage } from './components/DiagnosisHistoryPage';
import { PlantHealthAnalysisPage } from './components/PlantHealthAnalysisPage';
import { AgroTipsPage } from './components/AgroTipsPage';
import { ProfilePages } from './components/ProfilePages';
import { ChatbotWidget } from './components/ChatbotWidget';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('scan-crop');
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [activeParcel, setActiveParcel] = useState<string>(
    'Green Valley Field #4 - Corn & Tomato'
  );
  const [diagnosisRecords, setDiagnosisRecords] = useState<DiagnosisRecord[]>(
    INITIAL_DIAGNOSIS_HISTORY
  );
  const [analysisSearchPreset, setAnalysisSearchPreset] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser = USER_ACCOUNTS[currentRole];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleNavigate = (page: PageId, searchPreset?: string) => {
    if (searchPreset !== undefined) {
      setAnalysisSearchPreset(searchPreset);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    // Automatically align profile page if currently viewing a profile
    if (activePage === 'user-profile' && role === 'admin') {
      setActivePage('admin-profile');
    } else if (activePage === 'admin-profile' && role === 'user') {
      setActivePage('user-profile');
    }
    showToast(
      role === 'admin'
        ? 'Logged in as Administrator (Dr. Marcus Sterling). Admin Profile unlocked.'
        : 'Logged in as Normal User (Elena Vance — Lead Agronomist).'
    );
  };

  const handleLogDiagnosis = (
    newEntry: Omit<DiagnosisRecord, 'id' | 'timestamp' | 'dateFormatted'>
  ) => {
    const now = new Date();
    const record: DiagnosisRecord = {
      ...newEntry,
      id: `DIAG-${9043 + diagnosisRecords.length}`,
      timestamp: now.toISOString().slice(0, 16).replace('T', ' '),
      dateFormatted: now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) +
        ' • ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setDiagnosisRecords((prev) => [record, ...prev]);
  };

  const handleUpdateDiagnosisStatus = (
    id: string,
    status: DiagnosisRecord['status']
  ) => {
    setDiagnosisRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status } : rec))
    );
  };

  const handleDeleteDiagnosisRecord = (id: string) => {
    setDiagnosisRecords((prev) => prev.filter((rec) => rec.id !== id));
    showToast(`Deleted record ${id} from Diagnosis History.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      {/* Top Navigation & Search Header */}
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        activeParcel={activeParcel}
        onChangeParcel={(parcel) => {
          setActiveParcel(parcel);
          showToast(`Switched active telemetry parcel to "${parcel}".`);
        }}
      />

      {/* Non-blocking Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 font-body-sm text-xs max-w-md w-[90vw] animate-fade-in">
          <span className="material-symbols-outlined text-secondary-fixed text-base">
            check_circle
          </span>
          <span className="flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-inverse-on-surface/70 hover:text-inverse-on-surface"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full pt-20 bg-background flex-1">
        {activePage === 'scan-crop' && (
          <HomeScanCrop
            currentUser={currentUser}
            onLogDiagnosis={handleLogDiagnosis}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {activePage === 'diagnosis-history' && (
          <DiagnosisHistoryPage
            records={diagnosisRecords}
            onUpdateStatus={handleUpdateDiagnosisStatus}
            onDeleteRecord={handleDeleteDiagnosisRecord}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {activePage === 'plant-health-analysis' && (
          <PlantHealthAnalysisPage
            initialSearchQuery={analysisSearchPreset}
            currentUser={currentUser}
            onLogDiagnosis={handleLogDiagnosis}
            onShowToast={showToast}
          />
        )}

        {activePage === 'agro-tips' && (
          <AgroTipsPage onNavigate={handleNavigate} onShowToast={showToast} />
        )}

        {(activePage === 'user-profile' || activePage === 'admin-profile') && (
          <ProfilePages
            currentUser={currentUser}
            targetProfileView={activePage}
            onSwitchRole={handleSwitchRole}
            onNavigate={handleNavigate}
            records={diagnosisRecords}
            onShowToast={showToast}
          />
        )}

        {/* Enhanced Floating Chatbot Widget (Double-click to minimize into chatbot icon) */}
        <ChatbotWidget
          activeParcel={activeParcel}
          onLogDiagnosisFromChat={(entry) => {
            handleLogDiagnosis(entry);
            showToast(`Logged "${entry.diseaseName}" from AgroAI Copilot to Diagnosis History.`);
          }}
          onNavigateToAnalysis={(symptomQuery) => {
            handleNavigate('plant-health-analysis', symptomQuery || '');
          }}
        />
      </main>

      {/* Footer matching original HTML design */}
      <footer className="w-full bg-surface-container-low mt-auto py-space-md shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="w-full px-4 sm:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-sm">cloud_sync</span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              Offline Sync Active: Telemetry &amp; Scans Queued (Synced 2m ago)
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left max-w-xl">
            Agronomic Disclaimer: AI diagnostic inferences assist field assessment and should be
            validated alongside on-site laboratory pathology testing.
          </p>
          <div className="flex items-center gap-space-sm">
            <a
              className="inline-flex items-center gap-1.5 bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-md text-label-md hover:bg-error hover:text-on-error transition-colors"
              href="tel:18005552476"
            >
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Emergency Agronomy Hotline
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
