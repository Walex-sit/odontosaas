'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { History, ListFilter } from 'lucide-react'

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([])
  const [filtroAction, setFiltroAction] = useState('')
  const [carregando, setCarregando] = useState(true)

  async function carregarLogs() {
    let query = supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (filtroAction) {
      query = query.eq('action', filtroAction)
    }

    try {
      const { data } = await query
      setLogs(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarLogs() }, [filtroAction])

  const actionColors: Record<string, string> = {
    criacao: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    edicao: 'bg-blue-50 text-blue-700 border-blue-100',
    exclusao: 'bg-red-50 text-red-700 border-red-100',
    login: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    logout: 'bg-slate-100 text-slate-700 border-slate-200',
    financeiro: 'bg-amber-50 text-amber-700 border-amber-100',
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Logs do Sistema</h2>
          <p className="text-slate-505 mt-1 text-sm">Auditoria de ações realizadas no sistema</p>
        </div>
        <div className="w-full sm:w-auto">
          <select
            className="appearance-none w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={filtroAction}
            onChange={(e) => setFiltroAction(e.target.value)}
          >
            <option value="">Todas as Ações</option>
            <option value="criacao">Criação</option>
            <option value="edicao">Edição</option>
            <option value="exclusao">Exclusão</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="financeiro">Financeiro</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            Registros de Auditoria
          </h3>
          <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{logs.length} registro(s)</span>
        </div>

        {carregando ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum log registrado</h3>
            <p className="text-slate-505 text-sm">Os logs aparecerão conforme ações forem realizadas no sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data/Hora</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ação</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Entidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Detalhes</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((l) => {
                  const color = actionColors[l.action] || 'bg-slate-100 text-slate-600 border-slate-200'
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                        {new Date(l.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${color}`}>
                          {l.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-850 text-sm">{l.entity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-550 max-w-[200px] truncate">
                        {l.details ? JSON.stringify(l.details) : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {l.user_id ? l.user_id.substring(0, 8) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
