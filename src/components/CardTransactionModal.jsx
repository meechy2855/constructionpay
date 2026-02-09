import { useState } from 'react';
import {
  Check, Clock, AlertTriangle, CreditCard, HardHat,
  Receipt, Flag, MessageSquare, Calendar, DollarSign,
  Lock, ArrowUpRight, Upload, MapPin, Shield, ShieldAlert,
} from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { projects } from '../data/mockData';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtShort(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ─── Shared atoms ─── */
function FieldRow({ label, value, verified, icon: Icon }) {
  return (
    <div className="bg-stone-50 rounded-lg px-4 py-3 mb-2">
      <div className="text-xs text-stone-500 mb-0.5">{label}</div>
      <div className="flex items-center gap-1.5">
        {verified && <Check size={14} className="text-emerald-500" />}
        {Icon && <Icon size={14} className="text-stone-500" />}
        <span className="text-sm text-stone-800">{value}</span>
      </div>
    </div>
  );
}

function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <h3 className="text-lg font-semibold text-stone-900 tracking-tight">{children}</h3>
      {right}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-stone-200 my-5" />;
}

/* ═══════ TAB: Overview ═══════ */
function OverviewTab({ tx, cardholder }) {
  const [memo, setMemo] = useState(tx.memo || '');

  return (
    <div>
      {/* Warning banners */}
      {!tx.receipt && (
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-xs text-orange-800 mb-4">
          <Receipt size={14} className="shrink-0 mt-0.5" /> Missing receipt — upload or forward to receipts@ramp.com
        </div>
      )}
      {tx.policyInfo && (
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-800 mb-4">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" /> Policy: {tx.policyInfo}
        </div>
      )}

      {/* Field owner */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
          {cardholder.split(' ').map(w => w[0]).join('')}
        </div>
        <div>
          <div className="text-lg font-semibold text-stone-900">{cardholder}</div>
          <div className="text-xs text-stone-500">Field Owner</div>
        </div>
      </div>

      {/* Amount */}
      <div className="text-3xl font-semibold text-stone-900 tracking-tight mb-1">{fmt(tx.amount)} USD</div>
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
        <StatusBadge status={tx.status} />
        <span>·</span>
        <span>{fmtDate(tx.date)}</span>
      </div>

      <Divider />

      {/* Transaction details */}
      <SectionTitle>Transaction Details</SectionTitle>
      <FieldRow label="Merchant" value={tx.merchant} icon={CreditCard} />
      <FieldRow label="Trade / Spend Type" value={tx.category} verified />
      <FieldRow label="Date" value={fmtDate(tx.date)} icon={Calendar} />
      <FieldRow label="Amount" value={fmt(tx.amount)} />
      <FieldRow label="Receipt" value={tx.receipt ? 'Attached' : 'Missing'} verified={tx.receipt} />

      <Divider />

      {/* Memo */}
      <SectionTitle>Job Note</SectionTitle>
      <textarea
        value={memo}
        onChange={e => setMemo(e.target.value)}
        placeholder="Add job note — e.g., concrete pour for Bldg C foundation..."
        rows={3}
        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
      />

      <Divider />

      {/* Receipt section */}
      <SectionTitle>Receipts</SectionTitle>
      {!tx.receipt ? (
        <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 transition-colors bg-amber-50/30">
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <Upload size={16} className="text-stone-500" />
            Upload receipt
          </div>
          <div className="text-xs text-stone-400 mt-1">or forward to receipts@ramp.com</div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Receipt size={16} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-emerald-800">receipt_{tx.id}.jpg</div>
            <div className="text-xs text-emerald-600">Uploaded {fmtShort(tx.date)}</div>
          </div>
          <button className="text-xs text-emerald-700 underline">View</button>
        </div>
      )}
    </div>
  );
}

/* ═══════ TAB: Job Context ═══════ */
function JobContextTab({ tx }) {
  // Try to find project from category/merchant
  const proj = projects.find(p => p.name.toLowerCase().includes('oakwood')) || projects[0];
  const pctUsed = proj ? (proj.spent / proj.budget) * 100 : 0;
  const budgetRemaining = proj ? proj.budget - proj.spent : 0;
  const isWeekend = [0, 6].includes(new Date(tx.date).getDay());

  return (
    <div>
      <SectionTitle>Project Assignment</SectionTitle>
      <FieldRow label="Project" value={proj?.name || 'Unassigned'} verified={!!proj} />
      <FieldRow label="Cost Code" value="01-000 · General Requirements" verified />
      <FieldRow label="Trade / Spend Type" value={tx.category} verified />

      {proj && (
        <div className="bg-stone-50 rounded-lg px-4 py-3 mt-2 border border-stone-200">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs text-stone-500">Project budget</div>
            <div className="text-xs text-stone-500">{pctUsed.toFixed(0)}% used</div>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all ${pctUsed > 90 ? 'bg-red-500' : pctUsed > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(pctUsed, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-stone-600">{fmt(proj.spent)} spent</span>
            <span className={`font-medium ${budgetRemaining < 0 ? 'text-red-600' : 'text-stone-800'}`}>
              {fmt(budgetRemaining)} remaining
            </span>
          </div>
        </div>
      )}

      <Divider />

      <SectionTitle>Contextual Flags</SectionTitle>
      <div className="space-y-2.5">
        <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
          isWeekend ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <Calendar size={16} className={isWeekend ? 'text-amber-600' : 'text-stone-500'} />
            <div>
              <div className="text-sm font-medium text-stone-800">Weekend expense</div>
              <div className="text-xs text-stone-500">
                {isWeekend ? 'This expense was incurred on a weekend' : 'Weekday expense — no flag'}
              </div>
            </div>
          </div>
          {isWeekend && (
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Flagged</span>
          )}
        </div>

        {tx.amount > 500 && (
          <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2.5">
              <DollarSign size={16} className="text-amber-600" />
              <div>
                <div className="text-sm font-medium text-stone-800">High-value transaction</div>
                <div className="text-xs text-stone-500">Amount exceeds $500 — may require additional review</div>
              </div>
            </div>
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Flagged</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════ TAB: Accounting ═══════ */
function AccountingTab({ tx }) {
  const isExportReady = tx.receipt && tx.status !== 'Needs review';

  return (
    <div>
      <SectionTitle right={
        <button className="flex items-center gap-1.5 text-sm text-stone-600 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-50">
          <ArrowUpRight size={14} /> Split
        </button>
      }>
        Accounting
      </SectionTitle>

      <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border mb-4 ${
        isExportReady ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
      }`}>
        {isExportReady
          ? <><Check size={14} className="text-emerald-600" /><span className="text-xs font-medium text-emerald-700">Ready to export</span></>
          : <><AlertTriangle size={14} className="text-amber-600" /><span className="text-xs font-medium text-amber-700">Not ready — {!tx.receipt ? 'missing receipt' : 'needs review'}</span></>
        }
      </div>

      <FieldRow label="Trade / Spend Type" value={tx.category} verified />
      <FieldRow label="Accounting Category" value={tx.category} verified />
      <FieldRow label="Merchant" value={tx.merchant} verified />
      <FieldRow label="Accounting Date" value={fmtDate(tx.date)} verified />

      <Divider />

      <SectionTitle>Enforcement</SectionTitle>
      <div className="space-y-2">
        {[
          { label: 'Receipt', ok: tx.receipt, okText: 'Attached', failText: 'Missing' },
          { label: 'Project assignment', ok: true, okText: 'Complete', failText: 'Missing' },
          { label: 'Cost code', ok: true, okText: 'Complete', failText: 'Missing' },
          { label: 'Review status', ok: tx.status === 'Ready to approve', okText: 'Reviewed', failText: tx.status },
        ].map((rule, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200">
            {rule.ok ? <Check size={14} className="text-emerald-600" /> : <AlertTriangle size={14} className="text-amber-600" />}
            <span className="text-sm text-stone-700">{rule.label}</span>
            <span className={`ml-auto text-xs font-medium ${rule.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
              {rule.ok ? rule.okText : rule.failText}
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs text-stone-500 flex items-start gap-1.5 mt-4">
        <Lock size={11} className="shrink-0 mt-0.5" />
        Receipt + review required before export. Cost code required by policy.
      </div>
    </div>
  );
}

/* ═══════ TAB: Activity ═══════ */
function ActivityTab({ tx, cardholder }) {
  const activities = [
    { time: `${fmtShort(tx.date)} · 2:30 PM`, who: cardholder, action: `Card transaction at ${tx.merchant}`, icon: CreditCard },
    ...(tx.receipt ? [{ time: `${fmtShort(tx.date)} · 3:15 PM`, who: cardholder, action: 'Receipt uploaded', icon: Upload }] : []),
    ...(tx.memo ? [{ time: `${fmtShort(tx.date)} · 3:16 PM`, who: cardholder, action: `Job note: "${tx.memo}"`, icon: MessageSquare }] : []),
    { time: `${fmtShort(tx.date)} · 3:17 PM`, who: 'System', action: 'Auto-categorized transaction', icon: HardHat },
    { time: `${fmtShort(tx.date)} · 3:18 PM`, who: 'System', action: 'Sent for manager review', icon: Clock },
    ...(!tx.receipt ? [{ time: `${fmtShort(tx.date)} · 5:00 PM`, who: 'System', action: 'Missing receipt — reminder sent', icon: Flag }] : []),
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

/* ═══════ MAIN: CardTransactionModal ═══════ */
const TABS = ['Overview', 'Job Context', 'Accounting', 'Activity'];

export default function CardTransactionModal({ open, onClose, onAction, transaction, cardholder }) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!transaction) return null;

  const tx = transaction;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tx.merchant}
      subtitle={
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <StatusBadge status={tx.status} />
          <span>·</span>
          <span>{fmt(tx.amount)}</span>
          <span>·</span>
          <span>{cardholder}</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-center gap-3">
          {tx.status === 'Ready to approve' && (
            <>
              <button
                onClick={() => onAction?.('approve', `Approved transaction — ${tx.merchant} (${fmt(tx.amount)})`)}
                className="flex items-center gap-2 text-sm bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 font-medium"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => onAction?.('flag', `Flagged transaction — ${tx.merchant}`)}
                className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-5 py-2.5 hover:bg-stone-50 font-medium"
              >
                <Flag size={14} /> Flag
              </button>
              <button
                onClick={() => onAction?.('reject', `Disputed transaction — ${tx.merchant} (${fmt(tx.amount)})`)}
                className="flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-lg px-5 py-2.5 hover:bg-red-50 font-medium"
              >
                <ShieldAlert size={14} /> Dispute
              </button>
            </>
          )}
          {tx.status === 'Needs review' && (
            <>
              <button
                onClick={() => onAction?.('flag', `Requested info for ${tx.merchant}`)}
                className="flex items-center gap-2 text-sm bg-amber-600 text-white rounded-lg px-5 py-2.5 hover:bg-amber-700 font-medium"
              >
                <Receipt size={14} /> Request info
              </button>
              <button
                onClick={() => onAction?.('approve', `Approved transaction — ${tx.merchant} (${fmt(tx.amount)})`)}
                className="flex items-center gap-2 text-sm bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 font-medium"
              >
                <Check size={14} /> Approve anyway
              </button>
              <button
                onClick={() => onAction?.('reject', `Disputed transaction — ${tx.merchant} (${fmt(tx.amount)})`)}
                className="flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-lg px-5 py-2.5 hover:bg-red-50 font-medium"
              >
                <ShieldAlert size={14} /> Dispute
              </button>
            </>
          )}
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

      {activeTab === 'Overview' && <OverviewTab tx={tx} cardholder={cardholder} />}
      {activeTab === 'Job Context' && <JobContextTab tx={tx} />}
      {activeTab === 'Accounting' && <AccountingTab tx={tx} />}
      {activeTab === 'Activity' && <ActivityTab tx={tx} cardholder={cardholder} />}
    </Modal>
  );
}
