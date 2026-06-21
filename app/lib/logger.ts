import { supabase } from './supabaseClient'

export type LogAction = 'login' | 'logout' | 'criacao' | 'edicao' | 'exclusao' | 'financeiro'

/**
 * Registra uma ação no sistema de auditoria (system_logs).
 * 
 * @param userId   - ID do usuário que realizou a ação (obrigatório)
 * @param action   - Tipo da ação: login, logout, criacao, edicao, exclusao, financeiro
 * @param entity   - Módulo/entidade afetada: pacientes, receitas, despesas, usuarios, auth...
 * @param details  - Objeto com detalhes contextuais (nome, valor, id do registro, etc.)
 * 
 * Exemplo:
 *   await logAction(userId, 'criacao', 'pacientes', { nome: 'João Silva' })
 *   await logAction(userId, 'financeiro', 'receitas', { descricao: 'Implante', valor: 3500 })
 */
export async function logAction(
  userId: string,
  action: LogAction,
  entity: string,
  details?: Record<string, unknown>
) {
  try {
    await supabase.from('system_logs').insert([
      {
        user_id: userId || null,
        action,
        entity,
        details: details || null,
      }
    ])
  } catch (err) {
    // Silencia erros de log para não quebrar o fluxo principal
    console.error('[Logger] Falha ao registrar log:', err)
  }
}

