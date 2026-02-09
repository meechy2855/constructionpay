import { useState, useCallback } from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowRight, CheckCircle2, X, Clock, Shield, Zap, Check, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Toast from '../components/Toast';
import { capitalOffers, capitalBalance } from '../data/mockData';

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function CapitalDashboard() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">Outstanding Balance</div>
        <div className="text-2xl font-semibold text-ramp-gray-900">{formatCurrency(capitalBalance.totalOutstanding)}</div>
        <div className="text-xs text-ramp-gray-500 mt-1">Across {capitalBalance.byProject.length} projects</div>
      </div>
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">Upcoming Repayments</div>
        <div className="text-2xl font-semibold text-amber-600">{formatCurrency(capitalBalance.upcomingRepayments)}</div>
        <div className="text-xs text-ramp-gray-500 mt-1">Next 30 days</div>
      </div>
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">Effective DPO Extension</div>
        <div className="text-2xl font-semibold text-ramp-gray-900">{capitalBalance.effectiveDPO} days</div>
        <div className="text-xs text-emerald-600 mt-1">+28 days vs. standard</div>
      </div>
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">Vendor On-Time Score</div>
        <div className="text-2xl font-semibold text-emerald-600">96%</div>
        <div className="text-xs text-ramp-gray-500 mt-1">Last 90 days</div>
      </div>
    </div>
  );
}

