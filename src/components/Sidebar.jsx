import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Search, Inbox, BarChart3, CreditCard,
  FileText, ShoppingCart, Users,
  Settings, ChevronDown, DollarSign, ArrowRight,
} from 'lucide-react';

/* ─── Search dropdown results ─── */
const searchPages = [
  { to: '/insights', icon: BarChart3, label: 'Insights', description: 'Budget vs. actual, spend analytics' },
  { to: '/expenses/card-transactions', icon: CreditCard, label: 'Card Transactions', description: 'Construction card spend' },
  { to: '/expenses/reimbursements', icon: CreditCard, label: 'Reimbursements', description: 'Employee reimbursement requests' },
  { to: '/procurement/requests', icon: ShoppingCart, label: 'Procurement — Requests', description: 'Spend requests & approvals' },
  { to: '/procurement/purchase-orders', icon: ShoppingCart, label: 'Procurement — Purchase Orders', description: 'Committed POs & invoices' },
  { to: '/bill-pay', icon: FileText, label: 'Bill Pay', description: 'Vendor bills & payments' },
  { to: '/capital', icon: DollarSign, label: 'Capital', description: 'Flex-pay & working capital' },
  { to: '/people', icon: Users, label: 'People', description: 'Team & card management' },
  { to: '/inbox', icon: Inbox, label: 'Inbox', description: 'Action items & notifications' },
];

function SearchDropdown({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filtered = query
    ? searchPages.filter(p =>
        p.label.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : searchPages;

  function handleSelect(page) {
    navigate(page.to);
    onClose();
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full mt-1 w-72 bg-white border border-ramp-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
      style={{ animation: 'searchDropIn 0.15s ease-out' }}
    >
      {/* Search input */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ramp-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-ramp-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ramp-gray-300 bg-ramp-gray-50"
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-h-80 overflow-y-auto px-1.5 pb-2">
        {filtered.length === 0 && (
          <div className="text-xs text-ramp-gray-400 text-center py-6">No matching pages</div>
        )}
        {filtered.map(page => {
          const Icon = page.icon;
          return (
            <button
              key={page.to}
              onClick={() => handleSelect(page)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ramp-gray-50 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-ramp-gray-100 flex items-center justify-center shrink-0 group-hover:bg-ramp-gray-200 transition-colors">
                <Icon size={15} className="text-ramp-gray-500" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ramp-gray-900 truncate">{page.label}</div>
                <div className="text-[11px] text-ramp-gray-500 truncate">{page.description}</div>
              </div>
              <ArrowRight size={13} className="text-ramp-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes searchDropIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Nav sections ─── */
const navSections = [
  {
    items: [
      { to: '/search', icon: Search, label: 'Search', isSearch: true },
      { to: '/inbox', icon: Inbox, label: 'Inbox', badge: 4 },
    ],
  },
  {
    items: [
      { to: '/insights', icon: BarChart3, label: 'Insights' },
    ],
  },
  {
    items: [
      {
        to: '/expenses', icon: CreditCard, label: 'Expenses',
        children: [
          { to: '/expenses/card-transactions', label: 'Card transactions' },
          { to: '/expenses/reimbursements', label: 'Reimbursements' },
        ],
      },
    ],
  },
  {
    items: [
      {
        to: '/procurement', icon: ShoppingCart, label: 'Procurement',
        children: [
          { to: '/procurement/requests', label: 'Requests' },
          { to: '/procurement/purchase-orders', label: 'Purchase orders' },
        ],
      },
    ],
  },
  {
    items: [
      { to: '/bill-pay', icon: FileText, label: 'Bill Pay' },
    ],
  },
  {
    items: [
      { to: '/capital', icon: DollarSign, label: 'Capital' },
    ],
  },
  {
    items: [
      { to: '/people', icon: Users, label: 'People' },
    ],
  },
];

function SidebarLink({ item, depth = 0 }) {
  const [showSearch, setShowSearch] = useState(false);
  const Icon = item.icon;

  // Special search button — opens dropdown instead of navigating
  if (item.isSearch) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowSearch(prev => !prev)}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
            showSearch
              ? 'bg-ramp-gray-100 text-ramp-gray-900 font-medium'
              : 'text-ramp-gray-600 hover:bg-ramp-gray-50 hover:text-ramp-gray-900'
          }`}
        >
          <Icon size={16} strokeWidth={1.8} />
          <span className="flex-1 text-left">{item.label}</span>
        </button>
        {showSearch && <SearchDropdown onClose={() => setShowSearch(false)} />}
      </div>
    );
  }

  return (
    <div>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
            depth > 0 ? 'pl-10' : ''
          } ${
            isActive
              ? 'bg-ramp-gray-100 text-ramp-gray-900 font-medium'
              : 'text-ramp-gray-600 hover:bg-ramp-gray-50 hover:text-ramp-gray-900'
          }`
        }
      >
        {Icon && <Icon size={16} strokeWidth={1.8} />}
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="bg-ramp-gray-200 text-ramp-gray-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
            {item.badge}
          </span>
        )}
        {item.children && <ChevronDown size={14} className="text-ramp-gray-400" />}
      </NavLink>
      {item.children && (
        <div className="mt-0.5">
          {item.children.map((child) => (
            <SidebarLink key={child.to} item={child} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-ramp-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2 border-b border-ramp-gray-100">
        <div className="flex items-center gap-1.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 20L20 4M4 20L12 20M4 20L4 12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold text-lg tracking-tight text-ramp-gray-900">ramp</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navSections.map((section, si) => (
          <div key={si} className={si > 0 ? 'pt-1' : ''}>
            {section.items.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-ramp-gray-100 px-2 py-2">
        <NavLink
          to="/settings"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-ramp-gray-600 hover:bg-ramp-gray-50"
        >
          <Settings size={16} strokeWidth={1.8} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
