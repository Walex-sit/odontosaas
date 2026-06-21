'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { logAction } from '../../lib/logger'
import { Users, Shield, Plus, X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../components/RequireAuth'

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = 'admin' | 'dentista' | 'recepcao' | 'financeiro'

interface Usuario {
  id: string
  nome: string
  role: Role
}

interface NovoUsuarioForm {
  nome: string
  email: string
  senha: string
  role: Role
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<Role, { label: string; color: string }> = {
  admin:      { label: 'Administrador', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  dentista:   { label: 'Dentista',      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  recepcao:   { label: 'Recepção',      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  financeiro: { label: 'Financeiro',    color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
}

function validarSenha(senha: string): string | null {
  if (senha.length < 8)        return 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.'
  if (!/[A-Z]/.test(senha))   return 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.'
  if (!/[a-z]/.test(senha))   return 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.'
  if (!/[0-9]/.test(senha))   return 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.'
  return null
}

// ─── Modal Novo Usuário ───────────────────────────────────────────────────────

interface ModalProps {
  onClose: () => void
  onSucesso: () => void
}

function ModalNovoUsuario({ onClose, onSucesso }: ModalProps) {
  const { session } = useAuth()
  const [form, setForm] = useState<NovoUsuarioForm>({
    nome: '', email: '', senha: '', role: 'recepcao',
  })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function set(field: keyof NovoUsuarioForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (erro) setErro(null)
  }

  async function salvar() {
    setErro(null)

    // Validações básicas
    if (!form.nome.trim())  return setErro('O nome é obrigatório.')
    if (!form.email.trim()) return setErro('O e-mail é obrigatório.')
    if (!form.senha)        return setErro('A senha é obrigatória.')

    const erroSenha = validarSenha(form.senha)
    if (erroSenha) return setErro(erroSenha)

    setSalvando(true)
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.senha,
        options: {
          data: { full_name: form.nome.trim() },
        },
      })

      if (signUpError) {
        setErro(signUpError.message)
        return
      }

      const userId = signUpData.user?.id
      if (!userId) {
        setErro('Não foi possível obter o ID do novo usuário.')
        return
      }

      // 2. Criar/atualizar perfil em user_profiles com nome e role
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(
          { id: userId, nome: form.nome.trim(), role: form.role },
          { onConflict: 'id' }
        )

      if (profileError) {
        setErro(`Usuário criado, mas erro ao salvar perfil: ${profileError.message}`)
        return
      }

      await logAction(session?.user?.id || userId, 'criacao', 'usuarios', {
        email: form.email.trim(),
        role: form.role,
      })

      onSucesso()
    } catch (e: any) {
      setErro(e.message || 'Erro inesperado ao criar usuário.')
    } finally {
      setSalvando(false)
    }
  }

  // Fechar ao clicar no backdrop
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-slate-100">Novo Usuário</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Erro */}
          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {erro}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nome completo
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Ex: Ana Silva"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="Ex: ana@clinica.com"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={form.senha}
                onChange={e => set('senha', e.target.value)}
                placeholder="Mín. 8 chars, maiúscula, minúscula, número"
                className="w-full px-4 py-2.5 pr-11 bg-slate-950/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(v => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-600 leading-relaxed">
              Mínimo 8 caracteres · 1 maiúscula · 1 minúscula · 1 número
            </p>
          </div>

          {/* Perfil */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Perfil de acesso
            </label>
            <select
              value={form.role}
              onChange={e => set('role', e.target.value as Role)}
              className="appearance-none w-full px-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="admin"      className="bg-slate-900">Administrador</option>
              <option value="dentista"   className="bg-slate-900">Dentista</option>
              <option value="recepcao"   className="bg-slate-900">Recepção</option>
              <option value="financeiro" className="bg-slate-900">Financeiro</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={salvando}
            className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all border border-transparent"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-70 rounded-xl transition-all border border-blue-500 shadow-sm active:scale-95"
          >
            {salvando ? 'Criando...' : 'Criar usuário'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Usuarios() {
  const { session, refreshProfile } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  async function carregarUsuarios() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, nome, role')

      if (error) {
        console.error('Erro ao carregar perfis:', error.message)
      }

      setUsuarios((data || []) as Usuario[])
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  async function alterarRole(userId: string, novaRole: string) {
    const roleAnterior = usuarios.find(u => u.id === userId)?.role

    setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, role: novaRole as Role } : u))

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: novaRole })
        .eq('id', userId)
        .select()

      if (error) {
        setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, role: roleAnterior as Role } : u))
        alert(`Erro ao alterar perfil: ${error.message}`)
      } else {
        if (session?.user?.id) {
          await logAction(session.user.id, 'edicao', 'usuarios', { user_id_afetado: userId, nova_role: novaRole })
        }
        if (userId === session?.user?.id) {
          await refreshProfile()
        }
      }
    } catch (e: any) {
      setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, role: roleAnterior as Role } : u))
      alert(`Erro inesperado: ${e.message || e}`)
    }
  }

  function handleSucesso() {
    setModalAberto(false)
    carregarUsuarios()
  }

  useEffect(() => { carregarUsuarios() }, [])

  return (
    <>
      {modalAberto && (
        <ModalNovoUsuario
          onClose={() => setModalAberto(false)}
          onSucesso={handleSucesso}
        />
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-101">Usuários e Perfis</h2>
        <p className="text-slate-400 mt-1 text-sm">Gerencie permissões e níveis de acesso</p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-105 flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-400" />
            Todos os Usuários
          </h3>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-700/50">
              {usuarios.length} usuário(s)
            </span>
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all border border-blue-500 shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Novo Usuário
            </button>
          </div>
        </div>

        {carregando ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="h-16 w-16 bg-slate-900 text-slate-550 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-1">Nenhum perfil encontrado</h3>
            <p className="text-slate-400 text-sm">Clique em "Novo Usuário" para adicionar o primeiro.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-900/40 border-b border-slate-700/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil Atual</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alterar Perfil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {usuarios.map((u) => {
                    const info = ROLE_LABELS[u.role] || ROLE_LABELS['recepcao']
                    return (
                      <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                              {(u.nome || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-200 text-sm">{u.nome || 'Sem Nome'}</div>
                              <div className="text-xs text-slate-500">ID: {u.id.substring(0, 8)}</div>
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
                            className="appearance-none px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-105 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            value={u.role}
                            onChange={(e) => alterarRole(u.id, e.target.value)}
                          >
                            <option value="admin"      className="bg-slate-900 text-slate-100">Administrador</option>
                            <option value="dentista"   className="bg-slate-900 text-slate-100">Dentista</option>
                            <option value="recepcao"   className="bg-slate-900 text-slate-100">Recepção</option>
                            <option value="financeiro" className="bg-slate-900 text-slate-100">Financeiro</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-700/50">
              {usuarios.map((u) => {
                const info = ROLE_LABELS[u.role] || ROLE_LABELS['recepcao']
                return (
                  <div key={u.id} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                        {(u.nome || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-200 text-sm truncate">{u.nome || 'Sem Nome'}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${info.color} mt-0.5`}>
                          {info.label}
                        </span>
                      </div>
                    </div>
                    <select
                      className="appearance-none w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-105 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                      value={u.role}
                      onChange={(e) => alterarRole(u.id, e.target.value)}
                    >
                      <option value="admin"      className="bg-slate-900 text-slate-100">Administrador</option>
                      <option value="dentista"   className="bg-slate-900 text-slate-100">Dentista</option>
                      <option value="recepcao"   className="bg-slate-900 text-slate-100">Recepção</option>
                      <option value="financeiro" className="bg-slate-900 text-slate-100">Financeiro</option>
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
