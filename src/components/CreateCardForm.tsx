import { useState } from "react"
import { supabase } from "../lib/supabase"
import { getCurrentUserId } from "../lib/supabase"

interface Props {
  onCreated: () => void
}

export default function CreateCardForm({ onCreated }: Props) {
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const [categories, setCategories] = useState([""])

  const category_path = categories.filter(Boolean).join("/")

  const handleAddCategory = () => {
    setCategories([...categories, ""])
  }

  const handleChangeCategory = (index: number, value: string) => {
    const updated = [...categories]
    updated[index] = value
    setCategories(updated)
  }

  const handleSubmit = async () => {
    const user_id = await getCurrentUserId()
    if (!user_id) return alert("You must be logged in to create a card")

    const { error } = await supabase.from("flashcards").insert({
      front,
      back,
      category_path,
      user_id,
    })

    if (!error) {
      setFront("")
      setBack("")
      setCategories([""])
      onCreated()
    } else {
      alert("Error saving card")
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>Create New Card</h2>

      <input
        placeholder="Front"
        value={front}
        onChange={(e) => setFront(e.target.value)}
        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
      />

      <input
        placeholder="Back"
        value={back}
        onChange={(e) => setBack(e.target.value)}
        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
      />

      {categories.map((cat, idx) => (
        <input
          key={idx}
          placeholder={`Category ${idx + 1}`}
          value={cat}
          onChange={(e) => handleChangeCategory(idx, e.target.value)}
          style={{ display: "block", marginBottom: "0.25rem", width: "100%" }}
        />
      ))}

      <button onClick={handleAddCategory} style={{ marginBottom: "1rem" }}>
        + Add Subcategory
      </button>

      <br />
      <button onClick={handleSubmit}>Save Card</button>
    </div>
  )
}

