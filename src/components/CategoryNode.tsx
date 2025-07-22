import { useState } from "react"
import type { TreeNode } from "../lib/buildCategoryTree"

interface Props {
  node: TreeNode
  path: string
  onSelect: (path: string) => void
  selectedPath: string | null
}

export default function CategoryNode({ node, path, onSelect, selectedPath }: Props) {
  const [showChildren, setShowChildren] = useState(true)
  const [showCards, setShowCards] = useState(false)

  const isSelected = selectedPath === path

  return (
    <div style={{ marginLeft: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: isSelected ? "bold" : "normal",
          cursor: "pointer",
        }}
        onClick={() => onSelect(path)}
      >
        {node.children.size > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setShowChildren(!showChildren)
            }}
            style={{ marginRight: 6 }}
          >
            <i className={`fas ${showChildren ? "fa-folder-open" : "fa-folder"}`} />
          </span>
        )}

        <span>{node.name}</span>

        {node.cards.length > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setShowCards(!showCards)
            }}
            style={{ marginLeft: 8, cursor: "pointer" }}
            title="Toggle card list"
          >
            <i className="far fa-clone" />
          </span>
        )}
      </div>

      {showCards &&
        node.cards.map((card) => (
          <div key={card.id} style={{ marginLeft: 20, color: "#444" }}>
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

