'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path 
      ? 'bg-blue-50 text-blue-700 font-bold' 
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm z-20 relative">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Odonto<span className="text-blue-600">SaaS</span>
          </h1>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 flex items-center justify-between cursor-pointer hover:border-blue-200 transition-colors">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Clínica Ativa</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">Matriz Centro</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-8 no-scrollbar">
        <div>
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Principal
          </p>
          <nav className="space-y-1">
            <Link 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive('/')}`} 
              href="/"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
            <Link 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive('/agenda')}`} 
              href="/agenda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/agenda' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Agenda
            </Link>
          </nav>
        </div>

        <div>
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Clínica
          </p>
          <nav className="space-y-1">
            <Link 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${pathname.startsWith('/pacientes') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}`} 
              href="/pacientes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname.startsWith('/pacientes') ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pacientes
            </Link>
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-gray-400 cursor-not-allowed`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Prontuários <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold">BREVE</span>
            </div>
          </nav>
        </div>

        <div>
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Gestão
          </p>
          <nav className="space-y-1">
            <Link 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive('/financeiro')}`} 
              href="/financeiro"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/financeiro' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Financeiro
            </Link>
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-gray-400 cursor-not-allowed`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Relatórios <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold">BREVE</span>
            </div>
          </nav>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair da Conta
        </button>
      </div>
    </aside>
  )
}
