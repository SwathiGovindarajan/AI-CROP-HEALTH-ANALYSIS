import React, { useState } from 'react';
import { AGRO_TIPS_DATA, AgroTipItem, PageId } from '../data/agroData';

interface AgroTipsPageProps {
  onNavigate: (page: PageId, searchPreset?: string) => void;
  onShowToast: (msg: string) => void;
}

const CATEGORIES = [
  'ALL',
  'Irrigation & Soil',
  'Spray & Pruning',
  'Crop Nutrition',
  'Disease Prevention',
  'Seasonal Maintenance',
] as const;

export const AgroTipsPage: React.FC<AgroTipsPageProps> = ({ onNavigate, onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [bookmarkedTipIds, setBookmarkedTipIds] = useState<string[]>(['tip-irrigation']);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [calcAcres, setCalcAcres] = useState<number>(40);
  const [calcCrop, setCalcCrop] = useState<'tomato' | 'corn' | 'potato'>('tomato');

  const filteredTips: AgroTipItem[] = AGRO_TIPS_DATA.filter(
    (t) => selectedCategory === 'ALL' || t.category === selectedCategory
  );

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedTipIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      onShowToast(
        exists
          ? `Removed "${title}" from saved farm guides.`
          : `Saved "${title}" to your field maintenance playbook.`
      );
      return next;
    });
  };

  const toggleStepCheck = (stepKey: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  // Interactive Irrigation & Nutrient Calculator values
  const dailyGallonsPerAcre =
    calcCrop === 'corn' ? 7600 : calcCrop === 'tomato' ? 5800 : 5100;
  const totalDailyGallons = (calcAcres * dailyGallonsPerAcre).toLocaleString();
  const weeklyBioSprayQuarts = Math.round(calcAcres * 2.5);

  return (
    <div className="w-full px-4 sm:px-margin py-space-lg flex flex-col gap-space-lg">
      {/* Page Header */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">eco</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Practical Field Stewardship &amp; Plant Maintenance Playbook
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
            Agro Tips
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-1">
            Simple, actionable agricultural tips for healthy plants—covering precision irrigation,
            canopy pruning, soil nutrition, spray timing, and disease prevention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-surface-container-low px-3.5 py-2 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-base">bookmark</span>
            <span className="font-label-md text-xs text-on-surface">
              Saved Guides: <strong className="text-primary">{bookmarkedTipIds.length}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('plant-health-analysis')}
            className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">biotech</span>
            Plant Health Analysis
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center gap-1.5 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-lg font-label-md text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            {cat === 'ALL' ? 'All Agro Tips (6)' : cat}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filteredTips.map((tip) => {
          const isBookmarked = bookmarkedTipIds.includes(tip.id);
          return (
            <div
              key={tip.id}
              className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md border border-primary/5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                      <span className="material-symbols-outlined text-xl">{tip.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[10px] text-secondary uppercase font-bold">
                        {tip.category}
                      </span>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">
                        {tip.cropFocus} • {tip.readTime}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(tip.id, tip.title)}
                    aria-label="Bookmark tip"
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isBookmarked ? 'bookmark_added' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug">
                  {tip.title}
                </h2>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {tip.summary}
                </p>

                {/* Interactive Maintenance Checklist */}
                <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Step-by-Step Field Checklist:
                  </span>
                  {tip.actionChecklist.map((step, idx) => {
                    const stepKey = `${tip.id}-${idx}`;
                    const done = !!checkedSteps[stepKey];
                    return (
                      <label
                        key={stepKey}
                        className="flex items-start gap-2.5 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleStepCheck(stepKey)}
                          className="mt-1 w-4 h-4 accent-secondary rounded cursor-pointer"
                        />
                        <span
                          className={`font-body-sm text-xs leading-relaxed transition-colors ${
                            done
                              ? 'line-through text-on-surface-variant/60'
                              : 'text-on-surface group-hover:text-primary'
                          }`}
                        >
                          {step}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <span className="font-label-sm text-[11px] text-on-surface-variant">
                  {tip.proMetric}
                </span>
                <span className="font-label-sm text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-semibold">
                  {tip.impactMetric}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Parcel Care & Watering Calculator */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        <div className="lg:col-span-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">calculate</span>
            <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
              Interactive Field Maintenance Tool
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Daily Drip Irrigation &amp; Bio-Fungicide Estimator
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Calculate recommended daily sub-surface drip water volume and preventive bio-spray
            quantities based on your active parcel acreage and crop stage.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-space-md rounded-xl">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Select Crop Type
              </label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value as 'tomato' | 'corn' | 'potato')}
                className="bg-surface-container-lowest text-on-surface font-body-sm text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="tomato">Tomato (Early Fruiting)</option>
                <option value="corn">Corn / Maize (Peak Vegetative / Silking)</option>
                <option value="potato">Potato (Tuber Bulking)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant uppercase">Parcel Area (Acres)</span>
                <strong className="text-primary tabular-nums">{calcAcres} Acres</strong>
              </div>
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={calcAcres}
                onChange={(e) => setCalcAcres(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col justify-between gap-2">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Recommended Daily Drip Volume
              </span>
              <div className="font-headline-md text-headline-md text-primary font-bold tabular-nums mt-0.5">
                {totalDailyGallons} gal/day
              </div>
            </div>
            <div className="pt-2 border-t border-surface-container flex items-center justify-between font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Serenade ASO Bio-Shield:</span>
              <strong className="text-secondary tabular-nums">{weeklyBioSprayQuarts} qt / week</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
