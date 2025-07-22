import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type Flashcard = {
  id: string
  front: string
  back: string
  ease_factor: number
  interval: number
  repetition: number
  next_review: string
}

interface Props {
  onDone: () => void
}

export default function PractiseMode({ onDone }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    const fetchDueCards = async () => {
      const today = new Date().toISOString()
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .lte("next_review", today)

      if (error) console.error("Fetch error:", error)
      if (data) setCards(data)
    }

    fetchDueCards()
  }, [])

  const current = cards[index]

  const handleAnswer = async (grade: number) => {
    if (!current) return

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

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    const { error } = await supabase
      .from("flashcards")
      .update({
        ease_factor: ef,
        repetition: reps,
        interval,
        next_review: nextReview.toISOString(),
      })
      .eq("id", current.id)

    if (error) {
      console.error("Update error:", error)
      return
    }

    setIndex((prev) => prev + 1)
    setShowBack(false)
  }

  if (!current) return <div>No cards to review</div>

  return (
    <div>
      <div
        onClick={() => setShowBack(!showBack)}
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "1.5rem",
          cursor: "pointer",
          fontSize: "1.2rem",
          marginBottom: "1rem",
        }}
      >
        {showBack ? current.back : current.front}
        <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          {showBack ? "(click to flip back)" : "(click to reveal answer)"}
        </div>
      </div>

      {showBack && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p>How well did you remember this?</p>
          <button onClick={() => handleAnswer(0)}>Not at all</button>
          <button onClick={() => handleAnswer(3)}>Somewhat</button>
          <button onClick={() => handleAnswer(4)}>With effort</button>
          <button onClick={() => handleAnswer(5)}>Easily</button>
        </div>
      )}
    </div>
  )
}

