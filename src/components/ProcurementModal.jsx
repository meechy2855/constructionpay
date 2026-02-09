import { useState } from 'react';
import {
  Check, Clock, AlertTriangle, ShoppingCart, HardHat,
  Receipt, Flag, Calendar, DollarSign, Shield,
  Lock, ArrowUpRight, FileText, MessageSquare,
  Upload, Ban,
} from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { projects, procurementRequests } from '../data/mockData';

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtShort(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function fmtTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
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

/* ═══════ PROCUREMENT REQUEST MODAL ═══════ */

function RequestOverviewTab({ item, fullData }) {
  return (
    <div>
      {/* Requester */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-sm font-semibold text-white">
          {initials(item.requester)}
        </div>
        <div>
          <div className="text-lg font-semibold text-stone-900">{item.requester}</div>
          <div className="text-xs text-stone-500">{fullData?.requesterRole || 'Team member'}</div>
        </div>
      </div>

      {/* Amount */}
      <div className="text-3xl font-semibold text-stone-900 tracking-tight mb-1">{fmt(item.amount)} USD</div>
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
        <StatusBadge status={item.status} />
        <span>·</span>
        <span>{fmtDate(item.date)}</span>
      </div>

      <Divider />

      <SectionTitle>Request Details</SectionTitle>
      <FieldRow label="Request" value={item.name} icon={ShoppingCart} />
      <FieldRow label="Project" value={item.project} icon={HardHat} />
      <FieldRow label="Trade / Category" value={item.category} verified />
      <FieldRow label="Amount" value={fmt(item.amount)} icon={DollarSign} />
      <FieldRow label="Requested Date" value={fmtDate(item.date)} icon={Calendar} />

      {fullData?.description && (
        <>
          <Divider />
          <SectionTitle>Description</SectionTitle>
          <div className="bg-stone-50 rounded-lg px-4 py-3 text-sm text-stone-800 border border-stone-200">
            {fullData.description}
          </div>
        </>
      )}

      {fullData?.supplier && (
        <>
          <Divider />
          <SectionTitle>Supplier</SectionTitle>
          <FieldRow label="Supplier" value={fullData.supplier} verified />
          <FieldRow label="Payment Method" value={fullData.paymentMethod || 'ACH'} />
        </>
      )}
    </div>
  );
}

function RequestJobContextTab({ item, fullData }) {
  const proj = projects.find(p => p.name === item.project) || projects[0];
  const pctUsed = proj ? (proj.spent / proj.budget) * 100 : 0;
  const budgetRemaining = proj ? proj.budget - proj.spent : 0;

  return (
    <div>
      <SectionTitle>Project Assignment</SectionTitle>
      <FieldRow label="Project" value={item.project} verified />
      <FieldRow label="Cost Code" value={fullData?.costCode || '—'} verified={!!fullData?.costCode} />
      <FieldRow label="Trade" value={fullData?.trade || item.category} verified />
      {fullData?.jobPhase && <FieldRow label="Job Phase" value={fullData.jobPhase} />}

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
    </div>
  );
}

function RequestApprovalsTab({ item, fullData }) {
  const approvers = fullData?.approverChain || [
    { id: 1, name: 'Megan Lewis', role: 'Project Manager', group: 'Project Managers', status: 'Pending', timestamp: null },
  ];

  return (
    <div>
      <SectionTitle>Approval Flow</SectionTitle>

      <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border mb-4 ${
        item.status === 'Approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
      }`}>
        {item.status === 'Approved'
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
                <div className="text-[11px] text-stone-500">{a.role} · {a.group}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {a.status === 'Approved'
                    ? <><Check size={12} className="text-emerald-600" /><span className="text-xs font-medium text-emerald-600">Approved</span></>
                    : <><Clock size={12} className="text-amber-600" /><span className="text-xs font-medium text-amber-600">{a.status}</span></>
                  }
                  {a.timestamp && <span className="text-[11px] text-stone-400 ml-1">· {fmtShort(a.timestamp)} {fmtTime(a.timestamp)}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-stone-500 flex items-start gap-1.5 mt-3">
        <Shield size={11} className="shrink-0 mt-0.5" />
        Procurement requests require PM + Finance approval before purchase order issuance.
      </div>
    </div>
  );
}

function RequestActivityTab({ item, fullData }) {
  const activityLog = fullData?.activity || [
    { time: item.date + 'T09:00:00', who: item.requester, action: 'Request created' },
    { time: item.date + 'T09:01:00', who: 'System', action: 'Sent for approval' },
  ];

  return (
    <div>
      <SectionTitle>Activity Log</SectionTitle>
      <div className="relative">
        {activityLog.map((a, i) => (
          <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
            {i < activityLog.length - 1 && (
              <div className="absolute left-[15px] top-9 bottom-0 w-px bg-stone-200" />
            )}
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 z-10">
              <Clock size={14} className="text-stone-500" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="text-sm text-stone-900">{a.action}</div>
              <div className="text-xs text-stone-500">{a.who} · {fmtShort(a.time)} {fmtTime(a.time)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const REQUEST_TABS = ['Overview', 'Job Context', 'Approvals', 'Activity'];

export function ProcurementRequestModal({ open, onClose, onAction, item }) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!item) return null;

  // Try to find full procurement data from the main data source
  const fullData = procurementRequests.find(r =>
    r.name?.includes(item.name?.split('—')[1]?.trim() || '') || r.id === item.id
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item.name}
      subtitle={
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <StatusBadge status={item.status} />
          <span>·</span>
          <span>{fmt(item.amount)}</span>
          <span>·</span>
          <span>{item.project}</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-center gap-3">
          {item.status === 'Pending Approval' && (
            <>
              <button
                onClick={() => onAction?.('approve', `Approved procurement — ${item.name} (${fmt(item.amount)})`)}
                className="flex items-center gap-2 text-sm bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 font-medium"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => onAction?.('reject', `Rejected procurement — ${item.name}`)}
                className="flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-lg px-5 py-2.5 hover:bg-red-50 font-medium"
              >
                <Ban size={14} /> Reject
              </button>
            </>
          )}
          {item.status === 'Approved' && (
            <button
              onClick={() => onAction?.('approve', `Converted ${item.name} to Purchase Order`)}
              className="flex items-center gap-2 text-sm bg-stone-900 text-white rounded-lg px-5 py-2.5 hover:bg-stone-800 font-medium"
            >
              <ShoppingCart size={14} /> Convert to PO
            </button>
          )}
        </div>
      }
    >
      {/* Tabs */}
      <div className="border-b border-stone-200 -mx-6 px-6 -mt-5 mb-5">
        <nav className="flex gap-0 -mb-px">
          {REQUEST_TABS.map(tab => (
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

      {activeTab === 'Overview' && <RequestOverviewTab item={item} fullData={fullData} />}
      {activeTab === 'Job Context' && <RequestJobContextTab item={item} fullData={fullData} />}
      {activeTab === 'Approvals' && <RequestApprovalsTab item={item} fullData={fullData} />}
      {activeTab === 'Activity' && <RequestActivityTab item={item} fullData={fullData} />}
    </Modal>
  );
}

/* ═══════ PURCHASE ORDER MODAL ═══════ */

function POOverviewTab({ item, fullData }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white">
          {initials(item.requester)}
        </div>
        <div>
          <div className="text-lg font-semibold text-stone-900">{item.requester}</div>
          <div className="text-xs text-stone-500">{fullData?.requesterRole || 'Team member'}</div>
        </div>
      </div>

      <div className="text-3xl font-semibold text-stone-900 tracking-tight mb-1">{fmt(item.amount)} USD</div>
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
        <StatusBadge status={item.status} />
        <span>·</span>
        <span>{fmtDate(item.date)}</span>
      </div>

      <Divider />

      <SectionTitle>PO Details</SectionTitle>
      <FieldRow label="PO Name" value={item.name} icon={ShoppingCart} />
      <FieldRow label="Project" value={item.project} icon={HardHat} />
      <FieldRow label="Category" value={item.category} verified />
      <FieldRow label="Total Amount" value={fmt(item.amount)} icon={DollarSign} />

      {fullData?.supplier && (
        <>
          <Divider />
          <SectionTitle>Supplier</SectionTitle>
          <FieldRow label="Supplier" value={fullData.supplier} verified />
          <FieldRow label="Payment Method" value={fullData.paymentMethod || 'ACH'} />
        </>
      )}
    </div>
  );
}

function POCommitmentsTab({ fullData }) {
  const lineItems = fullData?.lineItems || [];

  if (lineItems.length === 0) {
    return (
      <div>
        <SectionTitle>Commitments</SectionTitle>
        <div className="text-sm text-stone-500 text-center py-8">No line items yet</div>
      </div>
    );
  }

  const totalCommitted = lineItems.reduce((s, li) => s + li.committed, 0);
  const totalInvoiced = lineItems.reduce((s, li) => s + li.invoiced, 0);

  return (
    <div>
      <SectionTitle>Commitments</SectionTitle>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-stone-50 rounded-lg px-4 py-3 border border-stone-200 text-center">
          <div className="text-xs text-stone-500 mb-0.5">Committed</div>
          <div className="text-lg font-semibold text-stone-900">{fmt(totalCommitted)}</div>
        </div>
        <div className="bg-emerald-50 rounded-lg px-4 py-3 border border-emerald-200 text-center">
          <div className="text-xs text-emerald-600 mb-0.5">Invoiced</div>
          <div className="text-lg font-semibold text-emerald-700">{fmt(totalInvoiced)}</div>
        </div>
        <div className="bg-amber-50 rounded-lg px-4 py-3 border border-amber-200 text-center">
          <div className="text-xs text-amber-600 mb-0.5">Remaining</div>
          <div className="text-lg font-semibold text-amber-700">{fmt(totalCommitted - totalInvoiced)}</div>
        </div>
      </div>

      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Line Item</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Committed</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Invoiced</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Remaining</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {lineItems.map(li => (
              <tr key={li.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5 text-stone-800">{li.name}</td>
                <td className="px-4 py-2.5 text-right text-stone-700">{fmt(li.committed)}</td>
                <td className="px-4 py-2.5 text-right text-emerald-600">{fmt(li.invoiced)}</td>
                <td className="px-4 py-2.5 text-right text-amber-600">{fmt(li.committed - li.invoiced)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function POInvoicesTab({ fullData }) {
  const invoices = fullData?.invoices || [];

  if (invoices.length === 0) {
    return (
      <div>
        <SectionTitle>Invoices</SectionTitle>
        <div className="text-sm text-stone-500 text-center py-8">No invoices linked yet</div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle>Invoices</SectionTitle>

      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Invoice #</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Date</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Amount</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase">Lien Waiver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5 font-medium text-stone-800">{inv.number}</td>
                <td className="px-4 py-2.5 text-stone-600">{fmtShort(inv.date)}</td>
                <td className="px-4 py-2.5 text-right text-stone-800">{fmt(inv.amount)}</td>
                <td className="px-4 py-2.5"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-medium ${inv.lienWaiver === 'Received' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {inv.lienWaiver}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.some(inv => inv.retainage > 0) && (
        <>
          <Divider />
          <SectionTitle>Retainage</SectionTitle>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <div className="text-xs text-amber-700 mb-0.5">Total retainage withheld</div>
            <div className="text-lg font-semibold text-amber-800">
              {fmt(invoices.reduce((s, inv) => s + (inv.retainage || 0), 0))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function POActivityTab({ item, fullData }) {
  const activityLog = fullData?.activity || [
    { time: item.date + 'T09:00:00', who: item.requester, action: 'PO created' },
  ];

  return (
    <div>
      <SectionTitle>Activity Log</SectionTitle>
      <div className="relative">
        {activityLog.map((a, i) => (
          <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
            {i < activityLog.length - 1 && (
              <div className="absolute left-[15px] top-9 bottom-0 w-px bg-stone-200" />
            )}
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 z-10">
              <Clock size={14} className="text-stone-500" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="text-sm text-stone-900">{a.action}</div>
              <div className="text-xs text-stone-500">{a.who} · {fmtShort(a.time)} {fmtTime(a.time)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PO_TABS = ['Overview', 'Commitments', 'Invoices', 'Activity'];

export function PurchaseOrderModal({ open, onClose, onAction, item }) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!item) return null;

  const fullData = procurementRequests.find(r =>
    r.name?.includes(item.name?.split('—')[1]?.trim() || '') || r.id === item.id
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item.name}
      subtitle={
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <StatusBadge status={item.status} />
          <span>·</span>
          <span>{fmt(item.amount)}</span>
          <span>·</span>
          <span>{item.project}</span>
        </div>
      }
      footer={
        <div className="flex items-center justify-center gap-3">
          {item.status === 'Pending Approval' && (
            <>
              <button
                onClick={() => onAction?.('approve', `Approved PO — ${item.name} (${fmt(item.amount)})`)}
                className="flex items-center gap-2 text-sm bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 font-medium"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => onAction?.('reject', `Rejected PO — ${item.name}`)}
                className="flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-lg px-5 py-2.5 hover:bg-red-50 font-medium"
              >
                <Ban size={14} /> Reject
              </button>
            </>
          )}
          {item.status === 'Approved' && (
            <button
              onClick={() => onAction?.('flag', `Flagged PO — ${item.name}`)}
              className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-5 py-2.5 hover:bg-stone-50 font-medium"
            >
              <Flag size={14} /> Flag for review
            </button>
          )}
        </div>
      }
    >
      {/* Tabs */}
      <div className="border-b border-stone-200 -mx-6 px-6 -mt-5 mb-5">
        <nav className="flex gap-0 -mb-px">
          {PO_TABS.map(tab => (
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

      {activeTab === 'Overview' && <POOverviewTab item={item} fullData={fullData} />}
      {activeTab === 'Commitments' && <POCommitmentsTab fullData={fullData} />}
      {activeTab === 'Invoices' && <POInvoicesTab fullData={fullData} />}
      {activeTab === 'Activity' && <POActivityTab item={item} fullData={fullData} />}
    </Modal>
  );
}
