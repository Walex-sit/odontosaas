'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Sidebar from './components/Sidebar'

export default function Dashboard() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState(0)
  const [agendamentos, setAgendamentos] = useState(0)
  const [receitas, setReceitas] = useState(0)

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function carregarDados() {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
      router.push('/login')
      return
    }

    const { data: pacientesData } = await supabase
      .from('pacientes')
      .select('*')
      .eq('user_id', userId)

    const { data: agendamentosData } = await supabase
      .from('agendamentos')
      .select('*')

    const { data: receitasData } = await supabase
      .from('receitas')
      .select('*')

    setPacientes(pacientesData?.length || 0)
    setAgendamentos(agendamentosData?.length || 0)
    setReceitas(receitasData?.length || 0)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:px-12 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard
            </h2>
            <p className="text-gray-500 mt-1.5 font-medium">
              Visão geral da sua clínica
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2 transition-all shadow-sm font-semibold text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair do Sistema
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Total de Pacientes</p>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2">{pacientes}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-50 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Agendamentos</p>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2">{agendamentos}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-violet-50 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Receitas Lançadas</p>
                <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2">{receitas}</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}