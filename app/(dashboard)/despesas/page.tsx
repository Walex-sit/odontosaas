'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { logAction } from '../../lib/logger'
import { TrendingDown, Plus, ListFilter, Calendar, DollarSign } from 'lucide-react'

export default function Despesas() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [dataVencimento, setDataVencimento] = useState('')
  const [despesas, setDespesas] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  async function carregarDespesas() {
    try {
      const { data } = await supabase
        .from('despesas')
        .select('*')
        .order('created_at', { ascending: false })

      setDespesas(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  async function salvarDespesa() {
    if (!descricao.trim() || !valor || !dataVencimento) return

    const { data: userData } = await supabase.auth.getUser()

    try {
      await supabase.from('despesas').insert([
        {
          descricao,
          valor: Number(valor),
          categoria,
          data_vencimento: dataVencimento,
          status: 'pendente',
          user_id: userData.user?.id
        }
      ])

      await logAction('financeiro', 'despesas', { descricao, valor: Number(valor), categoria, acao: 'despesa_criada' })

      setDescricao('')
      setValor('')
      setCategoria('')
      setDataVencimento('')
      carregarDespesas()
    } catch (e) {
      alert('Erro ao registrar despesa')
    }
  }

  useEffect(() => {
    carregarDespesas()
  }, [])

  const total = despesas.reduce((acc, item) => acc + Number(item.valor), 0)

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Despesas</h2>
          <p className="text-slate-500 mt-1 text-sm">Controle de despesas e contas a pagar</p>
        </div>

        {/* Card do Resumo de Despesas */}
        <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 w-full sm:w-auto">
          <div className="h-10 w-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100 shrink-0">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Despesas</p>
            <p className="text-xl font-extrabold text-red-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Nova Despesa */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-red-600" />
          Nova Despesa
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descrição</label>
            <input 
              className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all shadow-sm" 
              placeholder="Ex: Aluguel" 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valor (R$)</label>
            <input 
              className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all shadow-sm" 
              placeholder="0,00" 
              type="number" 
              step="0.01" 
              min="0" 
              value={valor} 
              onChange={(e) => setValor(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
            <select 
              className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all shadow-sm" 
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="aluguel">Aluguel</option>
              <option value="salarios">Salários</option>
              <option value="materiais">Materiais</option>
              <option value="equipamentos">Equipamentos</option>
              <option value="impostos">Impostos</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vencimento</label>
            <input 
              type="date" 
              className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all shadow-sm" 
              value={dataVencimento} 
              onChange={(e) => setDataVencimento(e.target.value)} 
            />
          </div>

          <button 
            onClick={salvarDespesa} 
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm h-[42px] border border-red-700 shadow-sm flex items-center justify-center shrink-0 active:scale-95"
          >
            Lançar Despesa
          </button>
        </div>
      </div>

      {/* Histórico de Despesas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-slate-500" />
            Histórico de Despesas
          </h3>
        </div>

        {carregando ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : despesas.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhuma despesa lançada</h3>
            <p className="text-slate-500 text-sm">Registre as despesas da clínica.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimento</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {despesas.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800 text-sm">{d.descricao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium capitalize">{d.categoria || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{d.data_vencimento ? new Date(d.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        d.status === 'pendente' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                        d.status === 'pago' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {d.status ? d.status.toUpperCase() : 'PENDENTE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-red-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(d.valor))}
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
