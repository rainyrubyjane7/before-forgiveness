import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const numeric = '一二三四五六七八九'
const allowed = /\.(?:avif|gif|jpe?g|png|webp|mp4|webm|ogv|mov|m4v|mkv|avi|mpeg|mpg|heic|heif|tiff?|bmp)$/i
const skipped = new Set(['node_modules', 'dist', 'work', 'generated_images'])
const sections = [...Array.from({ length: 9 }, (_, i) => `ch0${i + 1}`), 'silence', 'kiss', 'extra', 'cover']
const result = Object.fromEntries(sections.map(section => [section, []]))
const review = { ambiguous: [], unmatched: [], unsupported: [] }

function classify(name) {
  const matches = new Set()
  const base = path.parse(name).name.toLowerCase().normalize('NFKC')
  if (/封面|\bcover\b/.test(base.replaceAll('_', ' '))) matches.add('cover')
  if (/番外|\b(?:extra|epilogue)\b/.test(base.replaceAll('_', ' '))) matches.add('extra')
  if (/结局[\s_-]*(?:0?1|一)(?!\d)|(?<![a-z])ending[\s_-]*0?1(?!\d)/.test(base)) matches.add('silence')
  if (/结局[\s_-]*(?:0?2|二)(?!\d)|(?<![a-z])ending[\s_-]*0?2(?!\d)/.test(base)) matches.add('kiss')
  const chapter = /(?:第[\s_-]*([1-9一二三四五六七八九]|0[1-9])[\s_-]*章|(?:chapter|ch)[\s_-]*(0?[1-9]|[一二三四五六七八九])(?!\d))/g
  for (const match of base.matchAll(chapter)) addChapter(match[1] ?? match[2])
  if (matches.size === 0) {
    const leadingNumber = base.match(/^(0?[1-9])(?=[^0-9])/)
    if (leadingNumber) addChapter(leadingNumber[1])
    for (const match of base.matchAll(/(?:^|[\s_.-])(0?[1-9]|[一二三四五六七八九])(?=$|[\s_.-])/g)) addChapter(match[1])
  }
  function addChapter(value) {
    const index = numeric.indexOf(value) + 1 || Number(value)
    matches.add(`ch0${index}`)
  }
  return [...matches]
}

async function scan(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN', { numeric: true }))) {
    const source = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && !skipped.has(entry.name) && source !== 'public/media/imported') await scan(source)
      continue
    }
    if (!entry.isFile() || !allowed.test(entry.name)) continue
    const extension = path.extname(entry.name).toLowerCase()
    if (!/\.(avif|gif|jpe?g|png|webp|mp4|webm|ogv)$/.test(extension)) {
      review.unsupported.push(source)
      continue
    }
    const sections = classify(entry.name)
    if (sections.length !== 1) {
      review[sections.length ? 'ambiguous' : 'unmatched'].push(source)
      continue
    }
    const [section] = sections
    if (section === 'cover' && /\.(mp4|webm|ogv)$/.test(extension)) {
      review.unsupported.push(source)
      continue
    }
    const url = `media/imported/${section}-${result[section].length + 1}${extension}`
    await copyFile(source, path.join('public', url))
    const video = /\.(mp4|webm|ogv)$/.test(extension)
    result[section].push({ src: url, type: video ? 'video' : 'image', source })
  }
}

await mkdir('public/media/imported', { recursive: true })
await scan('.')
for (const assets of Object.values(result)) {
  assets.sort((a, b) => Number(/封面|页首|hero|poster/i.test(b.source)) - Number(/封面|页首|hero|poster/i.test(a.source)))
}
await writeFile('src/imported-media.json', JSON.stringify(result, null, 2) + '\n')
await writeFile('media-report.json', JSON.stringify({ mapped: result, ...review }, null, 2) + '\n')
console.log('素材映射已更新。详见 media-report.json。')
