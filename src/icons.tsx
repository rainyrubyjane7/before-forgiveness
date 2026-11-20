type Name = 'mark' | 'menu' | 'arrow' | 'down' | 'up' | 'book' | 'note' | 'external' | 'play' | 'pause' | 'back' | 'check'

export function Icon({ name, size = 20 }: { name: Name; size?: number }) {
  const paths: Record<Name, React.ReactNode> = {
    mark: <><path d="M12 2 20 12 12 22 4 12Z"/><path d="M12 6v12M8 12h8"/></>,
    menu: <><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></>,
    arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>,
    back: <path d="M20 12H5m6-6-6 6 6 6"/>,
    down: <path d="M12 4v15m-6-6 6 6 6-6"/>,
    up: <path d="M12 20V5m-6 6 6-6 6 6"/>,
    book: <path d="M12 6c-4-3-8-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-1-1-5-2-9 1v14"/>,
    note: <path d="M9 18V5l12-2v13M9 18c0 1.4-1.5 2.5-3.5 2.5S2 19.4 2 18s1.5-2.5 3.5-2.5S9 16.6 9 18Zm12-2c0 1.4-1.5 2.5-3.5 2.5S14 17.4 14 16s1.5-2.5 3.5-2.5S21 14.6 21 16Z"/>,
    external: <path d="M8 16 19 5M9 5h10v10"/>,
    play: <path d="m8 5 11 7-11 7Z"/>,
    pause: <path d="M9 5v14m6-14v14"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
