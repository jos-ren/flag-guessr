import countries from '@/data/countries.json'

function applyFavicon(emoji: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')!
  ctx.font = '26px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, 16, 17)

  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement('link')
  link.rel = 'icon'
  link.href = canvas.toDataURL()
  if (!link.parentNode) document.head.appendChild(link)
}

export function setFlagFavicon(code: string) {
  const country = countries.find(c => c.code === code)
  if (country) applyFavicon(country.emoji)
}

export function setRandomFlagFavicon() {
  const country = countries[Math.floor(Math.random() * countries.length)]!
  applyFavicon(country.emoji)
}
