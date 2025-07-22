import type { TreeNode } from "../lib/buildCategoryTree"
import { buildCategoryTree } from "../lib/buildCategoryTree"
import CategoryNode from "./CategoryNode"

interface Props {
  cards: any[]
  onSelect: (path: string) => void
  selectedPath: string | null
}

export default function CategoryTree({ cards, onSelect, selectedPath }: Props) {
  if (!cards || !Array.isArray(cards)) {
    return <div>No cards to display</div>
  }

  const root: TreeNode = buildCategoryTree(cards)

  return (
    <div>
      {Array.from(root.children.values()).map(child => (
        <CategoryNode
          key={child.name}
          node={child}
          path={child.name}
          onSelect={onSelect}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  )
}

