// Everything the owner can change in owner mode ("light editing"), with the demo defaults.
// Text visitors read is stored per language; the owner edits the language they're viewing.
import type { Localized, Strings } from './i18n/strings'

export type Compartment = 'nasi' | 'lauk' | 'sayur' | 'buah' | 'pelengkap'

/** The stainless tray (ompreng): nasi gets the big compartment. Labels live in i18n/strings.ts. */
export const COMPARTMENTS: Compartment[] = ['nasi', 'lauk', 'sayur', 'buah', 'pelengkap']

/** School days, 1 = Monday … 5 = Friday (same numbering as Date.getDay). */
export type Weekday = 1 | 2 | 3 | 4 | 5
export const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5]

export type DayMenu = Record<Compartment, Localized>
export type WeeklyMenu = Record<Weekday, DayMenu>

/** 0 = Sunday … 6 = Saturday; null = closed. Times are 24h "HH:MM". */
export type OpeningHours = Record<number, [string, string] | null>

export interface SiteContent {
  headline: Localized
  lead: Localized
  /** Rupiah per portion (one tray). */
  price: number
  /** Minimum portions per delivery day. */
  minOrder: number
  delivery: [string, string]
  deadline: Localized
  menu: WeeklyMenu
  hours: OpeningHours
  address: Localized
  photos: Record<string, string>
  /** ISO time of the owner's last save, shown in the footer. */
  updatedAt: string | null
}

/** The localized fields owner mode edits with `updateText`. */
export type TextKey = 'headline' | 'lead' | 'deadline' | 'address'

const dish = (id: string, en: string): Localized => ({ id, en })

export const DEFAULT_CONTENT: SiteContent = {
  headline: { id: 'Makan siang sehat untuk sekolah', en: 'Healthy lunches for schools' },
  lead: {
    id: 'Dimasak pagi hari di dapur kami, diantar hangat ke sekolah dalam ompreng stainless. Lengkap nasi, lauk, sayur, buah dan pelengkap.',
    en: 'Cooked every morning in our kitchen and delivered warm to schools in stainless-steel trays. Rice, a main, vegetables, fruit and a side in every tray.',
  },
  price: 15_000,
  minOrder: 30,
  delivery: ['10:30', '11:30'],
  deadline: { id: 'H-1, sebelum pukul 14.00', en: 'the day before, by 14:00' },
  menu: {
    1: { nasi: dish('Nasi putih', 'Steamed rice'), lauk: dish('Ayam goreng lengkuas', 'Galangal fried chicken'), sayur: dish('Tumis buncis wortel', 'Green beans & carrots'), buah: dish('Pisang', 'Banana'), pelengkap: dish('Tempe goreng', 'Fried tempeh') },
    2: { nasi: dish('Nasi putih', 'Steamed rice'), lauk: dish('Telur balado', 'Eggs in chilli sauce'), sayur: dish('Sayur sop', 'Vegetable soup'), buah: dish('Semangka', 'Watermelon'), pelengkap: dish('Perkedel kentang', 'Potato fritter') },
    3: { nasi: dish('Nasi kuning', 'Turmeric rice'), lauk: dish('Ayam suwir bumbu kuning', 'Shredded turmeric chicken'), sayur: dish('Tumis kangkung', 'Stir-fried water spinach'), buah: dish('Jeruk', 'Orange'), pelengkap: dish('Kering tempe', 'Crispy sweet tempeh') },
    4: { nasi: dish('Nasi putih', 'Steamed rice'), lauk: dish('Ikan dori saus tomat', 'Dory fish in tomato sauce'), sayur: dish('Capcay', 'Mixed veg stir-fry'), buah: dish('Melon', 'Melon'), pelengkap: dish('Tahu bacem', 'Sweet braised tofu') },
    5: { nasi: dish('Nasi uduk', 'Coconut rice'), lauk: dish('Semur daging', 'Beef in sweet soy'), sayur: dish('Urap sayur', 'Veg with spiced coconut'), buah: dish('Pepaya', 'Papaya'), pelengkap: dish('Bakwan jagung', 'Corn fritters') },
  },
  hours: {
    0: null,
    1: ['05:00', '15:00'],
    2: ['05:00', '15:00'],
    3: ['05:00', '15:00'],
    4: ['05:00', '15:00'],
    5: ['05:00', '15:00'],
    6: ['06:00', '12:00'],
  },
  address: { id: 'Jl. Kenanga No. 8, Coblong, Bandung (alamat demo)', en: 'Jl. Kenanga No. 8, Coblong, Bandung (demo address)' },
  photos: {},
  updatedAt: null,
}

/** Saved edits on top of the defaults, so content added later still shows up. */
export function mergeContent(saved: Partial<SiteContent>): SiteContent {
  const menu = { ...DEFAULT_CONTENT.menu }
  for (const day of WEEKDAYS) menu[day] = { ...DEFAULT_CONTENT.menu[day], ...saved.menu?.[day] }
  return { ...DEFAULT_CONTENT, ...saved, menu }
}

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
/** Always Indonesian formatting (Rp 15.000): it's a rupiah price in both languages. */
export const formatRupiah = (value: number) => rupiah.format(value)

/** Current time in West Indonesia, so the site reads the same for every visitor. */
export function jakartaNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
}

/** Today's school day, or Monday on weekends. */
export function todaySchoolDay(): Weekday {
  const day = jakartaNow().getDay()
  return day >= 1 && day <= 5 ? (day as Weekday) : 1
}

const toMinutes = (time: string) => { const [h, m] = time.split(':').map(Number); return h * 60 + m }

export function openStatus(hours: OpeningHours, t: Strings, now = jakartaNow()): { open: boolean; label: string } {
  const minutes = now.getHours() * 60 + now.getMinutes()
  const today = hours[now.getDay()]
  if (today && minutes >= toMinutes(today[0]) && minutes < toMinutes(today[1])) {
    return { open: true, label: t.status.openUntil(t.time(today[1])) }
  }
  for (let offset = 0; offset < 7; offset++) {
    const day = (now.getDay() + offset) % 7
    const slot = hours[day]
    if (slot && (offset > 0 || minutes < toMinutes(slot[0]))) {
      const when = offset === 0 ? t.status.today : offset === 1 ? t.status.tomorrow : t.days[day]
      return { open: false, label: t.status.closedOpens(when, t.time(slot[0])) }
    }
  }
  return { open: false, label: t.status.closed }
}
