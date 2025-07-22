import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function CreateCardForm({ onCreated }: { onCreated: () => void }) {
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const [categories, setCategories] = useState<string[]>([""])

  const addSubcategory = () => setCategories([...categories, ""])
  const updateCategory = (i: number, value: string) => {
    const updated = [...categories]
    updated[i] = value
    setCategories(updated)
  }

  const handleSubmit = async () => {
    const category_path = categories.filter(Boolean).join("/")
    const { data, error } = await supabase.from("flashcards").insert({
      front,
      back,
      category_path,
    })

    if (!error) {
      setFront("")
      setBack("")
      setCategories([""])
      onCreated() // trigger reload in Dashboard
    } else {
      alert("Error saving card")
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Create New Card</h3>
      <input
        placeholder="Front"
        value={front}
        onChange={e => setFront(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        placeholder="Back"
        value={back}
        onChange={e => setBack(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <div>
        <h4>Category Path</h4>
        {categories.map((cat, i) => (
          <input
            key={i}
            placeholder={`Level ${i + 1}`}
            value={cat}
            onChange={e => updateCategory(i, e.target.value)}
            style={{ marginBottom: 8, display: "block" }}
          />
        ))}
        <button onClick={addSubcategory}>+ Add Subcategory</button>
      </div>

      <button style={{ marginTop: 12 }} onClick={handleSubmit}>
        Save Card
      </button>
    </div>
  )
}

