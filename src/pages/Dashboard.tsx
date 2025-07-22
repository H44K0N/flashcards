import { useState } from "react"

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [mode, setMode] = useState<"default" | "create" | "review">("default")

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <div>
          <button onClick={() => setMode("create")}>➕ Create New Card</button>
          <button onClick={() => setMode("review")}>🧠 Practise Cards</button>
        </div>
        {selectedCategory && <div>Selected: {selectedCategory}</div>}
      </div>

      {/* Content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Left: Category Tree */}
        <div style={{ width: "300px", borderRight: "1px solid #ccc", padding: "1rem", overflowY: "auto" }}>
          <h4>Categories</h4>
          {/* 🔁 Replace with dynamic tree later */}
          <ul>
            <li onClick={() => setSelectedCategory("Math")}>Math (12)</li>
            <li onClick={() => setSelectedCategory("Math/Algebra")}>├─ Algebra (6)</li>
            <li onClick={() => setSelectedCategory("Java")}>Java (20)</li>
          </ul>
        </div>

        {/* Right: Main panel */}
        <div style={{ flex: 1, padding: "1rem" }}>
          {mode === "create" && (
            <div>
              <h3>Create New Card</h3>
              {/* 🔜 Add creation component here */}
            </div>
          )}

          {mode === "review" && (
            <div>
              <h3>Practise Cards</h3>
              <p>
                {selectedCategory
                  ? `Practising cards in "${selectedCategory}"...`
                  : "Practising all cards..."}
              </p>
              {/* 🔜 Add SM-2 review component here */}
            </div>
          )}

          {mode === "default" && <p>Select a category or action to begin.</p>}
        </div>
      </div>
    </div>
  )
}

