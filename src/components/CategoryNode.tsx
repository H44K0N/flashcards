import { useState } from "react"
import type { TreeNode } from "../lib/buildCategoryTree"
import styles from "../styles/CategoryNode.module.css"

interface Props {
  node: TreeNode
  path: string
  onSelect: (path: string) => void
  selectedPath: string | null
}

export default function CategoryNode({ node, path, onSelect, selectedPath }: Props) {
  const [showChildren, setShowChildren] = useState(false)
  const [showCards, setShowCards] = useState(false)

  const isSelected = selectedPath === path

  function getTotalCardCount(n: TreeNode): number {
    let count = n.cards.length
    for (const child of n.children.values()) {
      count += getTotalCardCount(child)
    }
    return count
  }

  const cardCount = getTotalCardCount(node)

  return (
      <div className={styles.node}>

    <div
        className={`${styles.nodeHeader} ${isSelected ? styles.selected : ""}`}
        onClick={() => onSelect(path)}
      >
        {node.children.size > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setShowChildren(!showChildren)
            }}
            className={styles.folderToggle}
          >
            <i className={`fas ${showChildren ? "fa-folder-open" : "fa-folder"}`} />
          </span>
        )}

        <span>{node.name}</span>

        {cardCount > 0 && <span style={{ marginLeft: 4 }}>({cardCount})</span>}

        {node.cards.length > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setShowCards(!showCards)
            }}
            className={styles.cardToggle}
            title="Toggle card list"
          >
            <i className="fas fa-clone" />
          </span>
        )}
      </div>

      {showCards &&
        node.cards.map((card) => (
          <div key={card.id} className={styles.card}>
            • {card.front}
          </div>
        ))}

      {showChildren &&
        Array.from(node.children.values()).map((child) => (
          <CategoryNode
            key={child.name}
            node={child}
            path={`${path}/${child.name}`}
            onSelect={onSelect}
            selectedPath={selectedPath}
          />
        ))}
    </div>
  )
}

