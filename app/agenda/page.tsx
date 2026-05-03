'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function Agenda() {

  const [pacientes, setPacientes] = useState<any[]>([])
  const [agendamentos, setAgendamentos] = useState<any[]>([])

  const [pacienteId, setPacienteId] = useState('')
  const [dataConsulta, setDataConsulta] = useState('')
  const [horaConsulta, setHoraConsulta] = useState('')

  async function carregarPacientes() {
    const { data: userData } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .eq('user_id', userData.user?.id)

    setPacientes(data || [])
  }

  async function carregarAgendamentos() {
    const { data } = await supabase
      .from('agendamentos')
      .select(`
        *,
        pacientes(nome)
      `)
      .order('data_consulta', { ascending: true })

    setAgendamentos(data || [])
  }

  async function salvarAgendamento() {

    if (!pacienteId || !dataConsulta || !horaConsulta) {
      return
    }

    await supabase.from('agendamentos').insert([
      {
        paciente_id: pacienteId,
        data_consulta: dataConsulta,
        hora_consulta: horaConsulta
      }
    ])

    setPacienteId('')
    setDataConsulta('')
    setHoraConsulta('')

    carregarAgendamentos()
  }

  useEffect(() => {
    carregarPacientes()
    carregarAgendamentos()
  }, [])
const eventos = agendamentos.map((a) => ({
  title: a.pacientes?.nome || 'Consulta',
  date: a.data_consulta
}))
  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">
          OdontoSaaS
        </h1>

        <nav className="space-y-3">
          <Link className="block p-3 rounded-lg hover:bg-gray-100" href="/">
            Dashboard
          </Link>

          <Link className="block p-3 rounded-lg hover:bg-gray-100" href="/pacientes">
            Pacientes
          </Link>

          <Link className="block p-3 rounded-lg bg-blue-600 text-white" href="/agenda">
            Agenda
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">

        <h2 className="text-3xl font-bold mb-2">
          Agenda
        </h2>

        <p className="text-gray-500 mb-8">
          Controle de consultas
        </p>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h3 className="text-xl font-bold mb-4">
            Novo agendamento
          </h3>

          <div className="grid md:grid-cols-4 gap-4">

            <select
              className="border rounded-lg px-4 py-2"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
            >
              <option value="">Selecione paciente</option>

              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border rounded-lg px-4 py-2"
              value={dataConsulta}
              onChange={(e) => setDataConsulta(e.target.value)}
            />

            <input
              type="time"
              className="border rounded-lg px-4 py-2"
              value={horaConsulta}
              onChange={(e) => setHoraConsulta(e.target.value)}
            />

            <button
              onClick={salvarAgendamento}
              className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Salvar
            </button>

          </div>
        </div>
<div className="bg-white p-6 rounded-2xl shadow mb-8">

  <h3 className="text-xl font-bold mb-4">
    Calendário
  </h3>

  <FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    events={eventos}
    height="auto"
  />

</div>
        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="text-xl font-bold mb-4">
            Próximas consultas
          </h3>

          <div className="space-y-4">

            {agendamentos.map((a) => (
              <div
                key={a.id}
                className="border rounded-xl p-4 flex justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {a.pacientes?.nome}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {a.data_consulta}
                  </p>
                </div>

                <div className="font-bold text-blue-600">
                  {a.hora_consulta}
                </div>
              </div>
            ))}

          </div>

        </div>

      </main>
    </div>
  )
}