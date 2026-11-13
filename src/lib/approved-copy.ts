/**
 * Printable texts approved at Gate 4 (2026-11-12), written by Marketing in
 * Phase 4. They live in `src/data/approved-copy.json`, apart from
 * `ideas.json`, which stays the verbatim record of the source PDF.
 *
 * SERVER ONLY: used by /printables/. The hooks, notes and extra safety lines
 * in the same file reach the pages through `@/lib/ideas`.
 */
import approvedCopy from '@/data/approved-copy.json'

export type PrintableTexts = {
  /** 24 questions; the first is verbatim from the card. */
  wouldYouRather: string[]
  /** Paragraphs of the farewell letter (idea 30); blanks are written as ____. */
  farewellLetter: string[]
  /** Story with numbered blanks written as "[1. a noun]". */
  storyCard: { text: string; signOff: string; blanks: string[] }
  kindnessMissions: { envelopeLabel: string; missions: string[] }
  /** 4 clue cards; card 1 also gets a "First stop" line. */
  clueTrail: { text: string; addLine?: string }[]
  niceListTopLine: string
  tasteTestInstruction: string
  /** Short letter for idea 60, different from the long farewell letter. */
  seeYouSoonLetter: { title: string; body: string[]; signoff: string }
}

export const printableTexts: PrintableTexts = (approvedCopy as unknown as { printables: PrintableTexts }).printables
