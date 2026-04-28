import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react'

const questions = [
  {
    title: 'Wie ist die aktuelle Auslastung deines Ferienhauses?',
    options: ['Unter 30 %', '30–50 %', '50–70 %', 'Über 70 %', 'Ich weiß es nicht genau'],
    scores: [
      { occupancy: 3, visibility: 0, offer: 0, pricing: 0, strategy: 1 },
      { occupancy: 2, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 1, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 2, visibility: 0, offer: 0, pricing: 0, strategy: 2 },
    ],
  },
  {
    title: 'Was ist aus deiner Sicht aktuell das größte Problem?',
    options: ['Zu wenig Buchungen', 'Zu wenig Anfragen', 'Zu niedrige Preise', 'Zu viele Lücken im Kalender', 'Ich weiß nicht genau, woran es liegt'],
    scores: [
      { occupancy: 2, visibility: 1, offer: 1, pricing: 0, strategy: 1 },
      { occupancy: 1, visibility: 3, offer: 1, pricing: 0, strategy: 1 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 1 },
      { occupancy: 3, visibility: 0, offer: 0, pricing: 1, strategy: 1 },
      { occupancy: 1, visibility: 1, offer: 1, pricing: 1, strategy: 3 },
    ],
  },
  {
    title: 'Über welche Kanäle kommen aktuell deine Buchungen?',
    options: ['Hauptsächlich Airbnb', 'Hauptsächlich Booking.com', 'Airbnb und Booking.com', 'Eigene Webseite oder Direktbuchungen', 'Verschiedene Kanäle, aber ohne echte Strategie'],
    scores: [
      { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 1, visibility: 2, offer: 1, pricing: 0, strategy: 3 },
    ],
  },
  {
    title: 'Wie gut wird dein Ferienhaus deiner Meinung nach online gefunden?',
    options: ['Sehr schlecht', 'Mittelmäßig', 'Ganz gut', 'Sehr gut', 'Kann ich nicht einschätzen'],
    scores: [
      { occupancy: 1, visibility: 3, offer: 0, pricing: 0, strategy: 1 },
      { occupancy: 0, visibility: 2, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 1, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 2, offer: 0, pricing: 0, strategy: 2 },
    ],
  },
  {
    title: 'Wie stark wirkt dein Inserat im Vergleich zu anderen Ferienhäusern?',
    options: ['Eher schwach', 'Durchschnittlich', 'Ganz gut', 'Sehr professionell', 'Ich habe keinen Vergleich'],
    scores: [
      { occupancy: 1, visibility: 1, offer: 3, pricing: 0, strategy: 1 },
      { occupancy: 0, visibility: 0, offer: 2, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 1, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 1, offer: 2, pricing: 0, strategy: 2 },
    ],
  },
  {
    title: 'Wie sicher bist du dir bei deiner Preisstrategie?',
    options: ['Sehr unsicher', 'Ich orientiere mich grob an anderen', 'Ich passe Preise gelegentlich an', 'Ich arbeite mit einer durchdachten Preisstrategie', 'Ich weiß nicht, ob mein Preis richtig ist'],
    scores: [
      { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 1 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 2, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 1, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 2, strategy: 2 },
    ],
  },
  {
    title: 'Was wäre für dich das wichtigste Ziel?',
    options: ['Mehr Buchungen', 'Höhere Auslastung', 'Bessere Preise', 'Weniger Leerstand', 'Eine bessere Gesamtstrategie'],
    scores: [
      { occupancy: 2, visibility: 1, offer: 1, pricing: 0, strategy: 0 },
      { occupancy: 3, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 0 },
      { occupancy: 2, visibility: 1, offer: 0, pricing: 1, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 3 },
    ],
  },
  {
    title: 'Wie dringend möchtest du die Buchungssituation verbessern?',
    options: ['Sofort', 'Innerhalb der nächsten Wochen', 'In den nächsten 1–3 Monaten', 'Langfristig', 'Ich möchte erstmal verstehen, was möglich ist'],
    scores: [
      { occupancy: 1, visibility: 1, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 },
      { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 2 },
    ],
  },
]

const diagnosisMap = {
  occupancy: { title: 'Auslastungsproblem', text: 'Der größte Engpass liegt wahrscheinlich in der Auslastung. Dein Ferienhaus schöpft sein vorhandenes Potenzial nicht konstant genug aus. Entscheidend ist jetzt ein strukturierter Plan, der Kalenderlücken, Buchungsphasen und Angebotswirkung zusammen betrachtet.' },
  visibility: { title: 'Sichtbarkeitsproblem', text: 'Der größte Engpass liegt wahrscheinlich in der Sichtbarkeit. Dein Ferienhaus kann nur gebucht werden, wenn es von passenden Gästen überhaupt gefunden und als relevante Option wahrgenommen wird.' },
  offer: { title: 'Angebotsproblem', text: 'Der größte Engpass liegt wahrscheinlich in der Wirkung deines Angebots. Bilder, Texte, Positionierung und Vertrauen müssen deutlich stärker arbeiten als bisher.' },
  pricing: { title: 'Preisstrategieproblem', text: 'Der größte Engpass liegt wahrscheinlich in der Preisstrategie. Wenn Preise nicht zur Nachfrage, Saison, Zielgruppe und Angebotswirkung passen, entsteht unnötiger Leerstand oder verschenktes Umsatzpotenzial.' },
  strategy: { title: 'Strategieproblem', text: 'Der größte Engpass liegt wahrscheinlich in der fehlenden Gesamtstrategie. Ohne klaren Handlungsplan bleibt oft unklar, welche Maßnahme zuerst den größten Effekt bringt.' },
}

