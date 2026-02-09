import { useState } from 'react';
import {
  Check, Clock, AlertTriangle, Landmark, CreditCard,
  Receipt, Flag, Calendar, DollarSign, Shield,
  Lock, ArrowUpRight, FileText, Download, MessageSquare,
} from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
function fmtDate(d) {
  if (!d) return '—';
  // Handle both ISO dates and display strings
  if (d.includes(',') || d.includes('May') || d.includes('Jun')) return d;
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

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
function OverviewTab({ bill }) {
  return (
    <div>
      {/* Vendor header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${bill.color}`}>
          {bill.initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-stone-900">{bill.vendor}</span>
            {bill.statusIcon === 'bank' && <Landmark size={15} className="text-stone-400" />}
            {bill.statusIcon === 'card' && <CreditCard size={15} className="text-stone-400" />}
          </div>
          <div className="text-xs text-stone-500">{bill.owner} · {bill.ownerDate}</div>
        </div>
      </div>

      {/* Amount */}
      <div className="text-3xl font-semibold text-stone-900 tracking-tight mb-1">{fmt(bill.amount)} USD</div>
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
        <StatusBadge status={bill.status} />
      </div>

      <Divider />

      <SectionTitle>Bill Details</SectionTitle>
      <FieldRow label="Vendor" value={bill.vendor} icon={FileText} />
      <FieldRow label="Bill Owner" value={bill.owner} />
      <FieldRow label="Amount" value={fmt(bill.amount)} icon={DollarSign} />
      <FieldRow label="Payment Method" value={bill.statusIcon === 'bank' ? 'ACH / Bank Transfer' : 'Card Payment'} icon={bill.statusIcon === 'bank' ? Landmark : CreditCard} />
      <FieldRow label="Due Date" value={bill.dueDate} icon={Calendar} />

      <Divider />

      <SectionTitle>Payment Info</SectionTitle>
      <FieldRow label="Payment Date" value={bill.paymentDate} verified={bill.status === 'Paid'} />
      <FieldRow label="Arrival" value={bill.paymentArrived} verified={bill.status === 'Paid'} />

      <Divider />

      <SectionTitle>Compliance</SectionTitle>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200">
          <Shield size={14} className="text-stone-500" />
          <span className="text-sm text-stone-700">Lien waiver</span>
          <span className="ml-auto text-xs font-medium text-amber-600">Pending</span>
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200">
          <FileText size={14} className="text-stone-500" />
          <span className="text-sm text-stone-700">W-9</span>
          <span className="ml-auto text-xs font-medium text-emerald-600">On file</span>
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-stone-50 border border-stone-200">
          <Shield size={14} className="text-stone-500" />
          <span className="text-sm text-stone-700">Insurance certificate</span>
          <span className="ml-auto text-xs font-medium text-emerald-600">Current</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════ TAB: Approvals ═══════ */
function ApprovalsTab({ bill }) {
  const approvers = [
    { id: 1, name: bill.owner, role: 'Bill Owner', status: 'Approved', timestamp: bill.ownerDate },
    { id: 2, name: 'Jan Levinson', role: 'Controller', status: bill.status === 'Paid' ? 'Approved' : 'Pending', timestamp: bill.status === 'Paid' ? bill.paymentDate : null },
  ];

  return (
    <div>
      <SectionTitle>Approval Flow</SectionTitle>

      <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border mb-4 ${
        bill.status === 'Paid' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
      }`}>
        {bill.status === 'Paid'
          ? <><Check size={14} className="text-emerald-600" /><span className="text-xs font-medium text-emerald-700">All approvals complete</span></>
          : <><Clock size={14} className="text-amber-600" /><span className="text-xs font-medium text-amber-700">Approval in progress</span></>
        }
      </div>

      <div className="border border-stone-200 rounded-xl p-4">
        {approvers.map((a, i) => (
          <div key={a.id} className="relative">
            {i < approvers.length - 1 && (
              <div className="absolute left-[19px] top-[44px] bottom-0 w-px bg-stone-200" />
            )}
            <div className="flex items-start gap-3 py-2.5">
              <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                a.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                a.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                'bg-stone-100 text-stone-500'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-900">{a.name}</div>
                <div className="text-[11px] text-stone-500">{a.role}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {a.status === 'Approved'
                    ? <><Check size={12} className="text-emerald-600" /><span className="text-xs font-medium text-emerald-600">Approved</span></>
                    : <><Clock size={12} className="text-amber-600" /><span className="text-xs font-medium text-amber-600">Pending</span></>
                  }
                  {a.timestamp && <span className="text-[11px] text-stone-400 ml-1">· {a.timestamp}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════ TAB: Activity ═══════ */
function ActivityTab({ bill }) {
  const activities = [
    { time: bill.ownerDate, who: bill.owner, action: 'Bill created and submitted', icon: FileText },
    { time: bill.ownerDate, who: 'System', action: `Payment scheduled: ${bill.paymentDate}`, icon: Calendar },
    ...(bill.status === 'Paid' ? [
      { time: bill.paymentDate, who: 'System', action: `Payment sent via ${bill.statusIcon === 'bank' ? 'ACH' : 'Card'}`, icon: bill.statusIcon === 'bank' ? Landmark : CreditCard },
      { time: bill.paymentArrived?.replace('Arrived ', ''), who: 'System', action: 'Payment confirmed received', icon: Check },
    ] : []),
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

/* ═══════ MAIN: BillModal ═══════ */
const TABS = ['Overview', 'Approvals', 'Activity'];

export default function BillModal({ open, onClose, onAction, bill }) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!bill) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Bill — ${bill.vendor}`}
      subtitle={
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <StatusBadge status={bill.status} />
          <span>·</span>
          <span>{fmt(bill.amount)}</span>
          <span>·</span>
          <span>Due {bill.dueDate}</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-center gap-3">
          {bill.status !== 'Paid' ? (
            <>
              <button
                onClick={() => onAction?.('approve', `Approved payment — ${bill.vendor} (${fmt(bill.amount)})`)}
                className="flex items-center gap-2 text-sm bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 font-medium"
              >
                <Check size={14} /> Approve payment
              </button>
              <button
                onClick={() => onAction?.('flag', `Flagged bill — ${bill.vendor}`)}
                className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-5 py-2.5 hover:bg-stone-50 font-medium"
              >
                <Flag size={14} /> Flag
              </button>
            </>
          ) : (
            <button className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-5 py-2.5 hover:bg-stone-50 font-medium">
              <Download size={14} /> Download receipt
            </button>
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

      {activeTab === 'Overview' && <OverviewTab bill={bill} />}
      {activeTab === 'Approvals' && <ApprovalsTab bill={bill} />}
      {activeTab === 'Activity' && <ActivityTab bill={bill} />}
    </Modal>
  );
}
