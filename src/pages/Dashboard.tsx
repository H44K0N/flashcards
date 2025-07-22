import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import CreateCardForm from "../components/CreateCardForm"
import CategoryTree from "../components/CategoryTree"

type Flashcard = {
  id: string
  front: string
  back: string
  category_path: string
}

export default function Dashboard() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [mode, setMode] = useState<"default" | "create">("default")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const loadCards = async () => {
    const { data } = await supabase
      .from("flashcards")
      .select("id, front, back, category_path")
    if (data) setFlashcards(data)
  }

  useEffect(() => {
    loadCards()
  }, [])

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 250, padding: 16, borderRight: "1px solid #ccc" }}>
        <button onClick={() => setMode("create")}>+ New Card</button>
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
        {mode === "default" && <div>Select a category or create a new card</div>}
      </div>
    </div>
  )
}

