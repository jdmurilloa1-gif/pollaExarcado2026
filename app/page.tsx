'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any>({})

  const [userName, setUserName] = useState<string | null>(null)
  const [longUserName, setLongUserName] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [totalPoints, setUserTotalPoints] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user_id')
    const name = localStorage.getItem('user_name')
    const longName = localStorage.getItem('user_longName')
    const totalPoints = localStorage.getItem('user_totalPoints')

    if (!user) {
      window.location.href = '/access'
    } else {
      setUserId(user)
      setUserName(name)
      setLongUserName(longName)
      setUserTotalPoints(totalPoints)
      initData(user)
    }
  }, [])

  const initData = async (id: string) => {
    await fetchUser(id)
    const matchesData = await fetchMatches()

    // 🔹 ordenar por match_order ascendente
    const ordered = [...matchesData].sort(
      (a, b) => (a.match_order || 0) - (b.match_order || 0)
    )

    setMatches(ordered)
    await fetchPredictions(id, ordered)
  }

  const fetchUser = async (id: string) => {
    const { data } = await supabase
      .from('users')
      .select('is_locked')
      .eq('id', id)
      .single()

    setIsLocked(data?.is_locked)
  }

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('matches').select('*')
    if (error) console.error(error)
    return data || []
  }

  const fetchPredictions = async (id: string, matchesData: any[]) => {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', id)

    if (error) return

    const formatted: any = {}

    data?.forEach((p) => {
      const match = matchesData.find((m) => m.id === p.match_id)
      if (!match) return

      if (match.stage === 'group') {
        formatted[p.match_id] = {
          team_a: p.pred_score_a?.toString(),
          team_b: p.pred_score_b?.toString()
        }
      } else {
        formatted[p.match_id] = {
          winner: p.pred_winner
        }
      }
    })

    setPredictions(formatted)
  }

  const handleChange = (matchId: string, field: string, value: string) => {
    if (isLocked) return
    if (value !== '' && Number(value) < 0) return

    setPredictions((prev: any) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }))
  }

  const handleSaveAll = async () => {
    if (!userId) return

    // 🔴 VALIDACIÓN GLOBAL
  const hasInvalid = matches.some((match) => {
    const pred = predictions[match.id]

    if (!pred) return true

    if (match.stage === 'group') {
      return (
        pred.team_a === undefined ||
        pred.team_b === undefined ||
        pred.team_a === '' ||
        pred.team_b === ''
      )
    } else {
      return !pred.winner
    }
  })

  if (hasInvalid) {
    alert('Debes completar todas las predicciones antes de guardar')
    return
  }

    const confirmSave = confirm(
      '¿Estás seguro? No podrás modificar tus predicciones después.'
    )
    if (!confirmSave) return

    const dataToInsert = matches
      .map((match) => {
        const pred = predictions[match.id]
        if (!pred) return null

        if (match.stage === 'group') {
          const scoreA = Number(pred.team_a)
          const scoreB = Number(pred.team_b)
          if (isNaN(scoreA) || isNaN(scoreB)) return null

          return {
            user_id: userId,
            match_id: match.id,
            pred_score_a: scoreA,
            pred_score_b: scoreB,
            pred_winner: null
          }
        } else {
          if (!pred.winner) return null

          return {
            user_id: userId,
            match_id: match.id,
            pred_score_a: null,
            pred_score_b: null,
            pred_winner: pred.winner
          }
        }
      })
      .filter((item) => item !== null)

    if (dataToInsert.length === 0) {
      alert('No hay predicciones válidas para guardar')
      return
    }

    const { error } = await supabase
      .from('predictions')
      .upsert(dataToInsert, {
        onConflict: 'user_id,match_id'
      })

    if (error) {
      console.error(error)
      alert('Error al guardar')
      return
    }

    await supabase
      .from('users')
      .update({ is_locked: true })
      .eq('id', userId)

    alert('Predicciones guardadas y bloqueadas')
    window.location.reload()
  }

  return (
    <div
      style={{
        background: '#e6f2ff',
        minHeight: '100vh',
        padding: 20,
        fontFamily: 'Arial'
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: '#007bff',
          color: 'white',
          padding: 20,
          borderRadius: 10,
          textAlign: 'center',
          marginBottom: 20
        }}
      >
        <h1 style={{ margin: 0 }}>EXARCADO MARONITA SANTA RAFQA DE COLOMBIA</h1>
        <h1 style={{ margin: 0 }}>POLLA MUNDIALISTA PRO-TEMPLO</h1>
      </div>

      {/* USER BANNER */}
      <div
        style={{
          background: 'white',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20
        }}
      >
        <strong>{longUserName}</strong> ({userName})<br />
        Puntos: {totalPoints}
      <div style={{ marginTop: 10 }}>
          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = '/access'
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 5,
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {isLocked && (
        <div
          style={{
            background: '#ffcccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 20,
            color: '#900'
          }}
        >
          Tus predicciones ya fueron guardadas y no pueden modificarse
        </div>
      )}

      {/* MATCHES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 15
        }}
      >
        {matches.map((match) => (
          <div
            key={match.id}
            style={{
              background: 'white',
              padding: 15,
              borderRadius: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {/* 🔹 data_match mostrado arriba */}
            <div
              style={{
                marginBottom: 10,fontWeight: 'bold', 
                color: '#000000',
              }}
            >
              {match.data_match}
            </div>

            <div style={{ marginBottom: 10}}>
              {match.team_a} vs {match.team_b}
            </div>

            {match.stage === 'group' ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="number"
                  min="0"
                  disabled={isLocked}
                  value={predictions[match.id]?.team_a || ''}
                  onChange={(e) =>
                    handleChange(match.id, 'team_a', e.target.value)
                  }
                  style={{
                    width: '50%',
                    padding: 8,
                    borderRadius: 5,
                    border: '1px solid #ccc'
                  }}
                />

                <input
                  type="number"
                  min="0"
                  disabled={isLocked}
                  value={predictions[match.id]?.team_b || ''}
                  onChange={(e) =>
                    handleChange(match.id, 'team_b', e.target.value)
                  }
                  style={{
                    width: '50%',
                    padding: 8,
                    borderRadius: 5,
                    border: '1px solid #ccc'
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                {[match.team_a, match.team_b].map((team) => (
                  <button
                    key={team}
                    disabled={isLocked}
                    onClick={() =>
                      handleChange(match.id, 'winner', team)
                    }
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 5,
                      border: 'none',
                      background:
                        predictions[match.id]?.winner === team
                          ? '#28a745'
                          : '#eee',
                      color:
                        predictions[match.id]?.winner === team
                          ? 'white'
                          : 'black'
                    }}
                  >
                    {team}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isLocked && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button
            onClick={handleSaveAll}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 16
            }}
          >
            Guardar todas mis predicciones
          </button>
        </div>
      )}
    </div>
  )
}