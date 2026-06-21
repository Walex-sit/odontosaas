'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../components/RequireAuth'
import PageTransition from '../../components/PageTransition'
import SmoothScroll from '../../components/SmoothScroll'
import { Users, Calendar, TrendingUp, TrendingDown, Wallet, BookOpen, ClipboardList } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface DashboardData {
  pacientes: number
  agendamentos: number
  receitas: number
  despesas: number
  prontuarios: number
}

// ─── Widget Card ─────────────────────────────────────────────────────────────

interface CardProps {
  label: string
  value: string | number
  badge?: string
  badgeColor?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  iconBorder: string
}

function StatCard({ label, value, badge, badgeColor, icon: Icon, iconBg, iconColor, iconBorder }: CardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col justify-between hover:border-slate-650 transition-all duration-300 relative overflow-hidden group shadow-sm">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 ${iconBg} ${iconColor} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border ${iconBorder}`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
          </div>
          {badge && (
            <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-slate-400 font-medium text-xs sm:text-sm">{label}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">{value}</h3>
      </div>
    </div>
  )
}

// ─── Widget sets por perfil ──────────────────────────────────────────────────

function AdminWidgets({ data }: { data: DashboardData }) {
  return (
    <>
      <StatCard label="Pacientes Cadastrados" value={data.pacientes} badge="+12% mês" badgeColor="text-emerald-450 bg-emerald-500/10 border border-emerald-500/20" icon={Users} iconBg="bg-blue-500/10" iconColor="text-blue-400" iconBorder="border-blue-500/20" />
      <StatCard label="Agendamentos de Hoje" value={data.agendamentos} badge="Hoje" badgeColor="text-slate-300 bg-slate-700 border border-slate-600" icon={Calendar} iconBg="bg-indigo-500/10" iconColor="text-indigo-400" iconBorder="border-indigo-500/20" />
      <StatCard label="Receita do Mês" value={`R$ ${(data.receitas * 150).toFixed(2)}`} badge="+8% mês" badgeColor="text-emerald-450 bg-emerald-500/10 border border-emerald-500/20" icon={TrendingUp} iconBg="bg-emerald-500/10" iconColor="text-emerald-400" iconBorder="border-emerald-500/20" />
      <StatCard label="Despesas do Mês" value={`R$ ${(data.despesas * 50).toFixed(2)}`} icon={TrendingDown} iconBg="bg-red-500/10" iconColor="text-red-400" iconBorder="border-red-500/20" />
      <StatCard label="Saldo Atual" value={`R$ ${((data.receitas * 150) - (data.despesas * 50)).toFixed(2)}`} icon={Wallet} iconBg="bg-teal-500/10" iconColor="text-teal-400" iconBorder="border-teal-500/20" />
      <StatCard label="Prontuários Registrados" value={data.prontuarios} icon={ClipboardList} iconBg="bg-amber-500/10" iconColor="text-amber-400" iconBorder="border-amber-500/20" />
    </>
  )
}

function DentistaWidgets({ data }: { data: DashboardData }) {
  return (
    <>
      <StatCard label="Meus Pacientes" value={data.pacientes} badge="+12% mês" badgeColor="text-emerald-450 bg-emerald-500/10 border border-emerald-500/20" icon={Users} iconBg="bg-blue-500/10" iconColor="text-blue-400" iconBorder="border-blue-500/20" />
      <StatCard label="Agendamentos de Hoje" value={data.agendamentos} badge="Hoje" badgeColor="text-slate-300 bg-slate-700 border border-slate-600" icon={Calendar} iconBg="bg-indigo-500/10" iconColor="text-indigo-400" iconBorder="border-indigo-500/20" />
      <StatCard label="Prontuários Registrados" value={data.prontuarios} icon={ClipboardList} iconBg="bg-amber-500/10" iconColor="text-amber-400" iconBorder="border-amber-500/20" />
    </>
  )
}

function RecepcaoWidgets({ data }: { data: DashboardData }) {
  return (
    <>
      <StatCard label="Pacientes Cadastrados" value={data.pacientes} badge="+12% mês" badgeColor="text-emerald-450 bg-emerald-500/10 border border-emerald-500/20" icon={Users} iconBg="bg-blue-500/10" iconColor="text-blue-400" iconBorder="border-blue-500/20" />
      <StatCard label="Agendamentos de Hoje" value={data.agendamentos} badge="Hoje" badgeColor="text-slate-300 bg-slate-700 border border-slate-600" icon={Calendar} iconBg="bg-indigo-500/10" iconColor="text-indigo-400" iconBorder="border-indigo-500/20" />
    </>
  )
}

function FinanceiroWidgets({ data }: { data: DashboardData }) {
  return (
    <>
      <StatCard label="Receita do Mês" value={`R$ ${(data.receitas * 150).toFixed(2)}`} badge="+8% mês" badgeColor="text-emerald-450 bg-emerald-500/10 border border-emerald-500/20" icon={TrendingUp} iconBg="bg-emerald-500/10" iconColor="text-emerald-400" iconBorder="border-emerald-500/20" />
      <StatCard label="Despesas do Mês" value={`R$ ${(data.despesas * 50).toFixed(2)}`} icon={TrendingDown} iconBg="bg-red-500/10" iconColor="text-red-400" iconBorder="border-red-500/20" />
      <StatCard label="Saldo Atual" value={`R$ ${((data.receitas * 150) - (data.despesas * 50)).toFixed(2)}`} icon={Wallet} iconBg="bg-teal-500/10" iconColor="text-teal-400" iconBorder="border-teal-500/20" />
      <StatCard label="Assinaturas Ativas" value={0} icon={BookOpen} iconBg="bg-amber-500/10" iconColor="text-amber-400" iconBorder="border-amber-500/20" />
    </>
  )
}

// ─── Greetings por perfil ────────────────────────────────────────────────────

const GREETINGS: Record<string, { title: string; subtitle: string }> = {
  admin: {
    title: 'Visão Geral 👋',
    subtitle: 'Acompanhe todos os indicadores da clínica em tempo real.',
  },
  dentista: {
    title: 'Olá, Dentista 👨‍⚕️',
    subtitle: 'Seus pacientes e agenda de hoje.',
  },
  recepcao: {
    title: 'Bem-vindo à Recepção 🗓️',
    subtitle: 'Gerencie pacientes e agendamentos.',
  },
  financeiro: {
    title: 'Painel Financeiro 💰',
    subtitle: 'Acompanhe receitas, despesas e saldo.',
  },
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { session, profile } = useAuth()
  const role = profile?.role ?? 'recepcao'

  const [data, setData] = useState<DashboardData>({
    pacientes: 0,
    agendamentos: 0,
    receitas: 0,
    despesas: 0,
    prontuarios: 0,
  })

  async function carregarDados(userId: string) {
    const [pacs, ags, recs, desps, prns] = await Promise.all([
      supabase.from('pacientes').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('agendamentos').select('id', { count: 'exact', head: true }),
      supabase.from('receitas').select('id', { count: 'exact', head: true }),
      supabase.from('despesas').select('id', { count: 'exact', head: true }),
      supabase.from('prontuarios').select('id', { count: 'exact', head: true }),
    ])

    setData({
      pacientes: pacs.count ?? 0,
      agendamentos: ags.count ?? 0,
      receitas: recs.count ?? 0,
      despesas: desps.count ?? 0,
      prontuarios: prns.count ?? 0,
    })
  }

  useEffect(() => {
    if (session?.user?.id) {
      carregarDados(session.user.id)
    }
  }, [session])

  const greeting = GREETINGS[role] ?? GREETINGS.admin

  return (
    <SmoothScroll>
      <PageTransition>
        <div className="mb-6 sm:mb-8 px-1 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            {greeting.title}
          </h2>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            {greeting.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {role === 'admin'      && <AdminWidgets data={data} />}
          {role === 'dentista'   && <DentistaWidgets data={data} />}
          {role === 'recepcao'   && <RecepcaoWidgets data={data} />}
          {role === 'financeiro' && <FinanceiroWidgets data={data} />}
        </div>
      </PageTransition>
    </SmoothScroll>
  )
}