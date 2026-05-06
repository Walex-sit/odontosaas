'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'

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

    if (!userData.user) return

    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    setPacientes(data || [])
  }

  async function adicionarPaciente() {
    if (!nome.trim()) return

    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) return

    await supabase.from('pacientes').insert([
      {
        nome,
        user_id: userData.user.id
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
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:px-12 overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pacientes</h2>
          <p className="text-gray-500 mt-1.5 font-medium">Cadastro e listagem de pacientes da clínica</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 mb-8 transition-all hover:shadow-md">
          <h3 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Novo Paciente
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Nome completo
              </label>
              <input
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <button
              onClick={adicionarPaciente}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md font-bold text-sm"
            >
              Salvar Paciente
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
          <h3 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Pacientes Cadastrados
          </h3>

          {pacientes.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">Nenhum paciente cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-hidden ring-1 ring-slate-200 rounded-xl">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nome do Paciente
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {pacientes.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-extrabold shadow-sm">
                            {p.nome.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900">{p.nome}</div>
                            <div className="text-xs text-slate-500 mt-0.5">ID: {p.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-500">
                        {new Date(p.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}