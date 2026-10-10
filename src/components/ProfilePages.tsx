import React, { useState } from 'react';
import {
  DiagnosisRecord,
  PageId,
  USER_ACCOUNTS,
  UserAccount,
  UserRole,
} from '../data/agroData';

interface ProfilePagesProps {
  currentUser: UserAccount;
  targetProfileView: 'user-profile' | 'admin-profile';
  onSwitchRole: (role: UserRole) => void;
  onNavigate: (page: PageId) => void;
  records: DiagnosisRecord[];
  onShowToast: (msg: string) => void;
}

export const ProfilePages: React.FC<ProfilePagesProps> = ({
  currentUser,
  targetProfileView,
  onSwitchRole,
  onNavigate,
  records,
  onShowToast,
}) => {
  // User Profile settings state
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [sprayWindowPush, setSprayWindowPush] = useState(true);
  const [autoSyncOffline, setAutoSyncOffline] = useState(true);

  // Admin Console state
  const [threatLevel, setThreatLevel] = useState<'High Risk' | 'Moderate Risk' | 'Elevated Watch'>(
    'High Risk'
  );
  const [threatAdvisoryTitle, setThreatAdvisoryTitle] = useState('Alternaria solani Alert');
  const [confidenceThreshold, setConfidenceThreshold] = useState(92);

  // Role-Based Access Guard:
  // Requirement 4:
  // - The User Profile should be accessible to users who log in with a normal user account.
  // - The Admin Profile should be accessible only to users who log in with an administrator account.
  // - Ensure that profile access and visibility depend on the user's login role.
  if (targetProfileView === 'admin-profile' && currentUser.role !== 'admin') {
    return (
      <div className="w-full px-4 sm:px-margin py-space-xl flex items-center justify-center">
        <div className="max-w-xl w-full bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-error/25 text-center flex flex-col items-center gap-space-md">
          <div className="w-14 h-14 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">gpp_maybe</span>
          </div>
          <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-3 py-1 rounded-full uppercase font-bold">
            Role-Based Access Control • Administrator Only
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Administrator Account Required
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            You are currently logged in as a <strong>Normal User ({currentUser.name})</strong>. The{' '}
            <strong>Admin Profile</strong> is restricted exclusively to users authenticated with an
            Administrator account.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('user-profile')}
              className="px-4 py-2.5 rounded-lg bg-surface-container-low text-primary font-label-md text-xs font-semibold hover:bg-surface-container"
            >
              Go to My User Profile
            </button>
            <button
              type="button"
              onClick={() => {
                onSwitchRole('admin');
                onShowToast('Switched login session to Administrator Account (Dr. Marcus Sterling).');
              }}
              className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-secondary shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Switch to Administrator Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (targetProfileView === 'user-profile' && currentUser.role !== 'user') {
    return (
      <div className="w-full px-4 sm:px-margin py-space-xl flex items-center justify-center">
        <div className="max-w-xl w-full bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-primary/20 text-center flex flex-col items-center gap-space-md">
          <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">switch_account</span>
          </div>
          <span className="font-label-sm text-label-sm bg-surface-container text-primary px-3 py-1 rounded-full uppercase font-bold">
            Role-Based Profile Routing
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Normal User Profile Interface
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            You are currently logged in with an <strong>Administrator Account ({currentUser.name})</strong>.
            To view the normal User Profile interface, switch to the Normal User account or open
            your Admin Profile console.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('admin-profile')}
              className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-secondary"
            >
              Open Admin Profile Console
            </button>
            <button
              type="button"
              onClick={() => {
                onSwitchRole('user');
                onShowToast('Switched login session to Normal User Account (Elena Vance).');
              }}
              className="px-4 py-2.5 rounded-lg bg-surface-container-low text-primary font-label-md text-xs font-semibold hover:bg-surface-container flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">person</span>
              Switch to Normal User Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Normal User Profile (accessible when logged in as normal user)
  if (targetProfileView === 'user-profile') {
    const userAccount = USER_ACCOUNTS.user;
    return (
      <div className="w-full px-4 sm:px-margin py-space-lg flex flex-col gap-space-lg">
        {/* Top User Identity Banner */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-4">
            <img
              src={userAccount.avatar}
              alt={userAccount.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-secondary/30 flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-label-sm text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Normal User Account • Verified Agronomist
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  ID: {userAccount.id}
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                {userAccount.name}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {userAccount.title} at <strong>{userAccount.organization}</strong> •{' '}
                {userAccount.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSwitchRole('admin');
                onNavigate('admin-profile');
                onShowToast('Switched to Administrator Account to view Admin Profile.');
              }}
              className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-xs font-semibold hover:bg-surface-container transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Switch to Admin Login
            </button>
            <button
              type="button"
              onClick={() => onNavigate('diagnosis-history')}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">history</span>
              View My Diagnosis History ({records.length})
            </button>
          </div>
        </div>

        {/* User Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Assigned Parcels & Telemetry Summary (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">grass</span>
                  Assigned Farm Parcels &amp; Sensor Quotas
                </h2>
                <span className="font-label-sm text-label-sm text-secondary">
                  3 Active Sectors • 340 Acres
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {userAccount.assignedParcels.map((parcel, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <div>
                        <strong className="font-body-sm text-sm text-on-surface block">
                          {parcel}
                        </strong>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Soil Moisture: 28.4% • Health Index: {88 - idx * 2}% • Telemetry Online
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('scan-crop')}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-xs font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      Scan Parcel
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-3">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                Agronomist Credentials &amp; Field Activity
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">
                    CCA License ID
                  </span>
                  <strong className="font-label-md text-sm text-on-surface">
                    {userAccount.certificationId}
                  </strong>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">
                    Last Field Sync
                  </span>
                  <strong className="font-label-md text-sm text-on-surface">
                    {userAccount.lastLogin}
                  </strong>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">
                    Scans Logged
                  </span>
                  <strong className="font-label-md text-sm text-secondary">
                    {records.length} Pathology Reports
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: User Notification & Field Preferences */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md">
            <div className="flex flex-col gap-4">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  notifications_active
                </span>
                Personal Field Alert Preferences
              </h2>

              <label className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl cursor-pointer">
                <div className="pr-3">
                  <strong className="font-body-sm text-sm text-on-surface block">
                    Pathology Outbreak SMS Alerts
                  </strong>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Receive instant SMS when Alternaria or Late Blight is detected within 15km.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlertsEnabled}
                  onChange={() => setSmsAlertsEnabled(!smsAlertsEnabled)}
                  className="w-5 h-5 accent-secondary rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl cursor-pointer">
                <div className="pr-3">
                  <strong className="font-body-sm text-sm text-on-surface block">
                    Optimal Spray Window Reminders
                  </strong>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Notify when Delta-T (2–8°C) and wind (&lt;12 km/h) align on assigned parcels.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={sprayWindowPush}
                  onChange={() => setSprayWindowPush(!sprayWindowPush)}
                  className="w-5 h-5 accent-secondary rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl cursor-pointer">
                <div className="pr-3">
                  <strong className="font-body-sm text-sm text-on-surface block">
                    Offline Field Telemetry Queueing
                  </strong>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Cache leaf captures locally in dead-zones and auto-sync upon reconnect.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoSyncOffline}
                  onChange={() => setAutoSyncOffline(!autoSyncOffline)}
                  className="w-5 h-5 accent-secondary rounded"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() =>
                onShowToast('User profile preferences saved to Oakridge Smart Farm account.')
              }
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-secondary transition-colors"
            >
              Save User Profile Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Administrator Profile Console (accessible only when logged in as admin)
  const adminAccount = USER_ACCOUNTS.admin;
  return (
    <div className="w-full px-4 sm:px-margin py-space-lg flex flex-col gap-space-lg">
      {/* Top Admin Identity Banner */}
      <div className="bg-primary text-on-primary p-space-lg rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-4">
          <img
            src={adminAccount.avatar}
            alt={adminAccount.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-secondary-fixed/60 flex-shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label-sm text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full font-bold uppercase">
                Administrator Account • Root Privileges
              </span>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                Clearance: {adminAccount.certificationId}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-primary tracking-tight mt-1">
              {adminAccount.name} — Admin Profile
            </h1>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              {adminAccount.title} • {adminAccount.organization} ({adminAccount.email})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onSwitchRole('user');
              onNavigate('user-profile');
              onShowToast('Switched to Normal User Account (Elena Vance).');
            }}
            className="px-3.5 py-2 rounded-lg bg-white/10 text-on-primary font-label-md text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">person</span>
            Switch to Normal User View
          </button>
        </div>
      </div>

      {/* Admin System KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Regional Monitored Acreage
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary tabular-nums">
              4,820
            </span>
            <span className="font-label-sm text-label-sm text-secondary">14 Farms Online</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Spectral Model Version
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface">v4.2</span>
            <span className="font-label-sm text-label-sm text-secondary">98.6% F1-Score</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Active Agronomist Accounts
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-primary tabular-nums">28</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">3 Admins</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <span className="font-label-sm text-label-sm text-error uppercase">
            County Biosecurity Status
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md text-error font-bold">
              {threatLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left 7 Cols: User Role & Farm Operator Directory */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">manage_accounts</span>
              Regional User &amp; Access Control Directory
            </h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              RBAC Policy Enforced
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container font-label-sm text-label-sm text-on-surface-variant uppercase">
                  <th className="py-2.5 pr-3">Operator</th>
                  <th className="py-2.5 px-3">Organization</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 pl-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60 font-body-sm text-xs">
                <tr>
                  <td className="py-3 pr-3 font-semibold text-on-surface">
                    Dr. Marcus Sterling
                    <span className="block font-label-sm text-[10px] text-on-surface-variant">
                      m.sterling@agroai.precision.org
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">AgroAI Regional Command</td>
                  <td className="py-3 px-3">
                    <span className="bg-primary text-on-primary px-2 py-0.5 rounded font-label-sm text-[10px] font-bold">
                      ADMIN
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-label-sm text-secondary">Active</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-semibold text-on-surface">
                    Elena Vance
                    <span className="block font-label-sm text-[10px] text-on-surface-variant">
                      elena.vance@oakridgeag.io
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">Oakridge Smart Farm</td>
                  <td className="py-3 px-3">
                    <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-label-sm text-[10px] font-bold">
                      USER
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-label-sm text-secondary">Active</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-semibold text-on-surface">
                    Carlos Mendoza
                    <span className="block font-label-sm text-[10px] text-on-surface-variant">
                      c.mendoza@greenvalleyfarms.com
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">Green Valley Co-op</td>
                  <td className="py-3 px-3">
                    <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-label-sm text-[10px] font-bold">
                      USER
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-label-sm text-secondary">Field Sync</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: County Threat Advisory & Neural Threshold Governance */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex flex-col gap-3">
            <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-error">campaign</span>
              County Threat Advisory &amp; Model Calibration
            </h2>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Active County Pathogen Alert Banner
              </label>
              <input
                type="text"
                value={threatAdvisoryTitle}
                onChange={(e) => setThreatAdvisoryTitle(e.target.value)}
                className="bg-surface-container-low text-on-surface font-body-sm text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                Regional Risk Classification
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['High Risk', 'Moderate Risk', 'Elevated Watch'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setThreatLevel(lvl)}
                    className={`py-2 px-2 rounded-lg font-label-sm text-xs font-semibold transition-colors ${
                      threatLevel === lvl
                        ? 'bg-error text-on-error'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 pt-2">
              <div className="flex justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant uppercase">
                  Minimum Neural Confidence Threshold
                </span>
                <strong className="text-primary tabular-nums">{confidenceThreshold}%</strong>
              </div>
              <input
                type="range"
                min={75}
                max={99}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onShowToast(
                `Broadcasted "${threatAdvisoryTitle}" (${threatLevel}) to all 14 regional farms.`
              )
            }
            className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">publish</span>
            Deploy Regional Admin Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
