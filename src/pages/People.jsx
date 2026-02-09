import { useState, useMemo } from 'react';
import {
  Search, Download, ChevronRight, ChevronDown, Plus,
  Users, HardHat, MapPin, Shield, CreditCard, DollarSign,
  FileText, AlertTriangle, Check, Clock, User, Briefcase,
  Building2, Lock, Mail, Phone,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TabNav from '../components/TabNav';
import StatusBadge from '../components/StatusBadge';
import { projects } from '../data/mockData';

/* ═══════════════════════════════════════════════════════════════
   Construction People Data
   ═══════════════════════════════════════════════════════════════ */
const people = [
  // Oakwood Apartments (1)
  { id: 1, name: 'David Wallace', role: 'Project Executive', department: 'Leadership', email: 'd.wallace@gangroup.com', phone: '(555) 101-0001', projectIds: [1, 2, 3, 4], cardLimit: 50000, cardsIssued: 1, status: 'Active', approvalLimit: 100000, jobsite: 'HQ / Multi-site', hireDate: '2019-03-15', complianceRoles: ['Retainage Release', 'Vendor Insurance'] },
  { id: 2, name: 'Michael Scott', role: 'Project Manager', department: 'Project Management', email: 'm.scott@gangroup.com', phone: '(555) 101-0002', projectIds: [1, 4], cardLimit: 25000, cardsIssued: 1, status: 'Active', approvalLimit: 25000, jobsite: 'Oakwood Apartments', hireDate: '2020-06-01', complianceRoles: ['Lien Waivers', 'W-9 Collection'] },
  { id: 3, name: 'Megan Lewis', role: 'Project Manager', department: 'Project Management', email: 'm.lewis@gangroup.com', phone: '(555) 101-0003', projectIds: [1, 2], cardLimit: 25000, cardsIssued: 1, status: 'Active', approvalLimit: 25000, jobsite: 'Trust Hill Development', hireDate: '2021-01-10', complianceRoles: ['Lien Waivers'] },
  { id: 4, name: 'Luke Hobbs', role: 'Foreman', department: 'Field Operations', email: 'l.hobbs@gangroup.com', phone: '(555) 101-0004', projectIds: [1], cardLimit: 5000, cardsIssued: 2, status: 'Active', approvalLimit: 5000, jobsite: 'Oakwood Apartments', hireDate: '2021-08-20', complianceRoles: [] },
  { id: 5, name: 'Jim Halpert', role: 'Project Engineer', department: 'Engineering', email: 'j.halpert@gangroup.com', phone: '(555) 101-0005', projectIds: [1], cardLimit: 10000, cardsIssued: 1, status: 'Active', approvalLimit: 10000, jobsite: 'Oakwood Apartments', hireDate: '2022-02-14', complianceRoles: [] },
  { id: 6, name: 'Dwight Schrute', role: 'Superintendent', department: 'Field Operations', email: 'd.schrute@gangroup.com', phone: '(555) 101-0006', projectIds: [1], cardLimit: 15000, cardsIssued: 1, status: 'Active', approvalLimit: 15000, jobsite: 'Oakwood Apartments', hireDate: '2020-11-05', complianceRoles: [] },
  // Trust Hill (2)
  { id: 7, name: 'Angela Martin', role: 'Superintendent', department: 'Field Operations', email: 'a.martin@gangroup.com', phone: '(555) 101-0007', projectIds: [2], cardLimit: 15000, cardsIssued: 1, status: 'Active', approvalLimit: 15000, jobsite: 'Trust Hill Development', hireDate: '2021-04-18', complianceRoles: [] },
  { id: 8, name: 'Oscar Martinez', role: 'Site Supervisor', department: 'Field Operations', email: 'o.martinez@gangroup.com', phone: '(555) 101-0008', projectIds: [2], cardLimit: 5000, cardsIssued: 1, status: 'Active', approvalLimit: 5000, jobsite: 'Trust Hill Development', hireDate: '2022-01-03', complianceRoles: [] },
  { id: 9, name: 'Ryan Howard', role: 'Purchasing Manager', department: 'Procurement', email: 'r.howard@gangroup.com', phone: '(555) 101-0009', projectIds: [2, 3], cardLimit: 20000, cardsIssued: 1, status: 'Active', approvalLimit: 20000, jobsite: 'Trust Hill Development', hireDate: '2021-09-01', complianceRoles: ['Vendor Insurance'] },
  // Metro Center (3)
  { id: 10, name: 'Karen Filippelli', role: 'Project Manager', department: 'Project Management', email: 'k.filippelli@gangroup.com', phone: '(555) 101-0010', projectIds: [3], cardLimit: 25000, cardsIssued: 1, status: 'Active', approvalLimit: 25000, jobsite: 'Metro Center Renovation', hireDate: '2021-06-15', complianceRoles: ['Lien Waivers', 'W-9 Collection'] },
  { id: 11, name: 'Stanley Hudson', role: 'Foreman', department: 'Field Operations', email: 's.hudson@gangroup.com', phone: '(555) 101-0011', projectIds: [3], cardLimit: 5000, cardsIssued: 1, status: 'Active', approvalLimit: 5000, jobsite: 'Metro Center Renovation', hireDate: '2022-05-10', complianceRoles: [] },
  // Harbor Bridge (4)
  { id: 12, name: 'Andy Bernard', role: 'Superintendent', department: 'Field Operations', email: 'a.bernard@gangroup.com', phone: '(555) 101-0012', projectIds: [4], cardLimit: 15000, cardsIssued: 1, status: 'Active', approvalLimit: 15000, jobsite: 'Harbor Bridge Repair', hireDate: '2021-11-22', complianceRoles: [] },
  { id: 13, name: 'Kevin Malone', role: 'Foreman', department: 'Field Operations', email: 'k.malone@gangroup.com', phone: '(555) 101-0013', projectIds: [4], cardLimit: 5000, cardsIssued: 1, status: 'Active', approvalLimit: 2500, jobsite: 'Harbor Bridge Repair', hireDate: '2023-01-09', complianceRoles: [] },
  // Accounting / Finance (cross-project)
  { id: 14, name: 'Holly Flax', role: 'Accounting Lead', department: 'Accounting', email: 'h.flax@gangroup.com', phone: '(555) 101-0014', projectIds: [1, 2, 3, 4], cardLimit: 0, cardsIssued: 0, status: 'Active', approvalLimit: 50000, jobsite: 'HQ', hireDate: '2020-02-01', complianceRoles: ['Retainage Release', 'W-9 Collection', 'Vendor Insurance'] },
  { id: 15, name: 'Jan Levinson', role: 'Controller', department: 'Finance', email: 'j.levinson@gangroup.com', phone: '(555) 101-0015', projectIds: [1, 2, 3, 4], cardLimit: 0, cardsIssued: 0, status: 'Active', approvalLimit: 999999, jobsite: 'HQ', hireDate: '2019-06-01', complianceRoles: ['Retainage Release'] },
  { id: 16, name: 'Phyllis Vance', role: 'AP Specialist', department: 'Accounting', email: 'p.vance@gangroup.com', phone: '(555) 101-0016', projectIds: [1, 2, 3, 4], cardLimit: 0, cardsIssued: 0, status: 'Active', approvalLimit: 10000, jobsite: 'HQ', hireDate: '2021-03-15', complianceRoles: ['Lien Waivers', 'W-9 Collection'] },
];

/* ─── Helpers ─── */
function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

const roleColors = {
  'Project Executive': 'bg-indigo-600',
  'Project Manager': 'bg-blue-600',
  'Superintendent': 'bg-amber-600',
  'Project Engineer': 'bg-sky-600',
  'Foreman': 'bg-amber-700',
  'Site Supervisor': 'bg-teal-600',
  'Purchasing Manager': 'bg-orange-600',
  'Accounting Lead': 'bg-emerald-600',
  'Controller': 'bg-purple-600',
  'AP Specialist': 'bg-emerald-500',
};
function getColor(role) { return roleColors[role] || 'bg-stone-500'; }

const TABS = ['By Project', 'By Role', 'Approval Authority', 'Jobsites', 'Compliance Owners', 'All People'];

/* ═══════════════════════════════════════════════════════════════
   VIEW 1: By Project (Default — Project-Based Org Chart)
   ═══════════════════════════════════════════════════════════════ */
function ByProjectView({ filteredPeople }) {
  const [expandedProjects, setExpandedProjects] = useState(
    projects.filter(p => p.status === 'Active').map(p => p.id)
  );

  function toggleProject(id) {
    setExpandedProjects(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  /* Build hierarchy: PE → PM → (Engineer, Superintendent(→Foreman(→Field Workers), Site Supervisors)), Accounting, Procurement */
  const roleOrder = ['Project Executive', 'Project Manager', 'Project Engineer', 'Superintendent', 'Foreman', 'Site Supervisor', 'Purchasing Manager', 'Accounting Lead', 'Controller', 'AP Specialist'];

  return (
    <div className="space-y-4">
      {projects.filter(p => p.status === 'Active').map(proj => {
        const isExpanded = expandedProjects.includes(proj.id);
        const projectPeople = filteredPeople.filter(p => p.projectIds.includes(proj.id));
        const sorted = [...projectPeople].sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

        return (
          <div key={proj.id} className="border border-ramp-gray-200 rounded-xl overflow-hidden">
            {/* Project header */}
            <button
              onClick={() => toggleProject(proj.id)}
              className="w-full px-4 py-3.5 bg-ramp-gray-50 border-b border-ramp-gray-200 flex items-center gap-3 hover:bg-ramp-gray-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-ramp-gray-900 text-white flex items-center justify-center">
                <HardHat size={16} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-ramp-gray-900">{proj.name}</div>
                <div className="text-xs text-ramp-gray-500">{proj.code} · {projectPeople.length} people · {projectPeople.filter(p => p.cardsIssued > 0).length} cards issued</div>
              </div>
              <StatusBadge status={proj.status} />
              {isExpanded ? <ChevronDown size={16} className="text-ramp-gray-400" /> : <ChevronRight size={16} className="text-ramp-gray-400" />}
            </button>

            {isExpanded && (
              <div className="divide-y divide-ramp-gray-100">
                {sorted.map(person => (
                  <PersonRow key={person.id} person={person} showProject={false} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW 2: By Role
   ═══════════════════════════════════════════════════════════════ */
function ByRoleView({ filteredPeople }) {
  const roleGroups = useMemo(() => {
    const order = ['Project Executive', 'Project Manager', 'Superintendent', 'Foreman', 'Project Engineer', 'Site Supervisor', 'Purchasing Manager', 'Accounting Lead', 'Controller', 'AP Specialist'];
    const groups = {};
    filteredPeople.forEach(p => {
      if (!groups[p.role]) groups[p.role] = [];
      groups[p.role].push(p);
    });
    return order.filter(r => groups[r]).map(r => ({ role: r, people: groups[r] }));
  }, [filteredPeople]);

  return (
    <div className="space-y-4">
      {roleGroups.map(group => (
        <div key={group.role} className="border border-ramp-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-ramp-gray-50 border-b border-ramp-gray-200 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${getColor(group.role)} text-white flex items-center justify-center`}>
              <User size={14} />
            </div>
            <div>
              <div className="font-semibold text-ramp-gray-900">{group.role}</div>
              <div className="text-xs text-ramp-gray-500">{group.people.length} {group.people.length === 1 ? 'person' : 'people'}</div>
            </div>
          </div>
          <div className="divide-y divide-ramp-gray-100">
            {group.people.map(p => (
              <PersonRow key={p.id} person={p} showProject />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW 3: Approval Authority Map
   ═══════════════════════════════════════════════════════════════ */
function ApprovalAuthorityView({ filteredPeople }) {
  const tiers = [
    { label: 'Field Spend < $5,000', description: 'Foreman-level approval', icon: HardHat, color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-800', filter: p => p.approvalLimit <= 5000 && p.approvalLimit > 0 },
    { label: '$5,000 – $25,000', description: 'Project Manager approval', icon: Briefcase, color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800', filter: p => p.approvalLimit > 5000 && p.approvalLimit <= 25000 },
    { label: '$25,000 – $100,000', description: 'Project Executive or Accounting', icon: Shield, color: 'bg-indigo-50 border-indigo-200', textColor: 'text-indigo-800', filter: p => p.approvalLimit > 25000 && p.approvalLimit <= 100000 },
    { label: '> $100,000', description: 'Controller / Finance sign-off', icon: Lock, color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-800', filter: p => p.approvalLimit > 100000 },
  ];

  return (
    <div className="space-y-4">
      {/* Summary diagram */}
      <div className="border border-ramp-gray-200 rounded-xl p-5 bg-ramp-gray-50 mb-2">
        <h3 className="font-semibold text-sm text-ramp-gray-900 mb-3">Financial Authority Graph</h3>
        <div className="space-y-2.5">
          {[
            { range: '< $5k Field Spend', approver: 'Foreman', color: 'bg-amber-500' },
            { range: '$5k – $25k', approver: 'Project Manager', color: 'bg-blue-500' },
            { range: '$25k – $100k', approver: 'Project Executive', color: 'bg-indigo-500' },
            { range: '> $100k', approver: 'Controller / Finance', color: 'bg-purple-500' },
            { range: 'Invoices / AP', approver: 'PM → Accounting → Finance', color: 'bg-emerald-500' },
          ].map((tier, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${tier.color} shrink-0`} />
              <div className="w-40 text-sm text-ramp-gray-700 font-medium">{tier.range}</div>
              <div className="flex items-center gap-1.5 text-sm text-ramp-gray-500">
                → {tier.approver}
              </div>
            </div>
          ))}
        </div>
      </div>

      {tiers.map(tier => {
        const Icon = tier.icon;
        const tierPeople = filteredPeople.filter(tier.filter).sort((a, b) => b.approvalLimit - a.approvalLimit);
        if (tierPeople.length === 0) return null;
        return (
          <div key={tier.label} className={`border rounded-xl overflow-hidden ${tier.color}`}>
            <div className="px-4 py-3 border-b border-inherit flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                <Icon size={16} className={tier.textColor} />
              </div>
              <div>
                <div className={`font-semibold ${tier.textColor}`}>{tier.label}</div>
                <div className="text-xs text-ramp-gray-500">{tier.description} · {tierPeople.length} people</div>
              </div>
            </div>
            <div className="bg-white divide-y divide-ramp-gray-100">
              {tierPeople.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-8 h-8 rounded-full ${getColor(p.role)} text-white flex items-center justify-center text-xs font-semibold`}>
                    {initials(p.name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ramp-gray-900">{p.name}</div>
                    <div className="text-xs text-ramp-gray-500">{p.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-ramp-gray-900">Up to {fmt(p.approvalLimit)}</div>
                    <div className="text-xs text-ramp-gray-500">{p.projectIds.length} project{p.projectIds.length > 1 ? 's' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW 4: Jobsites / Location-Based
   ═══════════════════════════════════════════════════════════════ */
function JobsitesView({ filteredPeople }) {
  const jobsiteGroups = useMemo(() => {
    const groups = {};
    filteredPeople.forEach(p => {
      const site = p.jobsite;
      if (!groups[site]) {
        groups[site] = { name: site, people: [], cardsIssued: 0, projectNames: new Set() };
      }
      groups[site].people.push(p);
      groups[site].cardsIssued += p.cardsIssued;
      p.projectIds.forEach(pid => {
        const proj = projects.find(pr => pr.id === pid);
        if (proj) groups[site].projectNames.add(proj.name);
      });
    });
    return Object.values(groups).sort((a, b) => b.people.length - a.people.length);
  }, [filteredPeople]);

  return (
    <div className="space-y-4">
      {jobsiteGroups.map(site => (
        <div key={site.name} className="border border-ramp-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 bg-ramp-gray-50 border-b border-ramp-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-700 text-white flex items-center justify-center">
              <MapPin size={16} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-ramp-gray-900">{site.name}</div>
              <div className="text-xs text-ramp-gray-500">
                {site.people.length} people · {site.cardsIssued} cards issued · {[...site.projectNames].join(', ')}
              </div>
            </div>
          </div>
          <div className="divide-y divide-ramp-gray-100">
            {site.people.map(p => (
              <PersonRow key={p.id} person={p} showProject />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW 5: Compliance Owners
   ═══════════════════════════════════════════════════════════════ */
function ComplianceView({ filteredPeople }) {
  const complianceAreas = [
    { label: 'Lien Waivers', description: 'Required for subcontractor payments — ensures no mechanic\'s lien risk', icon: FileText, color: 'bg-amber-50 border-amber-200' },
    { label: 'Vendor Insurance', description: 'Certificate of insurance verification before onboarding vendors', icon: Shield, color: 'bg-blue-50 border-blue-200' },
    { label: 'W-9 Collection', description: 'Tax ID verification required before first payment', icon: FileText, color: 'bg-emerald-50 border-emerald-200' },
    { label: 'Retainage Release', description: 'Approval of withheld retainage upon project completion', icon: DollarSign, color: 'bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-4">
      <div className="border border-ramp-gray-200 rounded-xl p-5 bg-ramp-gray-50 mb-2">
        <h3 className="font-semibold text-sm text-ramp-gray-900 mb-1">Compliance Responsibility Map</h3>
        <p className="text-xs text-ramp-gray-500">Tracks who is responsible for construction-specific compliance tasks. Compliance failures = real financial risk.</p>
      </div>

      {complianceAreas.map(area => {
        const owners = filteredPeople.filter(p => p.complianceRoles.includes(area.label));
        if (owners.length === 0) return null;
        const Icon = area.icon;
        return (
          <div key={area.label} className={`border rounded-xl overflow-hidden ${area.color}`}>
            <div className="px-4 py-3 border-b border-inherit flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center">
                <Icon size={16} className="text-ramp-gray-600" />
              </div>
              <div>
                <div className="font-semibold text-ramp-gray-900">{area.label}</div>
                <div className="text-xs text-ramp-gray-500">{area.description}</div>
              </div>
              <div className="ml-auto text-xs font-medium text-ramp-gray-600">{owners.length} owner{owners.length > 1 ? 's' : ''}</div>
            </div>
            <div className="bg-white divide-y divide-ramp-gray-100">
              {owners.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-8 h-8 rounded-full ${getColor(p.role)} text-white flex items-center justify-center text-xs font-semibold`}>
                    {initials(p.name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ramp-gray-900">{p.name}</div>
                    <div className="text-xs text-ramp-gray-500">{p.role} · {p.projectIds.length} project{p.projectIds.length > 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-xs text-ramp-gray-500">{p.jobsite}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW 6: All People (flat list)
   ═══════════════════════════════════════════════════════════════ */
function AllPeopleView({ filteredPeople }) {
  return (
    <div className="border border-ramp-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-ramp-gray-50 border-b border-ramp-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Name</th>
            <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Role</th>
            <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Projects</th>
            <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Jobsite</th>
            <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Card Limit</th>
            <th className="text-right px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Approval Limit</th>
            <th className="text-left px-4 py-3 font-medium text-ramp-gray-500 text-xs uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ramp-gray-100">
          {filteredPeople.map(p => (
            <tr key={p.id} className="hover:bg-ramp-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${getColor(p.role)} text-white flex items-center justify-center text-xs font-semibold`}>
                    {initials(p.name)}
                  </div>
                  <div>
                    <div className="font-medium text-ramp-gray-900">{p.name}</div>
                    <div className="text-xs text-ramp-gray-500">{p.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getColor(p.role).replace('bg-', 'bg-').replace('600', '50').replace('700', '50').replace('500', '50')} text-ramp-gray-700`}>
                  {p.role}
                </span>
              </td>
              <td className="px-4 py-3 text-ramp-gray-600 text-xs">
                {p.projectIds.map(pid => projects.find(pr => pr.id === pid)?.name).filter(Boolean).join(', ')}
              </td>
              <td className="px-4 py-3 text-ramp-gray-600 text-xs">{p.jobsite}</td>
              <td className="px-4 py-3 text-right text-ramp-gray-900 font-medium">{p.cardLimit > 0 ? fmt(p.cardLimit) : '—'}</td>
              <td className="px-4 py-3 text-right text-ramp-gray-900 font-medium">{fmt(p.approvalLimit)}</td>
              <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 bg-ramp-gray-50 border-t border-ramp-gray-200 text-xs text-ramp-gray-500">
        {filteredPeople.length} people · {filteredPeople.filter(p => p.cardsIssued > 0).length} with cards
      </div>
    </div>
  );
}

/* ─── Shared Person Row ─── */
function PersonRow({ person: p, showProject }) {
  const projectNames = p.projectIds.map(pid => projects.find(pr => pr.id === pid)?.name).filter(Boolean);
  const indent = ['Foreman', 'Site Supervisor'].includes(p.role) ? 'pl-12' :
                 ['Superintendent', 'Project Engineer'].includes(p.role) ? 'pl-8' :
                 ['AP Specialist'].includes(p.role) ? 'pl-8' : 'pl-4';

  return (
    <div className={`flex items-center gap-3 ${indent} pr-4 py-3 hover:bg-ramp-gray-50 transition-colors`}>
      {/* Indent hierarchy line */}
      <div className={`w-8 h-8 rounded-full ${getColor(p.role)} text-white flex items-center justify-center text-xs font-semibold shrink-0`}>
        {initials(p.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ramp-gray-900">{p.name}</span>
          <span className="text-xs text-ramp-gray-400">·</span>
          <span className="text-xs text-ramp-gray-500">{p.role}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-ramp-gray-500 mt-0.5">
          {showProject && <span>{projectNames.join(', ')}</span>}
          {p.cardsIssued > 0 && (
            <span className="flex items-center gap-1">
              <CreditCard size={10} /> {p.cardsIssued} card{p.cardsIssued > 1 ? 's' : ''}
            </span>
          )}
          <span className="flex items-center gap-1">
            <DollarSign size={10} /> {fmt(p.approvalLimit)} limit
          </span>
        </div>
      </div>
      {p.cardLimit > 0 && (
        <div className="text-xs text-ramp-gray-500 shrink-0">
          Card: {fmt(p.cardLimit)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Summary Stats Cards
   ═══════════════════════════════════════════════════════════════ */
function PeopleStats() {
  const totalPeople = people.length;
  const totalCards = people.reduce((s, p) => s + p.cardsIssued, 0);
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const complianceOwners = people.filter(p => p.complianceRoles.length > 0).length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-1.5 text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">
          <Users size={12} /> Total People
        </div>
        <div className="text-2xl font-semibold text-ramp-gray-900">{totalPeople}</div>
      </div>
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-1.5 text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">
          <CreditCard size={12} /> Cards Issued
        </div>
        <div className="text-2xl font-semibold text-ramp-gray-900">{totalCards}</div>
      </div>
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-1.5 text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">
          <HardHat size={12} /> Active Projects
        </div>
        <div className="text-2xl font-semibold text-ramp-gray-900">{activeProjects}</div>
      </div>
      <div className="border border-ramp-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-1.5 text-xs text-ramp-gray-500 mb-1 font-medium uppercase tracking-wide">
          <Shield size={12} /> Compliance Owners
        </div>
        <div className="text-2xl font-semibold text-ramp-gray-900">{complianceOwners}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main People Page
   ═══════════════════════════════════════════════════════════════ */
export default function People({ selectedProject }) {
  const [activeTab, setActiveTab] = useState('By Project');
  const [search, setSearch] = useState('');

  const filteredPeople = useMemo(() => {
    let result = people;
    if (selectedProject) {
      result = result.filter(p => p.projectIds.includes(selectedProject.id));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.jobsite.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedProject, search]);

  return (
    <div>
      <PageHeader
        breadcrumb="Organization"
        title="People"
        description="Construction workforce — organized by project, role, financial authority, and compliance responsibility."
        actions={
          <button className="text-sm px-3 py-2 bg-ramp-gray-900 text-white rounded-lg hover:bg-ramp-gray-800 font-medium flex items-center gap-1.5">
            <Plus size={14} />
            Add person
          </button>
        }
      />

      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <PeopleStats />

        {/* Search */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ramp-gray-400" />
              <input
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-ramp-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-ramp-gray-300"
              />
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-ramp-gray-50 text-ramp-gray-500"><Download size={16} /></button>
        </div>

        {/* Tab views */}
        {activeTab === 'By Project' && <ByProjectView filteredPeople={filteredPeople} />}
        {activeTab === 'By Role' && <ByRoleView filteredPeople={filteredPeople} />}
        {activeTab === 'Approval Authority' && <ApprovalAuthorityView filteredPeople={filteredPeople} />}
        {activeTab === 'Jobsites' && <JobsitesView filteredPeople={filteredPeople} />}
        {activeTab === 'Compliance Owners' && <ComplianceView filteredPeople={filteredPeople} />}
        {activeTab === 'All People' && <AllPeopleView filteredPeople={filteredPeople} />}
      </div>
    </div>
  );
}
