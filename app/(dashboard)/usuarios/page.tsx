'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { logAction } from '../../lib/logger'
import { Users, Shield } from 'lucide-react'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  async function carregarUsuarios() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, nome, role')

      if (error) {
        console.error('Erro ao carregar perfis:', error.message)
      }

      setUsuarios(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  async function alterarRole(userId: string, novaRole: string) {
    await supabase
      .from('user_profiles')
      .update({ role: novaRole })
      .eq('id', userId)

    await logAction('edicao', 'usuarios', { user_id_afetado: userId, nova_role: novaRole })

    carregarUsuarios()
  }

  useEffect(() => { carregarUsuarios() }, [])

  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: 'Administrador', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    dentista: { label: 'Dentista', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    recepcao: { label: 'Recepção', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    financeiro: { label: 'Financeiro', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Usuários e Perfis</h2>
        <p className="text-slate-500 mt-1 text-sm">Gerencie permissões e níveis de acesso</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-500" />
            Todos os Usuários
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">{usuarios.length} usuário(s)</span>
        </div>

        {carregando ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum perfil encontrado</h3>
            <p className="text-slate-500 text-sm">Execute o script SQL no Supabase para criar a tabela de perfis.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil Atual</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alterar Perfil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((u) => {
                    const info = roleLabels[u.role] || roleLabels['recepcao']
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                              {(u.nome || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">{u.nome || 'Sem Nome'}</div>
                              <div className="text-xs text-slate-400">ID: {u.id.substring(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${info.color}`}>
                            {info.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className="appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            value={u.role}
                            onChange={(e) => alterarRole(u.id, e.target.value)}
                          >
                            <option value="admin">Administrador</option>
                            <option value="dentista">Dentista</option>
                            <option value="recepcao">Recepção</option>
                            <option value="financeiro">Financeiro</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {usuarios.map((u) => {
                const info = roleLabels[u.role] || roleLabels['recepcao']
                return (
                  <div key={u.id} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                        {(u.nome || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">{u.nome || 'Sem Nome'}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${info.color} mt-0.5`}>
                          {info.label}
                        </span>
                      </div>
                    </div>
                    <select
                      className="appearance-none w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                      value={u.role}
                      onChange={(e) => alterarRole(u.id, e.target.value)}
                    >
                      <option value="admin">Administrador</option>
                      <option value="dentista">Dentista</option>
                      <option value="recepcao">Recepção</option>
                      <option value="financeiro">Financeiro</option>
                    </select>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}
