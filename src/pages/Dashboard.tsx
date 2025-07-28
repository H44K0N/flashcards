import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import CreateCardForm from "../components/CreateCardForm"
import CategoryTree from "../components/CategoryTree"
import PractiseMode from "../components/PractiseMode"
import styles from "../styles/Dashboard.module.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"

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
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [sidebarAnimating, setSidebarAnimating] = useState(false)

  const loadCards = async () => {
    const { data } = await supabase
      .from("flashcards")
      .select("id, front, back, category_path")

    if (data) setFlashcards(data)
  }

  useEffect(() => {
    loadCards()
  }, [])

  const toggleSidebar = () => {
    if (sidebarVisible) {
      setSidebarAnimating(true)
      setTimeout(() => {
        setSidebarVisible(false)
        setSidebarAnimating(false)
      }, 200) // matcher .sidebarExit animasjonstid
    } else {
      setSidebarVisible(true)
    }
  }

  const uniquePaths = Array.from(
    new Set(flashcards.map(card => card.category_path).filter(Boolean))
  ).sort()

  return (
    <>
      <button className={styles.toggleSidebarBtn} onClick={toggleSidebar}>
        <FontAwesomeIcon icon={sidebarVisible ? faTimes : faBars} />
      </button>

      <div className={styles.container}>
        {(sidebarVisible || sidebarAnimating) && (
          <div
            className={`${styles.sidebar} ${
              sidebarAnimating ? styles.sidebarExit : styles.sidebarEnter
            }`}
          >
          <div className={styles.buttonGroup}>
          <button
              className={styles.sidebarButton}
              onClick={() => setMode("create")}
            >
              + New Card
            </button>

            <button
              className={styles.sidebarButton}
              onClick={() => setMode("practise")}
            >
              Practise
            </button>
          </div>

            <div className={styles.selectWrapper}>
              <label>Cram from category:</label>
              <select
                value={cramCategory ?? ""}
                onChange={(e) =>
                  setCramCategory(e.target.value === "" ? null : e.target.value)
                }
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
            <h1>Your Flashcards</h1>
            <CategoryTree
              cards={flashcards}
              onSelect={setSelectedCategory}
              selectedPath={selectedCategory}
            />
          </div>
        )}

        <div className={styles.main}>
          {mode === "create" && <CreateCardForm onCreated={loadCards} />}
          {mode === "practise" && <PractiseMode cramCategory={cramCategory} />}
          {mode === "default" && (
            <div>Select a category or create a new card</div>
          )}
        </div>
      </div>
    </>
  )
}

