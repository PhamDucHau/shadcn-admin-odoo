import type { SearchableItem } from '@/context/search-provider'

export function fuzzySearch(
  query: string,
  items: SearchableItem[]
): SearchableItem[] {
  if (!query.trim()) return items

  const searchTerm = query.toLowerCase()

  return items
    .map((item) => {
      const title = item.title.toLowerCase()
      const category = item.category.toLowerCase()
      const keywords =
        item.keywords?.map((k) => k.toLowerCase()).join(' ') || ''

      const combinedSearchText = `${title} ${category} ${keywords}`

      // Simple fuzzy matching
      let score = 0
      const terms = searchTerm.split(' ')

      for (const term of terms) {
        if (title.includes(term)) {
          score += 10 // Highest weight for title match
        } else if (category.includes(term)) {
          score += 5 // Medium weight for category match
        } else if (keywords.includes(term)) {
          score += 3 // Lower weight for keyword match
        } else if (combinedSearchText.includes(term)) {
          score += 1 // Minimal weight for partial match
        }
      }

      return { ...item, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
}

interface NavItem {
  title: string
  url?: string
  items?: NavItem[]
}

interface NavGroup {
  title: string
  items?: NavItem[]
}

export function createSearchableItems(navGroups: NavGroup[]): SearchableItem[] {
  const items: SearchableItem[] = []

  navGroups.forEach((group) => {
    group.items?.forEach((item: NavItem) => {
      if (item.url) {
        items.push({
          id: String(item.url),
          title: item.title,
          url: String(item.url),
          category: group.title,
          keywords: [item.title, group.title],
        })
      }

      // Add sub-items
      if (item.items) {
        item.items.forEach((subItem: NavItem) => {
          if (subItem.url) {
            items.push({
              id: String(subItem.url),
              title: subItem.title,
              url: String(subItem.url),
              category: group.title,
              keywords: [subItem.title, item.title, group.title],
            })
          }
        })
      }
    })
  })

  return items
}
