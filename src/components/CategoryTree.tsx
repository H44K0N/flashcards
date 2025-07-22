type CategoryNode = {
  name: string
  path: string
  count: number
  children: CategoryNode[]
}

function buildTree(cards: { category_path: string }[]): CategoryNode[] {
  const root: Record<string, CategoryNode> = {}

  for (const { category_path } of cards) {
    const parts = category_path.split("/")
    let current = root
    let fullPath = ""

    for (const part of parts) {
      fullPath = fullPath ? `${fullPath}/${part}` : part
      if (!current[part]) {
        current[part] = { name: part, path: fullPath, count: 0, children: [] }
      }
      current[part].count++
      current = Object.fromEntries(current[part].children.map(c => [c.name, c]))
    }
  }

  const toArray = (obj: Record<string, CategoryNode>): CategoryNode[] =>
    Object.values(obj).map(node => ({
      ...node,
      children: toArray(Object.fromEntries(node.children.map(c => [c.name, c]))),
    }))

  return toArray(root)
}

export default function CategoryTree({
  cards,
  onSelect,
  selectedPath,
}: {
  cards: { category_path: string }[]
  onSelect: (path: string) => void
  selectedPath: string | null
}) {
  const tree = buildTree(cards)

  const renderNode = (node: CategoryNode, depth = 0) => (
    <div key={node.path} style={{ marginLeft: depth * 12 }}>
      <div
        style={{
          cursor: "pointer",
          fontWeight: selectedPath === node.path ? "bold" : "normal",
        }}
        onClick={() => onSelect(node.path)}
      >
        {node.name} ({node.count})
      </div>
      {node.children.map(child => renderNode(child, depth + 1))}
    </div>
  )

  return <div>{tree.map(node => renderNode(node))}</div>
}

