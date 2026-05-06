'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/navigation'

export default function Financeiro() {
  const router = useRouter()
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [receitas, setReceitas] = useState<any[]>([])

  async function verificarLogin() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) router.push('/login')
  }

  async function carregarReceitas() {
    // Para simplificar, assumindo que as receitas do usuário autenticado 
    // também poderiam ter um user_id se fosse multi-tenant restrito, 
    // mas vamos preservar a lógica original
    const { data } = await supabase
      .from('receitas')
      .select('*')
      .order('created_at', { ascending: false })

    setReceitas(data || [])
  }

  async function salvarReceita() {
    if (!descricao.trim() || !valor) return

    await supabase.from('receitas').insert([
      {
        descricao,
        valor: Number(valor),
        status: 'pendente'
      }
    ])

    setDescricao('')
    setValor('')

    carregarReceitas()
  }

  useEffect(() => {
    verificarLogin()
    carregarReceitas()
  }, [])

  const total = receitas.reduce(
    (acc, item) => acc + Number(item.valor),
    0
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:px-12 overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financeiro</h2>
          <p className="text-gray-500 mt-1.5 font-medium">Controle financeiro da clínica</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-50 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Total Receitas</p>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-extrabold mt-2 text-emerald-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
              </h3>
            </div>
          </div>
          {/* Pode-se adicionar mais cards no futuro como "Despesas" e "Saldo" */}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 mb-8 transition-all hover:shadow-md">
          <h3 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            Nova Receita
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Descrição</label>
              <input
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Ex: Tratamento Ortodôntico"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Valor (R$)</label>
              <input
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>

            <button
              onClick={salvarReceita}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-md font-bold text-sm"
            >
              Lançar Receita
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
          <h3 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            Histórico de Receitas
          </h3>

          {receitas.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">Nenhuma receita lançada ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receitas.map((r) => (
                <div
                  key={r.id}
                  className="border border-slate-100 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {r.descricao}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold mt-1.5 shadow-sm ${
                      r.status === 'pendente' ? 'bg-amber-100 text-amber-800' : 
                      r.status === 'pago' ? 'bg-emerald-100 text-emerald-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {r.status ? r.status.toUpperCase() : 'PENDENTE'}
                    </span>
                  </div>

                  <div className="font-extrabold text-emerald-600 text-lg">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(r.valor))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}