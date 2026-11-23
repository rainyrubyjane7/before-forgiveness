import { useEffect, useId, useRef, useState } from 'react'
import { source, story } from './story'
import './buried.css'

const horizon = 'M-60 282 Q-19 274 12 279 T72 267 Q95 271 117 266 T176 271 Q200 260 222 267 T269 260 Q293 249 320 258 Q347 249 370 264 T431 267 Q458 255 490 264 T541 256 Q579 263 609 249 T700 253'
const silhouette = 'M141 199 Q142 196 142 193 L153 193 Q153 198 155 200 Q164 206 165.7 216 L164 311 Q163 318 146 318 Q127 318 126.6 311 L128 218 Q128 207 141 199Z'
const stopper = 'M141.7 182 Q147 180 153.6 182 L153 187 L152 188 L151.8 198 Q147 201 143.4 198 L143 188 L142 187Z'
function distribution(index: number, seed: number) {
  const value = Math.sin(index * 78.233 + seed * 13.733) * 43758.5453
  return value - Math.floor(value)
}

function Earth({ id, side }: { id: string; side: 'left' | 'right' }) {
  return <g className={'earth-bank bank-' + side}>
    <g clipPath={`url(#${id}-${side})`}>
      <path d={horizon+' V490 H-60Z'} fill={`url(#${id}-soil)`} />
      <path d={horizon+' V490 H-60Z'} fill={`url(#${id}-grit)`} opacity=".85" />
      <path d={horizon} stroke="#ab8860" strokeWidth="3" fill="none" />
      {Array.from({length:48},(_,i)=>{
        const x = distribution(i,1)*740-50
        const y = 269+distribution(i,2)*105
        const reach = 17+distribution(i,3)*57
        return <g key={i} transform={`translate(${x} ${y}) rotate(${distribution(i,4)*50-25})`} fill="none" stroke={i%3===0?'#ae9066':'#785c40'} strokeWidth={i%3===0?1.2:.7}>
          <path d={`M0 0 q-9 8 4 18 t-2 ${reach} m6 -30 q12 -5 15 -21 m-19 6 q-11 4 -16 -9`}/>
        </g>
      })}
      {Array.from({length:180},(_,i)=>{
        const x=distribution(i,6)*745-50, y=267+distribution(i,8)*157, s=.25+distribution(i,9)*1.5
        return <g key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${distribution(i,5)*150})`}>
          <path d="M-6 2l1-4 5-2 7 3-1 3-8 2z" fill={['#42352a','#574939','#756852','#383027'][i%4]}/>
          <path d="M-5-2l5-2 6 2-8 1z" fill="#b79c75" opacity=".47"/>
        </g>
      })}
    </g>
  </g>
}

export function MemoryBottle() {
  const id = 'buried'+useId().replace(/[^a-zA-Z0-9_-]/g,'')
  const [open,setOpen] = useState(false)
  const [revealed,setRevealed] = useState(false)
  const message = story.bottle[1].slice(1,-1).replace('Sammy',' Sammy ')
  const note = useRef<HTMLDivElement>(null)
  const action = useRef<HTMLButtonElement>(null)
  useEffect(()=>{
    if (!open) return
    const timer = window.setTimeout(()=>setRevealed(true),matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 3150)
    return ()=>clearTimeout(timer)
  },[open])
  useEffect(()=>{ if(revealed) note.current?.focus({preventScroll:true}) },[revealed])
  return <figure className={'excavation'+(open?' is-open':'')}>
    <div className="excavation-view">
      <button type="button" className="bottle-object excavation-hit" aria-label="打开瓶子" disabled={open} onClick={()=>setOpen(true)}>
        <svg viewBox="0 0 640 410" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id={id+'-sky'} cx="51%" cy="53%" r="78%"><stop stopColor="#91866a"/><stop offset=".49" stopColor="#50544a"/><stop offset="1" stopColor="#171e1b"/></radialGradient>
            <linearGradient id={id+'-soil'} x2=".12" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#795d40"/><stop offset=".22" stopColor="#493829"/><stop offset="1" stopColor="#211d18"/></linearGradient>
            <filter id={id+'-noise'} x="0" y="0" width="100%" height="100%"><feTurbulence baseFrequency=".46" numOctaves="3" seed="13" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
            <pattern id={id+'-grit'} width="98" height="83" patternUnits="userSpaceOnUse"><rect width="98" height="83" filter={`url(#${id}-noise)`} opacity=".48" style={{mixBlendMode:'soft-light'}}/></pattern>
            <clipPath id={id+'-left'}><path d="M-65 0H322l-3 262 6 19-11 22 12 18-8 20 7 19-5 74H-65Z"/></clipPath>
            <clipPath id={id+'-right'}><path d="M320 0h390v440H318l5-80-7-19 8-20-12-18 11-22-6-19Z"/></clipPath>
            <clipPath id={id+'-glass'}><path d={silhouette}/></clipPath>
            <clipPath id={id+'-cork'}><path d={stopper}/></clipPath>
            <image id={id+'-photo'} href={source('media/bottle.webp')} width="270" height="405"/>
          </defs>
          <rect width="640" height="410" fill={`url(#${id}-sky)`}/>
          <rect width="640" height="410" fill={`url(#${id}-grit)`} opacity=".22"/>
          <g fill="none" stroke="#92947a" opacity=".4">{Array.from({length:32},(_,i)=>{
            const x=distribution(i,2)*660
            return <path key={i} d={`M${x} 283 q-7 -26 -22 -${31+distribution(i,4)*53} m20 58 q6 -18 19 -28`} />
          })}</g>
          <path d="M0 284q127-32 224-8t200-9q117 6 216-14v157H0Z" fill="#3b3127"/>
          <path d="M241 281q45-15 82-6t73 2v141H241Z" fill={`url(#${id}-grit)`}/>
          <path d="M281 285q27-10 66-4l-4 18-9 8-2 19-13 8-8-10-3-16-11-6z" fill="#1c1915" opacity=".8"/>
          <ellipse cx="320" cy="279" rx="51" ry="8" fill="#211b16" opacity=".68"/>
          <g className="unearthed-vessel"><g transform="translate(80 -91) scale(1.63)">
            <g clipPath={`url(#${id}-glass)`}><use href={'#'+id+'-photo'}/><path className="buried-slip" d="M135 286l12-19 9 5-12 19z" fill="#d6bd8e" stroke="#958166" strokeWidth=".6"/></g>
            <g className="excavated-cork"><g clipPath={`url(#${id}-cork)`}><use href={'#'+id+'-photo'}/></g></g>
          </g></g>
          <Earth id={id} side="left"/><Earth id={id} side="right"/>
          <g className="flying-fold"><path d="M312 238l18-6 6 10-22 8z" fill="#e8d4ab"/><path d="M312 238l13 1 5-7" fill="none" stroke="#94794f"/></g>
        </svg>
      </button>
      {revealed && <div className="opened-note excavated-letter" ref={note} tabIndex={-1}>{message}</div>}
    </div>
    <figcaption>
      <button ref={action} type="button" disabled={open&&!revealed} onClick={()=>{
        if(revealed){setOpen(false);setRevealed(false);requestAnimationFrame(()=>action.current?.focus({preventScroll:true}))}
        else setOpen(true)
      }}>{revealed?'重新查看':'打开瓶子'}</button>
    </figcaption>
  </figure>
}
