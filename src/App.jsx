import { useState, useMemo, useEffect, useCallback } from 'react'
import { ArrowLeft, CheckCircle2, BarChart3, Sparkles, TrendingUp, Eye, Package, DollarSign, Target, ChevronRight } from 'lucide-react'

// Configuration
const CONFIG = {
  brand: 'OSION',
  accentColor: '#8b5cf6',
  secondaryColor: '#f43f5e',
  successColor: '#10b981',
}

// Questions Data
const QUESTIONS = [
  {
    id: 'occupancy',
    title: 'Wie ist die aktuelle Auslastung?',
    subtitle: 'Ehrliche Einschätzung hilft bei der Analyse',
    options: [
      { label: 'Unter 30 %', value: 'low', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 0, strategy: 1 } },
      { label: '30–50 %', value: 'medium-low', score: { occupancy: 2, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: '50–70 %', value: 'medium', score: { occupancy: 1, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Über 70 %', value: 'high', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Weiß ich nicht', value: 'unknown', score: { occupancy: 2, visibility: 0, offer: 0, pricing: 0, strategy: 2 } },
    ],
  },
  {
    id: 'problem',
    title: 'Was ist das größte Problem?',
    subtitle: 'Wo tut es aktuell am meisten weh?',
    options: [
      { label: 'Zu wenig Buchungen', value: 'bookings', score: { occupancy: 2, visibility: 1, offer: 1, pricing: 0, strategy: 1 } },
      { label: 'Zu wenig Anfragen', value: 'inquiries', score: { occupancy: 1, visibility: 3, offer: 1, pricing: 0, strategy: 1 } },
      { label: 'Zu niedrige Preise', value: 'pricing', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 1 } },
      { label: 'Zu viele Lücken', value: 'gaps', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 1, strategy: 1 } },
      { label: 'Weiß ich nicht', value: 'unknown', score: { occupancy: 1, visibility: 1, offer: 1, pricing: 1, strategy: 3 } },
    ],
  },
  {
    id: 'channels',
    title: 'Über welche Kanäle kommen Buchungen?',
    subtitle: 'Wie verteilt sich dein Umsatz?',
    options: [
      { label: 'Hauptsächlich Airbnb', value: 'airbnb', score: { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Hauptsächlich Booking.com', value: 'booking', score: { occupancy: 0, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Airbnb + Booking.com', value: 'both', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Direktbuchungen/Webseite', value: 'direct', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Keine klare Strategie', value: 'none', score: { occupancy: 1, visibility: 2, offer: 1, pricing: 0, strategy: 3 } },
    ],
  },
  {
    id: 'visibility',
    title: 'Wie gut wird dein Haus gefunden?',
    subtitle: 'Suchergebnisse, Ranking, Erkennbarkeit',
    options: [
      { label: 'Sehr schlecht', value: 'very-poor', score: { occupancy: 1, visibility: 3, offer: 0, pricing: 0, strategy: 1 } },
      { label: 'Mittelmäßig', value: 'poor', score: { occupancy: 0, visibility: 2, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Ganz gut', value: 'ok', score: { occupancy: 0, visibility: 1, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Sehr gut', value: 'good', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Kann ich nicht einschätzen', value: 'unknown', score: { occupancy: 0, visibility: 2, offer: 0, pricing: 0, strategy: 2 } },
    ],
  },
  {
    id: 'offer',
    title: 'Wie wirkt dein Inserat?',
    subtitle: 'Im Vergleich zu anderen Ferienhäusern',
    options: [
      { label: 'Eher schwach', value: 'weak', score: { occupancy: 1, visibility: 1, offer: 3, pricing: 0, strategy: 1 } },
      { label: 'Durchschnittlich', value: 'average', score: { occupancy: 0, visibility: 0, offer: 2, pricing: 0, strategy: 0 } },
      { label: 'Ganz gut', value: 'good', score: { occupancy: 0, visibility: 0, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Sehr professionell', value: 'pro', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Kein Vergleich', value: 'unknown', score: { occupancy: 0, visibility: 1, offer: 2, pricing: 0, strategy: 2 } },
    ],
  },
  {
    id: 'pricing-confidence',
    title: 'Wie sicher bist du bei Preisen?',
    subtitle: 'Preisstrategie und Anpassung',
    options: [
      { label: 'Sehr unsicher', value: 'unsure', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 1 } },
      { label: 'Orientiere mich an anderen', value: 'copy', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 2, strategy: 0 } },
      { label: 'Passe gelegentlich an', value: 'sometimes', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 1, strategy: 0 } },
      { label: 'Durchdachte Strategie', value: 'strategy', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Weiß nicht, ob richtig', value: 'unknown', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 2, strategy: 2 } },
    ],
  },
  {
    id: 'goal',
    title: 'Was ist dein wichtigstes Ziel?',
    subtitle: 'Priorität für die nächsten Monate',
    options: [
      { label: 'Mehr Buchungen', value: 'bookings', score: { occupancy: 2, visibility: 1, offer: 1, pricing: 0, strategy: 0 } },
      { label: 'Höhere Auslastung', value: 'occupancy', score: { occupancy: 3, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Bessere Preise', value: 'pricing', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 3, strategy: 0 } },
      { label: 'Weniger Leerstand', value: 'gaps', score: { occupancy: 2, visibility: 1, offer: 0, pricing: 1, strategy: 0 } },
      { label: 'Bessere Gesamtstrategie', value: 'strategy', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 3 } },
    ],
  },
  {
    id: 'urgency',
    title: 'Wie dringend ist eine Verbesserung?',
    subtitle: 'Zeithorizont für Veränderung',
    options: [
      { label: 'Sofort', value: 'immediate', score: { occupancy: 1, visibility: 1, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'In den nächsten Wochen', value: 'soon', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'In 1–3 Monaten', value: 'medium', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Langfristig', value: 'long', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 } },
      { label: 'Erst verstehen was möglich', value: 'explore', score: { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 2 } },
    ],
  },
]

// Diagnosis Definitions
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

// Components
function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100
  
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">Frage {current + 1} von {total}</span>
        <span className="progress-percent">{Math.round(progress)}%</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function OptionCard({ option, selected, onClick, index }) {
  const letters = ['A', 'B', 'C', 'D', 'E']
  
  return (
    <button 
      className={`option-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className="option-content">
        <span className="option-letter">{letters[index]}</span>
        <span className="option-label">{option.label}</span>
      </div>
      <div className="option-indicator">
        {selected ? (
          <CheckCircle2 size={20} className="check-icon" />
        ) : (
          <div className="radio-circle" />
        )}
      </div>
    </button>
  )
}

function ResultCard({ title, value, icon: Icon, color, primary = false }) {
  return (
    <div className={`result-card ${primary ? 'primary' : ''}`} style={{ '--card-accent': color }}>
      <div className="result-icon-wrapper" style={{ background: color + '20', color }}>
        <Icon size={24} />
      </div>
      <div className="result-content">
        <span className="result-label">{title}</span>
        <span className="result-value">{value}</span>
      </div>
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = QUESTIONS[step]
  const isLastQuestion = step === QUESTIONS.length - 1
  const isFirstQuestion = step === 0

  // Calculate scores
  const scores = useMemo(() => {
    const totals = { occupancy: 0, visibility: 0, offer: 0, pricing: 0, strategy: 0 }
    answers.forEach((answer, idx) => {
      if (answer && QUESTIONS[idx].options[answer.index]) {
        const score = QUESTIONS[idx].options[answer.index].score
        Object.keys(totals).forEach(key => {
          totals[key] += score[key] || 0
        })
      }
    })
    return totals
  }, [answers])

  // Get primary diagnosis
  const diagnosis = useMemo(() => {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const primary = sorted[0]?.[0] || 'strategy'
    return DIAGNOSES[primary]
  }, [scores])

  // Get secondary issue
  const secondaryDiagnosis = useMemo(() => {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const secondary = sorted[1]?.[0]
    return secondary ? DIAGNOSES[secondary] : null
  }, [scores])

  const handleSelect = useCallback((optionIndex) => {
    if (isTransitioning) return
    
    setSelectedOption(optionIndex)
    setIsTransitioning(true)

    // Delay for animation
    setTimeout(() => {
      const newAnswers = [...answers]
      newAnswers[step] = { index: optionIndex, value: currentQuestion.options[optionIndex].value }
      setAnswers(newAnswers)
      
      if (isLastQuestion) {
        setShowResults(true)
      } else {
        setStep(prev => prev + 1)
        setSelectedOption(null)
      }
      setIsTransitioning(false)
    }, 400)
  }, [step, answers, currentQuestion, isLastQuestion, isTransitioning])

  const handleBack = useCallback(() => {
    if (isFirstQuestion || isTransitioning) return
    setStep(prev => prev - 1)
    setSelectedOption(answers[step - 1]?.index ?? null)
    setShowResults(false)
  }, [step, isFirstQuestion, isTransitioning, answers])

  const handleRestart = useCallback(() => {
    setStep(0)
    setAnswers([])
    setSelectedOption(null)
    setShowResults(false)
    setIsTransitioning(false)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResults) {
        if (e.key === 'Enter') handleRestart()
        return
      }
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const current = selectedOption ?? -1
        const direction = e.key === 'ArrowUp' ? -1 : 1
        const next = Math.max(0, Math.min(currentQuestion.options.length - 1, current + direction))
        setSelectedOption(next)
      }
      
      if (e.key === 'Enter' && selectedOption !== null) {
        handleSelect(selectedOption)
      }
      
      if (e.key === 'Backspace' && !isFirstQuestion) {
        handleBack()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedOption, currentQuestion, showResults, isFirstQuestion, handleSelect, handleBack, handleRestart])

  if (showResults) {
    return (
      <div className="ferienhaus-funnel">
        <div className="results-container">
          <div className="results-header">
            <div className="brand-badge">
              <Sparkles size={16} />
              <span>{CONFIG.brand} Analyse</span>
            </div>
            <h1 className="results-title">Deine Diagnose</h1>
            <p className="results-subtitle">Basierend auf deinen {QUESTIONS.length} Antworten</p>
          </div>

          <div className="diagnosis-primary">
            <div className="diagnosis-icon" style={{ background: diagnosis.color + '20', color: diagnosis.color }}>
              <diagnosis.icon size={32} />
            </div>
            <h2 className="diagnosis-title">{diagnosis.headline}</h2>
            <p className="diagnosis-description">{diagnosis.description}</p>
            <div className="diagnosis-action">
              <TrendingUp size={16} />
              <span>{diagnosis.action}</span>
            </div>
          </div>

          {secondaryDiagnosis && (
            <div className="diagnosis-secondary">
              <span className="secondary-label">Auch relevant:</span>
              <div className="secondary-card" style={{ '--secondary-accent': secondaryDiagnosis.color }}>
                <secondaryDiagnosis.icon size={20} style={{ color: secondaryDiagnosis.color }} />
                <span>{secondaryDiagnosis.title}</span>
              </div>
            </div>
          )}

          <div className="score-breakdown">
            <h3>Detaillierte Auswertung</h3>
            <div className="score-grid">
              <ResultCard 
                title="Auslastung" 
                value={scores.occupancy} 
                icon={TrendingUp} 
                color="#f43f5e"
                primary={diagnosis.title === 'Auslastungsproblem'}
              />
              <ResultCard 
                title="Sichtbarkeit" 
                value={scores.visibility} 
                icon={Eye} 
                color="#8b5cf6"
                primary={diagnosis.title === 'Sichtbarkeitsproblem'}
              />
              <ResultCard 
                title="Angebot" 
                value={scores.offer} 
                icon={Package} 
                color="#f59e0b"
                primary={diagnosis.title === 'Angebotsproblem'}
              />
              <ResultCard 
                title="Preise" 
                value={scores.pricing} 
                icon={DollarSign} 
                color="#10b981"
                primary={diagnosis.title === 'Preisstrategieproblem'}
              />
              <ResultCard 
                title="Strategie" 
                value={scores.strategy} 
                icon={Target} 
                color="#6366f1"
                primary={diagnosis.title === 'Strategieproblem'}
              />
            </div>
          </div>

          <div className="cta-section">
            <div className="cta-card">
              <BarChart3 size={24} className="cta-icon" />
              <h3>Kostenloser Handlungsplan</h3>
              <p>Erhalte einen personalisierten Plan mit konkreten nächsten Schritten für dein Ferienhaus.</p>
              <button className="cta-button" onClick={() => window.open('https://osion-solution.com/ferienhaus-optimierung', '_blank')}>
                <span>Plan anfordern</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <button className="restart-button" onClick={handleRestart}>
            <ArrowLeft size={16} />
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
              <Sparkles size={14} />
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
            {!isFirstQuestion && (
              <button className="back-button" onClick={handleBack} type="button">
                <ArrowLeft size={16} />
                <span>Zurück</span>
              </button>
            )}
            <span className="keyboard-hint">
              ↑↓ zum Navigieren • Enter zum Bestätigen
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
