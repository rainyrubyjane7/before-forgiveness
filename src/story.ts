import manuscript from './manuscript.json'
import imported from './imported-media.json'

export const chapterIds = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09'] as const
export const endingIds = ['silence', 'kiss'] as const
export type EndingId = typeof endingIds[number]
export type ReadingId = typeof chapterIds[number] | EndingId | 'extra'
export type Route = ReadingId | 'home' | 'contents' | 'choice' | 'bottle' | 'epilogue' | 'credits'
type Framing = { position?: string; mobilePosition?: string; fit?: 'cover' | 'contain'; mobileFit?: 'cover' | 'contain' }
export type Media = Framing & { src: string; type: 'image' | 'video'; poster?: string }
type Music = { song: string; artist?: string; url: string }
type Theme = [ink: string, accent: string, paper: string]
type Settings = { theme: Theme; media?: Media; framing?: Framing; music?: Music; setting: string }

export const title = manuscript.title
export const story = manuscript.sections

const music = {
  ch02: { song: '艾蜜莉', artist: '回春丹', url: 'https://163cn.tv/bluabZ9P' },
  ch05: { song: "Creepin' Up on You", artist: 'Darren Hayes', url: 'https://163cn.tv/blt9XsH0' },
  silence: { song: '道别是一件难事', artist: '上海彩虹室内合唱团', url: 'https://163cn.tv/bluayp0F' },
  kiss: { song: 'Love Me', artist: 'JMSN', url: 'https://163cn.tv/bluab9aR' },
} satisfies Record<string, Music>

export const settings: Record<ReadingId, Settings> = {
  ch01: { theme: ['#e7dcc8', '#aa875a', '#302721'], setting: '教堂内景' },
  ch02: { theme: ['#263e31', '#8a865a', '#eae8d6'], setting: '美式快餐店', music: music.ch02 },
  ch03: { theme: ['#392c45', '#977899', '#ede5f0'], setting: '教堂彩窗' },
  ch04: { theme: ['#e2d8c8', '#a49072', '#222023'], setting: '神父 Dean' },
  ch05: { theme: ['#443922', '#a99052', '#f5e9bb'], setting: '窗边的室内景象', music: music.ch05 },
  ch06: { theme: ['#eee0cb', '#ad8863', '#352b27'], setting: '教堂中殿' },
  ch07: { theme: ['#443d32', '#a49556', '#f6f0d7'], setting: '彩窗下的十字架' },
  ch08: { theme: ['#483733', '#b69578', '#eddfcd'], setting: '车内的 Sam 与 Dean' },
  ch09: { theme: ['#d9d7cb', '#8b8a78', '#222424'], setting: '阴影中的 Dean' },
  silence: { theme: ['#E3E8ED', '#9AA9B6', '#222E3A'], setting: '沉默', music: music.silence },
  kiss: { theme: ['#634832', '#C19A62', '#F6E9D4'], setting: '晨光', music: music.kiss },
  extra: { theme: ['#51402F', '#B49660', '#EDE0C7'], setting: '旧日记忆' },
}

export const coverMedia = (imported.cover as Media[]).find(asset => asset.type === 'image')

export const mediaFor = (id: ReadingId): Media[] => {
  const { media, framing } = settings[id]
  const assets = imported[id] as Media[]
  const ordered = media ? [media, ...assets.filter(asset => asset.src !== media.src)] : assets
  return ordered.map(asset => ({ ...framing, ...asset }))
}

export const source = (file: string) => `${import.meta.env.BASE_URL}${file}`
export const heading = (id: ReadingId) => story[id][endingIds.some(ending => ending === id) ? 1 : 0]
export const shortTitle = (id: ReadingId) => id === 'extra' ? 'Dean 的记忆' : heading(id).split(' ').slice(1).join(' ')
export const readingIds: ReadingId[] = [...chapterIds, ...endingIds, 'extra']
export const routeFromHash = (): Route => {
  const hash = location.hash.slice(1)
  return [...readingIds, 'contents', 'choice', 'bottle', 'epilogue', 'credits'].some(route => route === hash) ? hash as Route : 'home'
}
