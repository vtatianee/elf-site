/**
 * Meta descriptions built from an idea's own facts (no invented claims).
 * Marketing may replace them with hand-written ones in Phase 4.
 */
import { ideaLabels, type Idea } from '@/lib/ideas'
import { shortMessLabel } from '@/lib/cards'

const MAX = 158

function clip(text: string): string {
  if (text.length <= MAX) return text
  const cut = text.slice(0, MAX - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

export function ideaDescription(idea: Idea): string {
  const age = idea.age === 'all' ? 'all ages' : ideaLabels.age[idea.age].toLowerCase()
  const facts = `A ${idea.time.label} elf idea, ${shortMessLabel(idea.mess).toLowerCase()}, for ${age}.`
  return clip(`${idea.title}: ${facts} You need: ${idea.materials.join(', ')}.`)
}
