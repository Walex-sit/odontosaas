'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/pacientes')
    }
  }

  async function registrar() {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Conta criada!')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Entrar</button>
      <button onClick={registrar}>Criar conta</button>
    </div>
  )
}