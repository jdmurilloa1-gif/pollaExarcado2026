'use client'
/*admin Ex4Rc4d0#2026+*/
/*supabase: P0ll4Exarcado2026*/
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type User = {
  id: number
  name: string
  longName: string
  total_points: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('id, name, longName, total_points')
      .order('total_points', { ascending: false })
      .limit(10)

    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const runSumatoria = async () => {
    setLoading(true)
    const { error } = await supabase.rpc('SumatoriaPuntos')

    if (error) {
      alert('Error al ejecutar')
      console.error(error)
    } else {
      await fetchUsers()
      alert('Puntos actualizados')
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        padding: 30,
        fontFamily: 'Arial',
        background: '#f4f6fb',
        minHeight: '100vh'
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: 25 }}>
        <p style={{ color: '#666', marginTop: 5 }}>
          Panel administrador
        </p>
        <p style={{ color: '#666', marginTop: 5 }}>
          Top 10 usuarios por puntaje
        </p>
      </div>

      {/* ACTIONS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 20,
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={runSumatoria}
          style={{
            padding: '10px 15px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Recalcular puntos
        </button>

        <button
          onClick={fetchUsers}
          style={{
            padding: '10px 15px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Refrescar
        </button>

        <button
          onClick={() => {
            localStorage.clear()
            window.location.href = '/access'
          }}
          style={{
            padding: '10px 15px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Salir
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p style={{ textAlign: 'center', marginBottom: 15 }}>
          Cargando...
        </p>
      )}

      {/* LISTA */}
      <div
        style={{
          maxWidth: 650,
          margin: '0 auto',
          background: 'white',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
        }}
      >
        {users.map((user, index) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: index !== users.length - 1 ? '1px solid #eee' : 'none'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 16,
                color: '#333' }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`} {user.longName}
              </div>
              <div style={{ fontSize: 12, color: '#777' }}>
                {user.name}
              </div>
            </div>

            <div
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#333'
              }}
            >
              {user.total_points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}