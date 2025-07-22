export type TreeNode = {
  name: string
  children: Map<string, TreeNode>
  cards: any[]
}

export function buildCategoryTree(cards: any[]): TreeNode {
  const root: TreeNode = { name: "root", children: new Map(), cards: [] }

  for (const card of cards) {
    const parts = card.category_path?.split("/") || []
    let current = root

    for (const part of parts) {
      if (!current.children.has(part)) {
        current.children.set(part, { name: part, children: new Map(), cards: [] })
      }
      current = current.children.get(part)!
    }

    current.cards.push(card)
  }

  return root
}

