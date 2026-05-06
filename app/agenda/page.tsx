'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/navigation'

export default function Agenda() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [agendamentos, setAgendamentos] = useState<any[]>([])

  const [pacienteId, setPacienteId] = useState('')
  const [dataConsulta, setDataConsulta] = useState('')
  const [horaConsulta, setHoraConsulta] = useState('')

  async function verificarLogin() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) router.push('/login')
  }

  async function carregarPacientes() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data } = await supabase
      .from('pacientes')
      .select('*')
      .eq('user_id', userData.user.id)

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
      alert('Por favor, preencha todos os campos.')
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
    verificarLogin()
    carregarPacientes()
    carregarAgendamentos()
  }, [])

  const eventos = agendamentos.map((a) => ({
    title: a.pacientes?.nome || 'Consulta',
    date: a.data_consulta,
    color: '#2563eb' // blue-600
  }))

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 lg:px-12 overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Agenda</h2>
          <p className="text-gray-500 mt-1.5 font-medium">Controle de consultas e calendário</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 mb-8 transition-all hover:shadow-md">
          <h3 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Novo Agendamento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Paciente</label>
              <select
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
              >
                <option value="">Selecione o paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Data</label>
              <input
                type="date"
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Horário</label>
              <input
                type="time"
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                value={horaConsulta}
                onChange={(e) => setHoraConsulta(e.target.value)}
              />
            </div>

            <button
              onClick={salvarAgendamento}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md font-bold text-sm"
            >
              Agendar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
            <h3 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Calendário Mensal
            </h3>
            
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={eventos}
                height="auto"
                locale="pt-br"
                buttonText={{ today: 'Hoje' }}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth'
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 h-fit transition-all hover:shadow-md">
            <h3 className="text-xl font-extrabold text-slate-800 mb-5">
              Próximas consultas
            </h3>

            {agendamentos.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">Nenhuma consulta agendada.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agendamentos.map((a) => (
                  <div
                    key={a.id}
                    className="border border-slate-100 rounded-xl p-4 flex justify-between items-center hover:bg-blue-50/50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {a.pacientes?.nome || 'Paciente não encontrado'}
                      </p>
                      <div className="flex items-center text-slate-500 text-xs mt-1 font-medium gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(a.data_consulta).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <div className="font-bold text-blue-700 bg-blue-100 px-3.5 py-1.5 rounded-lg text-sm shadow-sm">
                      {a.hora_consulta}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}