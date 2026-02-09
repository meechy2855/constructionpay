import { useState } from 'react';
import { ChevronDown, HardHat } from 'lucide-react';
import { projects } from '../data/mockData';

export default function TopBar({ selectedProject, onProjectChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-10 bg-ramp-gray-900 text-white flex items-center justify-between px-4 text-sm">
      <div className="flex items-center gap-3">
        <span className="text-ramp-gray-400">See how Ramp can save your construction business time and money.</span>
        <a href="#" className="underline text-white hover:text-ramp-green font-medium">Learn more →</a>
      </div>
      <div className="flex items-center gap-4">
        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 bg-ramp-gray-800 hover:bg-ramp-gray-700 px-3 py-1 rounded-md transition-colors"
          >
            <HardHat size={14} />
            <span className="text-xs font-medium">
              {selectedProject ? selectedProject.name : 'All Projects'}
            </span>
            <ChevronDown size={12} />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white text-ramp-gray-900 rounded-lg shadow-lg border border-ramp-gray-200 z-50 py-1">
              <button
                onClick={() => { onProjectChange(null); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-ramp-gray-50 ${
                  !selectedProject ? 'font-medium bg-ramp-gray-50' : ''
                }`}
              >
                All Projects
              </button>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { onProjectChange(p); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-ramp-gray-50 ${
                    selectedProject?.id === p.id ? 'font-medium bg-ramp-gray-50' : ''
                  }`}
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-ramp-gray-500">{p.code}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="bg-ramp-green text-ramp-black px-3 py-1 rounded-md text-xs font-semibold hover:bg-ramp-green-dark transition-colors">
          Get started
        </button>
      </div>
    </div>
  );
}
