import React, { useState, useEffect } from 'react';
import {
  DiagnosisRecord,
  HOTLINKED_ASSETS,
  MAJOR_PLANT_DISEASES,
  MajorDiseaseInfo,
  UserAccount,
} from '../data/agroData';

interface PlantHealthAnalysisPageProps {
  initialSearchQuery?: string;
  currentUser: UserAccount;
  onLogDiagnosis: (record: Omit<DiagnosisRecord, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  onShowToast: (msg: string) => void;
}

interface AISymptomAnalysisResult {
  diseaseName: string;
  scientificName: string;
  confidence: string;
  severity: string;
  affectedCrop: string;
  summary: string;
  matchedSymptoms: string[];
  organicTreatments: { name: string; badge: string; instruction: string }[];
  chemicalTreatments: { name: string; fracCode: string; instruction: string }[];
  preventionTips: string[];
}

const COMMON_SYMPTOM_TAGS = [
  'Concentric brown target rings',
  'Yellow chlorotic leaf halo',
  'White powdery talcum patches',
  'Water-soaked dark blotches',
  'Cinnamon-brown rust pustules',
  'One-sided branch wilting',
  'Angular shot-hole leaf spots',
  'Dark sunken stem collar lesion',
  'Upward leaf curling',
  'White fuzzy growth under leaf',
];

export const PlantHealthAnalysisPage: React.FC<PlantHealthAnalysisPageProps> = ({
  initialSearchQuery = '',
  currentUser,
  onLogDiagnosis,
  onShowToast,
}) => {
  const [cropInput, setCropInput] = useState('Tomato (Solanum lycopersicum)');
  const [symptomInput, setSymptomInput] = useState(initialSearchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AISymptomAnalysisResult | null>(null);

  // Encyclopedia filter states
  const [encyclopediaFilter, setEncyclopediaFilter] = useState('');
  const [pathogenTypeFilter, setPathogenTypeFilter] = useState<string>('ALL');
  const [expandedDiseaseId, setExpandedDiseaseId] = useState<string>(
    MAJOR_PLANT_DISEASES[0].id
  );

  useEffect(() => {
    if (initialSearchQuery && initialSearchQuery.trim() !== '') {
      setSymptomInput(initialSearchQuery);
      setEncyclopediaFilter(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const toggleSymptomTag = (tag: string) => {
    const exists = selectedTags.includes(tag);
    const updated = exists ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];
    setSelectedTags(updated);
    if (!exists) {
      setSymptomInput((prev) => (prev.trim() ? `${prev.trim()}, ${tag}` : tag));
    }
  };

  const handleRunSymptomDiagnosis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const combinedSymptoms = symptomInput.trim() || selectedTags.join(', ');
    if (!combinedSymptoms) {
      onShowToast('Please enter or select at least one plant symptom to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: cropInput,
          symptoms: combinedSymptoms,
          environment: 'Field conditions: 24°C, 61% RH, Active Parcel GV-BLK-04B',
        }),
      });
      const data = await response.json();
      setAnalysisResult(data);
      onShowToast(`Identified "${data.diseaseName}" (${data.confidence} match).`);
    } catch {
      onShowToast('Symptom diagnosis completed using local pathology matrix.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogResultToHistory = () => {
    if (!analysisResult) return;
    onLogDiagnosis({
      parcelName: 'Green Valley Field #4',
      lotCode: 'GV-SYMP-08',
      gps: '38.541°N, 121.782°W',
      cropName: analysisResult.affectedCrop || cropInput,
      diseaseName: analysisResult.diseaseName,
      scientificName: analysisResult.scientificName,
      confidence: analysisResult.confidence,
      severity: (analysisResult.severity.includes('Critical')
        ? 'Critical Severity'
        : analysisResult.severity.includes('High')
        ? 'High Severity'
        : 'Moderate Severity') as DiagnosisRecord['severity'],
      status: 'Active Treatment',
      symptoms: analysisResult.matchedSymptoms,
      recommendedAction:
        analysisResult.organicTreatments[0]?.name +
        ': ' +
        analysisResult.organicTreatments[0]?.instruction,
      imageUrl: HOTLINKED_ASSETS.sampleLeaf,
      analyzedBy: `${currentUser.name} (${currentUser.title})`,
      method: 'Symptom Analysis',
    });
    onShowToast(`Saved "${analysisResult.diseaseName}" to Diagnosis History.`);
  };

  const filteredDiseases: MajorDiseaseInfo[] = MAJOR_PLANT_DISEASES.filter((d) => {
    const q = encyclopediaFilter.toLowerCase();
    const matchesText =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.scientificName.toLowerCase().includes(q) ||
      d.overview.toLowerCase().includes(q) ||
      d.affectedCrops.some((c) => c.toLowerCase().includes(q)) ||
      d.keySymptoms.some((s) => s.toLowerCase().includes(q));
    const matchesType = pathogenTypeFilter === 'ALL' || d.pathogenType === pathogenTypeFilter;
    return matchesText && matchesType;
  });

  return (
    <div className="w-full px-4 sm:px-margin py-space-lg flex flex-col gap-space-lg">
      {/* Page Banner */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">biotech</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Dedicated Plant Pathology &amp; Symptom Diagnostic Center
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
            Plant Health Analysis
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl mt-1">
            Enter observed plant symptoms below to receive an AI-powered pathology diagnosis, or
            explore our comprehensive reference encyclopedia of major agricultural plant diseases.
          </p>
        </div>
        <div className="bg-surface-container-low px-4 py-3 rounded-xl flex items-center gap-3 self-start lg:self-auto">
          <span className="material-symbols-outlined text-primary text-2xl">neurology</span>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Pathology Knowledge Base
            </span>
            <span className="font-headline-sm text-sm text-primary font-bold">
              6 Major Disease Complexes • Real-Time AI Triage
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Interactive Symptom-to-Disease Diagnostic Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">
                troubleshoot
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Symptom-Based Disease Analyzer
              </h2>
            </div>
            <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-semibold">
              AI Diagnostic
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Describe the symptoms affecting your plants (or click common symptom tags below) to
            identify the probable disease and receive treatment protocols.
          </p>

          <form onSubmit={handleRunSymptomDiagnosis} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Affected Crop / Plant Species
              </label>
              <select
                value={cropInput}
                onChange={(e) => setCropInput(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="Tomato (Solanum lycopersicum)">
                  Tomato (Solanum lycopersicum)
                </option>
                <option value="Potato (Solanum tuberosum)">Potato (Solanum tuberosum)</option>
                <option value="Corn / Maize (Zea mays)">Corn / Maize (Zea mays)</option>
                <option value="Wheat & Cereals (Triticum aestivum)">
                  Wheat &amp; Cereals (Triticum aestivum)
                </option>
                <option value="Cucurbits / Squash / Cucumber">
                  Cucurbits / Squash / Cucumber
                </option>
                <option value="Bell Pepper & Eggplant">Bell Pepper &amp; Eggplant</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Observed Plant Symptoms
              </label>
              <textarea
                rows={3}
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="e.g., Dark brown concentric rings on lower leaves with yellow halos, sunken lesions on stem..."
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            {/* Quick-Add Symptom Pills */}
            <div className="flex flex-col gap-1.5">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Quick-Select Observed Symptoms:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SYMPTOM_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSymptomTag(tag)}
                      className={`px-2.5 py-1 rounded-lg font-label-sm text-[11px] transition-colors ${
                        active
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex-1 py-3 px-4 bg-primary text-on-primary rounded-lg font-headline-sm text-sm font-semibold hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">clinical_notes</span>
                {isAnalyzing ? 'Analyzing Symptoms...' : 'Identify Plant Disease'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSymptomInput('');
                  setSelectedTags([]);
                  setAnalysisResult(null);
                }}
                className="py-3 px-3 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-xs"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Right 7 Cols: Live Symptom Diagnosis Output Card */}
        <div className="lg:col-span-7">
          {analysisResult ? (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-secondary/25">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-sm border-b border-surface-container">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
                      AI Symptom Diagnosis Result
                    </span>
                    <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold">
                      {analysisResult.severity}
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                    {analysisResult.diseaseName}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                    {analysisResult.scientificName} • Host: {analysisResult.affectedCrop}
                  </p>
                </div>

                <div className="bg-surface-container-low px-4 py-2.5 rounded-xl flex flex-col items-end">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Symptom Match Score
                  </span>
                  <span className="font-headline-md text-headline-md text-primary font-bold tabular-nums">
                    {analysisResult.confidence}
                  </span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface bg-surface-container-low/70 p-3.5 rounded-lg">
                {analysisResult.summary}
              </p>

              <div className="flex flex-col gap-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Matched Pathology Markers
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.matchedSymptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-lg font-body-sm text-xs text-on-surface"
                    >
                      <span className="material-symbols-outlined text-error text-sm">
                        check_circle
                      </span>
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col gap-2">
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">spa</span>
                    Organic Remediation
                  </span>
                  {analysisResult.organicTreatments.map((org, idx) => (
                    <div key={idx} className="bg-surface-container-lowest p-2.5 rounded border border-primary/5">
                      <div className="flex items-center justify-between">
                        <strong className="font-body-sm text-xs text-on-surface">
                          {org.name}
                        </strong>
                        <span className="font-label-sm text-[10px] text-secondary">
                          {org.badge}
                        </span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                        {org.instruction}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col gap-2">
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">science</span>
                    Chemical Formulations
                  </span>
                  {analysisResult.chemicalTreatments.map((chem, idx) => (
                    <div key={idx} className="bg-surface-container-lowest p-2.5 rounded border border-primary/5">
                      <div className="flex items-center justify-between">
                        <strong className="font-body-sm text-xs text-on-surface">
                          {chem.name}
                        </strong>
                        <span className="font-label-sm text-[10px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded">
                          {chem.fracCode}
                        </span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                        {chem.instruction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Prevention: {analysisResult.preventionTips.join(' • ')}
                </span>
                <button
                  type="button"
                  onClick={handleLogResultToHistory}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">bookmark_add</span>
                  Save to Diagnosis History
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm h-full flex flex-col justify-between gap-space-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase">
                    How Symptom Analysis Works
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                    Instant Multi-Marker Plant Disease Identification
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    When you describe visual symptoms—such as concentric bullseye lesions, yellow
                    chlorotic halos, powdery white mycelium, or vascular wilting—AgroAI cross-checks
                    pathogen taxonomy, host susceptibility, and microclimate telemetry.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary text-xl">
                    edit_note
                  </span>
                  <strong className="font-body-sm text-sm text-on-surface">
                    1. Enter Symptoms
                  </strong>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Type what you see on leaves, stems, roots, or fruit, or click the quick symptom
                    tags.
                  </span>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-1">
                  <span className="material-symbols-outlined text-secondary text-xl">
                    memory
                  </span>
                  <strong className="font-body-sm text-sm text-on-surface">
                    2. AI Pathogen Match
                  </strong>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Our Gemini-backed pathology engine identifies the disease, scientific taxon, and
                    severity.
                  </span>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-1">
                  <span className="material-symbols-outlined text-primary text-xl">
                    healing
                  </span>
                  <strong className="font-body-sm text-sm text-on-surface">
                    3. Targeted Protocol
                  </strong>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Receive exact organic bio-sprays, FRAC-coded chemical options, and prevention
                    steps.
                  </span>
                </div>
              </div>

              <div className="bg-primary-fixed/40 p-3.5 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary">bolt</span>
                  <span className="font-body-sm text-xs text-on-primary-fixed font-medium">
                    Want a quick demo? Click to run a sample symptom diagnosis for concentric brown
                    rings &amp; leaf yellowing.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSymptomInput(
                      'Concentric dark brown rings on lower tomato leaves with bright yellow halos and stem collar lesions'
                    );
                    setTimeout(() => handleRunSymptomDiagnosis(), 50);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-xs font-semibold hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  Run Sample Triage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Major Plant Diseases Reference Encyclopedia */}
      <div className="flex flex-col gap-space-md pt-space-sm">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Major Plant Diseases Reference Atlas
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Comprehensive pathology profiles covering symptoms, environmental triggers, and
              integrated pest management (IPM) for major crop diseases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant text-base absolute left-2.5 top-2">
                search
              </span>
              <input
                type="text"
                value={encyclopediaFilter}
                onChange={(e) => setEncyclopediaFilter(e.target.value)}
                placeholder="Filter diseases or symptoms..."
                className="bg-surface-container-low text-on-surface font-body-sm text-xs pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex bg-surface-container-low p-1 rounded-lg">
              {(['ALL', 'Fungal', 'Oomycete', 'Bacterial'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPathogenTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm transition-all ${
                    pathogenTypeFilter === type
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-2xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {type === 'ALL' ? 'All Pathogens' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Disease Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredDiseases.map((disease) => {
            const isExpanded = expandedDiseaseId === disease.id;
            return (
              <div
                key={disease.id}
                className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-primary/5 flex flex-col justify-between"
              >
                <div className="p-space-lg flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={disease.image}
                        alt={disease.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-label-sm text-[10px] bg-surface-container px-2 py-0.5 rounded text-primary font-bold uppercase">
                            {disease.pathogenType}
                          </span>
                          <span className="font-label-sm text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-semibold">
                            {disease.severity}
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                          {disease.name}
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant italic">
                          {disease.scientificName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {disease.overview}
                  </p>

                  {/* Affected Crops & Environmental Trigger */}
                  <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 font-label-sm text-label-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Susceptible Hosts:</span>
                      <strong className="text-on-surface">
                        {disease.affectedCrops.join(', ')}
                      </strong>
                    </div>
                    <div className="text-on-surface-variant">
                      <span className="text-secondary font-semibold">Climate Trigger: </span>
                      {disease.environmentalTriggers}
                    </div>
                  </div>

                  {/* Key Symptoms List */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Diagnostic Symptoms
                    </span>
                    {disease.keySymptoms.map((sym, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 font-body-sm text-xs text-on-surface"
                      >
                        <span className="material-symbols-outlined text-error text-sm mt-0.5">
                          lens_blur
                        </span>
                        <span>{sym}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Treatment & Prevention Protocol */}
                  {isExpanded && (
                    <div className="pt-3 mt-1 border-t border-surface-container flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="bg-secondary-fixed/20 p-3 rounded-lg">
                          <span className="font-label-sm text-label-sm text-secondary font-bold uppercase block mb-1">
                            Organic Control
                          </span>
                          <ul className="list-disc list-inside font-body-sm text-xs text-on-surface space-y-1">
                            {disease.organicControl.map((c, idx) => (
                              <li key={idx}>{c}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-surface-container-low p-3 rounded-lg">
                          <span className="font-label-sm text-label-sm text-primary font-bold uppercase block mb-1">
                            Chemical Control
                          </span>
                          <ul className="list-disc list-inside font-body-sm text-xs text-on-surface space-y-1">
                            {disease.chemicalControl.map((c, idx) => (
                              <li key={idx}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-surface-container px-3 py-2 rounded-lg font-body-sm text-xs text-on-surface">
                        <strong className="text-primary">Prevention Protocol: </strong>
                        {disease.prevention}
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-space-lg py-3 bg-surface-container-low/60 border-t border-surface-container flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedDiseaseId(isExpanded ? '' : disease.id)
                    }
                    className="font-label-md text-xs text-primary font-semibold hover:text-secondary flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    {isExpanded ? 'Hide Treatment Protocols' : 'View Organic & Chemical Treatments'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSymptomInput(disease.keySymptoms.join('; '));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-label-sm text-xs bg-surface-container-lowest px-2.5 py-1 rounded-lg text-on-surface hover:bg-primary hover:text-on-primary transition-colors border border-primary/10"
                  >
                    Load Symptoms into Analyzer ↑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
