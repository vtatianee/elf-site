'use client'

/**
 * "Idea of the day" (home page). Rotates through the 60 ideas in card order,
 * one per calendar day, using the visitor's local date. The static HTML shows
 * the idea for the build date; the browser swaps in today's on load. The
 * card keeps its size, so nothing jumps.
 */
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import { pickForDay } from '@/lib/daily'

export type FeatureIdea = {
  id: number
  title: string
  href: string
  timeLabel: string
  messLabel: string
  ageLabel: string
  roomLabel: string
  /** Horizontal illustration (1200x628) — src + alt; null while no file exists. */
  img: { src: string; alt: string } | null
  /** Elf note, when the card has one. */
  quote: { label: string; text: string } | null
}

export function IdeaOfTheDay({ ideas, initialId }: { ideas: FeatureIdea[]; initialId: number }) {
  const [idea, setIdea] = useState<FeatureIdea>(() => ideas.find((i) => i.id === initialId) ?? (ideas[0] as FeatureIdea))

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the visitor's date only exists in the browser
    setIdea(pickForDay(ideas, new Date()))
  }, [ideas])

  return (
    <section className="section" aria-labelledby="today-title">
      <article className="feature">
        {idea.img && (
          <img className="feature__img" src={idea.img.src} width={1200} height={628} alt={idea.img.alt} loading="lazy" decoding="async" />
        )}
        <div className="feature__body">
          <p className="eyebrow">Idea of the day</p>
          <h2 id="today-title">
            <Link href={idea.href}>{idea.title}</Link>
          </h2>
          <ul className="meta" role="list">
            <li>
              <Icon name="clock" />
              {idea.timeLabel}
            </li>
            <li>
              <Icon name="sparkle" />
              {idea.messLabel}
            </li>
            <li>
              <Icon name="child" />
              {idea.ageLabel}
            </li>
            <li>
              <Icon name="door" />
              {idea.roomLabel}
            </li>
          </ul>
          {idea.quote && (
            <p className="quote">
              <small>{idea.quote.label}</small>
              {idea.quote.text}
            </p>
          )}
          <Link className="btn" href={idea.href}>
            See the idea
            <Icon name="arrow" />
          </Link>
        </div>
      </article>
    </section>
  )
}
