// components/CategoryTree.tsx
import { TreeNode, buildCategoryTree } from "../lib/buildCategoryTree"

interface Props {
  cards: any[]
  onSelect: (path: string) => void
  selectedPath: string | null
}

export default function CategoryTree({ cards, onSelect, selectedPath }: Props) {
  const tree = buildCategoryTree(cards)

  const renderNode = (node: TreeNode, path: string[] = []) => {
    const fullPath = path.join("/")
    const isSelected = selectedPath === fullPath

    return (
      <div key={fullPath} style={{ marginLeft: path.length === 0 ? 0 : 12 }}>
        {node.name !== "root" && (
          <div
            onClick={() => onSelect(fullPath)}
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              backgroundColor: isSelected ? "#eef" : "transparent",
              padding: "2px 4px",
              borderRadius: 4,
            }}
          >
            {node.name}
          </div>
        )}

        {[...node.children.values()].map((child) =>
          renderNode(child, [...path, child.name])
        )}
      </div>
    )
  }

  return <div>{renderNode(tree)}</div>
}

