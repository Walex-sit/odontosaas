'use client'

import { useRouter } from 'next/navigation'
import { ShieldOff } from 'lucide-react'

export default function AcessoNegado() {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0e1420' }}>
      <div className="flex flex-col items-center text-center max-w-md px-6">
        <div className="h-20 w-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <ShieldOff className="h-10 w-10 text-red-400" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-100 mb-3">
          Acesso Negado
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Você não possui permissão para acessar esta área.
          <br />
          Se acredita que isso é um erro, entre em contato com o administrador.
        </p>

        <button
          onClick={() => router.replace('/overview')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all border border-blue-500 shadow-sm active:scale-95"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  )
}
