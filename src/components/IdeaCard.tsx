import Link from 'next/link'
import type { CardData } from '@/lib/cards'

type Props = {
  card: Pick<CardData, 'href' | 'img' | 'title' | 'timeLabel' | 'messLabel' | 'ageLabel'>
  /** Heading level of the title — keeps the page outline correct. */
  as?: 'h2' | 'h3'
  /** Row layout (thumbnail left) — Tonight Mode results and related ideas on phones. */
  row?: boolean
  /** Show the age group in the facts line. */
  showAge?: boolean
}

/**
 * Idea card (design inventory: `.card`). The whole card is clickable: the
 * title link stretches over it. Safe in Server and Client Components.
 */
export function IdeaCard({ card, as: Heading = 'h3', row = false, showAge = true }: Props) {
  return (
    <article className={row ? 'card card--row' : 'card'}>
      {card.img && (
        <img
          className="card__img"
          src={card.img.src}
          width={card.img.width}
          height={card.img.height}
          alt={card.img.alt}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="card__body">
        <Heading className="card__title">
          <Link href={card.href}>{card.title}</Link>
        </Heading>
        <ul className="meta" role="list">
          <li>{card.timeLabel}</li>
          <li>{card.messLabel}</li>
          {showAge && <li>{card.ageLabel}</li>}
        </ul>
      </div>
    </article>
  )
}
