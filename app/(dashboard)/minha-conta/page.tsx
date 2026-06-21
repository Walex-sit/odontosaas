'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../components/RequireAuth'
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, User } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  dentista: 'Dentista',
  recepcao: 'Recepção',
  financeiro: 'Financeiro',
}

function validarSenha(senha: string): string | null {
  if (senha.length < 8)       return 'A senha deve conter pelo menos 8 caracteres.'
  if (!/[A-Z]/.test(senha))   return 'A senha deve conter pelo menos uma letra maiúscula.'
  if (!/[a-z]/.test(senha))   return 'A senha deve conter pelo menos uma letra minúscula.'
  if (!/[0-9]/.test(senha))   return 'A senha deve conter pelo menos um número.'
  return null
}

export default function MinhaConta() {
  const { profile } = useAuth()

  const [novaSenha, setNovaSenha]             = useState('')
  const [confirmaSenha, setConfirmaSenha]     = useState('')
  const [mostrarNova, setMostrarNova]         = useState(false)
  const [mostrarConfirma, setMostrarConfirma] = useState(false)
  const [salvando, setSalvando]               = useState(false)
  const [sucesso, setSucesso]                 = useState(false)
  const [erro, setErro]                       = useState<string | null>(null)

  async function alterarSenha() {
    setErro(null)
    setSucesso(false)

    if (!novaSenha) return setErro('Digite a nova senha.')

    const erroSenha = validarSenha(novaSenha)
    if (erroSenha) return setErro(erroSenha)

    if (novaSenha !== confirmaSenha)
      return setErro('As senhas não coincidem.')

    setSalvando(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha })
      if (error) {
        setErro(error.message)
      } else {
        setSucesso(true)
        setNovaSenha('')
        setConfirmaSenha('')
      }
    } catch (e: any) {
      setErro(e.message || 'Erro inesperado.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Minha Conta</h2>
        <p className="text-slate-400 mt-1 text-sm">Gerencie suas informações e segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Card de Perfil */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold border-2 border-blue-500/30 shadow-sm mb-4">
              {(profile?.nome || 'U').charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-slate-100">{profile?.nome || 'Usuário'}</h3>
            <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {ROLE_LABELS[profile?.role ?? ''] ?? profile?.role ?? '—'}
            </span>

            <div className="w-full mt-6 pt-5 border-t border-slate-700/50 text-left space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">ID do Usuário</p>
                <p className="text-xs text-slate-400 font-mono break-all">{profile?.id ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Nível de Acesso</p>
                <p className="text-sm font-semibold text-slate-300">{ROLE_LABELS[profile?.role ?? ''] ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Alterar Senha */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
              <div className="h-9 w-9 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Alterar Senha</h3>
                <p className="text-xs text-slate-500">A nova senha será aplicada imediatamente</p>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Feedback de erro */}
              {erro && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{erro}</p>
                </div>
              )}

              {/* Feedback de sucesso */}
              {sucesso && (
                <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-400 font-medium">Senha alterada com sucesso!</p>
                </div>
              )}

              {/* Nova Senha */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarNova ? 'text' : 'password'}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    value={novaSenha}
                    onChange={(e) => { setNovaSenha(e.target.value); setErro(null); setSucesso(false) }}
                    disabled={salvando}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNova(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {mostrarNova ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarConfirma ? 'text' : 'password'}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    value={confirmaSenha}
                    onChange={(e) => { setConfirmaSenha(e.target.value); setErro(null); setSucesso(false) }}
                    disabled={salvando}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirma(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {mostrarConfirma ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Requisitos */}
              <ul className="space-y-1.5">
                {[
                  { ok: novaSenha.length >= 8,         label: 'Mínimo de 8 caracteres' },
                  { ok: /[A-Z]/.test(novaSenha),       label: 'Pelo menos uma letra maiúscula' },
                  { ok: /[a-z]/.test(novaSenha),       label: 'Pelo menos uma letra minúscula' },
                  { ok: /[0-9]/.test(novaSenha),       label: 'Pelo menos um número' },
                  { ok: novaSenha === confirmaSenha && confirmaSenha.length > 0, label: 'Senhas coincidem' },
                ].map(({ ok, label }) => (
                  <li key={label} className={`flex items-center gap-2 text-xs font-medium transition-colors ${ok ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${ok ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    {label}
                  </li>
                ))}
              </ul>

              {/* Botão */}
              <button
                onClick={alterarSenha}
                disabled={salvando}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all border border-blue-500 shadow-sm active:scale-[0.98]"
              >
                {salvando ? 'Salvando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
