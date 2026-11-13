/**
 * Meta descriptions built from an idea's own facts (no invented claims).
 * Wording reviewed by Marketing and approved at Gate 4 (copy review row 5):
 * "Trapped in a Jar: a 2-minute elf idea with zero mess, for all ages. You need: …"
 */
import type { Idea } from '@/lib/ideas'
import { shortMessLabel } from '@/lib/cards'

const MAX = 158

function clip(text: string): string {
  if (text.length <= MAX) return text
  const cut = text.slice(0, MAX - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

export function ideaDescription(idea: Idea): string {
  const age = { all: 'all ages', toddler: 'toddlers (2-4)', kids: 'kids (5-9)' }[idea.age]
  const minutes = idea.time.minutes === null ? `${idea.time.tag} minute` : `${idea.time.minutes}-minute`
  const facts = `a ${minutes} elf idea with ${shortMessLabel(idea.mess).toLowerCase()}, for ${age}.`
  return clip(`${idea.title}: ${facts} You need: ${idea.materials.join(', ')}.`)
}
