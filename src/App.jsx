import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  Gem,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

const quizQuestions = [
  {
    id: 'occupancy',
    title: 'Wie hoch ist die aktuelle Auslastung Deines Ferienhauses?',
    options: [
      { label: 'Unter 30 %', score: { visibility: 2, pricing: 2, trust: 1 } },
      { label: '30–50 %', score: { visibility: 2, pricing: 1, trust: 1 } },
      { label: '50–70 %', score: { visibility: 1, pricing: 1, trust: 1 } },
      { label: 'Über 70 %', score: { visibility: 0, pricing: 0, trust: 1 } },
    ],
  },
  {
    id: 'focus',
    title: 'Wo verlierst Du aktuell am meisten Potenzial?',
    options: [
      { label: 'Sichtbarkeit in Portalen', score: { visibility: 3, pricing: 0, trust: 0 } },
      { label: 'Preislogik & Aussteuerung', score: { visibility: 0, pricing: 3, trust: 0 } },
      { label: 'Vertrauen & Positionierung', score: { visibility: 0, pricing: 0, trust: 3 } },
      { label: 'Unklar – überall ein bisschen', score: { visibility: 1, pricing: 1, trust: 1 } },
    ],
  },
  {
    id: 'urgency',
    title: 'Wie schnell willst Du Ergebnisse sehen?',
    options: [
      { label: 'In den nächsten 30 Tagen', score: { visibility: 1, pricing: 1, trust: 1 } },
      { label: 'Innerhalb eines Quartals', score: { visibility: 0, pricing: 1, trust: 1 } },
      { label: 'Sauber & nachhaltig, egal wie lange', score: { visibility: 1, pricing: 0, trust: 2 } },
      { label: 'Ich brauche erst Klarheit', score: { visibility: 2, pricing: 1, trust: 2 } },
    ],
  },
  {
    id: 'data',
    title: 'Wie datenbasiert steuerst Du Preise und Kalender?',
    options: [
      { label: 'Kaum datenbasiert', score: { visibility: 0, pricing: 3, trust: 0 } },
      { label: 'Teilweise mit Regeln', score: { visibility: 0, pricing: 2, trust: 1 } },
      { label: 'Mit Tools, aber ohne System', score: { visibility: 1, pricing: 1, trust: 1 } },
      { label: 'Sehr strukturiert', score: { visibility: 0, pricing: 0, trust: 0 } },
    ],
  },
]

const clusterConfig = {
  visibility: {
    title: 'Sichtbarkeit & Darstellung',
    description: 'Titel, Fotos, Texte und Conversion-Elemente sind der größte Hebel.',
    icon: Eye,
    colorClass: 'rose',
  },
  pricing: {
    title: 'Preislogik & Auslastung',
    description: 'Mindestaufenthalte, Preisfenster und Nachfrage-Signale bremsen Dich aus.',
    icon: BarChart3,
    colorClass: 'amber',
  },
  trust: {
    title: 'Vertrauen & Differenzierung',
    description: 'Proof, Positionierung und klare Botschaften fehlen in Deinem Auftritt.',
    icon: ShieldCheck,
    colorClass: 'violet',
  },
}

const faqItems = [
  {
    q: 'Für wen ist der Check geeignet?',
    a: 'Für Gastgeber mit einem oder mehreren Ferienobjekten, die mehr Auslastung und planbare Buchungen wollen.',
  },
  {
    q: 'Wie lange dauert der Check?',
    a: 'Der Schnell-Check dauert ungefähr fünf Minuten. Danach erhältst Du sofort eine priorisierte Auswertung.',
  },
  {
    q: 'Brauche ich technische Vorkenntnisse?',
    a: 'Nein. Alle Empfehlungen sind in klaren Schritten formuliert und können direkt umgesetzt werden.',
  },
]

function scoreFromAnswers(answers) {
  const totals = { visibility: 0, pricing: 0, trust: 0 }
  answers.forEach((item) => {
    if (!item) return
    Object.keys(totals).forEach((key) => {
      totals[key] += item?.score?.[key] ?? 0
    })
  })
  return totals
}

