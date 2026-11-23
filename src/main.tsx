import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { createRoot } from 'react-dom/client'
import { Icon } from './icons'
import { chapterIds, endingIds, readingIds, coverMedia, heading, mediaFor, routeFromHash, settings, shortTitle, source, story, title } from './story'
import type { EndingId, Media, ReadingId, Route } from './story'
import './style.css'

const storageKey = 'before-forgiveness:v1'
type Checkpoint = { route: Route; scroll: number }
type Progress = { checkpoint: Checkpoint | null; visited: ReadingId[]; finished: EndingId[] }
const emptyProgress: Progress = { checkpoint: null, visited: [], finished: [] }

function readProgress(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    const point = saved?.checkpoint
    const routes = [...readingIds, 'choice', 'bottle', 'epilogue']
    return {
      checkpoint: routes.includes(point?.route) && Number.isFinite(point?.scroll)
        ? { route: point.route, scroll: Math.max(0, point.scroll) } : null,
      visited: Array.isArray(saved?.visited) ? readingIds.filter(id => saved.visited.includes(id)) : [],
      finished: Array.isArray(saved?.finished) ? endingIds.filter(id => saved.finished.includes(id)) : [],
    }
  } catch {
    return emptyProgress
  }
}

function persist(progress: Progress) {
  try { localStorage.setItem(storageKey, JSON.stringify(progress)) } catch { /* Reading remains available. */ }
}

function mediaStyle(media: Media): CSSProperties {
  return {
    '--position': media.position ?? 'center',
    '--mobile-position': media.mobilePosition ?? media.position ?? 'center',
    '--fit': media.fit ?? 'cover',
    '--mobile-fit': media.mobileFit ?? media.fit ?? 'cover',
  } as CSSProperties
}

function SectionOrnament({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`ornament ${className}`}><i /><Icon name="mark" size={24} /><i /></span>
}

function Header({ route }: { route: Route }) {
  return <header className="site-header">
    <a className="brand" href="#home" aria-label={`${title}首页`}><span className="brand-mark"><Icon name="mark" size={24} /></span><span>{title}</span></a>
    <nav aria-label="网站导航">
      {route !== 'home' && <a className="home-link" href="#home">封面</a>}
      <a className="contents-link" href="#contents"><Icon name="menu" size={18} /> 章节目录</a>
    </nav>
  </header>
}

function Directory({ progress }: { progress: Progress }) {
  return <section className="directory" aria-labelledby="contents">
    <div className="directory-heading">
      <div>
        <span className="eyebrow dark-eyebrow"><span /> TABLE OF CONTENTS</span>
        <h2 id="contents" tabIndex={-1}>章节目录</h2>
      </div>
      <span className="directory-note">九章正文 <i /> 双重结局 <i /> 番外</span>
    </div>
    <ol className="chapter-list">
      {chapterIds.map((id, i) => <li key={id}>
        <a href={`#${id}`} className="chapter-row">
          <span className="row-number">{String(i + 1).padStart(2, '0')}</span>
          <span className="row-title">{shortTitle(id)}</span>
          {progress.visited.includes(id) && <span className="visited-mark" aria-label="已访问"><Icon name="check" size={16} /></span>}
          <Icon name="arrow" size={17} />
        </a>
      </li>)}
    </ol>
    <div className="appendix-links">
      <a href="#choice"><span>双重结局</span>选择 <Icon name="arrow" size={16} /></a>
      {progress.finished.length > 0 && <a href="#epilogue"><span>番外</span>Dean 的记忆 <Icon name="arrow" size={16} /></a>}
    </div>
  </section>
}

function Cover({ progress, resume }: { progress: Progress; resume: () => void }) {
  return <section className="cover" id="home" aria-labelledby="cover-title">
    {coverMedia && <img className="cover-image" src={source(coverMedia.src)} style={mediaStyle(coverMedia)} alt="" fetchPriority="high" />}
    <div className="cover-shade" />
    <div className="cover-frame" aria-hidden="true" />
    <div className="cover-copy">
      <h1 id="cover-title" tabIndex={-1}>《{title.slice(0, 3)}<br />{title.slice(3)}》</h1>
      <p className="cover-author">作者：狗点什么</p>
      <div className="cover-actions">
        <a className="button primary" href="#ch01">开始阅读</a>
        {progress.checkpoint && <button className="button quiet" type="button" onClick={resume}>继续阅读</button>}
      </div>
    </div>
  </section>
}

