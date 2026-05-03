'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Pacientes() {
  const [nome, setNome] = useState('')
  const [pacientes, setPacientes] = useState<any[]>([])
  const router = useRouter()

  async function verificarLogin() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) router.push('/login')
  }

  async function carregarPacientes() {
    const { data: userData } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .eq('user_id', userData.user?.id)
      .order('created_at', { ascending: false })

    setPacientes(data || [])
  }

  async function adicionarPaciente() {
    if (!nome.trim()) return

    const { data: userData } = await supabase.auth.getUser()

    await supabase.from('pacientes').insert([
      {
        nome,
        user_id: userData.user?.id
      }
    ])

    setNome('')
    carregarPacientes()
  }

  useEffect(() => {
    verificarLogin()
    carregarPacientes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          OdontoSaaS
        </h1>

        <nav className="space-y-3">
          <Link className="block p-3 rounded-lg hover:bg-gray-100" href="/">
            Dashboard
          </Link>

          <Link className="block p-3 rounded-lg bg-blue-600 text-white" href="/pacientes">
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
        <h2 className="text-3xl font-bold mb-2">Pacientes</h2>
        <p className="text-gray-500 mb-8">Cadastro e listagem de pacientes</p>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h3 className="text-xl font-bold mb-4">Novo paciente</h3>

          <div className="flex gap-3">
            <input
              className="border rounded-lg px-4 py-2 flex-1"
              placeholder="Nome do paciente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <button
              onClick={adicionarPaciente}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-bold mb-4">Lista de pacientes</h3>

          {pacientes.length === 0 ? (
            <p className="text-gray-500">Nenhum paciente cadastrado ainda.</p>
          ) : (
            <ul className="divide-y">
              {pacientes.map((p) => (
                <li key={p.id} className="py-3 flex justify-between">
                  <span>{p.nome}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}