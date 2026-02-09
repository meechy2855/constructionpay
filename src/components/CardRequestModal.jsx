import { useState } from 'react';
import {
  Check, Clock, AlertTriangle, CreditCard, HardHat,
  Shield, Calendar, DollarSign, Flag, MessageSquare,
  User, Ban, Upload,
} from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtShort(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

/* ─── Shared atoms ─── */
function FieldRow({ label, value, icon: Icon }) {
  return (
    <div className="bg-stone-50 rounded-lg px-4 py-3 mb-2">
      <div className="text-xs text-stone-500 mb-0.5">{label}</div>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-stone-500" />}
        <span className="text-sm text-stone-800">{value}</span>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="mt-6 mb-3">
      <h3 className="text-lg font-semibold text-stone-900 tracking-tight">{children}</h3>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-stone-200 my-5" />;
}

/* ═══════ TAB: Overview ═══════ */
function OverviewTab({ req }) {
  return (
    <div>
      {/* Requester */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-sm font-semibold text-white">
          {initials(req.requester)}
        </div>
        <div>
          <div className="text-lg font-semibold text-stone-900">{req.requester}</div>
          <div className="text-xs text-stone-500">{req.role}</div>
        </div>
      </div>

      <Divider />

      <SectionTitle>Request Details</SectionTitle>
      <FieldRow label="Project" value={req.project} icon={HardHat} />
      <FieldRow label="Card Type" value={req.cardType} icon={CreditCard} />
      <FieldRow label="Spend Limit" value={fmt(req.limit)} icon={DollarSign} />
      <FieldRow label="Spend Categories" value={req.spendCategories} />
      <FieldRow label="Request Date" value={fmtDate(req.date)} icon={Calendar} />

      <Divider />

      <SectionTitle>Reason</SectionTitle>
      <div className="bg-stone-50 rounded-lg px-4 py-3 text-sm text-stone-800 border border-stone-200">
        {req.reason}
      </div>

      <Divider />

      <SectionTitle>Spend Controls</SectionTitle>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200">
          <Shield size={14} className="text-stone-500" />
          <span className="text-sm text-stone-700">Monthly limit</span>
          <span className="ml-auto text-xs font-medium text-stone-800">{fmt(req.limit)}</span>
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200">
          <CreditCard size={14} className="text-stone-500" />
          <span className="text-sm text-stone-700">Card type</span>
          <span className="ml-auto text-xs font-medium text-stone-800">{req.cardType}</span>
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200">
          <Flag size={14} className="text-stone-500" />
          <span className="text-sm text-stone-700">Restricted categories</span>
          <span className="ml-auto text-xs font-medium text-stone-800">{req.spendCategories}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════ TAB: Approvals ═══════ */
function ApprovalsTab({ req }) {
  const approvers = [
    { id: 1, name: 'Megan Lewis', role: 'Project Manager', group: 'Project Managers', status: 'Pending', timestamp: null },
  ];

  return (
    <div>
      <SectionTitle>Approval Flow</SectionTitle>

      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border bg-amber-50 border-amber-200 mb-4">
        <Clock size={14} className="text-amber-600" />
        <span className="text-xs font-medium text-amber-700">Approval in progress — waiting on Project Manager</span>
      </div>

      <div className="border border-stone-200 rounded-xl p-4">
        {approvers.map((a, i) => (
          <div key={a.id} className="flex items-start gap-3 py-2.5">
            <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              a.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
              a.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
              'bg-stone-100 text-stone-500'
            }`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-semibold">
                  {initials(a.name)}
                </div>
                <div>
                  <div className="text-sm font-medium text-stone-900">{a.name}</div>
                  <div className="text-[11px] text-stone-500">{a.role} · {a.group}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-1 ml-9">
                <Clock size={12} className="text-amber-600" />
                <span className="text-xs font-medium text-amber-600">{a.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-stone-500 flex items-start gap-1.5 mt-3">
        <Shield size={11} className="shrink-0 mt-0.5" />
        Card requests require project manager approval before issuance.
      </div>
    </div>
  );
}

/* ═══════ TAB: Activity ═══════ */
function ActivityTab({ req }) {
  const activities = [
    { time: `${fmtShort(req.date)} · 9:00 AM`, who: req.requester, action: 'Card request submitted', icon: CreditCard },
    { time: `${fmtShort(req.date)} · 9:01 AM`, who: 'System', action: 'Auto-routed to Project Manager for approval', icon: Clock },
    { time: `${fmtShort(req.date)} · 9:02 AM`, who: 'System', action: `Spend limit set: ${fmt(req.limit)}`, icon: Shield },
  ];

  return (
    <div>
      <SectionTitle>Activity Log</SectionTitle>
      <div className="relative">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
              {i < activities.length - 1 && (
                <div className="absolute left-[15px] top-9 bottom-0 w-px bg-stone-200" />
              )}
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 z-10">
                <Icon size={14} className="text-stone-500" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="text-sm text-stone-900">{a.action}</div>
                <div className="text-xs text-stone-500">{a.who} · {a.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════ MAIN: CardRequestModal ═══════ */
const TABS = ['Overview', 'Approvals', 'Activity'];

export default function CardRequestModal({ open, onClose, onAction, request }) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!request) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Card Request — ${request.requester}`}
      subtitle={
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <StatusBadge status={request.status} />
          <span>·</span>
          <span>{request.cardType} card</span>
          <span>·</span>
          <span>{fmt(request.limit)} limit</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onAction?.('approve', `Approved card request — ${request.requester} (${request.cardType}, ${fmt(request.limit)})`)}
            className="flex items-center gap-2 text-sm bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 font-medium"
          >
            <Check size={14} /> Approve
          </button>
          <button
            onClick={() => onAction?.('deny', `Denied card request — ${request.requester}`)}
            className="flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-lg px-5 py-2.5 hover:bg-red-50 font-medium"
          >
            <Ban size={14} /> Deny
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="border-b border-stone-200 -mx-6 px-6 -mt-5 mb-5">
        <nav className="flex gap-0 -mb-px">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-2.5 mr-5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Overview' && <OverviewTab req={request} />}
      {activeTab === 'Approvals' && <ApprovalsTab req={request} />}
      {activeTab === 'Activity' && <ActivityTab req={request} />}
    </Modal>
  );
}
