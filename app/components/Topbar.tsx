'use client'

import { Search, Plus, Bell, Menu } from 'lucide-react'

interface TopbarProps {
  onMenuClick?: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 relative shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)]">
      
      {/* Search and Hamburger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
        >
          <Menu className="h-5.5 w-5.5" />
        </button>

        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-xs sm:text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50 hover:bg-white transition-all text-slate-800 shadow-sm"
            placeholder="Buscar pacientes, agendamentos..."
          />
        </div>
      </div>

      {/* Action buttons and profile */}
      <div className="flex items-center gap-3 md:gap-6 ml-3 sm:ml-6 shrink-0">
        
        {/* Responsive Novo Agendamento Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 border border-blue-700 hover:shadow-md active:scale-95">
          <Plus className="h-4.5 w-4.5 sm:h-4 sm:w-4" strokeWidth={3} />
          <span className="hidden sm:inline">Novo Agendamento</span>
        </button>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        <button className="text-slate-400 hover:text-slate-600 transition-colors relative p-2 rounded-full hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
        </button>

        <div className="flex items-center gap-2 md:gap-3 pl-1 sm:pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800">Dr. Administrador</p>
            <p className="text-xs font-semibold text-slate-500">Admin</p>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm border border-blue-200 shrink-0">
            AD
          </div>
        </div>
      </div>

    </header>
  )
}
