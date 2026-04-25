import countries from '@/data/countries.json'

export function setRandomFlagFavicon() {
  const code = countries[Math.floor(Math.random() * countries.length)]!.code
  const emoji = code.toUpperCase().split('').map(
    c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('')

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