const emptyScores = () => ({ occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 })

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [selected, setSelected] = useState(null)
  const isResult = step >= questions.length
  const progress = ((Math.min(step, questions.length - 1) + 1) / questions.length) * 100

  const scores = useMemo(() => answers.reduce((acc, answerIndex, qIndex) => {
    if (answerIndex === null) return acc
    const score = questions[qIndex].scores[answerIndex]
    Object.keys(score).forEach((key) => { acc[key] += score[key] })
    return acc
  }, emptyScores()), [answers])

  const topDiagnosis = useMemo(() => {
    const key = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'strategy'
    return diagnosisMap[key]
  }, [scores])

  const currentQuestion = questions[step]
  const handleSelect = (index) => setSelected(index)

  useEffect(() => {
    if (isResult || selected === null) return
    const timer = window.setTimeout(() => {
      const nextAnswers = [...answers]
      nextAnswers[step] = selected
      setAnswers(nextAnswers)
      setSelected(null)
      setStep((prev) => prev + 1)
    }, 170)
    return () => window.clearTimeout(timer)
  }, [selected, step, answers, isResult])

  const handleBack = () => {
    if (step === 0) return
    const prevStep = step - 1
    setStep(prevStep)
    setSelected(answers[prevStep])
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers(Array(questions.length).fill(null))
    setSelected(null)
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <main className="viewport-card embed-perfect">
        {!isResult && (
          <header className="topbar compact-topbar">
            <div className="brand-pill">OSION Analyse</div>
            <div className="progress-wrap">
              <span className="progress-copy">{step + 1}/8</span>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          </header>
        )}
        {!isResult ? (
          <section className="question-stage embed-stage">
            <div className="eyebrow-row compact-eyebrow"><span className="eyebrow-dot" /><span className="eyebrow">Ferienhaus-Diagnose</span></div>
            <div className="hero-copy embed-hero">
              <h1>Finde heraus, warum dein Ferienhaus nicht konstant genug gebucht wird.</h1>
              <p>Beantworte wenige Fragen und erhalte eine erste Einschätzung, welche Buchungsbremsen aktuell wahrscheinlich wirken.</p>
            </div>
            <article className="question-card embed-card">
              <div className="question-chip">Frage {step + 1}</div>
              <h2>{currentQuestion.title}</h2>
              <div className="option-grid embed-grid">
                {currentQuestion.options.map((option, index) => (
                  <button key={option} className={`option-card embed-option ${selected === index ? 'active' : ''}`} onClick={() => handleSelect(index)} type="button">
                    <span className="option-indicator">{selected === index ? <CheckCircle2 size={18} /> : <span className="option-ring" />}</span>
                    <span className="option-label">{option}</span>
                  </button>
                ))}
              </div>
            </article>
            <div className="nav-row single-back compact-nav">
              <button className="nav-btn nav-btn-ghost back-only" onClick={handleBack} type="button" disabled={step === 0}><ArrowLeft size={16} />Zurück</button>
            </div>
          </section>
        ) : (
          <section className="result-stage">
            <div className="result-scroll">
              <div className="result-icon"><BarChart3 size={28} /></div>
              <div className="result-headline"><h2>Deine Analyse-Ergebnisse</h2><p>Basierend auf deinen Antworten zeigt sich ein klarer Hauptengpass.</p></div>
              <div className="result-panel"><span className="panel-label">Erste Einschätzung</span><p>Deine Antworten zeigen, dass dein Ferienhaus wahrscheinlich nicht an einem einzelnen Punkt scheitert, sondern an mehreren Buchungsbremsen gleichzeitig.</p></div>
              <div className="result-panel"><span className="panel-label">Hauptdiagnose</span><h3>{topDiagnosis.title}</h3><p>{topDiagnosis.text}</p></div>
              <div className="result-panel warning-panel"><span className="panel-label">Konsequenz</span><p>Ohne einen strukturierten Plan besteht das Risiko, dass weiterhin einzelne Änderungen ausprobiert werden, ohne dass die eigentliche Ursache sauber bearbeitet wird.</p></div>
              <div className="result-panel cta-panel"><span className="panel-label">OSION-Handlungsplan</span><h3>Die nächsten Hebel in der richtigen Reihenfolge</h3><p>Genau dafür wurde der OSION-Handlungsplan zur Ferienhausoptimierung entwickelt. Er zeigt dir, welche Hebel du zuerst angehst, um Auslastung, Sichtbarkeit und Buchungswirkung gezielt zu verbessern.</p><div className="roi-banner"><Sparkles size={18} /><span>Schon eine zusätzliche Buchung kann den Handlungsplan mehrfach bezahlen.</span></div><a className="cta-link" href="#angebot">Handlungsplan ansehen</a></div>
            </div>
            <div className="nav-row result-nav"><button className="nav-btn nav-btn-ghost wide" onClick={handleRestart} type="button">Analyse neu starten</button></div>
          </section>
        )}
      </main>
    </div>
  )
}
