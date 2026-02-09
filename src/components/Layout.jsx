import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children, selectedProject, onProjectChange }) {
  return (
    <div className="min-h-screen bg-white">
      <TopBar selectedProject={selectedProject} onProjectChange={onProjectChange} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="px-8 py-6 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
