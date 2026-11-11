/**
 * Card data — the small, serialisable shape every idea card, filter and
 * Tonight Mode draw needs. Built at BUILD TIME (it reads the illustration
 * files on disk) and passed to Client Components as props.
 */
import altText from '../../design/illustration-alt.json'
import {
  getAllIdeas,
  ideaLabels,
  type AgeGroup,
  type Hub,
  type Idea,
  type MaterialTag,
  type MessLevel,
  type Room,
  type TimeTag,
  type TypeTag,
} from '@/lib/ideas'
import { getIllustration, type Illustration, type IllustrationFormat } from '@/lib/illustrations'
import { routes } from '@/lib/routes'

const ALT = altText as Record<string, string>

/**
 * Alt text written by the Designer for each scene (design/illustration-alt.json).
 * Always starts with "Illustration of". Undefined = use the generic sentence.
 */
export function sceneAlt(slug: string): string | undefined {
  return ALT[slug]
}

/** Illustration of an idea with the Designer's alt text. */
export function ideaIllustration(idea: Pick<Idea, 'slug' | 'title'>, format: IllustrationFormat): Illustration | null {
  return getIllustration(idea, format, sceneAlt(idea.slug))
}

/** "Low mess (2-minute cleanup)" → "Low mess": the short form for cards. */
export function shortMessLabel(mess: MessLevel): string {
  return ideaLabels.mess[mess].split(' (')[0] ?? ideaLabels.mess[mess]
}

export type CardData = {
  id: number
  slug: string
  title: string
  href: string
  timeLabel: string
  messLabel: string
  ageLabel: string
  roomLabel: string
  img: Illustration | null
  // Filter fields
  time: TimeTag
  mess: MessLevel
  age: AgeGroup
  room: Room
  hubs: Hub[]
  typeTags: TypeTag[]
  materialTags: MaterialTag[]
  /** Lower-case text the search box matches against. */
  search: string
}

export function toCardData(idea: Idea): CardData {
  return {
    id: idea.id,
    slug: idea.slug,
    title: idea.title,
    href: routes.idea(idea.slug),
    timeLabel: idea.time.label,
    messLabel: shortMessLabel(idea.mess),
    ageLabel: ideaLabels.age[idea.age],
    roomLabel: ideaLabels.room[idea.room],
    img: ideaIllustration(idea, 'square'),
    time: idea.time.tag,
    mess: idea.mess,
    age: idea.age,
    room: idea.room,
    hubs: idea.hubs,
    typeTags: idea.typeTags,
    materialTags: idea.materialTags,
    search: [
      idea.title,
      ...idea.materials,
      idea.roomLabel,
      ideaLabels.room[idea.room],
      ideaLabels.age[idea.age],
      ...idea.typeTags.map((tag) => ideaLabels.type[tag]),
      idea.occasion ?? '',
    ]
      .join(' ')
      .toLowerCase(),
  }
}

export function getAllCards(): CardData[] {
  return getAllIdeas().map(toCardData)
}
