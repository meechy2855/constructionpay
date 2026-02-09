import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageHeader from '../components/PageHeader';
import TabNav from '../components/TabNav';
import { analyticsData, projects } from '../data/mockData';

const TABS = ['Spending', 'Compliance', 'Process'];

function formatCurrency(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function formatCurrencyFull(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const COLORS = ['#c4f441', '#a3a3a3', '#404040', '#1a1a1a'];

function SpendingTab() {
  const totalSpend = analyticsData.monthlySpend.reduce((s, m) => s + m.amount, 0);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="border border-ramp-gray-200 rounded-lg px-3 py-1.5 text-sm text-ramp-gray-600 flex items-center gap-1.5">
          Last 30 days
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Total spend chart */}
        <div className="border border-ramp-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-ramp-gray-600">Total company spending →</h3>
          </div>
          <div className="text-xs text-ramp-gray-500 mb-1">Total spend</div>
          <div className="text-2xl font-semibold text-ramp-gray-900 mb-4">{formatCurrency(totalSpend)}</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analyticsData.monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={formatCurrency} />
              <Tooltip formatter={(v) => formatCurrencyFull(v)} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {analyticsData.monthlySpend.map((_, i) => (
                  <Cell key={i} fill={i === analyticsData.monthlySpend.length - 1 ? '#c4f441' : '#d4d4d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by project */}
        <div className="border border-ramp-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-ramp-gray-600">Spending by project →</h3>
          </div>
          <div className="text-xs text-ramp-gray-500 mb-1">Top project spend</div>
          <div className="text-2xl font-semibold text-ramp-gray-900 mb-4">{formatCurrency(Math.max(...analyticsData.budgetVsActual.map(p => p.actual)))}</div>
          <div className="space-y-3">
            {analyticsData.budgetVsActual.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 text-right text-xs text-ramp-gray-500 font-medium">{i + 1}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white`}
                  style={{ backgroundColor: ['#1a1a1a', '#525252', '#737373', '#a3a3a3'][i] }}
                >
                  {p.project.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ramp-gray-900">{p.project}</div>
                </div>
                <div className="text-sm font-semibold text-ramp-gray-900 tabular-nums">{formatCurrencyFull(p.actual)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget vs Actual */}
      <div className="border border-ramp-gray-200 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-medium text-ramp-gray-600 mb-4">Cost-to-Date vs Budget (by project)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={analyticsData.budgetVsActual} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis dataKey="project" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={formatCurrency} />
            <Tooltip formatter={(v) => formatCurrencyFull(v)} />
            <Bar dataKey="budget" name="Budget" fill="#e5e5e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AP Aging and Retainage */}
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-ramp-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-medium text-ramp-gray-600 mb-4">AP Aging by Bucket</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.apAging}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={formatCurrency} />
              <Tooltip formatter={(v) => formatCurrencyFull(v)} />
              <Bar dataKey="amount" fill="#c4f441" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-ramp-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-medium text-ramp-gray-600 mb-4">Retainage Outstanding by Project</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.retainageByProject} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={formatCurrency} />
              <YAxis type="category" dataKey="project" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} width={90} />
              <Tooltip formatter={(v) => formatCurrencyFull(v)} />
              <Bar dataKey="retainage" fill="#1a1a1a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ComplianceTab() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-ramp-gray-200 rounded-xl p-4">
          <div className="text-xs text-ramp-gray-500 font-medium uppercase tracking-wide mb-1">Lien Waivers Collected</div>
          <div className="text-2xl font-semibold text-ramp-gray-900">24 / 31</div>
          <div className="mt-2 bg-ramp-gray-200 rounded-full h-2">
            <div className="bg-ramp-green h-2 rounded-full" style={{ width: '77%' }} />
          </div>
          <div className="text-xs text-ramp-gray-500 mt-1">77% collection rate</div>
        </div>
        <div className="border border-ramp-gray-200 rounded-xl p-4">
          <div className="text-xs text-ramp-gray-500 font-medium uppercase tracking-wide mb-1">Insurance Certificates Current</div>
          <div className="text-2xl font-semibold text-emerald-600">18 / 22</div>
          <div className="text-xs text-orange-600 mt-1">4 vendors expiring within 30 days</div>
        </div>
        <div className="border border-ramp-gray-200 rounded-xl p-4">
          <div className="text-xs text-ramp-gray-500 font-medium uppercase tracking-wide mb-1">W-9 on File</div>
          <div className="text-2xl font-semibold text-ramp-gray-900">20 / 22</div>
          <div className="text-xs text-red-600 mt-1">2 vendors missing W-9</div>
        </div>
      </div>
    </div>
  );
}

function ProcessTab() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-ramp-gray-200 rounded-xl p-4">
          <div className="text-xs text-ramp-gray-500 font-medium uppercase tracking-wide mb-1">Avg. Approval Time</div>
          <div className="text-2xl font-semibold text-ramp-gray-900">2.4 days</div>
          <div className="text-xs text-emerald-600 mt-1">↓ 1.2 days from last month</div>
        </div>
        <div className="border border-ramp-gray-200 rounded-xl p-4">
          <div className="text-xs text-ramp-gray-500 font-medium uppercase tracking-wide mb-1">Invoice-to-Payment Cycle</div>
          <div className="text-2xl font-semibold text-ramp-gray-900">18 days</div>
          <div className="text-xs text-ramp-gray-500 mt-1">Industry avg: 34 days</div>
        </div>
        <div className="border border-ramp-gray-200 rounded-xl p-4">
          <div className="text-xs text-ramp-gray-500 font-medium uppercase tracking-wide mb-1">Auto-Coded Invoices</div>
          <div className="text-2xl font-semibold text-ramp-gray-900">68%</div>
          <div className="text-xs text-emerald-600 mt-1">↑ 12% from last month</div>
        </div>
      </div>
    </div>
  );
}

export default function Insights() {
  const [activeTab, setActiveTab] = useState('Spending');

  return (
    <div>
      <PageHeader
        breadcrumb="Insights"
        title="Reporting"
        actions={
          <button className="text-sm border border-ramp-gray-200 rounded-lg px-3 py-2 hover:bg-ramp-gray-50 text-ramp-gray-700 font-medium">
            Save up to $8,300
          </button>
        }
      />

      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'Spending' && <SpendingTab />}
      {activeTab === 'Compliance' && <ComplianceTab />}
      {activeTab === 'Process' && <ProcessTab />}
    </div>
  );
}