export default function App() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [openFaq, setOpenFaq] = useState(0)

  const totals = useMemo(() => scoreFromAnswers(answers), [answers])
  const ranking = useMemo(
    () => Object.entries(totals).sort((a, b) => b[1] - a[1]),
    [totals],
  )

  const topCluster = ranking[0]?.[0] ?? 'visibility'
  const activeCluster = clusterConfig[topCluster]
  const currentQuestion = quizQuestions[step]

  const onAnswer = (index) => {
    const next = [...answers]
    next[step] = currentQuestion.options[index]
    setAnswers(next)
    if (step < quizQuestions.length - 1) {
      setStep((prev) => prev + 1)
    }
  }

  const onReset = () => {
    setStep(0)
    setAnswers([])
  }

  return (
    <main className="osion-app">
      <section className="hero-panel">
        <header className="topbar">
          <div className="logo">OSI<span>ON</span></div>
          <nav>
            <a href="#analyse">Analyse</a>
            <a href="#ablauf">Ablauf</a>
            <a href="#faq">FAQ</a>
          </nav>
          <button className="ghost-btn">Für Gastgeber</button>
        </header>

        <div className="hero-grid" id="analyse">
          <div className="hero-copy">
            <div className="pill">Der OSION Handlungsplan für Dein Ferienhaus</div>
            <h1>Mehr Auslastung. Mehr Buchungen. Klare Schritte.</h1>
            <p>Finde Buchungsbremsen, priorisiere Hebel und erhalte einen datenbasierten Fahrplan.</p>

            <div className="quiz-card">
              <div className="quiz-head">
                <span>Frage {step + 1} von {quizQuestions.length}</span>
                <div className="progress-track">
                  <div style={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }} />
                </div>
              </div>

              <h3>{currentQuestion.title}</h3>
              <div className="quiz-options">
                {currentQuestion.options.map((option, index) => (
                  <button key={option.label} onClick={() => onAnswer(index)}>
                    <span>{option.label}</span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
              <div className="quiz-foot">Dauer: ca. 5 Minuten · Ergebnis sofort</div>
            </div>
          </div>

          <div className="hero-result-card">
            <div className="result-kicker">OSION HANDLUNGSPLAN</div>
            <h2>{activeCluster.title}</h2>
            <p>{activeCluster.description}</p>
            <ul>
              <li><CheckCircle2 size={16} /> Problemcluster priorisieren</li>
              <li><CheckCircle2 size={16} /> Größten Umsatzhebel identifizieren</li>
              <li><CheckCircle2 size={16} /> Schritt-für-Schritt umsetzen</li>
            </ul>
            <div className="sparkline" />
          </div>
        </div>
      </section>

      <section className="platforms">
        <p>Geeignet für Gastgeber auf</p>
        <div>Airbnb · Booking.com · FeWo-direkt · VRBO</div>
      </section>

      <section className="pain-points">
        <h2>Warum bleiben Buchungen unter ihren Möglichkeiten?</h2>
        <div className="three-grid">
          <article>
            <Gem size={22} />
            <h3>Darstellung überzeugt nicht</h3>
            <p>Fotos, Texte und Titel sprechen die richtigen Gäste nicht an.</p>
          </article>
          <article>
            <TrendingUp size={22} />
            <h3>Preislogik nutzt Potenziale nicht</h3>
            <p>Preise und Regeln sind nicht synchron mit Nachfrage und Saison.</p>
          </article>
          <article>
            <BadgeCheck size={22} />
            <h3>Vertrauen und Differenzierung fehlen</h3>
            <p>Gäste sehen keinen klaren Grund, genau bei Dir zu buchen.</p>
          </article>
        </div>
      </section>

      <section className="process" id="ablauf">
        <h2>So führt Dich der Funnel zum Handlungsplan</h2>
        <div className="steps">
          <div><span>1</span><h4>Schnell-Check</h4><p>Kurze Fragen zur aktuellen Situation.</p></div>
          <ArrowRight size={18} />
          <div><span>2</span><h4>Auswertung</h4><p>Cluster und Hebel werden gewichtet.</p></div>
          <ArrowRight size={18} />
          <div><span>3</span><h4>Ergebnis</h4><p>Priorität + konkrete Maßnahmen.</p></div>
          <ArrowRight size={18} />
          <div><span>4</span><h4>Umsetzung</h4><p>Fahrplan für die nächsten 30/60/90 Tage.</p></div>
        </div>
      </section>

      <section className="result-preview">
        <div className="table-card">
          <h3>Dein Ergebnis (Vorschau)</h3>
          {ranking.map(([key, value], idx) => {
            const item = clusterConfig[key]
            const Icon = item.icon
            return (
              <div key={key} className="table-row">
                <div className="left">
                  <Icon size={16} />
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </div>
                </div>
                <div className={`priority ${item.colorClass}`}>
                  {idx === 0 ? 'Hoch' : idx === 1 ? 'Mittel' : 'Niedrig'} ({value})
                </div>
              </div>
            )
          })}
          <button className="link-btn" onClick={onReset}>Analyse zurücksetzen</button>
        </div>
        <div className="benefit-card">
          <h3>Das bekommst Du mit dem OSION Handlungsplan</h3>
          <ul>
            <li><CheckCircle2 size={16} /> Du weißt, was zuerst zu tun ist.</li>
            <li><CheckCircle2 size={16} /> Du bekommst Maßnahmen mit maximaler Wirkung.</li>
            <li><CheckCircle2 size={16} /> Du kannst sofort in die Umsetzung gehen.</li>
          </ul>
          <button className="cta-btn"><Rocket size={16} /> Ergebnis ansehen</button>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2>Häufige Fragen</h2>
        {faqItems.map((item, idx) => (
          <button key={item.q} className="faq-item" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
            <div>
              <strong>{item.q}</strong>
              {openFaq === idx && <p>{item.a}</p>}
            </div>
            <ChevronDown size={18} className={openFaq === idx ? 'open' : ''} />
          </button>
        ))}
      </section>

      <section className="footer-cta">
        <div>
          <h2>Starte jetzt mit dem ersten Check.</h2>
          <p>In wenigen Minuten zu mehr Auslastung und klaren Schritten.</p>
        </div>
        <button><CalendarRange size={16} /> Frage 1 von 4 starten</button>
      </section>
    </main>
  )
}
