import { useState } from 'react'
import { Brain, Lock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { generateQuiz } from '../api'
import { useApp } from '../context/AppContext'

export default function QuizPanel() {
  const { documentId } = useApp()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [numQ, setNumQ] = useState(5)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const generate = async () => {
    setLoading(true); setError(null); setQuiz(null); setAnswers({}); setSubmitted(false)
    try {
      const res = await generateQuiz(documentId, topic, difficulty, numQ)
      setQuiz(res.quiz)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to generate quiz.')
    } finally {
      setLoading(false)
    }
  }

  const score = quiz ? quiz.filter((q, i) => answers[i] === q.answer).length : 0

  if (!documentId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text-muted)' }}>
        <Lock size={28} />
        <p style={{ fontSize: '0.875rem' }}>Upload a PDF to generate quizzes</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Quiz Generator</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Generate custom quizzes to test your understanding</p>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Topic / Focus Area</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. transformer architecture, main conclusions…" className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="input-field" style={{ width: 120 }}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Questions</label>
            <input type="number" min={1} max={20} value={numQ} onChange={e => setNumQ(+e.target.value)} className="input-field" style={{ width: 80 }} />
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary" style={{ marginTop: 14, width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
          {loading ? <><div className="spinner" style={{ width: 15, height: 15 }} /> Generating…</> : <><Brain size={15} /> Generate Quiz</>}
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.8125rem', color: '#f87171', marginBottom: 16 }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {quiz && (
        <div className="animate-fade-in">
          {/* Score bar if submitted */}
          {submitted && (
            <div style={{
              background: score === quiz.length ? 'rgba(62,207,207,0.08)' : 'var(--surface)',
              border: `1px solid ${score === quiz.length ? 'rgba(62,207,207,0.3)' : 'var(--border)'}`,
              borderRadius: 12, padding: '1rem 1.5rem', marginBottom: 20,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Score: {score}/{quiz.length}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {score === quiz.length ? '🎉 Perfect score!' : score > quiz.length / 2 ? 'Good effort! Review the missed ones.' : 'Keep studying — you\'ve got this.'}
                </p>
              </div>
              <button onClick={() => { setAnswers({}); setSubmitted(false); setQuiz(null) }} className="btn-ghost">
                <RefreshCw size={14} /> Retake
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {quiz.map((q, i) => {
              const selected = answers[i]
              const correct = submitted && selected === q.answer
              const wrong = submitted && selected && selected !== q.answer

              return (
                <div key={i} className="card" style={{
                  padding: '1.5rem',
                  borderColor: submitted ? (correct ? 'rgba(62,207,207,0.3)' : wrong ? 'rgba(239,68,68,0.3)' : 'var(--border)') : 'var(--border)',
                }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)',
                      background: 'var(--accent-soft)', border: '1px solid rgba(107,140,255,0.2)',
                      borderRadius: 6, padding: '2px 8px', flexShrink: 0, alignSelf: 'flex-start', marginTop: 2,
                    }}>Q{i + 1}</span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.55 }}>{q.question}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {q.options.map((opt, j) => {
                      const isSelected = selected === opt
                      const isCorrect = submitted && opt === q.answer
                      const isWrong = submitted && isSelected && opt !== q.answer

                      return (
                        <button
                          key={j}
                          onClick={() => !submitted && setAnswers(a => ({ ...a, [i]: opt }))}
                          style={{
                            background: isCorrect ? 'rgba(62,207,207,0.08)' : isWrong ? 'rgba(239,68,68,0.08)' : isSelected ? 'var(--accent-soft)' : 'var(--surface-2)',
                            border: `1px solid ${isCorrect ? 'rgba(62,207,207,0.35)' : isWrong ? 'rgba(239,68,68,0.35)' : isSelected ? 'rgba(107,140,255,0.35)' : 'var(--border)'}`,
                            borderRadius: 8, padding: '8px 12px', textAlign: 'left',
                            cursor: submitted ? 'default' : 'pointer',
                            fontSize: '0.8125rem', color: 'var(--text-primary)',
                            transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                          }}
                        >
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle size={14} color="#3ecfcf" />}
                          {isWrong && <XCircle size={14} color="#f87171" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {!submitted && (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < quiz.length}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '0.75rem' }}
            >
              Submit Quiz ({Object.keys(answers).length}/{quiz.length} answered)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
