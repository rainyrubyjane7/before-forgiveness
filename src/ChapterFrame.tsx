import type { ReactNode } from 'react'
import { source } from './story'
import './frames.css'

const symbols: Record<string, ReactNode> = {
  ch01: <path d="M20 5h6v12h11v6H26v22h-6V23H9v-6h11z"/>,
  ch02: <><path d="M9 5v12q0 7 6 7t6-7V5m-6 0v15m0 4v21M34 5q-9 10-7 22h8M35 5v40"/></>,
  ch03: <><path d="M24 17c-17-11-23 7-15 20q7 11 15 5 10 5 16-8c7-16-2-24-16-17zM23 16q-1-7 5-12m-4 10Q13 15 12 5q10 0 12 9z"/></>,
  ch04: <><path d="M13 18Q6 14 6 5q6 10 14 9h8q8 1 14-9 1 10-7 14l3 7-4 10-10 9-11-9-3-10zM14 23l7 3-4 2m17-5-7 3 4 2m-12 7 5 3 5-3"/></>,
  ch05: <><path d="M7 17h25v13q0 10-12 10T7 30zM32 18h4q10 3 2 11l-6 1M7 43h28M13 13q4-3 0-6m8 6q4-4 0-8"/></>,
  ch06: <><path d="m20 5 8 0 1 6 5 2 5-3 5 7-5 5v5l4 4-4 7-6-2-5 2-1 5h-8l-1-5-5-2-6 2-4-7 4-4v-5l-4-5 5-7 6 3 5-2z"/><circle cx="24" cy="24" r="7"/></>,
  ch07: <><path d="M17 35V12l20-5v23m-20-12 20-5"/><ellipse cx="12" cy="36" rx="6" ry="4"/><ellipse cx="32" cy="31" rx="6" ry="4"/></>,
  ch08: <><ellipse cx="24" cy="6" rx="8" ry="2"/><circle cx="24" cy="15" r="4"/><path d="m24 21-8 19q8 5 16 0zm-5 3Q9 21 4 12q-2 17 12 21m13-9q10-3 15-12 1 17-12 21"/></>,
  ch09: <><path d="M8 43h33M12 42V7h25v35M17 40V12l15 3v27"/><circle cx="28" cy="28" r="1"/></>,
  silence: <><path d="M7 24h34v-7H7zm3 0v17h28V24m-16-7v24m5-24v24M24 17Q6 17 11 9q6-6 13 8zm0 0Q42 17 37 9q-6-6-13 8z"/></>,
  kiss: <path d="m4 37 8-9 5-15q3-5 4-1l-2 14 3-2 1-17q2-4 3 0l1 19-5 9-10 8zm40 0-8-9-5-15q-2-4-4-2m0 15 4 7 7 6M6 35l9 8m26-9-8 9"/>
}
export function FooterMark({id}: {id:string}) {
  return <div className="folio-mark" aria-hidden="true"><i/><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">{symbols[id]}</svg><i/></div>
}
function Material({id}: {id:string}) {
  switch(id) {
    case 'ch02': return <><rect x="36" y="23" width="644" height="473" fill="url(#folio-check)" transform="rotate(-2 360 260)"/><rect x="92" y="44" width="536" height="432" rx="62" fill="url(#folio-glaze)" stroke="#c7bea2" strokeWidth="3"/><rect x="105" y="56" width="510" height="405" rx="51" fill="none" stroke="#51684d" strokeWidth="2"/><rect x="110" y="61" width="500" height="395" rx="46" fill="none" stroke="#98a183"/><rect x="140" y="88" width="440" height="343" rx="24" fill="#d3cbb1" stroke="#ece6cd" strokeWidth="9"/></>
    default: return <><rect x="73" y="39" width="574" height="443" fill="#222628" stroke="#080b0d" strokeWidth="11"/><rect x="85" y="51" width="550" height="419" stroke="#636b69" fill="none"/>{[97,623].map(x=>[65,454].map(y=><g key={x+'-'+y}><circle cx={x} cy={y} r="7" fill="#404644"/><path d={`m${x-3} ${y+2} 6-4`} stroke="#151718"/></g>))}</>
  }
}
function Patterns() {
  return <defs>
    <pattern id="folio-check" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#e0d5b0"/><path d="M0 4.5h18M4.5 0v18" stroke="#638166" opacity=".54" strokeWidth="9"/></pattern>
    <linearGradient id="folio-glaze" x2=".7" y2="1"><stop stopColor="#fffce7"/><stop offset=".44" stopColor="#f2edda"/><stop offset=".86" stopColor="#d4cdb4"/><stop offset="1" stopColor="#a7a58d"/></linearGradient>
  </defs>
}
const photographs: Record<string, string> = {
  ch01: 'chapel',
  ch03: 'confessional',
  ch04: 'book',
  ch05: 'crt',
  ch06: 'cafe',
  ch07: 'garden',
  ch08: 'linen',
}

function IronFrame() {
  return <g fill="none">
    <defs>
      <pattern id="folio-iron-lattice" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M-16 16L16 48M0 0L32 32M16-16l32 32M-16 16L16-16M0 32L32 0m-16 48 32-32" stroke="#111416" strokeWidth="5" />
        <path d="m0 0 32 32M0 32 32 0" stroke="#606262" strokeWidth="1.25" />
      </pattern>
    </defs>
    <path d="M84 50H636V470H84Z M103 101H617V419H103Z" fill="url(#folio-iron-lattice)" fillRule="evenodd" />
    <rect x="100" y="99" width="520" height="322" stroke="#111416" strokeWidth="10" />
    <rect x="103" y="102" width="514" height="316" stroke="#62615b" strokeWidth="2" />
    <g transform="translate(557 423)" stroke="#aa9572">
      <path d="M6 18V10a9 9 0 0 1 18 0v8" strokeWidth="4" />
      <rect y="16" width="30" height="30" rx="3" fill="#514739" strokeWidth="1.5" />
      <path d="M15 28v7" stroke="#16181a" strokeWidth="4" strokeLinecap="round" />
    </g>
  </g>
}

export function ChapterFrame({ id, children }: { id: string; children: ReactNode }) {
  const backdrop = photographs[id]
  return <div className={`folio-scene folio-${id}${backdrop ? ' folio-photograph' : ''}`}>
    {backdrop ? <img className="folio-backdrop" alt="" src={source(`media/${backdrop}.webp`)} decoding="async" /> :
      <svg className="folio-shell" viewBox="0 0 720 520" aria-hidden="true">
        <Patterns /><Material id={id} />
        {id === 'ch09' && <IronFrame />}
      </svg>}
    <div className="folio-photo">{children}</div>
  </div>
}