function FeatureMedia({ asset, label }: { asset?: Media; label: string }) {
  const [failed, setFailed] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [videoPaused, setVideoPaused] = useState(true)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const element = video.current
    if (!element) return
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    const updatePlayback = () => {
      if (reducedMotion.matches) element.pause()
      else void element.play().catch(() => {})
    }
    updatePlayback()
    reducedMotion.addEventListener('change', updatePlayback)
    return () => reducedMotion.removeEventListener('change', updatePlayback)
  }, [])

  return <div className="feature-media" style={asset && mediaStyle(asset)}>
    {asset && !failed && (asset.type === 'video'
      ? <>
          <video ref={video} src={source(asset.src)} poster={asset.poster && source(asset.poster)}
            muted loop playsInline preload="metadata" aria-label={label}
            onError={() => setFailed(true)} onPlay={() => setVideoPaused(false)} onPause={() => setVideoPaused(true)} />
          <button className="video-toggle" type="button" onClick={() => {
            if (!video.current) return
            if (video.current.paused) void video.current.play().catch(() => {})
            else video.current.pause()
          }}><Icon name={videoPaused ? 'play' : 'pause'} size={16} />{videoPaused ? '播放视频' : '暂停视频'}</button>
        </>
      : <img src={source(asset.src)} alt={label} onError={() => setFailed(true)} />)}
    {(!asset || failed) && (failed && asset?.type === 'video' && asset.poster && !posterFailed
      ? <img src={source(asset.poster)} alt={label} onError={() => setPosterFailed(true)} />
      : <div className="media-placeholder"><SectionOrnament /><span>{asset ? '素材暂不可用' : '本章素材待上传'}</span></div>)}
  </div>
}

function ChapterMedia({ id }: { id: ReadingId }) {
  const media = mediaFor(id)
  const [active, setActive] = useState(0)
  return <figure className="chapter-media">
    <FeatureMedia key={active} asset={media[active]} label={settings[id].setting} />
    {media.length > 1 && <div className="media-picker" aria-label="章首素材">
      {media.map((asset, i) => <button key={`${asset.src}-${i}`} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>
        {asset.type === 'video' ? '视频' : '图片'} {i + 1}
      </button>)}
    </div>}
  </figure>
}

function Paragraphs({ lines }: { lines: string[] }) {
  return <>{lines.map((line, index) => line === ''
    ? <div key={index} className="paragraph-gap" aria-hidden="true" />
    : /^-{8,}$/.test(line) ? <hr key={index} /> : <p key={index}>{line}</p>)}</>
}

