import React, { useState } from 'react';
import { DiagnosisRecord, PageId } from '../data/agroData';

interface DiagnosisHistoryPageProps {
  records: DiagnosisRecord[];
  onUpdateStatus: (id: string, status: DiagnosisRecord['status']) => void;
  onDeleteRecord: (id: string) => void;
  onNavigate: (page: PageId, searchPreset?: string) => void;
  onShowToast: (msg: string) => void;
}

export const DiagnosisHistoryPage: React.FC<DiagnosisHistoryPageProps> = ({
  records,
  onUpdateStatus,
  onDeleteRecord,
  onNavigate,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<DiagnosisRecord | null>(
    records[0] || null
  );

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.parcelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || rec.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Timestamp',
      'Parcel',
      'Lot',
      'Crop',
      'Disease',
      'Pathogen',
      'Confidence',
      'Severity',
      'Status',
      'Method',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.timestamp,
      `"${r.parcelName}"`,
      r.lotCode,
      `"${r.cropName}"`,
      `"${r.diseaseName}"`,
      `"${r.scientificName}"`,
      r.confidence,
      r.severity,
      r.status,
      r.method,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgroAI_Diagnosis_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Exported ${filteredRecords.length} diagnosis records to CSV.`);
  };

  const severityBadgeClass = (severity: DiagnosisRecord['severity']) => {
    if (severity === 'Critical Severity' || severity === 'High Severity') {
      return 'bg-error-container text-on-error-container';
    }
    if (severity === 'Moderate Severity') {
      return 'bg-[#FEF3C7] text-[#78350F]';
    }
    return 'bg-secondary-fixed text-on-secondary-fixed';
  };

  const statusBadgeClass = (status: DiagnosisRecord['status']) => {
    switch (status) {
      case 'Resolved':
        return 'bg-secondary-fixed text-on-secondary-fixed';
      case 'Active Treatment':
        return 'bg-surface-container-highest text-primary';
      case 'Escalated':
        return 'bg-error-container text-on-error-container';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  return (
    <div className="w-full px-4 sm:px-margin py-space-lg flex flex-col gap-space-lg">
      {/* Page Header & Summary KPIs */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">history_edu</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Parcel Pathology Telemetry Archive
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
            Diagnosis History
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-1">
            Complete chronological ledger of previous plant health analyses, multispectral leaf
            captures, symptom diagnostics, and prescribed field interventions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('scan-crop')}
            className="px-4 py-2.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">center_focus_strong</span>
            New Vision Scan
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Ledger (CSV)
          </button>
        </div>
      </div>

      {/* Summary Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Total Logged Diagnoses
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary tabular-nums">
              {records.length}
            </span>
            <span className="font-label-sm text-label-sm text-secondary">100% Synced</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Mean Neural Confidence
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface tabular-nums">
              97.5%
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Spectral v4.2
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Active Field Treatments
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary tabular-nums">
              {records.filter((r) => r.status === 'Active Treatment' || r.status === 'Escalated').length}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Parcels</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Resolved Cases
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-secondary tabular-nums">
              {records.filter((r) => r.status === 'Resolved').length}
            </span>
            <span className="font-label-sm text-label-sm text-secondary">Verified Clear</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined text-on-surface-variant text-base absolute left-3 top-2.5">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by disease name, crop, lot code (e.g., GV-BLK-04B), or pathogen..."
            className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            {(['ALL', 'Active Treatment', 'Monitoring', 'Resolved', 'Escalated'] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-2xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {st === 'ALL' ? 'All Statuses' : st}
                </button>
              )
            )}
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            aria-label="Filter by diagnostic method"
            className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="ALL">All Methods</option>
            <option value="Vision Capture">Vision Capture</option>
            <option value="Symptom Analysis">Symptom Analysis</option>
            <option value="Copilot Triage">Copilot Triage</option>
          </select>
        </div>
      </div>

      {/* Main Split View: History List (7 cols) + Detailed Inspection Drawer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-7 flex flex-col gap-3">
          {filteredRecords.map((rec) => {
            const isSelected = selectedRecord?.id === rec.id;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer transition-all border ${
                  isSelected
                    ? 'border-secondary ring-2 ring-secondary/20'
                    : 'border-transparent hover:border-primary/15'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      {rec.id}
                    </span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {rec.dateFormatted}
                    </span>
                    <span className="font-label-sm text-[10px] bg-surface-container-low px-2 py-0.5 rounded text-on-surface-variant">
                      {rec.method}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${severityBadgeClass(
                        rec.severity
                      )}`}
                    >
                      {rec.severity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${statusBadgeClass(
                        rec.status
                      )}`}
                    >
                      {rec.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-3.5">
                  <img
                    src={rec.imageUrl}
                    alt={rec.diseaseName}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-surface-container"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-headline-sm text-base text-on-surface font-bold truncate">
                        {rec.diseaseName}
                      </h3>
                      <span className="font-label-md text-label-md text-primary font-bold tabular-nums flex-shrink-0">
                        {rec.confidence} Match
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant italic">
                      {rec.scientificName} — {rec.cropName}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-label-sm text-label-sm text-on-surface-variant">
                      <span>
                        Parcel: <strong className="text-on-surface">{rec.parcelName}</strong>
                      </span>
                      <span>
                        Lot: <strong className="text-on-surface">{rec.lotCode}</strong>
                      </span>
                      <span>GPS: {rec.gps}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="bg-surface-container-lowest p-space-xl rounded-xl text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                find_in_page
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                No Matching Diagnosis Records
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                No historical plant health analyses match your current filter criteria. Try clearing
                your search or logging a new crop scan.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                  setMethodFilter('ALL');
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Selected Diagnosis Detailed Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedRecord ? (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm sticky top-24 flex flex-col gap-space-md">
              <div className="flex items-start justify-between gap-2 pb-space-sm border-b border-surface-container">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase">
                    Selected Record Inspection • {selectedRecord.id}
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface mt-0.5">
                    {selectedRecord.diseaseName}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                    {selectedRecord.scientificName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteRecord(selectedRecord.id)}
                  title="Delete Record"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-on-background">
                <img
                  src={selectedRecord.imageUrl}
                  alt={selectedRecord.diseaseName}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface px-3 py-1.5 rounded flex items-center justify-between font-label-sm text-label-sm">
                  <span>Lot: {selectedRecord.lotCode}</span>
                  <span>Confidence: {selectedRecord.confidence}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-surface-container-low p-3 rounded-lg font-label-sm text-label-sm">
                <div>
                  <span className="text-on-surface-variant block">Crop Specimen</span>
                  <strong className="text-on-surface">{selectedRecord.cropName}</strong>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Timestamp</span>
                  <strong className="text-on-surface">{selectedRecord.dateFormatted}</strong>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Parcel &amp; GPS</span>
                  <strong className="text-on-surface">{selectedRecord.gps}</strong>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Logged By</span>
                  <strong className="text-on-surface">{selectedRecord.analyzedBy}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Recorded Pathology Symptoms
                </span>
                <div className="flex flex-col gap-1.5">
                  {selectedRecord.symptoms.map((sym, i) => (
                    <div
                      key={i}
                      className="bg-surface-container-low px-3 py-2 rounded-lg font-body-sm text-xs text-on-surface flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-error text-sm">
                        lens_blur
                      </span>
                      {sym}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Prescribed Agronomic Action
                </span>
                <p className="bg-secondary-fixed/30 text-on-secondary-fixed p-3 rounded-lg font-body-sm text-xs font-medium">
                  {selectedRecord.recommendedAction}
                </p>
              </div>

              {/* Update Remediation Status */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Update Field Remediation Status
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    ['Active Treatment', 'Monitoring', 'Resolved', 'Escalated'] as DiagnosisRecord['status'][]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(selectedRecord.id, st);
                        setSelectedRecord({ ...selectedRecord, status: st });
                        onShowToast(`Status for ${selectedRecord.id} updated to "${st}".`);
                      }}
                      className={`py-1.5 px-2 rounded font-label-sm text-[11px] font-semibold transition-colors ${
                        selectedRecord.status === st
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigate('plant-health-analysis', selectedRecord.diseaseName)
                }
                className="w-full py-2.5 px-4 rounded-lg bg-surface-container text-primary font-label-md text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">menu_book</span>
                View Full Pathology Reference in Plant Health Analysis
              </button>
            </div>
          ) : (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm text-center text-on-surface-variant font-body-sm text-body-sm">
              Select a diagnosis entry on the left to inspect its full pathology report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
