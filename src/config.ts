// Fixed business details. Content the owner can change (menu, prices, hours…) lives in content.ts.

export const business = {
  name: 'Makanan Bikin Gemuk',
  /**
   * Fictional STOEDIO demo: shows the "Demo by STOEDIO" strip and WhatsApp buttons preview the
   * message instead of opening it. Set to false (and fill in `whatsapp`) for a real kitchen.
   */
  demo: true,
  whatsapp: '', // international format without "+", e.g. '6281234567890'
  phoneDisplay: '0812-0000-0000 (demo)',
  email: 'halo@makananbikingemuk.id',
  mapQuery: 'Coblong, Bandung',
} as const

export const stoedio = {
  url: 'https://stoedio.com',
  whatsapp: '6282160562558',
  instagram: 'stoedioofficial',
} as const

export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
