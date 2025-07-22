import { TreeNode } from "../lib/buildCategoryTree"

interface Props {
  node: TreeNode
}

export default function CategoryTree({ node }: Props) {
  return (
    <div style={{ marginLeft: node.name === "root" ? 0 : 16 }}>
      {node.name !== "root" && <div style={{ fontWeight: "bold" }}>{node.name}</div>}

      {node.cards.map((card) => (
        <div key={card.id} style={{ marginLeft: 16 }}>
          🃏 {card.front}
        </div>
      ))}

      {[...node.children.values()].map((child) => (
        <CategoryTree key={child.name} node={child} />
      ))}
    </div>
  )
}

