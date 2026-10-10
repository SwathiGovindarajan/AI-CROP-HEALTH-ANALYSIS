import React, { useState } from 'react';
import {
  DiagnosisRecord,
  PageId,
  SAMPLE_PRESETS,
  SamplePreset,
  UserAccount,
} from '../data/agroData';

interface HomeScanCropProps {
  currentUser: UserAccount;
  onLogDiagnosis: (record: Omit<DiagnosisRecord, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  onNavigate: (page: PageId, searchPreset?: string) => void;
  onShowToast: (message: string) => void;
}

export const HomeScanCrop: React.FC<HomeScanCropProps> = ({
  currentUser,
  onLogDiagnosis,
  onNavigate,
  onShowToast,
}) => {
  const [selectedCropKey, setSelectedCropKey] = useState<'tomato' | 'corn' | 'potato' | 'rice' | 'wheat'>('tomato');
  const [treatmentTab, setTreatmentTab] = useState<'organic' | 'chemical'>('organic');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState(
    'Analyzing cellular leaf patterns & chlorosis index...'
  );
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);

  const currentSample: SamplePreset = SAMPLE_PRESETS[selectedCropKey] || SAMPLE_PRESETS.tomato;

  const handleLoadSample = (key: 'tomato' | 'corn' | 'potato' | 'rice' | 'wheat') => {
    setSelectedCropKey(key);
    setCustomImageUrl(null);
    setCustomFileName(null);
  };

  const runAnalysis = (uploadedName?: string) => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setProgress(20);
    setProgressText('Analyzing cellular leaf patterns & chlorosis index...');

