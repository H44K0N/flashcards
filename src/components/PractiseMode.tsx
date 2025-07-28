import { useEffect, useState, useCallback } from "react"
import { supabase } from "../lib/supabase"
import styles from "../styles/PractiseMode.module.css"

type Flashcard = {
  id: string
  front: string
  back: string
  ease_factor: number
  interval: number
  repetition: number
  next_review: string
  category_path: string
}

interface Props {
  cramCategory?: string | null
}

export default function PractiseMode({ cramCategory }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [continuedMode, setContinuedMode] = useState(false)

  useEffect(() => {
    const fetchCards = async () => {
      const today = new Date().toISOString()

      let query = supabase.from("flashcards").select("*")
      if (!continuedMode) {
        query = query.lte("next_review", today)
      }
      if (cramCategory) {
        query = query.ilike("category_path", `${cramCategory}%`)
      }

      const { data } = await query
      if (data) setCards(data)
    }

    fetchCards()
  }, [continuedMode, cramCategory])

  const current = cards[index]

  const handleAnswer = async (grade: number) => {
    if (!current) return

    if (!continuedMode) {
      let ef = current.ease_factor ?? 2.5
      let reps = current.repetition ?? 0
      let interval = current.interval ?? 1

      if (grade < 3) {
        reps = 0
        interval = 1
      } else {
        reps += 1
        interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(interval * ef)
        ef = Math.max(1.3, ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)))
      }

      const nextDue = new Date()
      nextDue.setDate(nextDue.getDate() + interval)

      await supabase
        .from("flashcards")
        .update({
          ease_factor: ef,
          repetition: reps,
          interval,
          next_review: nextDue.toISOString().split("T")[0],
        })
        .eq("id", current.id)
    }

    setIndex((prev) => (continuedMode ? (prev + 1) % cards.length : prev + 1))
    setShowBack(false)
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showBack && e.code === "Space") {
        e.preventDefault()
        setShowBack(true)
      } else if (showBack) {
        const gradeMap: { [key: string]: number } = {
          Digit1: 0,
          Digit2: 3,
          Digit3: 4,
          Digit4: 5,
        }
        if (gradeMap[e.code] !== undefined) {
          e.preventDefault()
          handleAnswer(gradeMap[e.code])
        }
      }
    },
    [showBack, current]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  if (!current) {
    return (
      <div>
        <p>Congratulations! You have no cards due for review.</p>
        {!continuedMode && (
          <button className={styles.cramButton} onClick={() => setContinuedMode(true)}>
            Cram anyway
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className={styles.checkboxRow}>
        <label>
          <input
            type="checkbox"
            checked={continuedMode}
            onChange={() => setContinuedMode(!continuedMode)}
          />
          {" "}Cram mode (don’t update spaced repetition data)
        </label>
      </div>
    <div className={styles.cardWrapper}>
      <div className={styles.card} onClick={() => setShowBack(!showBack)}>
        {showBack ? current.back : current.front}
        <div className={styles.cardHint}>
          {showBack ? "(click to flip back)" : "(click to reveal answer)"}
        </div>
      </div>

      {showBack && (
        <div className={styles.answerButtons}>
          <p>How well did you remember this?</p>
          <button onClick={() => handleAnswer(0)}>Not at all (1)</button>
          <button onClick={() => handleAnswer(3)}>Somewhat (2)</button>
          <button onClick={() => handleAnswer(4)}>With effort (3)</button>
          <button onClick={() => handleAnswer(5)}>Easily (4)</button>
        </div>
      )}
      </div>
    </div>
  )
}

