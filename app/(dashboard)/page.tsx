'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [pacientes, setPacientes] = useState(0)
  const [agendamentos, setAgendamentos] = useState(0)
  const [receitas, setReceitas] = useState(0)

  async function carregarDados() {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) return

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
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Olá, Dr. Administrador 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Aqui está o resumo da sua clínica hoje.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-blue-100 transition-all duration-300 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% mês</span>
            </div>
            <p className="text-gray-500 font-medium text-sm">Total de Pacientes</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{pacientes}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-emerald-100 transition-all duration-300 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-full">Hoje</span>
            </div>
            <p className="text-gray-500 font-medium text-sm">Agendamentos</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{agendamentos}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-violet-100 transition-all duration-300 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+8% mês</span>
            </div>
            <p className="text-gray-500 font-medium text-sm">Receitas do Mês</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{receitas}</h3>
          </div>
        </div>
      </div>
    </>
  )
}