import { useState, useMemo } from 'react'
import { ArrowLeft, ChevronRight, Sparkles, TrendingUp, Eye, Package, DollarSign, Target } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'occupancy',
    title: 'Wie hoch ist die aktuelle Auslastung Deines Ferienhauses?',
    subtitle: '',
    options: [
      { label: 'Unter 30 %', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 0, strategy: 1 } },
      { label: '30–50 %', score: { occupancy: 2, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: '50–70 %', score: { occupancy: 1, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Über 70 %', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
    ],
  },
  {
    id: 'problem',
    title: 'Was ist aus deiner Sicht aktuell das größte Problem?',
    subtitle: '',
    options: [
      { label: 'Zu wenig Buchungen', score: { occupancy: 2, visibility: 1, offer: 1, pricing: 0, strategy: 1 } },
      { label: 'Zu wenig Anfragen', score: { occupancy: 1, visibility: 3, offer: 1, pricing: 0, strategy: 1 } },
      { label: 'Zu niedrige Preise', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 1 } },
      { label: 'Zu viele Lücken im Kalender', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 1, strategy: 1 } },
    ],
  },
  {
    id: 'channels',
    title: 'Über welche Kanäle kommen aktuell deine Buchungen?',
    subtitle: '',
    options: [
      { label: 'Hauptsächlich Airbnb', score: { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Hauptsächlich Booking.com', score: { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Airbnb und Booking.com', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Verschiedene Kanäle, aber ohne echte Strategie', score: { occupancy: 1, visibility: 2, offer: 1, pricing: 0, strategy: 3 } },
    ],
  },
  {
    id: 'urgency',
    title: 'Wie dringend möchtest du die Buchungssituation verbessern?',
    subtitle: '',
    options: [
      { label: 'Sofort', score: { occupancy: 1, visibility: 1, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Innerhalb der nächsten Wochen', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'In den nächsten 1–3 Monaten', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Langfristig', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
    ],
  },
]

const DIAGNOSES = {
  occupancy: {
    icon: TrendingUp,
    title: 'Auslastungsproblem',
    headline: 'Kalenderlücken bremsen dein Ferienhaus aus',
    description: 'Dein Ferienhaus schöpft sein Potenzial nicht konstant genug aus. Die Lücken im Kalender sind der größte Umsatzkiller.',
    action: 'Strukturierter Plan für kontinuierliche Buchungen',
    color: '#f43f5e',
  },
  visibility: {
    icon: Eye,
    title: 'Sichtbarkeitsproblem',
    headline: 'Gäste finden dein Ferienhaus nicht',
    description: 'Ein tolles Ferienhaus nützt nichts, wenn es nicht gefunden wird. Dein Ranking in den Plattformen braucht Optimierung.',
    action: 'SEO-Optimierung und Ranking-Strategie',
    color: '#8b5cf6',
  },
  offer: {
    icon: Package,
    title: 'Angebotsproblem',
    headline: 'Dein Inserat überzeugt nicht',
    description: 'Bilder, Texte und Positionierung wirken schwächer als bei der Konkurrenz. Das kostet dich Buchungen.',
    action: 'Professionelles Listing-Redesign',
    color: '#f59e0b',
  },
  pricing: {
    icon: DollarSign,
    title: 'Preisstrategieproblem',
    headline: 'Preise passen nicht zur Nachfrage',
    description: 'Entweder zu teuer für die Buchungslage oder zu günstig für das Potenzial. Beides kostet Umsatz.',
    action: 'Datenbasierte Preisoptimierung',
    color: '#10b981',
  },
  strategy: {
    icon: Target,
    title: 'Strategieproblem',
    headline: 'Fehlender Plan für nachhaltigen Erfolg',
    description: 'Ohne klare Strategie wird oft an Symptomen statt Ursachen gearbeitet. Das führt zu Frustration.',
    action: 'Integrierter Handlungsplan',
    color: '#6366f1',
  },
}

function SegmentedProgress({ current, total }) {
  return (
    <div className="progress-segments">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`segment ${i < current ? 'completed' : ''} ${i === current ? 'active' : ''}`}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = QUESTIONS[step]
  const totalQuestions = QUESTIONS.length

  const scores = useMemo(() => {
    const totals = { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 }
    answers.forEach((ans) => {
      if (ans?.score) {
        Object.keys(totals).forEach((key) => { totals[key] += ans.score[key] || 0 })
      }
    })
    return totals
  }, [answers])

  const sorted = useMemo(() => Object.entries(scores).sort((a, b) => b[1] - a[1]), [scores])
  const diagnosis = DIAGNOSES[sorted[0]?.[0] || 'strategy']

  const handleSelect = (index) => {
    const newAnswers = [...answers]
    newAnswers[step] = { score: currentQuestion.options[index].score }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (step < totalQuestions - 1) {
        setStep(step + 1)
      } else {
        setShowResults(true)
      }
    }, 300)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers([])
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div className="ferienhaus-funnel">
        <div className="results-container">
          <div className="glass-card result-glass">
            <div className="brand-badge">
              <Sparkles size={14} />
              <span>OSION Analyse</span>
            </div>

            <h1 className="results-title">Deine Diagnose</h1>

            <div className="diagnosis-box">
              <div className="icon-glow" style={{ color: diagnosis.color }}>
                <div className="icon-inner">
                  <diagnosis.icon size={28} />
                </div>
              </div>
              <h2 className="diagnosis-title">{diagnosis.headline}</h2>
              <p className="diagnosis-desc">{diagnosis.description}</p>
              <div className="diagnosis-tag">
                <Target size={14} />
                <span>{diagnosis.action}</span>
              </div>
            </div>

            <div className="score-grid">
              {[
                { key: 'occupancy', label: 'Auslastung', color: '#f43f5e', icon: TrendingUp },
                { key: 'visibility', label: 'Sichtbarkeit', color: '#8b5cf6', icon: Eye },
                { key: 'offer', label: 'Angebot', color: '#f59e0b', icon: Package },
                { key: 'pricing', label: 'Preise', color: '#10b981', icon: DollarSign },
                { key: 'strategy', label: 'Strategie', color: '#6366f1', icon: Target },
              ].map(({ key, label, color, icon: Icon }) => (
                <div
                  key={key}
                  className={`score-item ${sorted[0][0] === key ? 'primary' : ''}`}
                >
                  <div className="score-icon" style={{ background: `${color}20`, color }}>
                    <Icon size={18} />
                  </div>
                  <span className="score-label">{label}</span>
                  <span className="score-value" style={{ color }}>{scores[key]}</span>
                </div>
              ))}
            </div>

            <a
              href="https://osion-solution.com/ferienhaus-optimierung"
              className="cta-button"
              target="_blank"
              rel="noopener"
            >
              <span>Kostenlosen Handlungsplan erhalten</span>
              <ChevronRight size={18} />
            </a>

            <button className="restart-btn" onClick={handleRestart}>
              <ArrowLeft size={16} />
              <span>Analyse wiederholen</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ferienhaus-funnel">
      <div className="funnel-container">
        <div className="glass-card">
          <div className="card-header">
            <span className="progress-text">Frage {step + 1} von {totalQuestions}</span>
            <button className="help-btn">?</button>
          </div>

          <SegmentedProgress current={step} total={totalQuestions} />

          <h1 className="question-title">{currentQuestion.title}</h1>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <div
                key={`${currentQuestion.id}-${index}`}
                className="option-card"
                onClick={() => handleSelect(index)}
              >
                <span className="option-label">{option.label}</span>
                <ChevronRight className="arrow-icon" />
              </div>
            ))}
          </div>
        </div>

        {step > 0 && (
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Zurück</span>
          </button>
        )}
      </div>
    </div>
  )
}
