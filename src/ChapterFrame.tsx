import type { ReactNode } from 'react'
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
const corners = [[64,42,0],[656,42,90],[656,478,180],[64,478,270]]
const beading = (x:number,y:number,w:number,h:number,color:string) => <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth="4" strokeDasharray="1 6" strokeLinecap="round"/>
function Vines() {
  return <g fill="none" stroke="#727449" strokeWidth="2">
    {[false,true].map(mirror=><g key={String(mirror)} transform={mirror?'translate(720 0) scale(-1 1)':undefined}>
      <path d="M225 492Q50 491 60 362T67 170Q21 43 217 30M50 330q-25-48 1-74t9-72m27-95q-12-40 36-53"/>
      {Array.from({length:19},(_,i)=>{
        const y=62+i*22, x=54+Math.sin(i*.55)*10+(i===0?40:0);
        return <g key={i} transform={`translate(${x},${y}) rotate(${i%2?15:-25})`}><path d={i%2?'M0 0q-25-1-28-19Q-8-19 0 0z':'M0 0q8-27 23-27Q23-8 0 0z'} fill={i%3?'#a4a471':'#737951'}/>{i%4===1&&<g fill="#fff5c9" stroke="#a29b66" strokeWidth="1">{[0,72,144,216,288].map(a=><ellipse key={a} cy="-5" rx="3.5" ry="6" transform={`rotate(${a})`}/>)}</g>}</g>
      })}
    </g>)}
  </g>
}
function Material({id}: {id:string}) {
  switch(id) {
    case 'ch01': return <><rect x="60" y="38" width="600" height="444" fill="url(#folio-walnut)" stroke="#1a110b" strokeWidth="10"/>{[9,16,29].map(d=><rect key={d} x={60+d} y={38+d} width={600-d*2} height={444-d*2} fill="none" stroke={d===16?'#492a19':'#af8851'} strokeWidth={d===16?8:2}/>)}{beading(83,61,554,398,'#b49361')}{corners.map(([x,y,a])=><path key={a} transform={`translate(${x} ${y}) rotate(${a})`} d="M1 1h64q-30 1-42 15 14-5 18 3-17 3-23 13-9-7-3-17Q4 25 1 63z" fill="#b79055" stroke="#573a22"/>)}</>
    case 'ch02': return <><rect x="36" y="23" width="644" height="473" fill="url(#folio-check)" transform="rotate(-2 360 260)"/><rect x="92" y="44" width="536" height="432" rx="62" fill="url(#folio-glaze)" stroke="#c7bea2" strokeWidth="3"/><rect x="105" y="56" width="510" height="405" rx="51" fill="none" stroke="#51684d" strokeWidth="2"/><rect x="110" y="61" width="500" height="395" rx="46" fill="none" stroke="#98a183"/><rect x="140" y="88" width="440" height="343" rx="24" fill="#d3cbb1" stroke="#ece6cd" strokeWidth="9"/></>
    case 'ch03': return <><path d="M0 0h144q-12 190-83 322L33 520H0zm720 0H576q12 190 83 322l28 198h33z" fill="url(#folio-velvet)"/><path d="M92 480V194Q112 88 360 13q248 75 268 181v286z" fill="url(#folio-lights)" stroke="#48414c" strokeWidth="9"/><path d="M107 463V199Q114 105 360 28q245 77 253 171v264z" fill="none" stroke="#d2b372" strokeWidth="3"/><g fill="none" stroke="#635563" strokeWidth="4"><path d="M145 175q45-71 111-101l104 97L464 74q64 30 111 101M360 24v148M203 119l47 52m266-52-47 52"/><circle cx="360" cy="105" r="38"/><path d="m360 66 27 39-27 39-27-39z"/></g></>
    case 'ch04': return <><rect x="26" y="65" width="669" height="399" rx="4" fill="#452628" stroke="#1d1719" strokeWidth="7"/><path d="M40 64q83-21 153 5 220-31 486-3v383q-273-19-486 4-78-20-153-5z" fill="url(#folio-leaves)" stroke="#856b50" strokeWidth="3"/><path d="M44 58q77-20 149 7 225-32 481-6v376q-265-19-481 5-80-23-149-4z" fill="url(#folio-page)"/><path d="M193 65v376" stroke="#503a2b" strokeWidth="5"/><g stroke="#83693f" fill="none"><ellipse cx="117" cy="248" rx="50" ry="69"/><ellipse cx="117" cy="248" rx="43" ry="61"/><path d="m117 189 37 92H80zm0 117-38-92h75z"/><circle cx="117" cy="248" r="18"/></g><path d="M217 425v60l11-10 12 7v-58" fill="#773a39"/></>
    case 'ch05': return <><path d="m267 418-11 46-52 17v15h312v-15l-52-17-11-46z" fill="url(#folio-glaze)" stroke="#867e60" strokeWidth="3"/><rect x="75" y="25" width="570" height="416" rx="28" fill="url(#folio-plastic)" stroke="#8d876d" strokeWidth="4"/><rect x="100" y="48" width="520" height="350" rx="27" fill="#4a493c" stroke="#aaa38c" strokeWidth="8"/>{Array.from({length:14},(_,i)=><path key={i} d={`M${115+i*8} 405v15`} stroke="#938b72" strokeWidth="4"/>)}<rect x="551" y="402" width="32" height="17" rx="5" fill="#b9b29c" stroke="#8e8772"/><circle cx="600" cy="410" r="4" fill="#778c44"/></>
    case 'ch06': return <><path d="m47 77 618-46 9 432-628 18z" fill="#231d17"/><rect x="72" y="59" width="576" height="395" fill="url(#folio-walnut)" stroke="#413021" strokeWidth="6"/><rect x="96" y="82" width="528" height="346" fill="none" stroke="#a98956" strokeWidth="4"/><path d="m44 450 626-7 26 26-672 13z" fill="#785338" stroke="#402a1b" strokeWidth="4"/><path d="m31 478 660-11" stroke="#bd9867" strokeWidth="2"/></>
    case 'ch07': return <><rect x="58" y="44" width="604" height="425" fill="#f4f0d9" stroke="#b0ab7e" strokeWidth="2"/><rect x="73" y="57" width="574" height="400" fill="none" stroke="#aa9c60" strokeDasharray="12 3 2 3"/></>
    case 'ch08': return <><path d="M61 54q112 17 285 4 169 13 314-12-10 54-7 105 18 185 7 313-75-12-131-8-261 20-468 2 14-113 1-208Q70 125 61 54z" fill="url(#folio-linen)" stroke="#876950" strokeWidth="3"/><g fill="url(#folio-puff)">
      <path d="M65 56Q198 77 348 59q179 12 307-10l-72 68q-216 12-443 0z"/>
      <path d="M64 458q233 15 465-4l129 9-73-62q-223 12-447 0z"/>
      <path d="M61 56q14 109 0 402l79-55q-8-162 0-287z"/>
      <path d="M657 51q-13 91-1 199l2 208-74-57q10-164-1-283z"/>
    </g><g fill="none" stroke="#846953" strokeWidth="1.2" opacity=".62">
      {[0,1,2,3,4,5].map(i=><g key={i}><path d={`M${72+i*7} ${68+i*2}q20 4 47 ${27-i*2}m${443-i*3} ${327-i*2}q40 12 69 43`}/><path d={`M${640-i*6} ${70+i}q-21 5-41 29M${75+i*4} ${442-i}q28-10 51-31`}/></g>)}
    </g><path d="M76 70q120 14 270 3 163 12 298-11-8 168 3 382-197 15-570-1 9-133 0-373z" fill="none" stroke="#efe0c0" strokeDasharray="5 4" strokeWidth="2"/><path d="M70 62q44 20 69 53m510-59q-36 23-62 65M70 450q39-27 69-36m512 40q-39-35-63-36" stroke="#9e816c" strokeWidth="5" fill="none"/></>
    default: return <><rect x="73" y="39" width="574" height="443" fill="#222628" stroke="#080b0d" strokeWidth="11"/><rect x="85" y="51" width="550" height="419" stroke="#636b69" fill="none"/>{[97,623].map(x=>[65,454].map(y=><g key={x+'-'+y}><circle cx={x} cy={y} r="7" fill="#404644"/><path d={`m${x-3} ${y+2} 6-4`} stroke="#151718"/></g>))}</>
  }
}
function Patterns() {
  return <defs>
    <pattern id="folio-walnut" width="150" height="17" patternUnits="userSpaceOnUse"><rect width="150" height="17" fill="#5b3c29"/><path d="M-10 4q46-7 82 2t93-3M0 13q34 4 62-1t92 0" stroke="#352319" fill="none"/><path d="M2 9q62-5 100 1t59 0" stroke="#80583a" fill="none"/></pattern>
    <pattern id="folio-check" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#e0d5b0"/><path d="M0 4.5h18M4.5 0v18" stroke="#638166" opacity=".54" strokeWidth="9"/></pattern>
    <linearGradient id="folio-glaze" x2=".7" y2="1"><stop stopColor="#fffce7"/><stop offset=".44" stopColor="#f2edda"/><stop offset=".86" stopColor="#d4cdb4"/><stop offset="1" stopColor="#a7a58d"/></linearGradient>
    <pattern id="folio-velvet" width="38" height="20" patternUnits="userSpaceOnUse"><rect width="38" height="20" fill="#5c424f"/><path d="M9 0v20" stroke="#745565" strokeWidth="11"/><path d="M31 0v20" stroke="#48343f" strokeWidth="6"/></pattern>
    <pattern id="folio-lights" width="66" height="76" patternUnits="userSpaceOnUse"><rect width="66" height="76" fill="#a7a5ba"/><path d="m33 0 33 38-33 38L0 38z" fill="#b68a9b" stroke="#615665" strokeWidth="3"/><path d="m33 9 24 29-24 29L9 38z" fill="#dab899"/><path d="m0 0 32 0L0 35z" fill="#a2beb0"/></pattern>
    <pattern id="folio-leaves" width="4" height="5" patternUnits="userSpaceOnUse"><rect width="4" height="5" fill="#c3ad89"/><path d="M0 1h4" stroke="#7e6b54"/></pattern>
    <linearGradient id="folio-page"><stop stopColor="#ddc59f"/><stop offset=".17" stopColor="#e1caa5"/><stop offset=".26" stopColor="#886c4d"/><stop offset=".33" stopColor="#ead5ad"/><stop offset="1" stopColor="#d8be99"/></linearGradient>
    <linearGradient id="folio-plastic" x2=".35" y2="1"><stop stopColor="#eee7c9"/><stop offset=".57" stopColor="#d7d1b6"/><stop offset="1" stopColor="#b2ac92"/></linearGradient>
    <linearGradient id="folio-puff" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6c5042" stopOpacity=".46"/><stop offset=".16" stopColor="#f9e9d1" stopOpacity=".68"/><stop offset=".55" stopColor="#e7d3ba" stopOpacity=".36"/><stop offset="1" stopColor="#6c5042" stopOpacity=".46"/></linearGradient>
    <pattern id="folio-linen" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#ceb8a2"/><path d="M0 2h7" stroke="#a98f79"/><path d="M2 0v7" stroke="#e1cbb3" opacity=".8"/></pattern>
  </defs>
}
export function ChapterFrame({id, children}: {id:string; children:ReactNode}) {
  return <div className={`folio-scene folio-${id}`}>
    <svg className="folio-shell" viewBox="0 0 720 520" aria-hidden="true"><Patterns/><Material id={id}/></svg>
    <div className="folio-photo">{children}</div>
    <svg className="folio-detail" viewBox="0 0 720 520" aria-hidden="true">
      {id==='ch07' && <Vines/>}
      {id==='ch06' && <><path d="M131 88h97L116 311v-96zm119 0h17L116 377v-36z" fill="#ffe5a1" opacity=".14"/><path d="M116 162h488m-365-67v316" stroke="#35271c" strokeWidth="9"/><path d="M116 157h488m-370-61v314" stroke="#bb9362" strokeWidth="2"/></>}
      {id==='ch09' && <g stroke="#282d30" fill="none">{[149,230,489,571].map(x=><path key={x} d={`M${x} 73v369`} strokeWidth="8"/>)}{[130,380].map(y=><path key={y} d={`M104 ${y}h510`} strokeWidth="7"/>)}<rect x="558" y="355" width="29" height="43" rx="3" fill="#585541"/><path d="M563 355v-8a10 10 0 0 1 20 0v8" strokeWidth="5"/><path d="M573 370v11" strokeWidth="4"/></g>}
    </svg>
  </div>
}