    let currentProg = 20;
    const interval = window.setInterval(() => {
      currentProg += 20;
      setProgress(currentProg);

      if (currentProg === 40) {
        setProgressText('Extracting chlorophyll spectra & thermal gradients...');
      } else if (currentProg === 80) {
        setProgressText('Cross-referencing global pathology neural database...');
      } else if (currentProg >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setIsAnalyzing(false);
          onShowToast(
            uploadedName
              ? `Neural scan complete for "${uploadedName}": ${currentSample.name} (${currentSample.conf} match).`
              : `Diagnostic model re-inference complete: ${currentSample.name} (${currentSample.conf} match).`
          );
        }, 350);
      }
    }, 180);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImageUrl(reader.result);
        setCustomFileName(file.name);
        runAnalysis(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogToParcelHistory = () => {
    onLogDiagnosis({
      parcelName: 'Green Valley Field #4',
      lotCode: currentSample.lot,
      gps: currentSample.gps,
      cropName: currentSample.selectLabel.split(' - ')[0],
      diseaseName: currentSample.name,
      scientificName: currentSample.taxon,
      confidence: currentSample.conf,
      severity: currentSample.severity,
      status: 'Active Treatment',
      symptoms: currentSample.symptoms.map((s) => s.text),
      recommendedAction: `${currentSample.organicProtocols[0].name} — ${currentSample.organicProtocols[0].description}`,
      imageUrl: customImageUrl || currentSample.image,
      analyzedBy: `${currentUser.name} (${currentUser.title})`,
      method: 'Vision Capture',
    });
    onShowToast(
      `Diagnosis "${currentSample.name}" committed to Diagnosis History ledger.`
    );
  };

  const handlePrintReport = () => {
    onShowToast(
      `Compiled high-resolution PDF field report for Lot ${currentSample.lot} (${currentSample.gps}).`
    );
  };

  const handleDispatchAgronomist = () => {
    onShowToast(
      `Alert telemetry & ${currentSample.name} prescription dispatched to Lead Agronomist.`
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* Farm Status & Environmental Telemetry Bar */}
      <section className="w-full px-4 sm:px-margin pt-space-md pb-space-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* Overall Health Index */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Health Index
              </span>
              <span className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Optimal
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-primary tracking-tight tabular-nums">
                88%
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                across 340 acres
              </span>
            </div>
            <div className="mt-space-sm w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[88%]"></div>
            </div>
          </div>

          {/* Soil Moisture Live */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Soil Moisture Matrix
              </span>
              <span className="material-symbols-outlined text-secondary text-base">water_drop</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight tabular-nums">
                28.4%
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Target: 26-32%
              </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>Root Depth: 35cm</span>
              <span className="text-secondary font-medium">Equilibrium</span>
            </div>
          </div>

          {/* Microclimate & Spray Window */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Spray Conditions
              </span>
              <span className="material-symbols-outlined text-secondary text-base">air</span>
            </div>
            <div className="mt-space-sm flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Good
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Wind: 4.2 km/h NW
              </span>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>RH: 61% • Delta T: 3.4</span>
              <span className="text-secondary font-medium">Valid next 4 hrs</span>
            </div>
          </div>

          {/* Regional Biosecurity Alert Ticker */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-error uppercase tracking-wider">
                County Threat Advisory
              </span>
              <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-xs">warning</span> High Risk
              </span>
            </div>
            <div className="mt-space-sm">
              <p className="font-body-sm text-body-sm text-on-surface font-semibold line-clamp-1">
                Alternaria solani Alert
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                3 confirmed clusters in 12km radius
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('plant-health-analysis', 'Alternaria solani')}
              className="mt-space-sm flex items-center gap-1.5 font-label-sm text-label-sm text-error font-medium hover:underline text-left"
            >
              <span className="material-symbols-outlined text-sm">schedule</span> Proactive screening advised
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Diagnostic Workstation */}
      <section className="w-full px-4 sm:px-margin pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Camera Viewport, Dropzone & Sample Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Crop Selector Header Box */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider"
                  htmlFor="cropSelect"
                >
                  Target Parcel Specimen
                </label>
                <div className="relative">
                  <select
                    id="cropSelect"
                    value={selectedCropKey}
                    onChange={(e) =>
                      handleLoadSample(
                        e.target.value as 'tomato' | 'corn' | 'potato' | 'rice' | 'wheat'
                      )
                    }
                    className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="tomato">
                      Tomato (Solanum lycopersicum) - Early Fruiting Stage
                    </option>
                    <option value="corn">
                      Corn / Maize (Zea mays) - V6 Vegetative Stage
                    </option>
                    <option value="potato">
                      Potato (Solanum tuberosum) - Tuber Initiation
                    </option>
                    <option value="rice">Rice (Oryza sativa) - Tillering Phase</option>
                    <option value="wheat">Wheat (Triticum aestivum) - Heading Stage</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-on-surface-variant pointer-events-none">
                    unfold_more
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant pt-1 font-label-sm text-label-sm">
                  <span>
                    Lot: <strong className="text-on-surface">{currentSample.lot}</strong>
                  </span>
                  <span>
                    GPS: <strong className="text-on-surface">{currentSample.gps}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Camera / Viewport */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">
                    center_focus_strong
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Vision Capture
                  </span>
                </div>
                <span className="font-label-sm text-label-sm bg-surface-container-low px-2 py-0.5 rounded text-on-surface-variant">
                  Spectral Model v4.2
                </span>
              </div>

              {/* Camera / Viewport Frame */}
              <div
                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-on-background flex items-center justify-center group select-none"
                id="scannerFrame"
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={currentSample.prompt}
                  src={customImageUrl || currentSample.image}
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* High-Tech Optical Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-secondary"></div>
                    <div className="bg-surface/85 backdrop-blur-md px-2 py-0.5 rounded font-label-sm text-label-sm text-primary flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                      ROI LOCKED: {currentSample.roiArea}
                    </div>
                    <div className="w-6 h-6 border-t-2 border-r-2 border-secondary"></div>
                  </div>

                  {/* Center Bounding Box */}
                  <div
                    className="self-center w-48 h-40 border-2 border-dashed border-error bg-error/15 rounded flex flex-col justify-between p-2 relative"
                    id="boundingBox"
                  >
                    <span className="font-label-sm text-label-sm bg-error text-on-error px-1.5 py-0.5 rounded self-start font-mono">
                      {currentSample.roiText}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-error self-end bg-on-background/70 px-1 rounded">
                      Conf: {currentSample.conf}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="w-6 h-6 border-b-2 border-l-2 border-secondary"></div>
                    <div className="font-label-sm text-label-sm text-inverse-on-surface bg-inverse-surface/80 px-2 py-0.5 rounded">
                      F/2.8 • 1/250s • ISO 100 • 550nm
                    </div>
                    <div className="w-6 h-6 border-b-2 border-r-2 border-secondary"></div>
                  </div>
                </div>

                {/* Animated Scan Line (Shown while analyzing) */}
                {isAnalyzing && (
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary shadow-[0_0_16px_#6bff8f] animate-bounce"></div>
                )}
              </div>

              {/* Quick Sample Switcher */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Test Sample Field Presets:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['tomato', 'corn', 'potato'] as const).map((key) => {
                    const preset = SAMPLE_PRESETS[key];
                    const isSelected = selectedCropKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleLoadSample(key)}
                        className={`px-2 py-1.5 rounded-lg font-label-sm text-label-sm text-center font-medium transition-colors active:scale-95 ${
                          isSelected
                            ? 'bg-surface-container text-primary font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => runAnalysis(customFileName || undefined)}
                  className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-md active:scale-[0.99] disabled:opacity-75"
                >
                  <span className="material-symbols-outlined">biotech</span>
                  {isAnalyzing ? 'Running Neural Pathology Scan...' : 'Analyze Crop Health'}
                </button>
                <div className="flex items-center justify-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
                  <label className="cursor-pointer hover:text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">upload_file</span> Drag &amp; drop file
                    <input
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      type="file"
                    />
                  </label>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast('Camera calibration verified via on-board multispectral sensor.')
                    }
                    className="hover:text-primary flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">videocam</span> Live Shutter
                  </button>
                </div>
              </div>

              {/* Simulated Progress Bar */}
              {isAnalyzing && (
                <div className="flex flex-col gap-1.5 pt-2">
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>{progressText}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live AI Results & Prescription Engine (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Result Overview Header Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Primary Diagnosis Identified
                    </span>
                    <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>{' '}
                      {currentSample.severity}
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    {currentSample.name}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                    {currentSample.taxon}
                  </p>
                </div>

                {/* Confidence Metric */}
                <div className="bg-surface-container-low px-4 py-2.5 rounded-xl flex flex-col items-end">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Confidence Score
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-md text-headline-md text-primary font-bold tabular-nums">
                      {currentSample.conf}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">
                      Neural Match
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptom Evidence Chips */}
              <div className="mt-space-md pt-space-md flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Identified Symptoms &amp; Pathology Markers
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('plant-health-analysis', currentSample.name)}
                    className="font-label-sm text-label-sm text-secondary hover:text-primary font-semibold flex items-center gap-1"
                  >
                    Inspect in Plant Health Analysis →
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSample.symptoms.map((sym, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-lg font-body-sm text-body-sm text-on-surface"
                    >
                      <span className={`material-symbols-outlined ${sym.colorClass} text-base`}>
                        {sym.icon}
                      </span>
                      {sym.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Treatment Recommendations (Tabbed Dual Protocol) */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">medication</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Targeted Treatment Prescriptions
                  </h3>
                </div>
                <div className="flex bg-surface-container-low p-1 rounded-lg self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setTreatmentTab('organic')}
                    className={`px-3 py-1 rounded-md font-label-md text-label-md font-semibold transition-all ${
                      treatmentTab === 'organic'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Organic Protocols
                  </button>
                  <button
                    type="button"
                    onClick={() => setTreatmentTab('chemical')}
                    className={`px-3 py-1 rounded-md font-label-md text-label-md font-semibold transition-all ${
                      treatmentTab === 'chemical'
                        ? 'bg-surface-container-lowest text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Chemical Formulations
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {treatmentTab === 'organic' ? (
                <div className="flex flex-col gap-3">
                  {currentSample.organicProtocols.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-low p-3.5 rounded-lg flex items-start gap-3"
                    >
                      <div className="p-2 bg-secondary/10 rounded-lg text-secondary flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="font-label-sm text-label-sm text-secondary font-medium">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {currentSample.chemicalProtocols.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-low p-3.5 rounded-lg flex items-start gap-3"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cultural Management & Prevention */}
              <div className="pt-2 flex flex-col gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Agronomic Prevention Protocol
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSample.preventionProtocols.map((prev, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-low p-3 rounded-lg flex items-center gap-2.5"
                    >
                      <span className="material-symbols-outlined text-secondary">{prev.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          {prev.title}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {prev.subtitle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Export & Dispatch Actions */}
              <div className="pt-space-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintReport}
                    className="px-3.5 py-2 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                    Print Field Report (PDF)
                  </button>
                  <button
                    type="button"
                    onClick={handleLogToParcelHistory}
                    className="px-3.5 py-2 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">bookmark</span>
                    Log to Parcel History
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleDispatchAgronomist}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Send to Agronomist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
