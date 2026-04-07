'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AccessPage() {
  const [code, setCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('access_code', code)
      .single()

    if (data) {
      localStorage.setItem('user_id', data.id)
      localStorage.setItem('user_name', data.name)
      localStorage.setItem('user_longName', data.longName)
      localStorage.setItem('user_totalPoints', data.total_points)
      localStorage.setItem('user_dataMatch', data.data_match)
      localStorage.setItem('user_matchOrder', data.match_order)
      localStorage.setItem('user_groupCountries', data.group_countries)

      if (data.name === 'admin' || data.role === 'admin') {
        router.push('/adminJDM')
      } else {
        router.push('/')
      }
    } else {
      alert('Código inválido')
    }
  }

  return (
    <div
      style={{
        background: '#e6f2ff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 30,
          borderRadius: 12,
          width: 320,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            background: '#007bff',
            color: 'white',
            padding: 15,
            borderRadius: 8,
            marginBottom: 20
          }}
        >
          <h2 style={{ margin: 0 }}>POLLA MUNDIALISTA</h2>
          <h2 style={{ margin: 0 }}>EXARCADO MARONITA</h2>
          <h2 style={{ margin: 0 }}>SANTA RAFQA</h2>
          <h2 style={{ margin: 0 }}>COLOMBIA</h2>
        </div>

        <div
          style={{
            background: '#97a0aa',
            color: 'black',
            padding: 15,
            borderRadius: 8,
            marginBottom: 20
          }}
        >
          <h2 style={{ margin: 0 }}>AVISO LEGAL:</h2>
          <h2 style={{ margin: 0 }}>El siguiente es el aviso legal de la polla</h2>
        </div>

        {/* INPUT + BOTÓN VER */}
        <div style={{ position: 'relative', marginBottom: 15 }}>
          <input
            type={showCode ? 'text' : 'password'}
            placeholder="Código de acceso"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 40px 10px 10px',
              borderRadius: 6,
              border: '1px solid #ccc',
              textAlign: 'center',
              fontSize: 16
            }}
          />

          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            style={{
              position: 'absolute',
              right: 5,
              top: 5,
              bottom: 5,
              padding: '0 10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 12,
              color: '#007bff'
            }}
          >
            {showCode ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: 10,
            background: '#4400ff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}