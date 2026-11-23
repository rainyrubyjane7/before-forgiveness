import { useEffect, useId, useRef, useState } from 'react'
import { source, story } from './story'
import './buried.css'

const silhouette = 'M141 199 Q142 196 142 193 L153 193 Q153 198 155 200 Q164 206 165.7 216 L164 311 Q163 318 146 318 Q127 318 126.6 311 L128 218 Q128 207 141 199Z'
const stopper = 'M141.7 182 Q147 180 153.6 182 L153 187 L152 188 L151.8 198 Q147 201 143.4 198 L143 188 L142 187Z'
const banks = [
  'M322 166l-22-7-31 9-17 21-24 9-3 36-15 29 20 37 31 17 25-8 36 8-8-31 10-27-8-28 9-24Z',
  'M322 166l23-9 29 18 21 7 9 37 17 27-8 34-25 14-14 26-31-5-21 2-8-31 10-27-8-28 9-24Z',
]

export function MemoryBottle() {
  const id = 'buried' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const note = useRef<HTMLDivElement>(null)
  const action = useRef<HTMLButtonElement>(null)
  const message = story.bottle[1].slice(1, -1).replace('Sammy', ' Sammy ')

  useEffect(() => {
    if (!open) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setRevealed(true), reduced ? 0 : 3150)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (revealed) note.current?.focus({ preventScroll: true })
  }, [revealed])

  function replay() {
    setOpen(false)
    setRevealed(false)
    requestAnimationFrame(() => action.current?.focus({ preventScroll: true }))
  }

  return <figure className={'excavation' + (open ? ' is-open' : '')}>
    <div className="excavation-view">
      <button className="bottle-object excavation-hit" type="button" aria-label="打开瓶子" disabled={open} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 640 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <image id={id + '-earth'} href={source('media/overhead-earth.webp')} width="640" height="420" preserveAspectRatio="xMidYMid slice" />
            <image id={id + '-photo'} href={source('media/bottle.webp')} width="270" height="405" />
            <clipPath id={id + '-glass'}><path d={silhouette} /></clipPath>
            <clipPath id={id + '-cork'}><path d={stopper} /></clipPath>
            <radialGradient id={id + '-pit'}>
              <stop stopColor="#100c07" /><stop offset=".68" stopColor="#191208" stopOpacity=".88" />
              <stop offset="1" stopColor="#191208" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={id + '-glass-shade'} x2="1" y2="0">
              <stop stopColor="#745736" stopOpacity=".5" /><stop offset=".36" stopColor="#b9a385" stopOpacity=".12" />
              <stop offset=".71" stopColor="#241b11" stopOpacity=".12" /><stop offset="1" stopColor="#2d1d0e" stopOpacity=".52" />
            </linearGradient>
            {banks.map((d, index) => <clipPath key={d} id={id + '-bank-' + index}><path d={d} /></clipPath>)}
          </defs>
          <use href={'#' + id + '-earth'} />
          <ellipse className="dig-hollow" cx="317" cy="237" rx="99" ry="103" fill={`url(#${id}-pit)`} />
          <ellipse className="vessel-shadow" cx="324" cy="205" rx="31" ry="112" fill="#120e08" transform="rotate(-18 324 205)" />
          <g className="unearthed-vessel">
            <g transform="rotate(-18 320 208)">
              <g transform="translate(92 -191) scale(1.55)">
                <g clipPath={`url(#${id}-glass)`}>
                  <use href={'#' + id + '-photo'} />
                  <rect x="126" y="192" width="40" height="126" fill={`url(#${id}-glass-shade)`} />
                  <path className="buried-slip" d="M135 286l12-19 9 5-12 19z" fill="#d6bd8e" stroke="#776447" strokeWidth=".6" />
                </g>
                <g className="excavated-cork">
                  <g clipPath={`url(#${id}-cork)`}><use href={'#' + id + '-photo'} /></g>
                </g>
              </g>
            </g>
          </g>
          {banks.map((d, index) => <g key={d} className={'earth-bank bank-' + index}>
            <g clipPath={`url(#${id}-bank-${index})`}>
              <use href={'#' + id + '-earth'} />
              <path d={d} fill="#503b21" opacity=".14" />
            </g>
          </g>)}
          <g className="flying-fold" transform="translate(280 85)">
            <path d="M0 5l26-5 12 15L7 20z" fill="#e7d0a2" />
            <path d="m0 5 17 6L26 0" stroke="#91784f" fill="none" />
          </g>
        </svg>
      </button>
      {revealed && <div className="opened-note excavated-letter" ref={note} tabIndex={-1}>{message}</div>}
    </div>
    <figcaption>
      <button ref={action} type="button" disabled={open && !revealed} onClick={revealed ? replay : () => setOpen(true)}>
        {revealed ? '重新查看' : '打开瓶子'}
      </button>
    </figcaption>
  </figure>
}
