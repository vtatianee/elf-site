/**
 * "3 related ideas" at the end of every idea page (internal-linking rule:
 * every idea links to 3 siblings + 2 hubs).
 *
 * Deterministic: the same idea always gets the same 3 siblings, so the
 * static pages never change between builds unless the data changes.
 *
 * Score — what a parent most likely wants next:
 *   same room (+4): the source plans "more ideas in the kitchen"
 *   each shared type tag (+2): funny with funny, arrival with arrival
 *   compatible age (+1), same mess level (+1), same time (+1)
 * Ties go to the nearest card number, then the lower one.
 */
import { getAllIdeas, type Idea } from '@/lib/ideas'

function score(a: Idea, b: Idea): number {
  let s = 0
  if (a.room === b.room) s += 4
  s += a.typeTags.filter((tag) => b.typeTags.includes(tag)).length * 2
  if (a.age === b.age || a.age === 'all' || b.age === 'all') s += 1
  if (a.mess === b.mess) s += 1
  if (a.time.tag === b.time.tag) s += 1
  return s
}

export function getRelatedIdeas(idea: Idea, count = 3): Idea[] {
  return getAllIdeas()
    .filter((other) => other.id !== idea.id)
    .map((other) => ({ other, s: score(idea, other), d: Math.abs(other.id - idea.id) }))
    .sort((x, y) => y.s - x.s || x.d - y.d || x.other.id - y.other.id)
    .slice(0, count)
    .map(({ other }) => other)
}