function Reading({ id, finish }: { id: ReadingId; finish: (id: EndingId) => void }) {
  const chapter = chapterIds.findIndex(candidate => candidate === id)
  const ending = endingIds.findIndex(candidate => candidate === id)
  const { music, theme: [ink, accent, paper] } = settings[id]
  const theme = { '--ink': ink, '--accent': accent, '--paper': paper } as CSSProperties
  const previous = chapter > 0 ? chapterIds[chapter - 1] : chapter === 0 ? 'home' : id === 'extra' ? 'epilogue' : 'choice'
  const next = chapter >= 0 && chapter < 8 ? chapterIds[chapter + 1] : 'choice'
  const previousText = chapter > 0 ? `上一章 · ${shortTitle(chapterIds[chapter - 1])}` : chapter === 0 ? '返回封面' : id === 'extra' ? '返回番外入口' : '返回选择'
  const nextText = chapter >= 0 && chapter < 8 ? `下一章 · ${shortTitle(chapterIds[chapter + 1])}` : '进入选择'
  return <article className={`reading reading-${id}`} style={theme}>
    <div className="reading-inner">
      <header className="chapter-heading">
        <SectionOrnament />
        <p className="eyebrow">{chapter >= 0 ? `CHAPTER ${chapter + 1}` : ending >= 0 ? `ENDING 0${ending + 1}` : 'EPILOGUE'}</p>
        <h1 tabIndex={-1}>{shortTitle(id)}</h1>
        {id === 'extra' && <p className="extra-subtitle">{heading(id).split('——')[1]}</p>}
      </header>
      {chapter >= 0 && <ChapterMedia id={id} />}
      {music && <a className="music-card" href={music.url} target="_blank" rel="noopener noreferrer">
        <span className="music-icon"><Icon name="note" /></span>
        <span className="music-details"><small className="music-label">{chapter >= 0 ? `CHAPTER ${chapter + 1}` : `ENDING ${ending + 1}`} · {shortTitle(id)}</small><strong>{music.song}</strong>{music.artist && <small>{music.artist}</small>}</span>
        <span className="music-link">前往网易云音乐收听 <Icon name="external" size={16} /></span>
      </a>}
      <div className="prose"><Paragraphs lines={story[id].slice(ending >= 0 ? 2 : 1)} />{id === 'extra' && <Bottle />}</div>
      <SectionOrnament className="end-ornament" />
      <nav className="reading-nav" aria-label="阅读导航">
        <a className="button quiet" href={`#${previous}`}><Icon name="back" size={17} /> {previousText}</a>
        {chapter >= 0 && <a className="button primary" href={`#${next}`}>{nextText} <Icon name="arrow" size={17} /></a>}
        {ending >= 0 && <button className="button primary" type="button" onClick={() => finish(endingIds[ending])}>读完结局，前往番外</button>}
      </nav>
      <button type="button" className="top-link" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>返回顶部 <Icon name="up" size={16} /></button>
    </div>
  </article>
}

function Choice({ unlocked }: { unlocked: boolean }) {
  const choicePrompt = story.choice[0].replace('Dean', ' Dean ')
  const [pause, prompt] = choicePrompt.split('，')
  return <section className="immersive choice">
    <div className="immersive-inner">
      <SectionOrnament />
      <h1 tabIndex={-1} aria-label={choicePrompt}><span>{pause}，</span><span>{prompt}</span></h1>
      <div className="choice-quote"><Paragraphs lines={story.choice.slice(1)} /></div>
      <div className="choice-links">
        {endingIds.map(id => <a key={id} className="button" href={`#${id}`}>{story[id][0].replace(/。$/, '')}<Icon name="arrow" size={19} /></a>)}
      </div>
      <a className="subtle-link" href="#ch09"><Icon name="back" size={16} /> 返回第九章</a>
      {unlocked && <a className="subtle-link" href="#epilogue">前往番外入口</a>}
    </div>
  </section>
}

