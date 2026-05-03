'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
const router = useRouter()

async function logout() {
  await supabase.auth.signOut()
  router.push('/login')
}
  const [pacientes, setPacientes] = useState(0)
  const [agendamentos, setAgendamentos] = useState(0)
  const [receitas, setReceitas] = useState(0)

  async function carregarDados() {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

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
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          OdontoSaaS
        </h1>

        <nav className="space-y-3">
          <Link className="block p-3 rounded-lg bg-blue-600 text-white" href="/">
            Dashboard
          </Link>

          <Link className="block p-3 rounded-lg hover:bg-gray-100" href="/pacientes">
            Pacientes
          </Link>

          <Link className="block p-3 rounded-lg hover:bg-gray-100" href="/agenda">
            Agenda
          </Link>

          <Link className="block p-3 rounded-lg hover:bg-gray-100" href="/financeiro">
            Financeiro
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
       <div className="flex justify-between items-center mb-8">

  <div>
    <h2 className="text-3xl font-bold">
      Dashboard
    </h2>

    <p className="text-gray-500">
      Visão geral da clínica
    </p>
  </div>

  <button
    onClick={logout}
    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
  >
    Sair
  </button>

</div>
        <p className="text-gray-500 mb-8">
          Visão geral da clínica
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Pacientes</p>
            <h3 className="text-4xl font-bold mt-2">{pacientes}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Agendamentos</p>
            <h3 className="text-4xl font-bold mt-2">{agendamentos}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Receitas</p>
            <h3 className="text-4xl font-bold mt-2">{receitas}</h3>
          </div>

        </div>
      </main>
    </div>
  )
}