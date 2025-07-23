import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import CreateCardForm from "../components/CreateCardForm"
import CategoryTree from "../components/CategoryTree"
import PractiseMode from "../components/PractiseMode"

type Flashcard = {
  id: string
  front: string
  back: string
  category_path: string
}

export default function Dashboard() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [mode, setMode] = useState<"default" | "create" | "practise">("default")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cramCategory, setCramCategory] = useState<string | null>(null)

  const loadCards = async () => {
    const { data } = await supabase
      .from("flashcards")
      .select("id, front, back, category_path")

    if (data) setFlashcards(data)
  }

  useEffect(() => {
    loadCards()
  }, [])

  const uniquePaths = Array.from(
    new Set(flashcards.map(card => card.category_path).filter(Boolean))
  ).sort()

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 250, padding: 16, borderRight: "1px solid #ccc" }}>
        <button onClick={() => setMode("create")}>+ New Card</button>
        <button onClick={() => setMode("practise")} style={{ marginTop: 8 }}>
          Practise
        </button>

        <div style={{ marginTop: 12 }}>
          <label>Cram from category:</label>
          <select
            value={cramCategory ?? ""}
            onChange={(e) =>
              setCramCategory(e.target.value === "" ? null : e.target.value)
            }
            style={{ width: "100%", marginTop: 4 }}
          >
            <option value="">All</option>
            {uniquePaths.map((path) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </select>
        </div>

        <hr />
        <CategoryTree
          cards={flashcards}
          onSelect={setSelectedCategory}
          selectedPath={selectedCategory}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 16 }}>
        {mode === "create" && <CreateCardForm onCreated={loadCards} />}
        {mode === "practise" && (
          <PractiseMode cramCategory={cramCategory} />
        )}
        {mode === "default" && <div>Select a category or create a new card</div>}
      </div>
    </div>
  )
}