function Bottle() {
  const [open, setOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const note = useRef<HTMLDivElement>(null)
  const bottle = useRef<HTMLButtonElement>(null)
  const message = story.bottle[1].slice(1, -1).replace('Sammy', ' Sammy ')
  const reference = new URL(source('media/bottle.webp'), document.baseURI).href

  useEffect(() => {
    if (!open) return
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1320
    const timer = window.setTimeout(() => setRevealed(true), delay)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => { if (revealed) note.current?.focus() }, [revealed])

  return <figure className={`bottle-page ${open ? 'bottle-open' : ''}`}>
    <div className="bottle-stage" style={{ '--bottle-reference': `url("${reference}")` } as CSSProperties}>
      <button className="bottle-object" ref={bottle} type="button" aria-label={story.bottle[0]} disabled={open} onClick={() => setOpen(true)}>
        <span className="cork" /><span className="neck" />
        <span className="glass"><span className="folded-note" /></span>
      </button>
      <div className="rising-note" aria-hidden="true" />
      {revealed && <div className="opened-note" ref={note} tabIndex={-1}>{message}</div>}
    </div>
    <figcaption className="bottle-actions">
      {!open && <button type="button" className="button primary" onClick={() => setOpen(true)}>打开瓶子</button>}
      {revealed && <button type="button" className="button quiet" onClick={() => { setRevealed(false); setOpen(false); requestAnimationFrame(() => bottle.current?.focus()) }}>重新查看</button>}
    </figcaption>
  </figure>
}

function Epilogue() {
  const [failed, setFailed] = useState(false)
  return <section className="immersive epilogue">
    <div className="immersive-inner">
      <SectionOrnament />
      <h1 tabIndex={-1}>番外 · Dean 的记忆</h1>
      <video src={source('media/end.mp4')} preload="metadata" controls playsInline aria-label="番外入口视频" onError={() => setFailed(true)} />
      {failed && <p role="status">视频暂时无法播放。<a href={source('media/end.mp4')}>打开视频文件</a></p>}
      <div className="choice-links">
        <a className="button primary" href="#extra">进入番外</a>
        <a className="button quiet" href="#choice">返回结局选择</a>
      </div>
    </div>
  </section>
}

function readingRoute(progress: Progress): Route {
  const route = routeFromHash()
  if (route === 'bottle' || route === 'extra' || route === 'epilogue') {
    if (progress.finished.length === 0) return 'choice'
    if (route === 'bottle') return 'extra'
  }
  return route
}

function App() {
  const [progress, setProgress] = useState(readProgress)
  const [route, setRoute] = useState(() => readingRoute(progress))
  const checkpoint = useRef(progress.checkpoint)
  const pendingRestore = useRef(checkpoint.current?.route === route ? checkpoint.current.scroll : 0)
  const main = useRef<HTMLElement>(null)
  const isReading = (id: Route): id is ReadingId => readingIds.includes(id as ReadingId)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    const onHash = () => setRoute(readingRoute(readProgress()))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useLayoutEffect(() => {
    const scrollTarget = pendingRestore.current
    pendingRestore.current = 0
    const visiting = isReading(route) || route === 'choice' || route === 'epilogue'
    if (route === 'contents') {
      const directory = document.getElementById('contents')
      directory?.focus({ preventScroll: true })
      directory?.scrollIntoView({ block: 'start', behavior: 'instant' })
    } else {
      main.current?.querySelector('h1')?.focus({ preventScroll: true })
      window.scrollTo({ top: scrollTarget, behavior: 'instant' })
    }

    let current = readProgress()
    if (visiting) {
      current = {
        ...current,
        checkpoint: { route, scroll: window.scrollY },
        visited: isReading(route) && !current.visited.includes(route) ? [...current.visited, route] : current.visited,
      }
      persist(current)
    }
    checkpoint.current = current.checkpoint
    setProgress(current)
    if (!visiting) return

    const save = () => {
      current = { ...current, finished: readProgress().finished, checkpoint: { route, scroll: window.scrollY } }
      checkpoint.current = current.checkpoint
      persist(current)
    }
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(save)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', save)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', save)
    }
  }, [route])

  useEffect(() => {
    document.title = isReading(route) ? `${shortTitle(route)} · ${title}` : `${title} · Before Forgiveness`
  }, [route])

  function resume() {
    if (!checkpoint.current) return
    pendingRestore.current = checkpoint.current.scroll
    const target = checkpoint.current.route
    location.hash = target === 'bottle' ? 'extra' : target
  }

  function finish(id: EndingId) {
    const current = readProgress()
    persist({ ...current, finished: endingIds.filter(ending => ending === id || current.finished.includes(ending)) })
    location.hash = 'epilogue'
  }

  return <>
    {route !== 'home' && <Header route={route} />}
    <main ref={main} key={route} className="scene">
      {route === 'home' && <Cover progress={progress} resume={resume} />}
      {route === 'contents' && <Directory progress={progress} />}
      {isReading(route) && <Reading id={route} finish={finish} />}
      {route === 'choice' && <Choice unlocked={progress.finished.length > 0} />}
      {route === 'epilogue' && <Epilogue />}
    </main>
    {route !== 'home' && <footer className="site-footer"><Icon name="mark" size={18} /><span>{title}</span><a href="#contents">返回目录</a></footer>}
  </>
}

createRoot(document.getElementById('root')!).render(<App />)
