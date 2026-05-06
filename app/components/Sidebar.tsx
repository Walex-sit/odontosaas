'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path 
      ? 'bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-600' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 relative">
      <div className="p-6 border-b border-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Odonto<span className="text-blue-600">SaaS</span>
          </h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Menu Principal
        </p>
        <nav className="space-y-1">
          <Link 
            className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-200 ${isActive('/')}`} 
            href="/"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <Link 
            className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-200 ${isActive('/pacientes')}`} 
            href="/pacientes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/pacientes' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Pacientes
          </Link>

          <Link 
            className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-200 ${isActive('/agenda')}`} 
            href="/agenda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/agenda' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agenda
          </Link>

          <Link 
            className={`flex items-center gap-3 px-4 py-3 rounded-l-xl transition-all duration-200 ${isActive('/financeiro')}`} 
            href="/financeiro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/financeiro' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Financeiro
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            US
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">Usuário</span>
            <span className="text-xs text-gray-500">Clínica Ativa</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
