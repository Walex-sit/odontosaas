'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { logAction } from '../lib/logger'
import { Mail, Lock, Activity } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function login() {
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.')
      return
    }
    setCarregando(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) {
        alert(error.message)
      } else {
        await logAction('login', 'auth', { email })
        router.push('/pacientes')
      }
    } catch (e: any) {
      alert(e.message || 'Erro ao realizar login')
    } finally {
      setCarregando(false)
    }
  }

  async function registrar() {
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.')
      return
    }
    setCarregando(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
      })

      if (error) {
        alert(error.message)
      } else {
        alert('Conta criada com sucesso! Verifique seu e-mail ou acesse o sistema.')
      }
    } catch (e: any) {
      alert(e.message || 'Erro ao criar conta')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFF] font-sans antialiased text-slate-800">
      
      {/* Coluna Esquerda: Seção Hero */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-10 lg:py-16 lg:px-12 border-b lg:border-b-0 lg:border-r border-slate-100 bg-white relative overflow-hidden">
        {/* Background sutil */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-[120px]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-50/30 blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-2xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-600 text-xs font-semibold mb-6 shadow-sm">
            <Activity className="h-4 w-4" />
            O novo padrão em tecnologia clínica
          </div>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
            A nova geração da <br />
            <span className="text-blue-600">gestão odontológica</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-slate-500 mt-4 text-sm md:text-base leading-relaxed max-w-xl">
            Um software médico premium projetado para clínicas que exigem velocidade, elegância e confiabilidade total em seus processos diários.
          </p>
        </div>
      </div>

      {/* Coluna Direita: Card de Login */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center px-6 py-10 lg:py-16 lg:px-12 bg-[#F8FAFF]">
        
        {/* Header Superior da Coluna Direita */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Odonto<span className="text-blue-600">SaaS</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center">
            Acesse sua clínica
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 text-center">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        {/* Card Branco */}
        <div className="w-full max-w-[380px] bg-white border border-slate-200/60 rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center">
          
          {/* Logo Card */}
          <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-sm mb-3">
            OS
          </div>
          
          <div className="text-lg font-bold text-slate-800 mb-6">
            Odonto<span className="text-blue-600">SaaS</span>
          </div>

          {/* Form Fields */}
          <div className="w-full space-y-4">
            {/* E-mail Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                disabled={carregando}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm"
                placeholder="testealex@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Senha Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                disabled={carregando}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {/* Botão Entrar */}
            <button
              onClick={login}
              disabled={carregando}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-all text-sm shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>

            {/* Botão Criar Conta */}
            <button
              onClick={registrar}
              disabled={carregando}
              className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50/40 disabled:opacity-50 transition-all text-sm active:scale-[0.98]"
            >
              Criar conta
            </button>
          </div>
        </div>

        {/* Footer do Card */}
        <div className="flex items-center gap-2 mt-8 text-slate-500 max-w-[280px] text-center">
          <Lock className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500 leading-normal">
            Seus dados estão protegidos com segurança de ponta a ponta.
          </span>
        </div>

      </div>
    </div>
  )
}