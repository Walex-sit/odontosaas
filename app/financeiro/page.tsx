'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Financeiro() {

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [receitas, setReceitas] = useState<any[]>([])

  async function carregarReceitas() {

    const { data } = await supabase
      .from('receitas')
      .select('*')
      .order('created_at', { ascending: false })

    setReceitas(data || [])
  }

  async function salvarReceita() {

    if (!descricao || !valor) return

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
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          OdontoSaaS
        </h1>

        <nav className="space-y-3">

          <Link
            className="block p-3 rounded-lg hover:bg-gray-100"
            href="/"
          >
            Dashboard
          </Link>

          <Link
            className="block p-3 rounded-lg hover:bg-gray-100"
            href="/pacientes"
          >
            Pacientes
          </Link>

          <Link
            className="block p-3 rounded-lg hover:bg-gray-100"
            href="/agenda"
          >
            Agenda
          </Link>

          <Link
            className="block p-3 rounded-lg bg-blue-600 text-white"
            href="/financeiro"
          >
            Financeiro
          </Link>

        </nav>
      </aside>

      <main className="flex-1 p-8">

        <h2 className="text-3xl font-bold mb-2">
          Financeiro
        </h2>

        <p className="text-gray-500 mb-8">
          Controle financeiro da clínica
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Total Receitas</p>

            <h3 className="text-4xl font-bold mt-2 text-green-600">
              R$ {total.toFixed(2)}
            </h3>
          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h3 className="text-xl font-bold mb-4">
            Nova Receita
          </h3>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              className="border rounded-lg px-4 py-2"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              className="border rounded-lg px-4 py-2"
              placeholder="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <button
              onClick={salvarReceita}
              className="bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Salvar
            </button>

          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="text-xl font-bold mb-4">
            Receitas
          </h3>

          <div className="space-y-4">

            {receitas.map((r) => (
              <div
                key={r.id}
                className="border rounded-xl p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {r.descricao}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {r.status}
                  </p>
                </div>

                <div className="font-bold text-green-600">
                  R$ {Number(r.valor).toFixed(2)}
                </div>
              </div>
            ))}

          </div>

        </div>

      </main>
    </div>
  )
}