import { useState, useMemo, useRef, useEffect } from 'react';
import {
  X, ArrowLeft, AlertTriangle, Upload, Check, Clock,
  MapPin, Calendar, Shield, Edit3, ChevronRight, ChevronDown, Ban,
  CreditCard, User, HardHat, ArrowUpRight, Lock, Flag, MessageSquare,
  ExternalLink, Zap, Trash2, GripVertical, Plus, Receipt, Search,
  UserPlus, Users, Briefcase, DollarSign, ShieldCheck, Settings, FileText, Send,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { projects, approverDirectory } from '../data/mockData';

/* ─── Upload Receipt Modal ─── */
function UploadReceiptModal({ onClose, onSave }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const newFiles = Array.from(fileList).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ animation: 'uploadModalFadeIn 0.15s ease-out' }}
    >
      <div
        className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ animation: 'uploadModalSlideUp 0.2s ease-out' }}
      >
        <div className="px-6 pt-5 pb-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Upload Receipt</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-stone-900 bg-stone-50' : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            <Upload size={24} className="mx-auto text-stone-400 mb-2" />
            <div className="text-sm text-stone-600">Drop files here or click to browse</div>
            <div className="text-xs text-stone-400 mt-1">PDF, JPG, PNG up to 10 MB</div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(f => (
                <div key={f.id} className="flex items-center gap-3 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200">
                  <FileText size={14} className="text-stone-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-stone-800 truncate">{f.name}</div>
                    <div className="text-xs text-stone-400">{f.size}</div>
                  </div>
                  <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className="text-stone-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-stone-200 px-6 py-3 flex items-center justify-end gap-2">
          <button onClick={onClose} className="text-sm text-stone-600 border border-stone-200 rounded-lg px-4 py-2 hover:bg-stone-50 font-medium">
            Cancel
          </button>
          <button
            onClick={() => { onSave(files); onClose(); }}
            disabled={files.length === 0}
            className="text-sm bg-stone-900 text-white rounded-lg px-4 py-2 hover:bg-stone-800 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save receipt{files.length > 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes uploadModalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes uploadModalSlideUp { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
function fmtDate(d) {
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

/* ─── Avatar colors by role ─── */
const roleColors = {
  PM: 'bg-blue-600',
  'Project Manager': 'bg-blue-600',
  'Project Executive': 'bg-indigo-600',
  'Site Supervisor': 'bg-amber-600',
  Accounting: 'bg-emerald-600',
  'Accounting Lead': 'bg-emerald-600',
  Controller: 'bg-purple-600',
  Finance: 'bg-purple-600',
  'Purchasing Manager': 'bg-orange-600',
  Admin: 'bg-stone-600',
  Foreman: 'bg-amber-700',
  Supervisor: 'bg-teal-600',
};

function getAvatarColor(role) {
  return roleColors[role] || 'bg-stone-500';
}

/* ─── Group icons ─── */
const groupIcons = {
  'project-owner': User,
  'project-managers': Users,
  'accounting': Briefcase,
  'finance': DollarSign,
  'purchasing': ShieldCheck,
  'admin': Settings,
};

/* ═══════════════════════════════════════════════════════════════
   Approver Selector Dropdown
   ═══════════════════════════════════════════════════════════════ */
function ApproverSelectorDropdown({ expense, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const ref = useRef(null);

  // Filter individuals by project
  const projectIndividuals = useMemo(() => {
    return approverDirectory.individuals.filter(p =>
      p.projects.includes(expense.projectId) &&
      !expense.approvers?.some(a => a.name === p.name)
    );
  }, [expense]);

  const filteredIndividuals = useMemo(() => {
    if (!search) return projectIndividuals;
    const q = search.toLowerCase();
    return projectIndividuals.filter(p =>
      p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
    );
  }, [projectIndividuals, search]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function togglePerson(person) {
    setSelectedIds(prev =>
      prev.includes(person.id)
        ? prev.filter(id => id !== person.id)
        : [...prev, person.id]
    );
  }

  function handleAdd() {
    const people = projectIndividuals.filter(p => selectedIds.includes(p.id));
    onSelect(people);
    onClose();
  }

  function handleGroupSelect(groupId) {
    const groupPeople = projectIndividuals.filter(p => p.group === groupId);
    onSelect(groupPeople);
    onClose();
  }

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden"
      style={{ animation: 'fadeIn 0.15s ease-out' }}
    >
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="text-xs font-semibold text-stone-700 mb-2">Select approvers</div>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {/* Groups */}
        {!search && (
          <div className="px-3 pb-2">
            <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Groups</div>
            {approverDirectory.groups.map(g => {
              const Icon = groupIcons[g.id] || Users;
              const count = projectIndividuals.filter(p => p.group === g.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={g.id}
                  onClick={() => handleGroupSelect(g.id)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
                    <Icon size={14} className="text-stone-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-stone-800">{g.name}</div>
                    <div className="text-[11px] text-stone-500">{g.description}</div>
                  </div>
                  <span className="text-xs text-stone-400">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Individuals */}
        <div className="px-3 pb-3">
          <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
            {search ? 'Results' : 'Individuals'}
          </div>
          {filteredIndividuals.length === 0 && (
            <div className="text-xs text-stone-400 py-3 text-center">No matching approvers</div>
          )}
          {filteredIndividuals.map(p => (
            <button
              key={p.id}
              onClick={() => togglePerson(p)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-stone-50 transition-colors text-left"
            >
              <div className={`w-6 h-6 rounded-full ${getAvatarColor(p.role)} text-white flex items-center justify-center text-[10px] font-semibold`}>
                {initials(p.name)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-stone-800">{p.name}</div>
                <div className="text-[11px] text-stone-500">{p.role}</div>
              </div>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                selectedIds.includes(p.id)
                  ? 'bg-stone-800 border-stone-800'
                  : 'border-stone-300'
              }`}>
                {selectedIds.includes(p.id) && <Check size={10} className="text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      {selectedIds.length > 0 && (
        <div className="border-t border-stone-200 px-3 py-2.5 bg-stone-50">
          <button
            onClick={handleAdd}
            className="w-full bg-stone-900 text-white text-sm font-medium rounded-lg py-2 hover:bg-stone-800 transition-colors"
          >
            Add {selectedIds.length} approver{selectedIds.length > 1 ? 's' : ''}
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Approval Flow Stepper (Vertical)
   ═══════════════════════════════════════════════════════════════ */
function ApprovalStepper({ approvers, onRemove, onReorder }) {
  const statusIcon = (status) => {
    if (status === 'Approved') return <Check size={12} className="text-emerald-600" />;
    if (status === 'Pending') return <Clock size={12} className="text-amber-600" />;
    return <Clock size={12} className="text-stone-400" />;
  };

  const statusLabel = (status) => {
    if (status === 'Approved') return 'text-emerald-600';
    if (status === 'Pending') return 'text-amber-600';
    return 'text-stone-400';
  };

  return (
    <div className="space-y-0">
      {approvers.map((a, i) => (
        <div key={a.id} className="relative">
          {/* Connector line */}
          {i < approvers.length - 1 && (
            <div className="absolute left-[19px] top-[44px] bottom-0 w-px bg-stone-200" />
          )}
          <div className="flex items-start gap-3 py-2.5">
            {/* Step number */}
            <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
              a.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
              a.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
              'bg-stone-100 text-stone-500'
            }`}>
              {i + 1}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full ${getAvatarColor(a.role)} text-white flex items-center justify-center text-[10px] font-semibold`}>
                  {initials(a.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-900 truncate">{a.name}</div>
                  <div className="text-[11px] text-stone-500">{a.role} · {a.group}</div>
                </div>
              </div>
              {/* Status line */}
              <div className="flex items-center gap-1.5 mt-1 ml-9">
                {statusIcon(a.status)}
                <span className={`text-xs font-medium ${statusLabel(a.status)}`}>{a.status}</span>
                {a.timestamp && (
                  <span className="text-[11px] text-stone-400 ml-1">· {fmtShort(a.timestamp)} {fmtTime(a.timestamp)}</span>
                )}
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-1 pt-1.5 shrink-0">
              {a.status !== 'Approved' && (
                <button
                  onClick={() => onRemove(a.id)}
                  className="text-stone-300 hover:text-red-500 transition-colors p-0.5"
                  title="Remove approver"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <button className="text-stone-300 hover:text-stone-500 transition-colors p-0.5 cursor-grab" title="Reorder">
                <GripVertical size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Smart Defaults Engine
   ═══════════════════════════════════════════════════════════════ */
function getSmartDefaultNote(expense) {
  const notes = [];
  if (!expense.receipt) notes.push('Accounting added — missing receipt');
  if (expense.amount > 500) notes.push('Finance added — amount exceeds $500 threshold');
  const proj = projects.find(p => p.id === expense.projectId);
  if (proj && proj.spent / proj.budget > 0.85) notes.push('Finance added — project over 85% budget');
  return notes;
}

/* ═══════════════════════════════════════════════════════════════
   TAB 1: Overview
   ═══════════════════════════════════════════════════════════════ */
function OverviewContent({ expense, approvers, setApprovers, onAction }) {
  const [memo, setMemo] = useState(expense.description || '');
  const [showSelector, setShowSelector] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(!!expense.receipt);
  const isPending = expense.status === 'Pending Review' || expense.status === 'Missing Receipt';
  const allApproved = approvers.every(a => a.status === 'Approved');
  const smartNotes = getSmartDefaultNote(expense);

  function handleAddApprovers(people) {
    const newApprovers = people.map((p, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: p.name,
      role: p.role,
      group: p.group,
      status: 'Waiting',
      timestamp: null,
    }));
    setApprovers(prev => [...prev, ...newApprovers]);
  }

  function handleRemoveApprover(id) {
    setApprovers(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div>
      {/* Warning banners */}
      {!expense.receipt && (
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-xs text-orange-800 mb-4">
          <Receipt size={14} className="shrink-0 mt-0.5" /> Missing receipt — required for reimbursement processing and accounting export
        </div>
      )}

      {/* ─── Employee (submitter) ─── */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full ${getAvatarColor(expense.role)} flex items-center justify-center text-sm font-semibold text-white`}>
          {initials(expense.employee)}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-semibold text-stone-900">{expense.employee}</span>
          <ChevronRight size={16} className="text-stone-400" />
        </div>
      </div>

      {/* Role + category chips */}
      <div className="flex items-center gap-2 mb-1">
        <div className="inline-flex items-center gap-1.5 bg-stone-100 rounded-lg px-3 py-1.5 text-sm text-stone-700">
          <HardHat size={14} className="text-stone-500" />
          {expense.role}
        </div>
        <div className="inline-flex items-center gap-1.5 bg-stone-100 rounded-lg px-3 py-1.5 text-sm text-stone-700">
          {expense.spendType}
        </div>
        <button className="text-stone-400 hover:text-stone-600"><Edit3 size={14} /></button>
      </div>

      <Divider />

      {/* ─── Transaction state ─── */}
      <div className="mb-2">
        <div className="text-xs text-stone-500 mb-1">Reimbursement state</div>
        <div className="flex items-center gap-1.5">
          {expense.status === 'Approved' ? (
            <><Check size={15} className="text-emerald-600" /><span className="text-sm font-medium text-emerald-700">Approved & processing</span></>
          ) : expense.receipt ? (
            <><Clock size={15} className="text-amber-600" /><span className="text-sm font-medium text-amber-700">Awaiting approval</span></>
          ) : (
            <><AlertTriangle size={15} className="text-orange-600" /><span className="text-sm font-medium text-orange-700">Blocked — missing receipt</span></>
          )}
        </div>
      </div>

      <Divider />

      {/* ═══ APPROVAL SECTION — the core of this spec ═══ */}
      <SectionTitle>Approval</SectionTitle>

      {/* Status banner */}
      <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border mb-4 ${
        allApproved && expense.status === 'Approved'
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-amber-50 border-amber-200'
      }`}>
        {allApproved && expense.status === 'Approved' ? (
          <><Check size={14} className="text-emerald-600" /><span className="text-xs font-medium text-emerald-700">All approvals complete</span></>
        ) : (
          <><Clock size={14} className="text-amber-600" /><span className="text-xs font-medium text-amber-700">Approval in progress</span></>
        )}
      </div>

      {/* Smart defaults note */}
      {smartNotes.length > 0 && isPending && (
        <div className="mb-3 space-y-1">
          {smartNotes.map((note, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-stone-500">
              <Zap size={10} className="text-amber-500 shrink-0" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* Approval stepper */}
      <div className="border border-stone-200 rounded-xl p-4 relative">
        <ApprovalStepper
          approvers={approvers}
          onRemove={handleRemoveApprover}
          onReorder={() => {}}
        />

        {/* Add approver button */}
        <div className="mt-3 pt-3 border-t border-stone-100 relative">
          <button
            onClick={() => setShowSelector(true)}
            className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Plus size={14} /> <span className="underline">Add approver</span>
          </button>

          {/* Dropdown selector */}
          {showSelector && (
            <ApproverSelectorDropdown
              expense={expense}
              onSelect={handleAddApprovers}
              onClose={() => setShowSelector(false)}
            />
          )}
        </div>
      </div>

      {/* Guardrails */}
      <div className="text-xs text-stone-500 flex items-start gap-1.5 mt-2.5">
        <Shield size={11} className="shrink-0 mt-0.5" />
        At least one project-level approver required. Cannot remove required approvers.
      </div>

      <Divider />

      {/* ─── Submission policy ─── */}
      <div className="mb-1">
        <div className="text-xs text-stone-500 mb-0.5">Submission policy</div>
        <div className="text-sm font-medium text-stone-900">Reimbursement — Field Spend</div>
      </div>

      <Divider />

      {/* ─── Receipts ─── */}
      <SectionTitle right={
        <button className="text-xs text-stone-600 underline hover:text-stone-900 flex items-center gap-1">
          Search in Gmail <ExternalLink size={11} />
        </button>
      }>
        Receipts
      </SectionTitle>

      {!receiptUploaded ? (
        <div
          onClick={() => setShowUpload(true)}
          className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 transition-colors bg-amber-50/30"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            <Upload size={16} className="text-stone-500" />
            Add receipts
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Receipt size={16} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-emerald-800">receipt_{expense.id}.jpg</div>
            <div className="text-xs text-emerald-600">Uploaded {fmtShort(expense.date)}</div>
          </div>
          <button className="text-xs text-emerald-700 underline">View</button>
        </div>
      )}

      {showUpload && (
        <UploadReceiptModal
          onClose={() => setShowUpload(false)}
          onSave={(files) => {
            if (files.length > 0) {
              setReceiptUploaded(true);
              onAction?.('approve', `Receipt uploaded — ${files.length} file${files.length > 1 ? 's' : ''} saved`);
            }
          }}
        />
      )}

      <Divider />

      {/* ─── Memo ─── */}
      <SectionTitle>Description / Memo</SectionTitle>
      <textarea
        value={memo}
        onChange={e => setMemo(e.target.value)}
        placeholder="Add a description — e.g., jobsite supplies, mileage for site inspection..."
        rows={3}
        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
      />
      {memo && (
        <div className="border border-stone-200 rounded-lg px-4 py-2.5 mt-2 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <MessageSquare size={14} className="text-stone-500" />
            <span><strong>Recurring?</strong> Make this a recurring reimbursement</span>
          </div>
          <button className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 font-medium">
            Set up <Zap size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2: Job Context
   ═══════════════════════════════════════════════════════════════ */
function JobContextContent({ expense }) {
  const proj = projects.find(p => p.id === expense.projectId);
  const pctUsed = proj ? (proj.spent / proj.budget) * 100 : 0;
  const budgetRemaining = proj ? proj.budget - proj.spent : 0;
  const isWeekend = [0, 6].includes(new Date(expense.date).getDay());

  return (
    <div>
      <SectionTitle>Project</SectionTitle>
      <FieldCard label="Project" value={expense.project} verified sub={expense.projectCode} />
      <FieldCard label="Cost Code" value={expense.costCode || '—'} verified={!!expense.costCode} />
      <FieldCard label="Spend Type" value={expense.spendType} verified />
      <FieldCard label="Trade" value={expense.trade} verified />

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

        {expense.amount > 500 && (
          <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2.5">
              <DollarSign size={16} className="text-amber-600" />
              <div>
                <div className="text-sm font-medium text-stone-800">High-value reimbursement</div>
                <div className="text-xs text-stone-500">Amount exceeds $500 — may require additional approval</div>
              </div>
            </div>
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Flagged</span>
          </div>
        )}

        {(() => {
          const proj2 = projects.find(p => p.id === expense.projectId);
          const overBudget = proj2 && (proj2.spent / proj2.budget) > 0.85;
          return overBudget ? (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-red-50 border-red-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={16} className="text-red-600" />
                <div>
                  <div className="text-sm font-medium text-stone-800">Project over 85% budget</div>
                  <div className="text-xs text-stone-500">Finance approval may be required for additional spend</div>
                </div>
              </div>
              <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Alert</span>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3: Accounting
   ═══════════════════════════════════════════════════════════════ */
function AccountingContent({ expense }) {
  const isExportReady = expense.receipt && expense.costCode && expense.status === 'Approved';

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
          : <><AlertTriangle size={14} className="text-amber-600" /><span className="text-xs font-medium text-amber-700">Not ready — {!expense.receipt ? 'missing receipt' : expense.status !== 'Approved' ? 'pending approval' : 'missing fields'}</span></>
        }
      </div>

      <FieldCard
        label="Spend Type"
        value={expense.spendType}
        verified
        rightLabel="Accounting Category"
        rightValue="Accounting Category"
        rightVerified
      />
      <FieldCard label="Project" value={expense.project} verified />
      <FieldCard label="Cost Code" value={expense.costCode || 'Missing — required'} verified={!!expense.costCode} />
      <FieldCard label="Employee" value={expense.employee} verified sub={expense.role} />
      <FieldCard
        label="Accounting date"
        value={new Date(expense.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
        verified
      />
      <div className="text-xs text-stone-500 mt-1 mb-2">Edit the accounting date for this specific reimbursement.</div>

      <Divider />

      <SectionTitle>Enforcement</SectionTitle>
      <div className="space-y-2">
        {[
          { label: 'Receipt', ok: expense.receipt, okText: 'Attached', failText: 'Missing' },
          { label: 'Cost code', ok: !!expense.costCode, okText: 'Complete', failText: 'Missing' },
          { label: 'Project assignment', ok: !!expense.projectId, okText: 'Complete', failText: 'Missing' },
          { label: 'Approval status', ok: expense.status === 'Approved', okText: 'Approved', failText: expense.status },
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
        Receipt + approval required before export. Cost code required by policy.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB 4: Activity
   ═══════════════════════════════════════════════════════════════ */
function ActivityContent({ expense, approvers }) {
  const activities = [
    { time: `${fmtShort(expense.date)} · 9:15 AM`, who: expense.employee, action: 'Reimbursement submitted', icon: Receipt },
    ...(expense.receipt ? [{ time: `${fmtShort(expense.date)} · 9:16 AM`, who: expense.employee, action: 'Receipt uploaded', icon: Upload }] : []),
    ...(expense.description ? [{ time: `${fmtShort(expense.date)} · 9:16 AM`, who: expense.employee, action: `Description: "${expense.description}"`, icon: MessageSquare }] : []),
    { time: `${fmtShort(expense.date)} · 9:17 AM`, who: 'System', action: `Auto-assigned to project: ${expense.project}`, icon: HardHat },
    // Approver-related activity
    ...approvers
      .filter(a => a.status !== 'Waiting')
      .map(a => ({
        time: a.timestamp ? `${fmtShort(a.timestamp)} · ${fmtTime(a.timestamp)}` : `${fmtShort(expense.date)} · 9:18 AM`,
        who: a.status === 'Approved' ? a.name : 'System',
        action: a.status === 'Approved'
          ? `Approved by ${a.name} (${a.group})`
          : `Approval request sent to ${a.name} (${a.group})`,
        icon: a.status === 'Approved' ? Check : Clock,
      })),
    ...(!expense.receipt ? [{ time: `${fmtShort(expense.date)} · 9:20 AM`, who: 'System', action: 'Missing receipt — reminder sent', icon: Flag }] : []),
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

/* ═══════════════════════════════════════════════════════════════
   Main Drawer — 4 tabs
   ═══════════════════════════════════════════════════════════════ */
const DRAWER_TABS = ['Overview', 'Job Context', 'Activity'];

export default function ReimbursementDrawer({ expense, onClose, onAction }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [approvers, setApprovers] = useState(expense?.approvers || []);

  if (!expense) return null;

  function handleAction(type, message) {
    onAction?.(type, message);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/10 z-40 transition-opacity" onClick={onClose} />
      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 h-full w-[520px] bg-white shadow-2xl border-l border-stone-200 z-50 flex flex-col"
        style={{ animation: 'drawerSlideIn 0.2s ease-out' }}
      >
        {/* ─── Header ─── */}
        <div className="px-6 pt-5 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900">
              <ArrowLeft size={15} /> Back
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600">
              <X size={18} />
            </button>
          </div>
          {/* Amount */}
          <div className="text-4xl font-semibold text-stone-900 tracking-tight">{fmt(expense.amount)} USD</div>
          {/* Status + date + employee */}
          <div className="flex items-center gap-2 mt-1.5 text-sm text-stone-500">
            <StatusBadge status={expense.status} />
            <span>·</span>
            <span>{fmtDate(expense.date)}</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Reimbursement · {expense.employee} · {expense.project}
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="border-b border-stone-200 px-6 shrink-0">
          <nav className="flex gap-0 -mb-px">
            {DRAWER_TABS.map(tab => (
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
          {activeTab === 'Overview' && (
            <OverviewContent expense={expense} approvers={approvers} setApprovers={setApprovers} onAction={handleAction} />
          )}
          {activeTab === 'Job Context' && <JobContextContent expense={expense} />}
          {activeTab === 'Activity' && <ActivityContent expense={expense} approvers={approvers} />}
        </div>

        {/* ─── Persistent footer — contextual actions ─── */}
        <div className="border-t border-stone-200 px-6 py-3 bg-white flex items-center justify-center gap-3 shrink-0">
          {expense.status === 'Pending Review' && (
            <>
              <button
                onClick={() => handleAction('approve', `Reimbursement for ${expense.employee} — ${fmt(expense.amount)} approved`)}
                className="flex items-center gap-2 text-sm bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 font-medium"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => handleAction('reject', `Reimbursement for ${expense.employee} — ${fmt(expense.amount)} rejected`)}
                className="flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-lg px-5 py-2.5 hover:bg-red-50 font-medium"
              >
                <Ban size={14} /> Reject
              </button>
            </>
          )}
          {expense.status === 'Missing Receipt' && (
            <>
              <button
                onClick={() => handleAction('flag', `Receipt reminder sent to ${expense.employee}`)}
                className="flex items-center gap-2 text-sm bg-amber-600 text-white rounded-lg px-5 py-2.5 hover:bg-amber-700 font-medium"
              >
                <Send size={14} /> Request receipt
              </button>
              <button
                onClick={() => handleAction('reject', `Reimbursement for ${expense.employee} — ${fmt(expense.amount)} rejected`)}
                className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-5 py-2.5 hover:bg-stone-50 font-medium"
              >
                <Ban size={14} /> Reject
              </button>
            </>
          )}
          {expense.status === 'Approved' && (
            <button
              onClick={() => handleAction('flag', `Reimbursement for ${expense.employee} flagged for review`)}
              className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 rounded-lg px-5 py-2.5 hover:bg-stone-50 font-medium"
            >
              <Flag size={14} /> Flag for review
            </button>
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
