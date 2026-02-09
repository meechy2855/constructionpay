import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Download, Settings, Plus, ShoppingCart } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TabNav from '../components/TabNav';
import StatusBadge from '../components/StatusBadge';
import RequestDrawer from '../components/RequestDrawer';
import PurchaseOrderDrawer from '../components/PurchaseOrderDrawer';
import Toast from '../components/Toast';
import { procurementRequests, costCodes } from '../data/mockData';

const TABS = ['All requests', 'Drafts', 'Needs action', 'Pending'];

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function RequestsView({ selectedProject, onRowClick, requests }) {
  const [activeTab, setActiveTab] = useState('All requests');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = requests;
    if (selectedProject) {
      result = result.filter(r => r.projectId === selectedProject.id);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.project.toLowerCase().includes(q) ||
        r.requester.toLowerCase().includes(q)
      );
    }
    if (activeTab === 'Drafts') result = result.filter(r => r.status === 'Draft');
    if (activeTab === 'Needs action') result = result.filter(r => r.status === 'Pending');
    if (activeTab === 'Pending') result = result.filter(r => r.status === 'Pending');
    return result;
  }, [selectedProject, search, activeTab]);

  return (
    <div>
      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ramp-gray-400" />
            <input
              type="text"
              placeholder="Filter by..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm border border-ramp-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-ramp-gray-300"
            />
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-ramp-gray-50 text-ramp-gray-500"><Download size={16} /></button>
          </div>
        </div>

        <div className="border border-ramp-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Approvals</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Next approver</th>
                <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Amount / Frequency</th>
                <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Spend program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ramp-gray-100">
              {filtered.map((r) => {
                const nextApprover = r.approverChain?.find(a => a.status === 'Pending');
                return (
                  <tr
                    key={r.id}
                    onClick={() => onRowClick(r)}
                    className="hover:bg-ramp-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-ramp-gray-900">{r.name}</div>
                      <div className="text-xs text-ramp-gray-500">{r.requester}</div>
                    </td>
                    <td className="px-4 py-3 text-ramp-gray-700">{r.project}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.category} />
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={r.approvals} /></td>
                    <td className="px-4 py-3 text-ramp-gray-500 text-sm">
                      {nextApprover ? nextApprover.name : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium text-ramp-gray-900">{formatCurrency(r.estimatedAmount)}</div>
                      <div className="text-xs text-ramp-gray-500">{r.frequency || 'Annual'}</div>
                    </td>
                    <td className="px-4 py-3 text-ramp-gray-600">{r.spendProgram}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-ramp-gray-50 border-t border-ramp-gray-200 text-xs text-ramp-gray-500">
            1–{filtered.length} of {filtered.length} items
          </div>
        </div>
      </div>
    </div>
  );
}

function PurchaseOrdersView({ selectedProject, onRowClick, requests }) {
  const [search, setSearch] = useState('');

  const orders = useMemo(() => {
    let result = requests.filter(r => r.status === 'Approved');
    if (selectedProject) {
      result = result.filter(r => r.projectId === selectedProject.id);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.project.toLowerCase().includes(q) ||
        (r.supplier && r.supplier.toLowerCase().includes(q))
      );
    }
    return result;
  }, [selectedProject, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ramp-gray-400" />
          <input
            type="text"
            placeholder="Filter by..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-ramp-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-ramp-gray-300"
          />
        </div>
        <button className="text-sm border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50 text-ramp-gray-700 font-medium flex items-center gap-1.5">
          <Settings size={14} />
          Settings
        </button>
      </div>

      <div className="border border-ramp-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">PO #</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Supplier</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">PO Status</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Committed</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Invoiced</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Remaining</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Project</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ramp-gray-100">
            {orders.map((o) => {
              const remaining = o.totalAmount - (o.billedAmount || 0);
              return (
                <tr
                  key={o.id}
                  onClick={() => onRowClick(o)}
                  className="hover:bg-ramp-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-ramp-gray-700 font-medium">PO-{String(o.id).padStart(4, '0')}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ramp-gray-900">{o.supplier || '—'}</div>
                    <div className="text-xs text-ramp-gray-500">{o.category}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={o.poStatus} /></td>
                  <td className="px-4 py-3 text-right text-ramp-gray-900 font-medium">{formatCurrency(o.totalAmount)}</td>
                  <td className="px-4 py-3 text-right text-ramp-gray-700">{formatCurrency(o.billedAmount || 0)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${remaining < 0 ? 'text-red-600' : 'text-ramp-gray-900'}`}>
                    {formatCurrency(remaining)}
                  </td>
                  <td className="px-4 py-3 text-ramp-gray-600">{o.project}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-ramp-gray-50 border-t border-ramp-gray-200 text-xs text-ramp-gray-500">
          1–{orders.length} of {orders.length} items
        </div>
      </div>
    </div>
  );
}

export default function Procurement({ selectedProject }) {
  const location = useLocation();
  const initialView = location.pathname.includes('purchase-orders') ? 'purchase-orders' : 'requests';
  const [view, setView] = useState(initialView);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  // Local status overrides — tracks status changes from drawer actions
  const [statusOverrides, setStatusOverrides] = useState({});

  // Apply status overrides to requests
  const requestsWithOverrides = useMemo(() => {
    return procurementRequests.map(r => {
      const override = statusOverrides[r.id];
      return override ? { ...r, ...override } : r;
    });
  }, [statusOverrides]);

  // Toast state
  const [toast, setToast] = useState(null);
  const handleDismissToast = useCallback((id) => {
    setToast(prev => (prev?.id === id ? null : prev));
  }, []);

  const handleDrawerAction = useCallback((actionType, message) => {
    setToast({ id: Date.now(), message, type: actionType, visible: true });
    const item = selectedRequest || selectedPO;
    if (item) {
      const id = item.id;
      if (actionType === 'approve') {
        setStatusOverrides(prev => ({ ...prev, [id]: { status: 'Approved', approvals: 'Approved' } }));
      } else if (actionType === 'reject') {
        setStatusOverrides(prev => ({ ...prev, [id]: { status: 'Rejected', approvals: 'Rejected' } }));
      } else if (actionType === 'flag') {
        setStatusOverrides(prev => ({ ...prev, [id]: { status: 'Flagged', approvals: 'Flagged' } }));
      }
    }
    setSelectedRequest(null);
    setSelectedPO(null);
  }, [selectedRequest, selectedPO]);

  function handleRequestClick(request) {
    setSelectedRequest(request);
    setSelectedPO(null);
  }

  function handlePOClick(po) {
    setSelectedPO(po);
    setSelectedRequest(null);
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Procurement"
        title={view === 'requests' ? 'Requests' : 'Purchase orders'}
        actions={
          view === 'requests' ? (
            <>
              <button className="text-sm border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50 text-ramp-gray-700 font-medium">
                New procurement program
              </button>
              <button className="text-sm px-3 py-2 bg-ramp-gray-900 text-white rounded-lg hover:bg-ramp-gray-800 font-medium flex items-center gap-1.5">
                <Plus size={14} />
                Request spend
              </button>
            </>
          ) : (
            <button className="text-sm border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50 text-ramp-gray-700 font-medium flex items-center gap-1.5">
              <Settings size={14} />
              Settings
            </button>
          )
        }
      />

      {/* Sub-nav toggle */}
      <div className="flex gap-1 mb-4 bg-ramp-gray-100 rounded-lg p-0.5 w-fit">
        <button
          onClick={() => setView('requests')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === 'requests' ? 'bg-white text-ramp-gray-900 shadow-sm' : 'text-ramp-gray-500 hover:text-ramp-gray-700'
          }`}
        >
          Requests
        </button>
        <button
          onClick={() => setView('purchase-orders')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === 'purchase-orders' ? 'bg-white text-ramp-gray-900 shadow-sm' : 'text-ramp-gray-500 hover:text-ramp-gray-700'
          }`}
        >
          Purchase orders
        </button>
      </div>

      {view === 'requests' ? (
        <RequestsView selectedProject={selectedProject} onRowClick={handleRequestClick} requests={requestsWithOverrides} />
      ) : (
        <PurchaseOrdersView selectedProject={selectedProject} onRowClick={handlePOClick} requests={requestsWithOverrides} />
      )}

      {/* Request Drawer */}
      {selectedRequest && (
        <RequestDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAction={handleDrawerAction}
        />
      )}

      {/* Purchase Order Drawer */}
      {selectedPO && (
        <PurchaseOrderDrawer
          po={selectedPO}
          onClose={() => setSelectedPO(null)}
          onAction={handleDrawerAction}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={handleDismissToast} />
    </div>
  );
}
