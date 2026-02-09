import { useState, useCallback } from 'react';
import {
  Search, Calendar, Table2, Download, ChevronDown,
  Flag, Check, MoreVertical, Landmark, CreditCard, Banknote,
  ShieldAlert, Receipt, SlidersHorizontal, Ban,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';
import CardTransactionModal from '../components/CardTransactionModal';
import CardRequestModal from '../components/CardRequestModal';
import ReimbursementModal from '../components/ReimbursementModal';
import BillModal from '../components/BillModal';
import { ProcurementRequestModal } from '../components/ProcurementModal';
import {
  inboxCardRequests,
  inboxCardTransactions,
  inboxReimbursements,
  inboxBills,
  inboxProcurement,
} from '../data/mockData';

const TABS = ['Card requests', 'Card transactions', 'Reimbursements', 'Bills', 'Procurement'];

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    'bg-amber-600', 'bg-stone-500', 'bg-emerald-600', 'bg-violet-500',
    'bg-rose-500', 'bg-cyan-600', 'bg-orange-600', 'bg-indigo-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/* ─── Toolbar ─── */
function InboxToolbar({ search, setSearch, rightSlot }) {
  return (
    <div className="flex items-center justify-between mb-0">
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
      </div>
      <div className="flex items-center gap-1.5">
        {rightSlot}
        <button className="p-2 rounded-lg hover:bg-ramp-gray-100 text-ramp-gray-500"><Calendar size={16} /></button>
        <button className="p-2 rounded-lg hover:bg-ramp-gray-100 text-ramp-gray-500"><Table2 size={16} /></button>
        <button className="p-2 rounded-lg hover:bg-ramp-gray-100 text-ramp-gray-500"><Download size={16} /></button>
      </div>
    </div>
  );
}

/* ─── Tab: Card Requests ─── */
function CardRequestsTab({ data, onRowClick, onAction }) {
  const [search, setSearch] = useState('');
  const filtered = data.filter(r =>
    !search || r.requester.toLowerCase().includes(search.toLowerCase()) || r.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <InboxToolbar search={search} setSearch={setSearch} />
      <div className="border border-ramp-gray-200 rounded-xl overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
            <tr>
              <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-ramp-gray-300" /></th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Requester</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Project</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Card type</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Limit</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Categories</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Reason</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ramp-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-ramp-gray-50 transition-colors cursor-pointer" onClick={() => onRowClick(r)}>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-ramp-gray-300" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(r.requester)}`}>
                      {getInitials(r.requester)}
                    </div>
                    <div>
                      <div className="font-medium text-ramp-gray-900">{r.requester}</div>
                      <div className="text-xs text-ramp-gray-500">{r.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ramp-gray-700">{r.project}</td>
                <td className="px-4 py-3 text-ramp-gray-600">{r.cardType}</td>
                <td className="px-4 py-3 text-right font-medium text-ramp-gray-900">{formatCurrency(r.limit)}</td>
                <td className="px-4 py-3 text-ramp-gray-600 text-xs">{r.spendCategories}</td>
                <td className="px-4 py-3 text-ramp-gray-600 text-xs max-w-52 truncate">{r.reason}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAction('cardRequest', r.id, 'approve', `Approved card request — ${r.requester} (${r.cardType}, ${formatCurrency(r.limit)})`)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onAction('cardRequest', r.id, 'deny', `Denied card request — ${r.requester}`)}
                      className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100"
                    >
                      Deny
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Tab: Card Transactions ─── */
function CardTransactionsTab({ data, onRowClick, onAction }) {
  const [search, setSearch] = useState('');

  return (
    <div>
      <InboxToolbar
        search={search}
        setSearch={setSearch}
        rightSlot={
          <>
            <button className="flex items-center gap-1.5 text-sm bg-ramp-gray-900 text-white rounded-lg px-3 py-2 hover:bg-ramp-gray-800 font-medium">
              <CreditCard size={14} />
              Cardholder
            </button>
            <button className="flex items-center gap-1.5 text-sm border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50 text-ramp-gray-700">
              Reminders
              <span className="bg-ramp-green text-ramp-black text-xs px-1.5 py-0.5 rounded-full font-semibold">3</span>
              <ChevronDown size={12} />
            </button>
          </>
        }
      />
      <div className="border border-ramp-gray-200 rounded-xl overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
            <tr>
              <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-ramp-gray-300" /></th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Date</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Policy information</th>
              <th className="text-center px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Receipt</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Memo</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Resolution</th>
            </tr>
          </thead>
          <tbody>
            {data.map((group) => (
              <GroupedCardTransactions key={group.id} group={group} onRowClick={onRowClick} onAction={onAction} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupedCardTransactions({ group, onRowClick, onAction }) {
  return (
    <>
      {/* Group header */}
      <tr className="bg-white border-t border-ramp-gray-200">
        <td className="px-4 py-3"><input type="checkbox" className="rounded border-ramp-gray-300" /></td>
        <td colSpan={6} className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(group.cardholder)}`}>
              {getInitials(group.cardholder)}
            </div>
            <span className="font-semibold text-ramp-gray-900">{group.cardholder}</span>
          </div>
        </td>
      </tr>
      {/* Individual transactions */}
      {group.transactions.map((t) => (
        <tr
          key={t.id}
          className="hover:bg-ramp-gray-50 transition-colors border-t border-ramp-gray-100 cursor-pointer"
          onClick={() => onRowClick(t, group.cardholder)}
        >
          <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-ramp-gray-300" /></td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ramp-gray-100 flex items-center justify-center text-ramp-gray-500">
                <CreditCard size={14} />
              </div>
              <div>
                <div className="font-medium text-ramp-gray-900">{t.merchant}</div>
                <div className="text-xs text-ramp-gray-500">
                  {formatDate(t.date)} · {t.category}
                </div>
                <div className="text-xs text-blue-600">{t.status}</div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-right font-medium text-ramp-gray-900">{formatCurrency(t.amount)}</td>
          <td className="px-4 py-3 text-ramp-gray-500 text-sm">{t.policyInfo || '—'}</td>
          <td className="px-4 py-3 text-center text-ramp-gray-500 text-sm">{t.receipt ? 'Yes' : '—'}</td>
          <td className="px-4 py-3 text-ramp-gray-500 text-sm max-w-40 truncate">{t.memo || '—'}</td>
          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
            {t.status === 'Ready to approve' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAction('cardTransaction', t.id, 'approve', `Approved transaction — ${t.merchant} (${formatCurrency(t.amount)})`)}
                  className="w-8 h-8 flex items-center justify-center border border-emerald-300 rounded-md text-emerald-600 hover:bg-emerald-50"
                  title="Approve"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => onAction('cardTransaction', t.id, 'flag', `Flagged transaction — ${t.merchant}`)}
                  className="w-8 h-8 flex items-center justify-center border border-orange-300 rounded-md text-orange-600 hover:bg-orange-50"
                  title="Flag"
                >
                  <Flag size={14} />
                </button>
                <button
                  onClick={() => onAction('cardTransaction', t.id, 'reject', `Disputed transaction — ${t.merchant} (${formatCurrency(t.amount)})`)}
                  className="w-8 h-8 flex items-center justify-center border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                  title="Dispute"
                >
                  <ShieldAlert size={14} />
                </button>
              </div>
            )}
            {t.status === 'Needs review' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAction('cardTransaction', t.id, 'flag', `Requested info for ${t.merchant}`)}
                  className="w-8 h-8 flex items-center justify-center border border-amber-300 rounded-md text-amber-600 hover:bg-amber-50"
                  title="Request info"
                >
                  <Receipt size={14} />
                </button>
                <button
                  onClick={() => onAction('cardTransaction', t.id, 'approve', `Approved transaction — ${t.merchant} (${formatCurrency(t.amount)})`)}
                  className="w-8 h-8 flex items-center justify-center border border-emerald-300 rounded-md text-emerald-600 hover:bg-emerald-50"
                  title="Approve anyway"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => onAction('cardTransaction', t.id, 'reject', `Disputed transaction — ${t.merchant} (${formatCurrency(t.amount)})`)}
                  className="w-8 h-8 flex items-center justify-center border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                  title="Dispute"
                >
                  <ShieldAlert size={14} />
                </button>
              </div>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

/* ─── Tab: Reimbursements ─── */
function ReimbursementsTab({ data, onRowClick, onAction }) {
  const [search, setSearch] = useState('');
  const totalItems = data.reduce((s, g) => s + g.items.length, 0);

  return (
    <div>
      <InboxToolbar search={search} setSearch={setSearch} />
      <div className="border border-ramp-gray-200 rounded-xl overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
            <tr>
              <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-ramp-gray-300" /></th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">User</th>
              <th className="text-center px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Receipt</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Submitted date</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Transaction date</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Spent on</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Review</th>
            </tr>
          </thead>
          <tbody>
            {data.map((group) => (
              <GroupedReimbursements key={group.id} group={group} onRowClick={onRowClick} onAction={onAction} />
            ))}
          </tbody>
        </table>
        {totalItems > 0 && (
          <div className="px-4 py-3 bg-ramp-gray-50 border-t border-ramp-gray-200 text-xs text-ramp-gray-500">
            1–{totalItems} of {totalItems} reimbursements · {formatCurrency(
              data.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.amount, 0), 0)
            )} total
          </div>
        )}
      </div>
    </div>
  );
}

function GroupedReimbursements({ group, onRowClick, onAction }) {
  return (
    <>
      <tr className="bg-white border-t border-ramp-gray-200">
        <td className="px-4 py-3"><input type="checkbox" className="rounded border-ramp-gray-300" /></td>
        <td colSpan={7} className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getAvatarColor(group.user)}`}>
              {getInitials(group.user)}
            </div>
            <span className="font-semibold text-ramp-gray-900">{group.user}</span>
          </div>
        </td>
      </tr>
      {group.items.map((item) => (
        <tr
          key={item.id}
          className="hover:bg-ramp-gray-50 transition-colors border-t border-ramp-gray-100 cursor-pointer"
          onClick={() => onRowClick(item, group.user, group.role)}
        >
          <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-ramp-gray-300" /></td>
          <td className="px-4 py-3">
            <div className="text-ramp-gray-900">{group.user}</div>
            <div className="text-xs text-ramp-gray-500">{group.role}</div>
          </td>
          <td className="px-4 py-3 text-center text-ramp-gray-500">—</td>
          <td className="px-4 py-3 text-ramp-gray-700">{formatDate(item.submittedDate)}</td>
          <td className="px-4 py-3 text-ramp-gray-700">{formatDate(item.transactionDate)}</td>
          <td className="px-4 py-3 text-ramp-gray-700">{item.spentOn}</td>
          <td className="px-4 py-3 text-right font-medium text-ramp-gray-900">{formatCurrency(item.amount)} USD</td>
          <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
            {item.status === 'Pending review' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAction('reimbursement', item.id, 'pay', `Approved & paid reimbursement — ${group.user} (${formatCurrency(item.amount)})`)}
                  className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Banknote size={12} />
                  Pay
                </button>
                <button
                  onClick={() => onAction('reimbursement', item.id, 'reject', `Rejected reimbursement — ${group.user} (${item.spentOn})`)}
                  className="w-7 h-7 flex items-center justify-center border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                  title="Reject"
                >
                  <Ban size={12} />
                </button>
                <button
                  onClick={() => onAction('reimbursement', item.id, 'flag', `Changed spending limit for ${group.user}`)}
                  className="w-7 h-7 flex items-center justify-center border border-stone-300 rounded-md text-stone-500 hover:bg-stone-50"
                  title="Change limit"
                >
                  <SlidersHorizontal size={12} />
                </button>
              </div>
            )}
            {item.status !== 'Pending review' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAction('reimbursement', item.id, 'pay', `Approved & paid reimbursement — ${group.user} (${formatCurrency(item.amount)})`)}
                  className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Banknote size={12} />
                  Pay
                </button>
                <button
                  onClick={() => onAction('reimbursement', item.id, 'reject', `Rejected reimbursement — ${group.user} (${item.spentOn})`)}
                  className="w-7 h-7 flex items-center justify-center border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                  title="Reject"
                >
                  <Ban size={12} />
                </button>
              </div>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

/* ─── Tab: Bills ─── */
function BillsTab({ data, onRowClick }) {
  const [search, setSearch] = useState('');

  return (
    <div>
      <InboxToolbar search={search} setSearch={setSearch} />
      <div className="border border-ramp-gray-200 rounded-xl overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
            <tr>
              <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-ramp-gray-300" /></th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Vendor / owner</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Payment date</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Due date</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ramp-gray-100">
            {data.map((bill) => (
              <tr key={bill.id} className="hover:bg-ramp-gray-50 transition-colors cursor-pointer" onClick={() => onRowClick(bill)}>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-ramp-gray-300" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${bill.color}`}>
                      {bill.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ramp-gray-900">{bill.vendor}</span>
                        {bill.statusIcon === 'bank' && <Landmark size={13} className="text-ramp-gray-400" />}
                        {bill.statusIcon === 'card' && <CreditCard size={13} className="text-ramp-gray-400" />}
                      </div>
                      <div className="text-xs text-ramp-gray-500">{bill.owner} · {bill.ownerDate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={bill.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium text-ramp-gray-900">{formatCurrency(bill.amount)}</td>
                <td className="px-4 py-3">
                  <div className="text-ramp-gray-900">{bill.paymentDate}</div>
                  <div className="text-xs text-ramp-gray-500">{bill.paymentArrived}</div>
                </td>
                <td className="px-4 py-3 text-ramp-gray-700">{bill.dueDate}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onRowClick(bill)}
                    className="px-3 py-1.5 border border-ramp-gray-200 rounded-md text-xs font-medium text-ramp-gray-700 hover:bg-ramp-gray-50 flex items-center gap-1.5"
                  >
                    <Download size={12} />
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Tab: Procurement ─── */
function ProcurementTab({ data, onRowClick }) {
  const [search, setSearch] = useState('');

  return (
    <div>
      <InboxToolbar search={search} setSearch={setSearch} />
      <div className="border border-ramp-gray-200 rounded-xl overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
            <tr>
              <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-ramp-gray-300" /></th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Request</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Project</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Category</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ramp-gray-100">
            {data.map((p) => (
              <tr key={p.id} className="hover:bg-ramp-gray-50 transition-colors cursor-pointer" onClick={() => onRowClick(p)}>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-ramp-gray-300" /></td>
                <td className="px-4 py-3">
                  <div className="font-medium text-ramp-gray-900">{p.name}</div>
                  <div className="text-xs text-ramp-gray-500">{p.requester} · {formatDate(p.date)}</div>
                </td>
                <td className="px-4 py-3 text-ramp-gray-700">{p.project}</td>
                <td className="px-4 py-3"><StatusBadge status={p.category} /></td>
                <td className="px-4 py-3 text-right font-medium text-ramp-gray-900">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRowClick(p)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onRowClick(p)}
                      className="px-3 py-1.5 border border-ramp-gray-200 rounded-md text-xs font-medium text-ramp-gray-700 hover:bg-ramp-gray-50"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Inbox Component ─── */
export default function Inbox() {
  const [activeTab, setActiveTab] = useState('Card transactions');

  // Modal state
  const [modalState, setModalState] = useState({ type: null, data: null, extra: null });

  // Dismissed items — track by unique key (type + id)
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Toast state
  const [toast, setToast] = useState(null);

  const openModal = (type, data, extra = null) => setModalState({ type, data, extra });
  const closeModal = () => setModalState({ type: null, data: null, extra: null });

  // Handle action from modals (approve, deny, reject, flag, pay)
  const handleAction = useCallback((actionType, message) => {
    const { type, data } = modalState;
    if (!data) return;

    // Build a unique dismiss key from the modal type and item id
    const dismissKey = `${type}-${data.id}`;

    // Close the modal
    closeModal();

    // Add to dismissed set
    setDismissedIds(prev => {
      const next = new Set(prev);
      next.add(dismissKey);
      return next;
    });

    // Show toast
    setToast({
      id: Date.now(),
      message,
      type: actionType,
      visible: true,
    });
  }, [modalState]);

  // Handle direct inline action from table row buttons (no modal involved)
  const handleDirectAction = useCallback((dismissType, itemId, actionType, message) => {
    const dismissKey = `${dismissType}-${itemId}`;

    setDismissedIds(prev => {
      const next = new Set(prev);
      next.add(dismissKey);
      return next;
    });

    setToast({
      id: Date.now(),
      message,
      type: actionType,
      visible: true,
    });
  }, []);

  const handleDismissToast = useCallback((id) => {
    setToast(prev => (prev?.id === id ? null : prev));
  }, []);

  // ─── Filter out dismissed items ───

  const filteredCardRequests = inboxCardRequests.filter(
    r => !dismissedIds.has(`cardRequest-${r.id}`)
  );

  const filteredCardTransactions = inboxCardTransactions
    .map(group => ({
      ...group,
      transactions: group.transactions.filter(
        t => !dismissedIds.has(`cardTransaction-${t.id}`)
      ),
    }))
    .filter(group => group.transactions.length > 0);

  const filteredReimbursements = inboxReimbursements
    .map(group => ({
      ...group,
      items: group.items.filter(
        item => !dismissedIds.has(`reimbursement-${item.id}`)
      ),
    }))
    .filter(group => group.items.length > 0);

  const filteredBills = inboxBills.filter(
    b => !dismissedIds.has(`bill-${b.id}`)
  );

  const filteredProcurement = inboxProcurement.filter(
    p => !dismissedIds.has(`procurement-${p.id}`)
  );

  // ─── Counts ───

  const totalCount =
    filteredCardRequests.length +
    filteredCardTransactions.reduce((s, g) => s + g.transactions.length, 0) +
    filteredReimbursements.reduce((s, g) => s + g.items.length, 0) +
    filteredBills.length +
    filteredProcurement.length;

  const tabCounts = {
    'Reimbursements': filteredReimbursements.reduce((s, g) => s + g.items.length, 0),
    'Bills': filteredBills.length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-3">
          <h1 className="text-4xl font-semibold text-ramp-gray-900 tracking-tight">Inbox</h1>
          <span className="text-2xl text-ramp-gray-400 font-light">{totalCount}</span>
        </div>
        <button className="flex items-center gap-1.5 text-sm border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50 text-ramp-gray-700">
          Reminders
          <span className="bg-ramp-green text-ramp-black text-xs px-1.5 py-0.5 rounded-full font-semibold">3</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-ramp-gray-200 mb-5">
        <nav className="flex gap-0 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-ramp-black text-ramp-black'
                  : 'border-transparent text-ramp-gray-500 hover:text-ramp-gray-700 hover:border-ramp-gray-300'
              }`}
            >
              {tab}
              {tabCounts[tab] != null && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab
                    ? 'bg-ramp-gray-900 text-white'
                    : 'bg-ramp-gray-200 text-ramp-gray-600'
                }`}>
                  {tabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'Card requests' && (
        <CardRequestsTab data={filteredCardRequests} onRowClick={(r) => openModal('cardRequest', r)} onAction={handleDirectAction} />
      )}
      {activeTab === 'Card transactions' && (
        <CardTransactionsTab data={filteredCardTransactions} onRowClick={(tx, cardholder) => openModal('cardTransaction', tx, cardholder)} onAction={handleDirectAction} />
      )}
      {activeTab === 'Reimbursements' && (
        <ReimbursementsTab data={filteredReimbursements} onRowClick={(item, user, role) => openModal('reimbursement', item, { user, role })} onAction={handleDirectAction} />
      )}
      {activeTab === 'Bills' && (
        <BillsTab data={filteredBills} onRowClick={(bill) => openModal('bill', bill)} />
      )}
      {activeTab === 'Procurement' && (
        <ProcurementTab data={filteredProcurement} onRowClick={(p) => openModal('procurement', p)} />
      )}

      {/* ─── Modals ─── */}
      <CardTransactionModal
        open={modalState.type === 'cardTransaction'}
        onClose={closeModal}
        onAction={handleAction}
        transaction={modalState.type === 'cardTransaction' ? modalState.data : null}
        cardholder={modalState.type === 'cardTransaction' ? modalState.extra : ''}
      />

      <CardRequestModal
        open={modalState.type === 'cardRequest'}
        onClose={closeModal}
        onAction={handleAction}
        request={modalState.type === 'cardRequest' ? modalState.data : null}
      />

      <ReimbursementModal
        open={modalState.type === 'reimbursement'}
        onClose={closeModal}
        onAction={handleAction}
        item={modalState.type === 'reimbursement' ? modalState.data : null}
        user={modalState.type === 'reimbursement' ? modalState.extra?.user : ''}
        role={modalState.type === 'reimbursement' ? modalState.extra?.role : ''}
      />

      <BillModal
        open={modalState.type === 'bill'}
        onClose={closeModal}
        onAction={handleAction}
        bill={modalState.type === 'bill' ? modalState.data : null}
      />

      <ProcurementRequestModal
        open={modalState.type === 'procurement'}
        onClose={closeModal}
        onAction={handleAction}
        item={modalState.type === 'procurement' ? modalState.data : null}
      />

      {/* ─── Toast ─── */}
      <Toast toast={toast} onDismiss={handleDismissToast} />
    </div>
  );
}
