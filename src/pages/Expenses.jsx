import { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Download, Bell, Camera, Mic, MapPin, AlertTriangle, Receipt as ReceiptIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TabNav from '../components/TabNav';
import StatusBadge from '../components/StatusBadge';
import ReimbursementDrawer from '../components/ReimbursementDrawer';
import Toast from '../components/Toast';
import { expenses } from '../data/mockData';

const TABS = ['Overview', 'Needs Review', 'Pending', 'History'];

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ─── Overview KPI Cards ─── */
function OverviewCards({ expenses: exps, onKpiClick, activeKpi }) {
  const totalAmount = exps.reduce((s, e) => s + e.amount, 0);
  const pendingCount = exps.filter(e => e.status === 'Pending Review').length;
  const missingReceipts = exps.filter(e => !e.receipt).length;
  const approvedCount = exps.filter(e => e.status === 'Approved').length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">Total reimbursements</div>
        <div className="text-2xl font-semibold text-ramp-gray-900">{formatCurrency(totalAmount)}</div>
        <div className="text-xs text-ramp-gray-500 mt-0.5">{exps.length} submissions</div>
      </div>
      <button
        onClick={() => onKpiClick('pending')}
        className={`border rounded-xl p-4 text-left transition-colors cursor-pointer ${
          activeKpi === 'pending' ? 'border-amber-300 bg-amber-50' : 'border-ramp-gray-200 hover:bg-amber-50/50 hover:border-amber-200'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs text-amber-700 mb-1 font-medium uppercase tracking-wide">
          <AlertTriangle size={12} /> Pending Review
        </div>
        <div className="text-2xl font-semibold text-amber-700">{pendingCount}</div>
      </button>
      <button
        onClick={() => onKpiClick('missing-receipts')}
        className={`border rounded-xl p-4 text-left transition-colors cursor-pointer ${
          activeKpi === 'missing-receipts' ? 'border-orange-300 bg-orange-50' : 'border-ramp-gray-200 hover:bg-orange-50/50 hover:border-orange-200'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs text-orange-600 mb-1 font-medium uppercase tracking-wide">
          <ReceiptIcon size={12} /> Missing Receipts
        </div>
        <div className="text-2xl font-semibold text-orange-600">{missingReceipts}</div>
      </button>
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">Approved</div>
        <div className="text-2xl font-semibold text-emerald-600">{approvedCount}</div>
      </div>
    </div>
  );
}

/* ─── Mobile-First Expense Flow Preview ─── */
function MobileFlowPreview() {
  return (
    <div className="border border-ramp-gray-200 rounded-xl p-5 bg-ramp-gray-50 mb-6">
      <h3 className="font-semibold text-sm text-ramp-gray-900 mb-2">Mobile-First Expense Flow</h3>
      <p className="text-xs text-ramp-gray-500 mb-4">Optimized for field workers — capture and submit in seconds</p>
      <div className="flex items-center gap-3">
        {[
          { step: '1', label: 'Capture Receipt', icon: Camera, desc: 'Photo or scan' },
          { step: '2', label: 'Select Project', icon: MapPin, desc: 'Auto-suggest by location' },
          { step: '3', label: 'Select Cost Code', icon: null, desc: 'Filtered by project' },
          { step: '4', label: 'Submit', icon: null, desc: 'One-tap submit' },
        ].map((s, i) => (
          <div key={i} className="flex-1 text-center">
            <div className="w-8 h-8 rounded-full bg-ramp-gray-900 text-white flex items-center justify-center text-xs font-semibold mx-auto mb-1.5">
              {s.step}
            </div>
            <div className="text-xs font-medium text-ramp-gray-900">{s.label}</div>
            <div className="text-xs text-ramp-gray-500">{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-ramp-gray-500">
        <Mic size={12} /> Voice memo option available
        <span className="mx-1">·</span>
        <MapPin size={12} /> Offline-first capture
      </div>
    </div>
  );
}

export default function Expenses({ selectedProject }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [kpiFilter, setKpiFilter] = useState(null);

  // Local status overrides — tracks status changes from drawer actions
  const [statusOverrides, setStatusOverrides] = useState({});

  // Toast state
  const [toast, setToast] = useState(null);
  const handleDismissToast = useCallback((id) => {
    setToast(prev => (prev?.id === id ? null : prev));
  }, []);
  const handleDrawerAction = useCallback((actionType, message) => {
    setToast({ id: Date.now(), message, type: actionType, visible: true });
    if (selectedExpense) {
      const id = selectedExpense.id;
      if (actionType === 'approve') {
        setStatusOverrides(prev => ({ ...prev, [id]: { status: 'Approved' } }));
      } else if (actionType === 'reject') {
        setStatusOverrides(prev => ({ ...prev, [id]: { status: 'Rejected' } }));
      } else if (actionType === 'flag') {
        setStatusOverrides(prev => ({ ...prev, [id]: { status: 'Flagged' } }));
      }
    }
    setSelectedExpense(null);
  }, [selectedExpense]);

  // Apply status overrides to expenses
  const expensesWithOverrides = useMemo(() => {
    return expenses.map(e => {
      const override = statusOverrides[e.id];
      return override ? { ...e, ...override } : e;
    });
  }, [statusOverrides]);

  const filtered = useMemo(() => {
    let result = expensesWithOverrides;
    if (selectedProject) {
      result = result.filter(e => e.project === selectedProject.name);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.employee.toLowerCase().includes(q) ||
        e.project.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.spendType?.toLowerCase().includes(q)
      );
    }
    if (activeTab === 'Needs Review') result = result.filter(e => e.status === 'Pending Review' || e.status === 'Missing Receipt');
    if (activeTab === 'Pending') result = result.filter(e => e.status === 'Pending Review');
    if (activeTab === 'History') result = result.filter(e => e.status === 'Approved');

    // KPI filters (only on Overview tab)
    if (activeTab === 'Overview' && kpiFilter === 'pending') {
      result = result.filter(e => e.status === 'Pending Review');
    }
    if (activeTab === 'Overview' && kpiFilter === 'missing-receipts') {
      result = result.filter(e => !e.receipt);
    }

    return result;
  }, [expensesWithOverrides, selectedProject, search, activeTab, kpiFilter]);

  const tabCounts = {
    'Needs Review': expensesWithOverrides.filter(e => e.status === 'Pending Review' || e.status === 'Missing Receipt').length,
  };

  function handleKpiClick(filter) {
    setKpiFilter(prev => prev === filter ? null : filter);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setKpiFilter(null);
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Expenses"
        title="Reimbursements"
        description="Petty cash replacement for field teams — capture, code, and submit expenses from the jobsite."
        actions={
          <button className="flex items-center gap-1.5 text-sm border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50">
            <Bell size={14} />
            Reminders
            <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full font-medium">95</span>
          </button>
        }
      />

      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} counts={tabCounts} />

      <div className="mt-4">
        {activeTab === 'Overview' && (
          <>
            <MobileFlowPreview />
            <OverviewCards expenses={expensesWithOverrides} onKpiClick={handleKpiClick} activeKpi={kpiFilter} />
          </>
        )}

        {/* KPI active filter indicator */}
        {activeTab === 'Overview' && kpiFilter && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <AlertTriangle size={14} />
            <span className="font-medium">
              {kpiFilter === 'pending' ? 'Showing pending review only' : 'Showing expenses with missing receipts'}
            </span>
            <button
              onClick={() => setKpiFilter(null)}
              className="ml-auto text-xs text-amber-600 underline hover:text-amber-800"
            >
              Clear filter
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ramp-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-ramp-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-ramp-gray-300"
              />
            </div>
            <button className="flex items-center gap-1.5 text-sm text-ramp-gray-600 border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50">
              <Filter size={14} />
              Add filter
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-ramp-gray-50 text-ramp-gray-500"><Download size={16} /></button>
        </div>

        <div className="border border-ramp-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Receipt</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Cost Code</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Description</th>
                <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ramp-gray-100">
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelectedExpense(e)}
                  className="hover:bg-ramp-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-ramp-gray-900">{e.employee}</div>
                    <div className="text-xs text-ramp-gray-500">{e.role}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-3">
                    {e.receipt ? (
                      <span className="text-emerald-600 text-xs">Attached</span>
                    ) : (
                      <span className="text-orange-600 text-xs">Missing</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ramp-gray-600">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-ramp-gray-700">{e.project}</td>
                  <td className="px-4 py-3 text-ramp-gray-600 font-mono text-xs">{e.costCode}</td>
                  <td className="px-4 py-3 text-ramp-gray-600 text-xs">{e.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-ramp-gray-900">{formatCurrency(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-ramp-gray-50 border-t border-ramp-gray-200 text-xs text-ramp-gray-500 flex justify-between">
            <span>1–{filtered.length} of {filtered.length} reimbursements · {formatCurrency(filtered.reduce((s, e) => s + e.amount, 0))} total</span>
            {(() => {
              const missing = filtered.filter(e => !e.receipt).length;
              return missing > 0 ? (
                <span className="text-orange-600 font-medium">{missing} missing receipt{missing > 1 ? 's' : ''}</span>
              ) : (
                <span className="text-emerald-600">All receipts attached</span>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Reimbursement Detail Drawer */}
      {selectedExpense && (
        <ReimbursementDrawer
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onAction={handleDrawerAction}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={handleDismissToast} />
    </div>
  );
}
