import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavPill = ({ label, id, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300
      ${active 
        ? 'bg-accent text-primary shadow-sm' 
        : 'bg-white border text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800'
      }`}
  >
    {label}
  </button>
);

export default function DashboardLayout({ children, currentView, setCurrentView, title, subtitle, navPills, roleBadge }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFC] font-sans pb-16">
      
      {/* Top Header */}
      <header className="px-8 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg outline-2 outline-offset-2 outline-slate-800 bg-primary flex items-center justify-center shadow-md">
            <div className="flex gap-1">
              <div className="w-1.5 h-3 bg-white rounded-sm"></div>
              <div className="w-1.5 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">QuickStay</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[15px] text-gray-500 font-medium">
          <a href="#" className="text-primary font-semibold border-b-2 border-primary pb-0.5">Dashboard</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            title="Log out back to Portal"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-primary font-bold text-sm tracking-wide shadow-sm hover:-translate-y-0.5 transition-transform duration-300 group"
          >
            {roleBadge} <LogOut size={16} className="ml-1 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto w-full px-6 pt-16">
        
        <div className="text-center mb-12">
          <h1 className="text-[44px] leading-tight font-extrabold text-primary mb-3">
            {title}
          </h1>
          <p className="text-gray-500 text-[17px]">
            {subtitle}
          </p>
        </div>

        {/* Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {navPills.map(pill => (
            <NavPill 
              key={pill.id} 
              id={pill.id} 
              label={pill.label} 
              active={currentView === pill.id} 
              onClick={setCurrentView} 
            />
          ))}
        </div>

        {/* View Component */}
        <div className="animate-fade-in transition-all duration-300">
          {children}
        </div>
        
      </main>
      
    </div>
  );
}
