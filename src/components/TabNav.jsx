export default function TabNav({ tabs, activeTab, onTabChange, counts }) {
  return (
    <div className="border-b border-ramp-gray-200">
      <nav className="flex gap-0 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-ramp-black text-ramp-black'
                : 'border-transparent text-ramp-gray-500 hover:text-ramp-gray-700 hover:border-ramp-gray-300'
            }`}
          >
            {tab}
            {counts?.[tab] != null && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab ? 'bg-ramp-gray-900 text-white' : 'bg-ramp-gray-200 text-ramp-gray-600'
              }`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
