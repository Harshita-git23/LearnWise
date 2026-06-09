import { useState, useEffect, useRef } from 'react'
import {
  GitBranch,
  AlertCircle,
  Download,
  Copy,
  Check,
  Lock
} from 'lucide-react'

import { generateDiagram } from '../api'

export default function DiagramPanel({
  documentId
}) {
  const [topic, setTopic] = useState('')
  const [code, setCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [rendered, setRendered] = useState('')
  if (!documentId) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '0 auto',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Visual Diagrams
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
            }}
          >
            Generate diagrams from your study material
          </p>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: 'var(--text-muted)',
          }}
        >
          <Lock size={28} />

          <p style={{ fontSize: '0.875rem' }}>
            Upload a document to generate diagrams
          </p>
        </div>
      </div>
    )
  }

  const containerRef = useRef()

  const generate = async () => {
    if (!documentId) {
      setError(
        'Please upload a PDF first.'
      )
      return
    }

    setLoading(true)
    setError(null)
    setCode(null)
    setRendered('')

    try {
      const res = await generateDiagram(
        documentId,
        topic
      )
      const cleaned =
        res.mermaid_code
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim()

      setCode(cleaned)

    } catch (e) {
      setError(
        e?.response?.data?.detail ||
        'Failed to generate diagram.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!code) return
    console.log(
      "Mermaid Code:\n",
      code
    )

    const render = async () => {
      try {
        const mermaid = (
          await import('mermaid')
        ).default

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#1e1e2a',
            primaryTextColor: '#f0f0f4',
            primaryBorderColor: '#3a3a5a',
            lineColor: '#6b8cff',
            secondaryColor: '#252535',
            tertiaryColor: '#16161f',
            background: '#16161f',
            mainBkg: '#1e1e2a',
            nodeBorder: '#3a3a5a',
            clusterBkg: '#16161f',
            titleColor: '#f0f0f4',
            edgeLabelBackground:
              '#16161f',
          },
          fontFamily:
            'DM Sans, sans-serif',
          fontSize: 14,
          flowchart: {
            curve: 'basis',
            useMaxWidth: true,
          },
        })

        const id =
          `mermaid-${Date.now()}`

        const { svg } = await mermaid.render(
          id,
          code
        )

        if (
          svg.includes('Syntax error in text')
        ) {

          setRendered('')

          setError(
            'Generated diagram contains invalid Mermaid syntax. Please try again.'
          )

          return
        }

        setRendered(svg)
      } catch (err) {

          console.error(
            'Mermaid Render Error:',
            err
          )

          setRendered('')

          setError(
            'Generated Mermaid syntax is invalid. Please regenerate.'
          )
        }
    }

    render()
  }, [code])

  const copyCode = () => {
    navigator.clipboard.writeText(
      code
    )

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const downloadSVG = () => {
    const blob = new Blob(
      [rendered],
      {
        type: 'image/svg+xml',
      }
    )

    const url =
      URL.createObjectURL(blob)

    const a =
      document.createElement('a')

    a.href = url
    a.download = 'diagram.svg'
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          marginBottom: 28,
        }}
      >
        <h2
          style={{
            fontFamily:
              'Playfair Display, serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Visual Diagrams
        </h2>

        <p
          style={{
            color:
              'var(--text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          Generate Visual diagrams
          from your uploaded notes
        </p>
      </div>
      


      <div
        className="card"
        style={{
          padding: '1.5rem',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
          }}
        >
          <input
            value={topic}
            onChange={(e) =>
              setTopic(
                e.target.value
              )
            }
            placeholder="Topic to visualize..."
            className="input-field"
            style={{
              flex: 1,
            }}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              generate()
            }
          />

          <button
            onClick={generate}
            disabled={
              loading ||
              !topic.trim() ||
              !documentId
            }
            className="btn-primary"
          >
            {loading ? (
              <div
                className="spinner"
                style={{
                  width: 15,
                  height: 15,
                }}
              />
            ) : (
              <>
                <GitBranch
                  size={15}
                />
                Generate
              </>
            )}
          </button>
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            color:
              'var(--text-muted)',
            marginTop: 8,
          }}
        >
          Diagram generation uses
          the uploaded document as
          context.
        </p>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            padding:
              '10px 14px',
            background:
              'rgba(239,68,68,0.08)',
            border:
              '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8,
            fontSize:
              '0.8125rem',
            color: '#f87171',
            marginBottom: 16,
          }}
        >
          <AlertCircle
            size={14}
          />
          {error}
        </div>
      )}

      {rendered && !error &&(
        <div
          className="animate-fade-in"
        >
          <div
            className="card"
            style={{
              padding: 0,
              overflow:
                'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                padding:
                  '10px 16px',
                borderBottom:
                  '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  fontSize:
                    '0.75rem',
                  color:
                    'var(--text-muted)',
                }}
              >
                Mermaid Diagram
              </span>

              <div
                style={{
                  display:
                    'flex',
                  gap: 6,
                }}
              >
                <button
                  onClick={
                    copyCode
                  }
                  className="btn-ghost"
                >
                  {copied ? (
                    <>
                      <Check
                        size={
                          12
                        }
                      />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy
                        size={
                          12
                        }
                      />
                      Copy
                    </>
                  )}
                </button>

                <button
                  onClick={
                    downloadSVG
                  }
                  className="btn-ghost"
                >
                  <Download
                    size={12}
                  />
                  SVG
                </button>
              </div>
            </div>

            <div
              ref={
                containerRef
              }
              style={{
                padding:
                  '2rem',
                overflowX:
                  'auto',
                minHeight:
                  200,
              }}
              dangerouslySetInnerHTML={{
                __html:
                  rendered,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}