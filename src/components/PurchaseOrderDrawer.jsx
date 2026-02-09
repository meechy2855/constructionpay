import { useState } from 'react';
import {
  X, ArrowLeft, AlertTriangle, Check, Clock,
  Edit3, Ban, Lock, Flag, MessageSquare,
  DollarSign, FileText, Send, ArrowUpRight,
  Receipt, Shield, ExternalLink,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { projects, costCodes } from '../data/mockData';

/* ─── Helpers ─── */
function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtShort(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

/* ─── Shared UI atoms ─── */
function FieldCard({ label, value, verified, sub, rightLabel, rightValue, rightVerified }) {
  return (
    <div className="bg-stone-50 rounded-lg px-4 py-3 mb-2">
      {rightLabel ? (
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-xs text-stone-500 mb-0.5">{label}</div>
            <div className="flex items-center gap-1.5">
              {verified && <Check size={14} className="text-stone-500" />}
              <span className="text-sm text-stone-800">{value}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-stone-400 pt-3">⇋</div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              {rightVerified && <Check size={14} className="text-stone-500" />}
              <span className="text-sm text-stone-600">{rightValue}</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-xs text-stone-500 mb-0.5">{label}</div>
          <div className="flex items-center gap-1.5">
            {verified && <Check size={14} className="text-stone-500" />}
            <span className="text-sm text-stone-800">{value}</span>
          </div>
          {sub && <div className="text-xs text-stone-500 mt-0.5">{sub}</div>}
        </>
      )}
    </div>
  );
}

function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mt-7 mb-3">
      <h2 className="text-xl font-semibold text-stone-900 tracking-tight">{children}</h2>
      {right}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-stone-200 my-5" />;
}

const roleColors = {
  'Project Manager': 'bg-blue-600',
  'Project Executive': 'bg-indigo-600',
  'Site Supervisor': 'bg-amber-600',
  'Accounting Lead': 'bg-emerald-600',
  Controller: 'bg-purple-600',
  'Purchasing Manager': 'bg-orange-600',
  Foreman: 'bg-amber-700',
  Supervisor: 'bg-teal-600',
};

function getAvatarColor(role) {
  return roleColors[role] || 'bg-stone-500';
}

/* ═══════════════════════════════════════════════
   TAB 1: Overview (PO Summary)
   ═══════════════════════════════════════════════ */
function OverviewTab({ po }) {
  const invoicedAmount = po.billedAmount || 0;
  const remaining = po.totalAmount - invoicedAmount;
  const pctInvoiced = po.totalAmount ? (invoicedAmount / po.totalAmount) * 100 : 0;

  return (
    <div>
      {/* Supplier */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-semibold text-stone-600`}>
          {po.supplier ? initials(po.supplier) : '?'}
        </div>
        <div>
          <div className="text-sm font-medium text-stone-900">{po.supplier || 'No supplier'}</div>
          <div className="text-xs text-stone-500 uppercase tracking-wide">Supplier</div>
        </div>
      </div>

      <FieldCard label="Trade / Category" value={po.category} verified sub={po.trade} />
      <FieldCard label="Total PO Amount" value={fmt(po.totalAmount)} verified />
      <FieldCard label="Term" value={po.term || 'One-time'} verified />

      {(po.startDate || po.endDate) && (
        <FieldCard
          label="Start / End Date"
          value={`${po.startDate ? fmtDate(po.startDate) : '—'} → ${po.endDate ? fmtDate(po.endDate) : '—'}`}
          verified={!!(po.startDate && po.endDate)}
        />
      )}

      <FieldCard label="Payment Method" value={po.paymentMethod || '—'} verified={!!po.paymentMethod} />

      <Divider />

      {/* Indicators */}
      <SectionTitle>Spend Tracking</SectionTitle>

      <div className="bg-stone-50 rounded-lg px-4 py-3 border border-stone-200">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs text-stone-500">Invoiced to date</div>
          <div className="text-xs text-stone-500">{pctInvoiced.toFixed(0)}%</div>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full transition-all ${pctInvoiced > 100 ? 'bg-red-500' : pctInvoiced > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(pctInvoiced, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-stone-600">{fmt(invoicedAmount)} invoiced</span>
          <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-stone-800'}`}>
            {fmt(remaining)} remaining
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 2: Commitments (Construction-Native)
   ═══════════════════════════════════════════════ */
function CommitmentsTab({ po }) {
  const lineItems = po.lineItems || [];
  const totalCommitted = lineItems.reduce((s, li) => s + li.committed, 0);
  const totalInvoiced = lineItems.reduce((s, li) => s + li.invoiced, 0);

  return (
    <div>
      <SectionTitle right={
        <span className="text-xs text-stone-500">{lineItems.length} line item{lineItems.length !== 1 ? 's' : ''}</span>
      }>
        Commitments
      </SectionTitle>

      {lineItems.length > 0 ? (
        <div className="border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-stone-500 text-xs uppercase tracking-wide">Line Item</th>
                <th className="text-right px-4 py-2.5 font-medium text-stone-500 text-xs uppercase tracking-wide">Committed</th>
                <th className="text-right px-4 py-2.5 font-medium text-stone-500 text-xs uppercase tracking-wide">Invoiced</th>
                <th className="text-right px-4 py-2.5 font-medium text-stone-500 text-xs uppercase tracking-wide">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {lineItems.map(li => {
                const rem = li.committed - li.invoiced;
                const costCode = costCodes.find(c => c.code === li.costCode);
                return (
                  <tr key={li.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="text-stone-900 font-medium">{li.name}</div>
                      <div className="text-xs text-stone-500">{costCode ? `${costCode.code} — ${costCode.name}` : li.costCode}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-stone-700">{fmt(li.committed)}</td>
                    <td className="px-4 py-3 text-right text-stone-700">{fmt(li.invoiced)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${rem < 0 ? 'text-red-600' : 'text-stone-900'}`}>{fmt(rem)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-stone-50 border-t border-stone-200">
              <tr>
                <td className="px-4 py-2.5 font-semibold text-stone-900 text-xs uppercase">Total</td>
                <td className="px-4 py-2.5 text-right font-semibold text-stone-900">{fmt(totalCommitted)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-stone-900">{fmt(totalInvoiced)}</td>
                <td className={`px-4 py-2.5 text-right font-semibold ${totalCommitted - totalInvoiced < 0 ? 'text-red-600' : 'text-stone-900'}`}>
                  {fmt(totalCommitted - totalInvoiced)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center">
          <div className="text-sm text-stone-500">No line items committed yet</div>
          <div className="text-xs text-stone-400 mt-1">Commitments will appear after PO conversion</div>
        </div>
      )}

      <div className="text-xs text-stone-500 flex items-start gap-1.5 mt-3">
        <Shield size={11} className="shrink-0 mt-0.5" />
        Critical for cash forecasting and preventing over-billing.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 3: Invoices (PO → AP Bridge)
   ═══════════════════════════════════════════════ */
function InvoicesTab({ po }) {
  const invoices = po.invoices || [];

  const lienWaiverColor = (status) => {
    if (status === 'Received') return 'text-emerald-600';
    if (status === 'Pending') return 'text-amber-600';
    return 'text-stone-400';
  };

  return (
    <div>
      <SectionTitle right={
        <span className="text-xs text-stone-500">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</span>
      }>
        Linked Invoices
      </SectionTitle>

      {invoices.length > 0 ? (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="border border-stone-200 rounded-xl p-4 hover:bg-stone-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Receipt size={14} className="text-stone-500" />
                  <span className="text-sm font-medium text-stone-900">{inv.number}</span>
                </div>
                <StatusBadge status={inv.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-stone-500">Amount</div>
                  <div className="text-stone-900 font-medium">{fmt(inv.amount)}</div>
                </div>
                <div>
                  <div className="text-stone-500">Retainage</div>
                  <div className="text-stone-900 font-medium">{fmt(inv.retainage || 0)}</div>
                </div>
                <div>
                  <div className="text-stone-500">Date</div>
                  <div className="text-stone-900">{fmtShort(inv.date)}</div>
                </div>
              </div>
              {/* Lien waiver */}
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-stone-100">
                <Shield size={12} className={lienWaiverColor(inv.lienWaiver)} />
                <span className={`text-xs font-medium ${lienWaiverColor(inv.lienWaiver)}`}>
                  Lien waiver: {inv.lienWaiver || 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center">
          <div className="text-sm text-stone-500">No invoices linked yet</div>
          <div className="text-xs text-stone-400 mt-1">Invoices will appear after matching in Bill Pay</div>
        </div>
      )}

      {/* Actions */}
      {invoices.length > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <button className="text-xs border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-medium flex items-center gap-1">
            <DollarSign size={12} /> Match invoice
          </button>
          <button className="text-xs border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-medium flex items-center gap-1">
            <Flag size={12} /> Flag over-billing
          </button>
          <button className="text-xs border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-medium flex items-center gap-1">
            <Send size={12} /> Send to Bill Pay
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 4: Accounting
   ═══════════════════════════════════════════════ */
function AccountingTab({ po }) {
  const costCode = costCodes.find(c => c.code === po.costCode);
  const isOverInvoiced = po.billedAmount > po.totalAmount;
  const isExportReady = po.exportStatus === 'Exported';

  return (
    <div>
      <SectionTitle right={
        <button className="flex items-center gap-1.5 text-sm text-stone-600 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-50">
          <ArrowUpRight size={14} /> Split
        </button>
      }>
        Accounting
      </SectionTitle>

      {/* Export readiness */}
      <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border mb-4 ${
        isExportReady ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
      }`}>
        {isExportReady
          ? <><Check size={14} className="text-emerald-600" /><span className="text-xs font-medium text-emerald-700">Exported to accounting system</span></>
          : <><AlertTriangle size={14} className="text-amber-600" /><span className="text-xs font-medium text-amber-700">Export: {po.exportStatus || 'Not exported'}</span></>
        }
      </div>

      <FieldCard label="Project" value={po.project} verified />
      <FieldCard label="Cost Code(s)" value={costCode ? `${costCode.code} — ${costCode.name}` : po.costCode || '—'} verified={!!po.costCode} />
      <FieldCard
        label="Category"
        value={po.category}
        verified
        rightLabel="Accounting Category"
        rightValue={po.accountingCategory || '—'}
        rightVerified={!!po.accountingCategory}
      />
      <FieldCard
        label="Supplier"
        value={po.supplier || '—'}
        verified={!!po.supplier}
        rightLabel="Vendor Mapping"
        rightValue={po.vendorMapping || '—'}
        rightVerified={!!po.vendorMapping}
      />
      <FieldCard label="Export Status" value={po.exportStatus || 'Not exported'} verified={po.exportStatus === 'Exported'} />

      <Divider />

      <SectionTitle>Enforcement</SectionTitle>
      <div className="space-y-2">
        {[
          { label: 'Cost code assigned', ok: !!po.costCode, okText: 'Complete', failText: 'Missing' },
          { label: 'Vendor mapping', ok: !!po.vendorMapping, okText: 'Mapped', failText: 'Not mapped' },
          { label: 'Over-invoicing check', ok: !isOverInvoiced, okText: 'Within limit', failText: `Over by ${fmt(po.billedAmount - po.totalAmount)}` },
          { label: 'Cost code match', ok: true, okText: 'Consistent', failText: 'Mismatch detected' },
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
        Invoicing beyond PO value is blocked. Cost code mismatches trigger warnings.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAB 5: Activity (Audit Trail)
   ═══════════════════════════════════════════════ */
function ActivityTab({ po }) {
  const activities = po.activity || [];
  const iconMap = {
    'created': FileText,
    'Approved': Check,
    'Converted': Send,
    'matched': DollarSign,
    'sent': Clock,
    'Draft': Edit3,
    'Closed': Lock,
    'Invoice': Receipt,
  };

  function getIcon(action) {
    for (const [key, Icon] of Object.entries(iconMap)) {
      if (action.includes(key)) return Icon;
    }
    return MessageSquare;
  }

  return (
    <div>
      <SectionTitle>Activity Log</SectionTitle>
      <div className="relative">
        {activities.map((a, i) => {
          const Icon = getIcon(a.action);
          return (
            <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
              {i < activities.length - 1 && <div className="absolute left-[15px] top-9 bottom-0 w-px bg-stone-200" />}
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 z-10">
                <Icon size={14} className="text-stone-500" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="text-sm text-stone-900">{a.action}</div>
                <div className="text-xs text-stone-500">{a.who} · {fmtShort(a.time)} {fmtTime(a.time)}</div>
              </div>
            </div>
          );
        })}
        {activities.length === 0 && (
          <div className="text-sm text-stone-400 text-center py-8">No activity yet</div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Purchase Order Drawer
   ═══════════════════════════════════════════════ */
const TABS = ['Overview', 'Commitments', 'Invoices', 'Accounting', 'Activity'];

/* ─── Editable Field ─── */
function EditableFieldCard({ label, value, onChange, type = 'text' }) {
  return (
    <div className="bg-stone-50 rounded-lg px-4 py-3 mb-2 border border-stone-200">
      <div className="text-xs text-stone-500 mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm text-stone-800 bg-transparent border-none outline-none focus:ring-0 p-0"
      />
    </div>
  );
}

export default function PurchaseOrderDrawer({ po, onClose, onAction }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [edits, setEdits] = useState({
    supplier: po?.supplier || '',
    paymentMethod: po?.paymentMethod || '',
    category: po?.category || '',
    term: po?.term || '',
  });
  const [savedEdits, setSavedEdits] = useState({ ...edits });

  const isDirty = JSON.stringify(edits) !== JSON.stringify(savedEdits);

  const handleEditField = (key, value) => {
    setEdits(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSavedEdits({ ...edits });
    setIsEditing(false);
    onAction?.('approve', `Saved changes to ${po.name}`);
  };

  const handleDiscard = () => {
    setEdits({ ...savedEdits });
    setIsEditing(false);
  };

  const handleAction = (type, message) => {
    onAction?.(type, message);
  };

  if (!po) return null;

  const remaining = po.totalAmount - (po.billedAmount || 0);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/10 z-40 transition-opacity" onClick={onClose} />
      {/* Drawer panel */}
      <div className="fixed top-0 right-0 h-full w-[520px] bg-white shadow-2xl border-l border-stone-200 z-50 flex flex-col" style={{ animation: 'drawerSlideIn 0.2s ease-out' }}>

        {/* ─── Header ─── */}
        <div className="px-6 pt-5 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900">
              <ArrowLeft size={15} /> Back
            </button>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs border border-stone-200 rounded-md px-2.5 py-1 hover:bg-stone-50 text-stone-600 font-medium flex items-center gap-1"
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
              <button
                onClick={() => handleAction('reject', `Closed PO — ${po.name}`)}
                className="text-xs border border-stone-200 rounded-md px-2.5 py-1 hover:bg-stone-50 text-red-600 font-medium flex items-center gap-1"
              >
                <Lock size={12} /> Close PO
              </button>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* PO number + status */}
          <div className="text-lg font-semibold text-stone-900 tracking-tight">{po.name}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <StatusBadge status={po.poStatus} />
            <span className="text-sm text-stone-500">·</span>
            <span className="text-sm text-stone-900 font-medium">{fmt(po.totalAmount)}</span>
            <span className="text-sm text-stone-500">committed</span>
          </div>

          {/* Remaining + project */}
          <div className="flex items-center gap-3 mt-2">
            <div className={`text-sm font-medium ${remaining < 0 ? 'text-red-600' : 'text-stone-600'}`}>
              {fmt(remaining)} remaining
            </div>
            <span className="text-stone-300">·</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">{po.project}</button>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="border-b border-stone-200 px-6 shrink-0">
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

        {/* ─── Scrollable content ─── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isEditing && activeTab === 'Overview' ? (
            <div>
              <SectionTitle>Edit Purchase Order</SectionTitle>
              <EditableFieldCard label="Supplier" value={edits.supplier} onChange={v => handleEditField('supplier', v)} />
              <EditableFieldCard label="Category / Trade" value={edits.category} onChange={v => handleEditField('category', v)} />
              <EditableFieldCard label="Payment Method" value={edits.paymentMethod} onChange={v => handleEditField('paymentMethod', v)} />
              <EditableFieldCard label="Term" value={edits.term} onChange={v => handleEditField('term', v)} />
            </div>
          ) : (
            <>
              {activeTab === 'Overview' && <OverviewTab po={po} />}
              {activeTab === 'Commitments' && <CommitmentsTab po={po} />}
              {activeTab === 'Invoices' && <InvoicesTab po={po} />}
              {activeTab === 'Accounting' && <AccountingTab po={po} />}
              {activeTab === 'Activity' && <ActivityTab po={po} />}
            </>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="border-t border-stone-200 px-6 py-3 bg-white flex items-center justify-center gap-3 shrink-0">
          {(isEditing || isDirty) ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-stone-500">You have unsaved changes</span>
              <div className="flex items-center gap-2">
                <button onClick={handleDiscard} className="text-sm text-stone-600 border border-stone-200 rounded-lg px-4 py-2 hover:bg-stone-50 font-medium">
                  Discard
                </button>
                <button onClick={handleSave} className="flex items-center gap-1.5 text-sm bg-stone-900 text-white rounded-lg px-5 py-2 hover:bg-stone-800 font-medium">
                  <Check size={13} /> Save changes
                </button>
              </div>
            </div>
          ) : (
            <>
              {po.poStatus === 'Not billed' && (
                <button
                  onClick={() => handleAction('approve', `Matched invoice to ${po.name}`)}
                  className="flex items-center gap-2 text-sm bg-stone-900 text-white rounded-lg px-5 py-2.5 hover:bg-stone-800 font-medium"
                >
                  <Receipt size={14} /> Match invoice
                </button>
              )}
              {(po.poStatus === 'Partially invoiced' || po.poStatus === 'Partially billed') && (
                <>
                  <button
                    onClick={() => handleAction('approve', `Matched invoice to ${po.name}`)}
                    className="flex items-center gap-2 text-sm bg-stone-900 text-white rounded-lg px-5 py-2.5 hover:bg-stone-800 font-medium"
                  >
                    <Receipt size={14} /> Match invoice
                  </button>
                  <button
                    onClick={() => handleAction('flag', `Flagged ${po.name} for review`)}
                    className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-4 py-2.5 hover:bg-stone-50 font-medium"
                  >
                    <Flag size={14} /> Flag for review
                  </button>
                </>
              )}
              {(po.poStatus === 'Fully billed' || po.poStatus === 'Closed') && (
                <button
                  onClick={() => handleAction('approve', `Viewing ${po.name} in Bill Pay`)}
                  className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-4 py-2.5 hover:bg-stone-50 font-medium"
                >
                  <ExternalLink size={14} /> View in Bill Pay
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
