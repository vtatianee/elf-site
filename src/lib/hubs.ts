/**
 * The 8 SEO hubs: wording and ordering.
 *
 * Membership comes from `hubs` in src/data/ideas.json (rules of the source
 * document, handoff 01 §2.3). This file only adds the words around it.
 *
 * COPY STATUS: titles, intros and descriptions are Developer drafts written
 * from the source document's hub rules. Marketing reviews them in Phase 4.
 */
import { getIdeasByHub, type Hub, type Idea } from '@/lib/ideas'

type HubInfo = {
  /** H1 and meta title. */
  title: string
  /** Short label for navigation and hub tiles. */
  navLabel: string
  /** Tile label on the home page. */
  tileLabel: string
  /** One or two sentences under the H1. `{n}` is replaced by the count. */
  intro: string
  /** Meta description. `{n}` is replaced by the count. */
  description: string
  /** Link text on an idea page that BELONGS to this hub. */
  memberLink: string
  /** Link text on an idea page that does NOT belong to it (invitation). */
  invitationLink: string
}

export const HUB_INFO: Record<Hub, HubInfo> = {
  '5-minute': {
    title: '5-Minute Elf Ideas',
    navLabel: '5-minute ideas',
    tileLabel: '5-minute',
    intro: 'All {n} ideas here take 2 or 5 minutes to set up — the ones to reach for when it’s late and you’re tired.',
    description: '{n} elf ideas you can set up in 5 minutes or less, each with a materials list and 3 simple steps.',
    memberLink: 'More 5-minute ideas',
    invitationLink: 'Short on time? See 5-minute ideas',
  },
  easy: {
    title: 'Easy Elf Ideas',
    navLabel: 'Easy ideas',
    tileLabel: 'Easy',
    intro: 'The low-effort ones: every 2- and 5-minute idea, plus the 10-minute ideas with zero mess. {n} in all.',
    description: '{n} easy elf ideas: quick setups and zero-mess scenes, each with a materials list and simple steps.',
    memberLink: 'More easy ideas',
    invitationLink: 'Want it simpler? See easy ideas',
  },
  'no-mess': {
    title: 'No-Mess Elf Ideas',
    navLabel: 'No-mess ideas',
    tileLabel: 'No mess',
    intro: 'Nothing to clean up in the morning. All {n} ideas here are zero mess.',
    description: '{n} zero-mess elf ideas — nothing to sweep up the next morning. Materials list and steps for each.',
    memberLink: 'More no-mess ideas',
    invitationLink: 'Want zero cleanup? See no-mess ideas',
  },
  toddlers: {
    title: 'Elf Ideas for Toddlers',
    navLabel: 'Toddler ideas',
    tileLabel: 'Toddlers',
    intro: 'Ideas made for little ones (2-4) come first, followed by all-ages ideas that work for toddlers too. {n} in all.',
    description: '{n} elf ideas for toddlers (2-4): ideas made for little ones first, then all-ages ideas that work for them too.',
    memberLink: 'More toddler ideas',
    invitationLink: 'See ideas for toddlers',
  },
  kids: {
    title: 'Elf Ideas for Kids',
    navLabel: 'Ideas for kids',
    tileLabel: 'Kids',
    intro: 'Ideas made for kids 5-9 come first, followed by all-ages ideas. {n} in all.',
    description: '{n} elf ideas for kids (5-9): ideas made for this age first, then all-ages ideas.',
    memberLink: 'More ideas for kids',
    invitationLink: 'See ideas for kids',
  },
  funny: {
    title: 'Funny Elf Ideas',
    navLabel: 'Funny ideas',
    tileLabel: 'Funny',
    intro: 'Mischief with a visual joke — the {n} scenes most likely to get a laugh at breakfast.',
    description: '{n} funny elf ideas: harmless mischief with a visual joke, each with a materials list and steps.',
    memberLink: 'More funny ideas',
    invitationLink: 'Want a laugh? See funny ideas',
  },
  arrival: {
    title: 'Elf Arrival Ideas',
    navLabel: 'Arrival ideas',
    tileLabel: 'Arrival',
    intro: '{n} ways for the elf to make a big entrance at the start of the season — banners, breakfasts, boxes and a clue trail.',
    description: '{n} elf arrival ideas for the first night of the season, each with a materials list and steps.',
    memberLink: 'More arrival ideas',
    invitationLink: 'See arrival ideas',
  },
  goodbye: {
    title: 'Elf Goodbye Ideas',
    navLabel: 'Goodbye ideas',
    tileLabel: 'Goodbye',
    intro: '{n} gentle ways to say goodbye in the last days before Christmas.',
    description: '{n} elf goodbye ideas for the end of the season, including a farewell letter, each with a materials list and steps.',
    memberLink: 'More goodbye ideas',
    invitationLink: 'See goodbye ideas',
  },
}

export function fillCount(text: string, n: number): string {
  return text.replaceAll('{n}', String(n))
}

/**
 * The ideas of a hub in display order. For /toddlers/ and /kids/ the ideas
 * written for that age come first, then the all-ages ones (source rule).
 * Everything else is in card order.
 */
export function getHubIdeas(hub: Hub): readonly Idea[] {
  const ideas = getIdeasByHub(hub)
  const specificAge = hub === 'toddlers' ? 'toddler' : hub === 'kids' ? 'kids' : null
  if (specificAge === null) return ideas
  return [...ideas.filter((i) => i.age === specificAge), ...ideas.filter((i) => i.age !== specificAge)]
}
