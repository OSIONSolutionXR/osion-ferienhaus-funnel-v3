import { useState, useMemo } from 'react'
import { ArrowLeft, BarChart3, Sparkles, TrendingUp, Eye, Package, DollarSign, Target, ChevronRight } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'occupancy',
    title: 'Wie ist die aktuelle Auslastung?',
    subtitle: 'Ehrliche Einschätzung hilft bei der Analyse',
    options: [
      { label: 'Unter 30 %', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 0, strategy: 1 } },
      { label: '30–50 %', score: { occupancy: 2, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: '50–70 %', score: { occupancy: 1, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Über 70 %', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Weiß ich nicht', score: { occupancy: 2, visibility: 0, offer: 0, pricing: 0, strategy: 2 } },
    ],
  },
  {
    id: 'problem',
    title: 'Was ist das größte Problem?',
    subtitle: 'Wo tut es aktuell am meisten weh?',
    options: [
      { label: 'Zu wenig Buchungen', score: { occupancy: 2, visibility: 1, offer: 1, pricing: 0, strategy: 1 } },
      { label: 'Zu wenig Anfragen', score: { occupancy: 1, visibility: 3, offer: 1, pricing: 0, strategy: 1 } },
      { label: 'Zu niedrige Preise', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 1 } },
      { label: 'Zu viele Lücken', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 1, strategy: 1 } },
      { label: 'Weiß ich nicht', score: { occupancy: 1, visibility: 1, offer: 1, pricing: 1, strategy: 3 } },
    ],
  },
  {
    id: 'channels',
    title: 'Über welche Kanäle kommen Buchungen?',
    subtitle: 'Wie verteilt sich dein Umsatz?',
    options: [
      { label: 'Hauptsächlich Airbnb', score: { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Hauptsächlich Booking.com', score: { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Airbnb + Booking.com', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Direktbuchungen/Webseite', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Keine klare Strategie', score: { occupancy: 1, visibility: 2, offer: 1, pricing: 0, strategy: 3 } },
    ],
  },
  {
    id: 'visibility',
    title: 'Wie gut wird dein Haus gefunden?',
    subtitle: 'Suchergebnisse, Ranking, Erkennbarkeit',
    options: [
      { label: 'Sehr schlecht', score: { occupancy: 1, visibility: 3, offer: 0, pricing: 0, strategy: 1 } },
      { label: 'Mittelmäßig', score: { occupancy: 0, visibility: 2, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Ganz gut', score: { occupancy: 0, visibility: 1, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Sehr gut', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Kann ich nicht einschätzen', score: { occupancy: 0, visibility: 2, offer: 0, pricing: 0, strategy: 2 } },
    ],
  },
  {
    id: 'offer',
    title: 'Wie wirkt dein Inserat?',
    subtitle: 'Im Vergleich zu anderen Ferienhäusern',
    options: [
      { label: 'Eher schwach', score: { occupancy: 1, visibility: 1, offer: 3, pricing: 0, strategy: 1 } },
      { label: 'Durchschnittlich', score: { occupancy: 0, visibility: 0, offer: 2, pricing: 0, strategy: 0 } },
      { label: 'Ganz gut', score: { occupancy: 0, visibility: 0, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Sehr professionell', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Kein Vergleich', score: { occupancy: 0, visibility: 1, offer: 2, pricing: 0, strategy: 2 } },
    ],
  },
  {
    id: 'pricing',
    title: 'Wie sicher bist du bei Preisen?',
    subtitle: 'Preisstrategie und Anpassung',
    options: [
      { label: 'Sehr unsicher', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 1 } },
      { label: 'Orientiere mich an anderen', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 2, strategy: 0 } },
      { label: 'Passe gelegentlich an', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 1, strategy: 0 } },
      { label: 'Durchdachte Strategie', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Weiß nicht, ob richtig', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 2, strategy: 2 } },
    ],
  },
  {
    id: 'goal',
    title: 'Was ist dein wichtigstes Ziel?',
    subtitle: 'Priorität für die nächsten Monate',
    options: [
      { label: 'Mehr Buchungen', score: { occupancy: 2, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Höhere Auslastung', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Bessere Preise', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 0 } },
      { label: 'Weniger Leerstand', score: { occupancy: 2, visibility: 1, offer: 0, pricing: 1, strategy: 0 } },
      { label: 'Bessere Gesamtstrategie', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 3 } },
    ],
  },
  {
    id: 'urgency',
    title: 'Wie dringend ist eine Verbesserung?',
    subtitle: 'Zeithorizont für Veränderung',
    options: [
      { label: 'Sofort', score: { occupancy: 1, visibility: 1, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'In den nächsten Wochen', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'In 1–3 Monaten', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Langfristig', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Erst verstehen was möglich', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 2 } },
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

function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">Frage {current + 1} von {total}</span>
        <span className="progress-percent">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function OptionCard({ option, selected, onClick, index }) {
  const letters = ['A', 'B', 'C', 'D', 'E']
  return (
    <div className={`option-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <span className="option-letter">{letters[index]}</span>
      <span className="option-label">{option.label}</span>
      <div className="option-indicator" />
    </div>
  )
}

function ResultCard({ title, value, icon: Icon, color, primary }) {
  return (
    <div className={`score-card ${primary ? 'primary' : ''}`}>
      <div className="score-icon" style={{ background: color + '20', color }}>
        <Icon size={20} />
      </div>
      <span className="score-label">{title}</span>
      <span className="score-value">{value}</span>
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = QUESTIONS[step]
  const isLastQuestion = step === QUESTIONS.length - 1

  const scores = useMemo(() => {
    const totals = { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 }
    answers.forEach((ans) => {
      if (ans?.score) {
        Object.keys(totals).forEach(key => { totals[key] += ans.score[key] || 0 })
      }
    })
    return totals
  }, [answers])

  const sorted = useMemo(() => Object.entries(scores).sort((a, b) => b[1] - a[1]), [scores])
  const diagnosis = DIAGNOSES[sorted[0]?.[0] || 'strategy']
  const secondaryDiagnosis = sorted[1] ? DIAGNOSES[sorted[1][0]] : null

  const handleSelect = (index) => {
    setSelectedOption(index)
    const newAnswers = [...answers]
    newAnswers[step] = { score: currentQuestion.options[index].score }
    setAnswers(newAnswers)
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResults(true)
      } else {
        setStep(step + 1)
        setSelectedOption(answers[step + 1]?.score ? null : null)
      }
    }, 300)
  }

  const handleBack = () => {
    if (step === 0) return
    setStep(step - 1)
    setSelectedOption(null)
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers([])
    setSelectedOption(null)
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div className="ferienhaus-funnel">
        <div className="results-container">
          <div className="results-header">
            <div className="brand-badge">
              <Sparkles size={14} />
              <span>OSION Analyse</span>
            </div>
            <h1 className="results-title">Deine Diagnose</h1>
            <p className="results-subtitle">Basierend auf deinen 8 Antworten</p>
          </div>

          <div className="diagnosis-primary">
            <div className="diagnosis-icon" style={{ background: diagnosis.color + '20', color: diagnosis.color }}>
              <diagnosis.icon size={28} />
            </div>
            <h2 className="diagnosis-title">{diagnosis.headline}</h2>
            <p className="diagnosis-desc">{diagnosis.description}</p>
            <div className="diagnosis-action">
              <TrendingUp size={14} />
              <span>{diagnosis.action}</span>
            </div>
          </div>

          {secondaryDiagnosis && (
            <div className="secondary-wrap">
              <span className="secondary-label">Auch relevant:</span>
              <div className="secondary-card" style={{ '--secondary-accent': secondaryDiagnosis.color }}>
                <secondaryDiagnosis.icon size={18} style={{ color: secondaryDiagnosis.color }} />
                <span>{secondaryDiagnosis.title}</span>
              </div>
            </div>
          )}

          <div className="score-section">
            <h3 className="score-title">Detaillierte Auswertung</h3>
            <div className="score-grid">
              <ResultCard title="Auslastung" value={scores.occupancy} icon={TrendingUp} color="#f43f5e" primary={diagnosis.title === 'Auslastungsproblem'} />
              <ResultCard title="Sichtbarkeit" value={scores.visibility} icon={Eye} color="#8b5cf6" primary={diagnosis.title === 'Sichtbarkeitsproblem'} />
              <ResultCard title="Angebot" value={scores.offer} icon={Package} color="#f59e0b" primary={diagnosis.title === 'Angebotsproblem'} />
              <ResultCard title="Preise" value={scores.pricing} icon={DollarSign} color="#10b981" primary={diagnosis.title === 'Preisstrategieproblem'} />
              <ResultCard title="Strategie" value={scores.strategy} icon={Target} color="#6366f1" primary={diagnosis.title === 'Strategieproblem'} />
            </div>
          </div>

          <div className="cta-section">
            <div className="cta-card">
              <BarChart3 size={20} style={{ color: '#8b5cf6', marginBottom: 10 }} />
              <h3>Kostenloser Handlungsplan</h3>
              <p>Erhalte einen personalisierten Plan mit konkreten nächsten Schritten.</p>
              <a href="https://osion-solution.com/ferienhaus-optimierung" className="cta-btn" target="_blank" rel="noopener">
                <span>Plan anfordern</span>
                <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <button className="restart-btn" onClick={handleRestart}>
            <ArrowLeft size={14} />
            <span>Analyse wiederholen</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ferienhaus-funnel">
      <div className="funnel-container">
        <ProgressBar current={step} total={QUESTIONS.length} />

        <div className="question-wrapper">
          <div className="question-header">
            <div className="category-badge">
              <Sparkles size={12} />
              <span>Ferienhaus-Check</span>
            </div>
            <h1 className="question-title">{currentQuestion.title}</h1>
            <p className="question-subtitle">{currentQuestion.subtitle}</p>
          </div>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <OptionCard
                key={`${currentQuestion.id}-${index}`}
                option={option}
                selected={selectedOption === index}
                onClick={() => handleSelect(index)}
                index={index}
              />
            ))}
          </div>

          <div className="funnel-footer">
            <button className="back-btn" onClick={handleBack} disabled={step === 0}>
              <ArrowLeft size={14} />
              <span>Zurück</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
