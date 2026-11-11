'use client'

import type { MouseEvent } from 'react'
import { Icon } from '@/components/Icon'

/**
 * Prints ONE printable sheet: marks its `.sheet` as the one to print, hides
 * the others for the print run (see `.print-only-one` in components.css),
 * then opens the browser's print dialog (where "Save as PDF" also works).
 */
export function PrintButton({ label }: { label: string }) {
  function print(event: MouseEvent<HTMLButtonElement>) {
    const sheet = event.currentTarget.closest('.sheet')
    const root = document.querySelector('main')
    if (!sheet || !root) {
      window.print()
      return
    }
    sheet.classList.add('is-printing')
    root.classList.add('print-only-one')
    const cleanUp = () => {
      sheet.classList.remove('is-printing')
      root.classList.remove('print-only-one')
      window.removeEventListener('afterprint', cleanUp)
    }
    window.addEventListener('afterprint', cleanUp)
    window.print()
  }

  return (
    <button className="btn btn--small no-print" type="button" onClick={print}>
      <Icon name="print" />
      {label}
    </button>
  )
}
