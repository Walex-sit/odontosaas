'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Financeiro() {
  const router = useRouter()
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [receitas, setReceitas] = useState<any[]>([])

  async function carregarReceitas() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push('/login')
      return
    }

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
    carregarReceitas()
  }, [])

  const total = receitas.reduce(
    (acc, item) => acc + Number(item.valor),
    0
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financeiro</h2>
          <p className="text-gray-500 mt-1">Controle financeiro da clínica</p>
        </div>

        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Receitas</p>
            <p className="text-xl font-extrabold text-emerald-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Receita
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descrição</label>
            <input
              className="appearance-none block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition-all"
              placeholder="Ex: Tratamento Ortodôntico"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valor (R$)</label>
            <input
              className="appearance-none block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:text-sm transition-all"
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
            className="w-full bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm font-bold text-sm h-[42px]"
          >
            Lançar Receita
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Histórico de Receitas
          </h3>
        </div>

        {receitas.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="h-16 w-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhuma receita lançada</h3>
            <p className="text-gray-500">Comece a registrar as receitas da clínica.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {receitas.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-sm">{r.descricao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(r.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${
                        r.status === 'pendente' ? 'bg-amber-100 text-amber-800' : 
                        r.status === 'pago' ? 'bg-emerald-100 text-emerald-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {r.status ? r.status.toUpperCase() : 'PENDENTE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-600 bg-emerald-50/50">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(r.valor))}
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