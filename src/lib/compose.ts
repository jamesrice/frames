import { WORLD } from '../data/world'
import type { Option } from '../data/world'

export interface ComposeInput {
  text: Record<string, string>
  selections: Record<string, string | null>
}

function lc(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function cap(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function stripPeriod(value: string): string {
  return value.endsWith('.') ? value.slice(0, -1) : value
}

function selectedOption(selections: Record<string, string | null>, fieldId: string): Option | null {
  for (const section of WORLD.sections) {
    for (const field of section.fields) {
      if (field.kind === 'text' || field.id !== fieldId) continue
      const optionId = selections[fieldId]
      if (!optionId) return null
      return field.options.find((option) => option.id === optionId) ?? null
    }
  }
  return null
}

/**
 * Expands the builder's token selections into a full director-style prompt.
 * Deterministic templates only — no network, no AI. Sentence order:
 * framing -> camera/film -> light -> environment -> era -> style/closing.
 */
export function composePrompt({ text, selections }: ComposeInput): string {
  const get = (fieldId: string) => selectedOption(selections, fieldId)
  const txt = (fieldId: string) => text[fieldId]?.trim() ?? ''

  const framing = get('framing')
  const angle = get('cameraAngle')
  const moment = get('humanMoment')
  const style = get('style')
  const timeOfDay = get('timeOfDay')
  const light = get('light')
  const body = get('cameraBody')
  const dof = get('depthOfField')
  const stock = get('filmStock')
  const grain = get('grain')
  const scan = get('filmScan')
  const era = get('era')
  const wardrobe = get('wardrobe')
  const signage = get('signage')
  const vehicles = get('vehicles')
  const streetLife = get('streetLife')

  const subject = txt('subject')
  const environment = txt('environment')
  const action = txt('action')
  const atmosphere = txt('lightAtmosphere')

  const sentences: string[] = []

  // 1. Framing + subject + action + human moment
  {
    const frameBits: string[] = []
    if (framing) frameBits.push(framing.name.toLowerCase())
    if (angle) frameBits.push(lc(angle.phrase))
    const opening = frameBits.length > 0 ? `Framing: ${frameBits.join(', ')}` : ''

    const sceneBits: string[] = []
    if (subject) sceneBits.push(stripPeriod(subject))
    if (action) sceneBits.push(lc(stripPeriod(action)))
    if (moment) sceneBits.push(moment.phrase)
    const scene = sceneBits.join(', ')

    if (opening && scene) sentences.push(`${opening} — ${scene}.`)
    else if (opening) sentences.push(`${opening}.`)
    else if (scene) sentences.push(`${cap(scene)}.`)
  }

  // 2. Camera + film pipeline
  {
    const bits: string[] = []
    if (body) bits.push(cap(body.phrase))
    if (stock) {
      const stockClause = `${lc(stock.phrase)} — ${lc(stripPeriod(stock.description))}`
      bits.push(bits.length > 0 ? stockClause : cap(stockClause))
    }
    let sentence = bits.join(' ')
    const tail: string[] = []
    if (dof) tail.push(dof.phrase)
    if (grain) tail.push(`${grain.phrase} carrying the texture`)
    if (scan) tail.push(`finished as a ${scan.name.toLowerCase()} scan, ${lc(stripPeriod(scan.description))}`)
    if (sentence && tail.length > 0) sentence += `; ${tail.join(', ')}`
    else if (tail.length > 0) sentence = cap(tail.join(', '))
    if (sentence) sentences.push(`${sentence}.`)
  }

  // 3. Light — skip the time-of-day phrase when the light option already names it
  {
    const bits: string[] = []
    const redundantTime =
      timeOfDay && light ? light.phrase.toLowerCase().includes(timeOfDay.name.toLowerCase()) : false
    if (timeOfDay && !redundantTime) bits.push(cap(timeOfDay.phrase))
    if (light) {
      const lightClause = `${lc(light.phrase)} — ${lc(stripPeriod(light.description))}`
      bits.push(bits.length > 0 ? lightClause : cap(lightClause))
    }
    let sentence = bits.join(', ')
    if (atmosphere) {
      const atmoClause = lc(stripPeriod(atmosphere))
      sentence = sentence ? `${sentence}; ${atmoClause}` : cap(atmoClause)
    }
    if (sentence) sentences.push(`${sentence}.`)
  }

  // 4. Environment + street dressing
  {
    const bits: string[] = []
    if (environment) bits.push(cap(stripPeriod(environment)))
    if (streetLife) bits.push(bits.length > 0 ? streetLife.phrase : cap(streetLife.phrase))
    if (signage) bits.push(signage.phrase)
    if (vehicles) bits.push(vehicles.phrase)
    if (bits.length > 0) sentences.push(`${bits.join(', ')}.`)
  }

  // 5. Era lock
  {
    if (era) {
      let sentence = `Every visible detail holds to the period — ${lc(era.phrase)}, ${lc(stripPeriod(era.description))}`
      if (wardrobe) sentence += `; subject ${lc(wardrobe.phrase)}, ${lc(stripPeriod(wardrobe.description))}`
      sentences.push(`${sentence}.`)
    } else if (wardrobe) {
      sentences.push(`Subject ${lc(wardrobe.phrase)} — ${lc(stripPeriod(wardrobe.description))}.`)
    }
  }

  // 6. Style closer
  {
    if (style) {
      sentences.push(`${style.name} throughout: ${lc(stripPeriod(style.description))}.`)
    }
  }

  return sentences.join(' ')
}
