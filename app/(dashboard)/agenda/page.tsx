'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Calendar as CalendarIcon, Clock, User, Plus } from 'lucide-react'

export default function Agenda() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  const [pacienteId, setPacienteId] = useState('')
  const [dataConsulta, setDataConsulta] = useState('')
  const [horaConsulta, setHoraConsulta] = useState('')

  async function carregarPacientes() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push('/login')
      return
    }

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

    try {
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
    } catch (e) {
      alert('Erro ao criar agendamento')
    }
  }

  useEffect(() => {
    async function init() {
      await Promise.all([carregarPacientes(), carregarAgendamentos()])
      setCarregando(false)
    }
    init()
  }, [])

  const eventos = agendamentos.map((a) => ({
    title: a.pacientes?.nome || 'Consulta',
    date: a.data_consulta,
    color: '#2563eb' // Blue theme
  }))

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agenda da Clínica</h2>
          <p className="text-slate-500 mt-1 text-sm">Gerencie os horários e agendamentos</p>
        </div>
      </div>

      {/* Card de Novo Agendamento */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          Novo Agendamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Paciente</label>
            <div className="relative">
              <select
                className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all shadow-sm"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
              >
                <option value="" className="text-slate-500">Selecione o paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id} className="text-slate-800">
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Data</label>
            <input
              type="date"
              className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all shadow-sm"
              value={dataConsulta}
              onChange={(e) => setDataConsulta(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Horário</label>
            <input
              type="time"
              className="appearance-none block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all shadow-sm"
              value={horaConsulta}
              onChange={(e) => setHoraConsulta(e.target.value)}
            />
          </div>

          <button
            onClick={salvarAgendamento}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm h-[42px] border border-blue-700 shadow-sm flex items-center justify-center shrink-0 active:scale-95"
          >
            Agendar
          </button>
        </div>
      </div>

      {/* Calendário e Próximas Consultas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bloco do Calendário */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-slate-500" />
            Calendário Mensal
          </h3>
          
          <div className="calendar-container clinical-calendar overflow-x-auto no-scrollbar">
            <div className="min-w-[500px]">
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
        </div>

        {/* Bloco de Próximas Consultas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Próximas consultas
          </h3>

          {carregando ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 font-medium text-sm">Nenhuma consulta agendada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {agendamentos.map((a) => (
                <div
                  key={a.id}
                  className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {a.pacientes?.nome || 'Paciente não encontrado'}
                    </p>
                    <div className="flex items-center text-slate-500 text-xs mt-1 font-medium gap-1">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {new Date(a.data_consulta).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shrink-0">
                    <Clock className="h-3 w-3" />
                    {a.hora_consulta}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  )
}