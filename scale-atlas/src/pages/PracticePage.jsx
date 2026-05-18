import { useState } from 'react'
import { Link } from 'react-router-dom'
import AudioPlayer from '../components/AudioPlayer.jsx'
import IntervalDiagram from '../components/visualizations/IntervalDiagram.jsx'
import { CardIcon, LightbulbIcon, ShuffleIcon } from '../components/icons.jsx'
import styles from './PracticePage.module.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomScale(scales) {
  return scales[Math.floor(Math.random() * scales.length)]
}

// --- Flashcard Mode ---
function Flashcard({ scale, onNext }) {
  const [revealed, setReveal] = useState(false)

  function next() {
    setReveal(false)
    onNext()
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardFront}>
        <div className={styles.cardTag}>{scale.region}</div>
        <h2 className={styles.cardName}>{scale.name}</h2>
        <div className={styles.cardFormula}>
          {scale.intervalFormula.map((n, i) => (
            <span key={i} className={styles.formulaNum}>{n}</span>
          ))}
        </div>
        <AudioPlayer scale={scale} />
      </div>

      {!revealed ? (
        <button className="btn btn-primary" onClick={() => setReveal(true)}>Reveal Details</button>
      ) : (
        <div className={styles.cardBack}>
          <div className={styles.cardMeta}>
            {scale.characteristics.mood.map(m => (
              <span key={m} className={`tag tag-${m}`}>{m}</span>
            ))}
          </div>
          <p className={styles.cardDesc}>{scale.description.split('\n\n')[0].slice(0, 200)}…</p>
          <IntervalDiagram scale={scale} />
          <div className={styles.cardActions}>
            <Link to={`/scale/${scale.id}`} className="btn btn-ghost">View full page</Link>
            <button className="btn btn-primary" onClick={next}>Next Scale →</button>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Quiz Mode ---
function Quiz({ scales }) {
  const [question, setQuestion] = useState(() => makeQuestion(scales))
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  function makeQuestion(scales) {
    const target = randomScale(scales)
    const others = shuffle(scales.filter(s => s.id !== target.id)).slice(0, 3)
    const options = shuffle([target, ...others])
    return { target, options }
  }

  function answer(scale) {
    if (selected) return
    setSelected(scale.id)
    setScore(s => ({
      correct: s.correct + (scale.id === question.target.id ? 1 : 0),
      total: s.total + 1,
    }))
  }

  function next() {
    setSelected(null)
    setQuestion(makeQuestion(scales))
  }

  const { target, options } = question
  const answered = !!selected

  return (
    <div className={styles.quiz}>
      <div className={styles.quizScore}>
        Score: {score.correct} / {score.total}
      </div>

      <div className={styles.quizPrompt}>
        <p className={styles.quizInstruction}>Which scale has this interval pattern?</p>
        <div className={styles.quizFormula}>
          {target.intervalFormula.map((n, i) => (
            <span key={i} className={styles.formulaNum}>{n}</span>
          ))}
        </div>
        <div className={styles.quizViz}>
          <IntervalDiagram scale={target} />
        </div>
        <AudioPlayer scale={target} />
      </div>

      <div className={styles.quizOptions}>
        {options.map(opt => {
          let cls = styles.option
          if (answered) {
            if (opt.id === target.id) cls = `${styles.option} ${styles.optionCorrect}`
            else if (opt.id === selected) cls = `${styles.option} ${styles.optionWrong}`
          }
          return (
            <button key={opt.id} className={cls} onClick={() => answer(opt)}>
              <span className={styles.optionName}>{opt.name}</span>
              <span className={styles.optionMeta}>{opt.region} · {opt.toneCount} tones</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className={styles.quizFeedback}>
          {selected === target.id
            ? '✓ Correct!'
            : `✗ That was ${target.name}`}
          <button className="btn btn-primary" style={{ marginLeft: '1rem' }} onClick={next}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

// --- Random Explorer ---
function RandomExplorer({ scales }) {
  const [scale, setScale] = useState(() => randomScale(scales))

  return (
    <div className={styles.explorer}>
      <div className={styles.explorerHeader}>
        <h2 className={styles.explorerName}>{scale.name}</h2>
        <button className="btn btn-ghost" onClick={() => setScale(randomScale(scales))}>
          <ShuffleIcon size={13} /> Random
        </button>
      </div>
      <div className={styles.explorerMeta}>
        <span className="tag tag-accent">{scale.culture}</span>
        <span className="tag">{scale.region}</span>
        <span className="tag">{scale.toneCount} tones</span>
        {scale.characteristics.mood.map(m => (
          <span key={m} className={`tag tag-${m}`}>{m}</span>
        ))}
      </div>
      <AudioPlayer scale={scale} />
      <IntervalDiagram scale={scale} />
      <p className={styles.explorerDesc}>{scale.description.split('\n\n')[0]}</p>
      <Link to={`/scale/${scale.id}`} className="btn btn-primary">Explore fully →</Link>
    </div>
  )
}

const MODES = [
  { id: 'flashcard', Icon: CardIcon, label: 'Flashcards', desc: 'Study scales one by one' },
  { id: 'quiz', Icon: LightbulbIcon, label: 'Quiz', desc: 'Identify scales by their intervals' },
  { id: 'random', Icon: ShuffleIcon, label: 'Random', desc: 'Discover a random scale' },
]

export default function PracticePage({ scales }) {
  const [mode, setMode] = useState('flashcard')
  const [flashScale, setFlashScale] = useState(() => randomScale(scales))

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Practice</h1>
        <p className={styles.subtitle}>Ear training, scale recognition, and exploration.</p>

        <div className={styles.modeBar}>
          {MODES.map(({ id, Icon, label, desc }) => (
            <button
              key={id}
              className={`${styles.modeBtn} ${mode === id ? styles.modeBtnActive : ''}`}
              onClick={() => setMode(id)}
            >
              <span className={styles.modeLabel}><Icon size={14} /> {label}</span>
              <span className={styles.modeDesc}>{desc}</span>
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {mode === 'flashcard' && (
            <Flashcard
              scale={flashScale}
              onNext={() => setFlashScale(randomScale(scales))}
            />
          )}
          {mode === 'quiz' && <Quiz scales={scales} />}
          {mode === 'random' && <RandomExplorer scales={scales} />}
        </div>
      </div>
    </div>
  )
}