/* ─── Flex Pay Modal ─── */
function FlexPayModal({ offer, selectedTerm: initialTerm, onClose, onConfirm }) {
  const [selectedTerm, setSelectedTerm] = useState(initialTerm);

  const dpoExtension = selectedTerm ? selectedTerm.days : 0;
  const totalCost = selectedTerm ? offer.invoiceAmount + selectedTerm.feeAmount : offer.invoiceAmount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ animation: 'flexFadeIn 0.15s ease-out' }}
      role="dialog"
      aria-modal="true"
      aria-label="Flex Pay"
    >
      <div
        className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 80px)', animation: 'flexSlideUp 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-stone-200 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 tracking-tight">Flex Pay — Extend Your Cash Runway</h2>
              <p className="text-sm text-stone-500 mt-1">Pay vendors on time, repay Ramp later. Aligned to construction payment cycles.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors ml-4 shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Context block */}
          <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wide font-medium">Vendor</div>
                <div className="text-sm font-semibold text-stone-900 mt-0.5">{offer.vendor}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wide font-medium">Project</div>
                <div className="text-sm font-semibold text-stone-900 mt-0.5">{offer.project}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wide font-medium">Invoice Amount</div>
                <div className="text-sm font-semibold text-stone-900 mt-0.5">{formatCurrency(offer.invoiceAmount)}</div>
              </div>
              <div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wide font-medium">Due Date</div>
                <div className="text-sm font-semibold text-stone-900 mt-0.5">Net 30</div>
              </div>
            </div>
          </div>

          {/* Term selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Select repayment term</h3>
            <div className="grid grid-cols-3 gap-3">
              {offer.terms.map((term) => {
                const isSelected = selectedTerm?.days === term.days;
                return (
                  <button
                    key={term.days}
                    onClick={() => setSelectedTerm(term)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`text-lg font-bold ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>{term.days}</div>
                    <div className="text-xs text-stone-500">days</div>
                    <div className="border-t border-stone-200 mt-2 pt-2">
                      <div className="text-xs text-stone-500">Fee: {term.fee}%</div>
                      <div className={`text-sm font-semibold mt-0.5 ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                        {formatCurrency(term.feeAmount)}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2">
                        <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto">
                          <Check size={12} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time cost summary */}
          {selectedTerm && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 mb-6">
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-2">Cost Summary</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700">Invoice amount</span>
                  <span className="text-emerald-900 font-medium">{formatCurrency(offer.invoiceAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700">Flex Pay fee ({selectedTerm.fee}%)</span>
                  <span className="text-emerald-900 font-medium">{formatCurrency(selectedTerm.feeAmount)}</span>
                </div>
                <div className="border-t border-emerald-200 pt-1.5 flex justify-between text-sm">
                  <span className="text-emerald-800 font-semibold">Total repayment</span>
                  <span className="text-emerald-900 font-bold">{formatCurrency(totalCost)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Construction-specific insights */}
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Construction-Specific Insights</h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 px-3.5 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900">DPO Extension</div>
                  <div className="text-xs text-blue-700 mt-0.5">
                    {selectedTerm
                      ? `Extends your Days Payable Outstanding by ${dpoExtension} days — aligned with pay-when-paid cycles`
                      : 'Select a term to see your DPO extension'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 px-3.5 py-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Users size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-emerald-900">Vendor On-Time Payment</div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    {offer.vendor} gets paid on time — maintain your 96% on-time vendor score
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 px-3.5 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-amber-900">Project Continuity</div>
                  <div className="text-xs text-amber-700 mt-0.5">
                    Keep {offer.project} on schedule — no payment delays, no work stoppages
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-6 py-4 bg-white rounded-b-2xl shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-sm text-stone-600 border border-stone-200 rounded-lg px-5 py-2.5 hover:bg-stone-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedTerm) {
                onConfirm(offer, selectedTerm);
              }
            }}
            disabled={!selectedTerm}
            className="flex items-center gap-2 text-sm bg-stone-900 text-white rounded-lg px-5 py-2.5 hover:bg-stone-800 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap size={14} />
            {selectedTerm
              ? `Pay Vendor Now, Repay in ${selectedTerm.days} Days`
              : 'Select a term'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes flexFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes flexSlideUp { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

function InvoiceFinancingCard({ offer, onFlexPay }) {
  const [selectedTerm, setSelectedTerm] = useState(null);

  return (
    <div className="border border-ramp-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-ramp-gray-900">{offer.vendor}</h3>
          <p className="text-sm text-ramp-gray-500">{offer.project}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-ramp-gray-900">{formatCurrency(offer.invoiceAmount)}</div>
          <div className="text-xs text-ramp-gray-500">Invoice amount</div>
        </div>
      </div>

      <div className="bg-ramp-gray-50 rounded-lg p-3 mb-4">
        <div className="text-xs text-ramp-gray-500 font-medium uppercase tracking-wide mb-2">Pay now, repay later</div>
        <div className="grid grid-cols-3 gap-2">
          {offer.terms.map((term) => (
            <button
              key={term.days}
              onClick={() => setSelectedTerm(term)}
              className={`p-3 rounded-lg border text-center transition-all ${
                selectedTerm?.days === term.days
                  ? 'border-ramp-gray-900 bg-white shadow-sm'
                  : 'border-ramp-gray-200 bg-white hover:border-ramp-gray-300'
              }`}
            >
              <div className="text-sm font-semibold text-ramp-gray-900">{term.days} days</div>
              <div className="text-xs text-ramp-gray-500 mt-0.5">{term.fee}% fee</div>
              <div className="text-xs text-ramp-gray-400">{formatCurrency(term.feeAmount)}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedTerm && (
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <div>
            <div className="text-sm font-medium text-emerald-800">
              Pay vendor today, repay in {selectedTerm.days} days
            </div>
            <div className="text-xs text-emerald-600">
              Fee: {formatCurrency(selectedTerm.feeAmount)} · Total: {formatCurrency(offer.invoiceAmount + selectedTerm.feeAmount)}
            </div>
          </div>
          <button
            onClick={() => onFlexPay(offer, selectedTerm)}
            className="bg-ramp-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-ramp-gray-800 flex items-center gap-1"
          >
            Flex Pay <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Capital() {
  const [flexPayModal, setFlexPayModal] = useState(null); // { offer, selectedTerm }
  const [scheduledOffers, setScheduledOffers] = useState(new Set());

  // Toast state
  const [toast, setToast] = useState(null);
  const handleDismissToast = useCallback((id) => {
    setToast(prev => (prev?.id === id ? null : prev));
  }, []);

  function handleFlexPayClick(offer, selectedTerm) {
    setFlexPayModal({ offer, selectedTerm });
  }

  function handleFlexPayConfirm(offer, term) {
    setFlexPayModal(null);
    setScheduledOffers(prev => new Set([...prev, offer.id]));
    setToast({
      id: Date.now(),
      message: `Flex Pay scheduled — ${offer.vendor} invoice ${formatCurrency(offer.invoiceAmount)} will be paid now, repay in ${term.days} days`,
      type: 'pay',
      visible: true,
    });
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Construction Capital"
        title="Flex Pay"
        description="Extend your payment timeline on eligible invoices. Pay vendors on time, repay Ramp later."
        bullets={[
          'Aligned to pay-when-paid construction cycles',
          'Per-invoice flexibility — 30, 60, or 90 day terms',
          'Clear fee structure with project-level cash flow visibility',
        ]}
      />

      <CapitalDashboard />

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ramp-gray-900">Eligible Invoices</h2>
        <p className="text-sm text-ramp-gray-500">Select a repayment term to extend your cash runway</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {capitalOffers.map((offer) => (
          scheduledOffers.has(offer.id) ? (
            <div key={offer.id} className="border border-emerald-200 rounded-xl p-5 bg-emerald-50/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h3 className="font-semibold text-emerald-800">Flex Pay Scheduled</h3>
              </div>
              <div className="text-sm text-emerald-700">{offer.vendor}</div>
              <div className="text-xs text-emerald-600">{offer.project} · {formatCurrency(offer.invoiceAmount)}</div>
            </div>
          ) : (
            <InvoiceFinancingCard key={offer.id} offer={offer} onFlexPay={handleFlexPayClick} />
          )
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ramp-gray-900">Outstanding by Project</h2>
      </div>
      <div className="border border-ramp-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Project</th>
              <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Outstanding</th>
              <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Repayment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ramp-gray-100">
            {capitalBalance.byProject.map((item, i) => (
              <tr key={i} className="hover:bg-ramp-gray-50">
                <td className="px-4 py-3 font-medium text-ramp-gray-900">{item.project}</td>
                <td className="px-4 py-3 text-right font-medium text-ramp-gray-900">{formatCurrency(item.outstanding)}</td>
                <td className="px-4 py-3 text-ramp-gray-600">{new Date(item.repaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Flex Pay Modal */}
      {flexPayModal && (
        <FlexPayModal
          offer={flexPayModal.offer}
          selectedTerm={flexPayModal.selectedTerm}
          onClose={() => setFlexPayModal(null)}
          onConfirm={handleFlexPayConfirm}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={handleDismissToast} />
    </div>
  );
}
