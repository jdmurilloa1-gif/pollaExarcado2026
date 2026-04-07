'use client'
/*admin Ex4Rc4d0#2026+*/
/*supabase: P0ll4Exarcado2026*/
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { countries } from '../../lib/countries'

type User = {
  id: number
  name: string
  longName: string
  total_points: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const [inputIndex, setInputIndex] = useState('')
const [inputA, setInputA] = useState('')
const [inputB, setInputB] = useState('')
const [inputWinner, setInputWinner] = useState('')

const runAgregarResultado = async () => {
  if (!inputIndex) {
    alert('Ingresa el número de partido')
    return
  }

  setLoading(true)

  const { error } = await supabase.rpc('update_match_result', {
    p_index: Number(inputIndex),
    p_res_a: inputA === '' ? null : Number(inputA),
    p_res_b: inputB === '' ? null : Number(inputB),
    p_ganador: inputWinner || null
  })

  if (error) {
    console.error(error)
    alert('Error al ejecutar')
  } else {
    alert('Partido actualizado')
    setInputIndex('')
    setInputA('')
    setInputB('')
    setInputWinner('')
  }

  setLoading(false)
}

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

  const runLockUsers = async () => {
    setLoading(true)
    const { error } = await supabase.rpc('lock_all_users')

    if (error) {
      alert('Error al ejecutar')
      console.error(error)
    } else {
      await fetchUsers()
      alert('Bloqueo de todos los usuarios')
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
        <p style={{  marginTop: 5 , fontWeight: 'bold', 
                color: '#000000'}}>
          Panel administrador
        </p>
        <p style={{ fontWeight: 'bold', 
                color: '#000000', marginTop: 5 }}>
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
<div style={{ textAlign: 'center', marginBottom: 25, padding: 30,}}>
      <button
  onClick={() => {
    const code = prompt('Ingresa el código de confirmación')

    if (code !== 'Ex4Rc4d0#2026+') {
      alert('Código incorrecto')
      return
    }

    const ok = confirm('¿Seguro que quieres bloquear todos los usuarios?')
    if (ok) runLockUsers()
  }}
  style={{
    padding: '10px 15px',
    background: '#a728a1',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold'
  }}
>
  Bloquear usuarios
</button>
        </div>


<div
  style={{
    background: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10
  }}
>
  <h3 style={{ margin: 0,fontWeight: 'bold', 
                color: '#000000', }}>Ingresar resultado</h3>

  <input
    type="number"
    placeholder="N° partido"
    value={inputIndex}
    onChange={(e) => setInputIndex(e.target.value)}
    style={{ padding: 8, borderRadius: 5, width: 200,fontWeight: 'bold', 
                color: '#000000', }}
  />

  <div style={{ display: 'flex', gap: 10 }}>
    <input
      type="number"
      placeholder="A"
      value={inputA}
      onChange={(e) => setInputA(e.target.value)}
      style={{ padding: 8, borderRadius: 5, width: 80, fontWeight: 'bold', 
                color: '#000000', }}
    />

    <input
      type="number"
      placeholder="B"
      value={inputB}
      onChange={(e) => setInputB(e.target.value)}
      style={{ padding: 8, borderRadius: 5, width: 80, fontWeight: 'bold', 
                color: '#000000', }}
    />
  </div>

  <select
    value={inputWinner}
    onChange={(e) => setInputWinner(e.target.value)}
    style={{
      padding: 8,
      borderRadius: 5,
      backgroundColor: '#cce5ff',
      width: 200,fontWeight: 'bold', 
                color: '#000000',
    }}
  >
    <option value="">Selecciona ganador</option>
    {countries.map((team) => (
      <option key={team} value={team}>
        {team}
      </option>
    ))}
  </select>

  <button
  onClick={() => {
    const code = prompt('Ingresa el código de confirmación')

    if (code !== 'Ex4Rc4d0#2026+') {
      alert('Código incorrecto')
      return
    }

    const ok = confirm('¿Seguro que quieres guardar este resultado?')
    if (!ok) return

    runAgregarResultado()
  }}
  disabled={loading}
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
  {loading ? 'Guardando...' : 'Guardar resultado'}
</button>


</div>




<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    gap: 20
  }}
>
  <img
    src="/faseGrupo.png"
    alt="Fase de grupos"
    style={{ maxWidth: '100%', borderRadius: 10 }}
  />

  <img
    src="/eliminatorias.png"
    alt="Eliminatorias"
    style={{ maxWidth: '100%', borderRadius: 10 }}
  />
</div>


    </div>
  )
}