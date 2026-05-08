'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Pacientes() {
  const [nome, setNome] = useState('')
  const [pacientes, setPacientes] = useState<any[]>([])
  const router = useRouter()

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
    carregarPacientes()
  }, [])

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pacientes</h2>
          <p className="text-gray-500 mt-1">Gerencie os prontuários e dados dos pacientes</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Cadastro Rápido
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nome Completo do Paciente
            </label>
            <input
              className="appearance-none block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <button
            onClick={adicionarPaciente}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-bold text-sm h-[42px]"
          >
            Adicionar Paciente
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Todos os Pacientes
          </h3>
        </div>

        {pacientes.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="h-16 w-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum paciente cadastrado</h3>
            <p className="text-gray-500">Adicione seu primeiro paciente usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">ID Registro</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Cadastro</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pacientes.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/pacientes/${p.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {p.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.nome}</div>
                          <div className="text-xs text-gray-500">Paciente Ativo</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-sm text-gray-500 font-medium">
                      #{p.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Abrir Ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}