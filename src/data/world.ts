export interface Option {
  id: string
  name: string
  description: string
  phrase: string
}

export interface TextField {
  kind: 'text'
  id: string
  label: string
  hint: string
  placeholder: string
}

export interface OptionsField {
  kind: 'options'
  id: string
  label: string
  options: Option[]
}

export type Field = TextField | OptionsField

export type SectionKind = 'presets' | 'text' | 'options'

export interface Section {
  id: string
  number: string
  title: string
  subtitle: string
  kind: SectionKind
  fields: Field[]
}

export interface Preset {
  id: string
  name: string
  specString: string
  tileColor: 'aqua' | 'blue' | 'red' | 'orange'
  selections: Record<string, string>
}

export interface World {
  id: string
  name: string
  eyebrow: string
  subline: string
  presets: Preset[]
  sections: Section[]
}

export const WORLD: World = {
  id: 'rangefinder-city',
  name: 'The Rangefinder City',
  eyebrow: 'World 01 — Rangefinder',
  subline:
    'Grain, glass, and the hour before the light goes. Build a prompt for photographs that feel remembered, not staged.',
  presets: [
    {
      id: 'golden-hour-portrait',
      name: 'Golden Hour Portrait',
      specString: 'Leica M6 · f/2.8 · Portra 400',
      tileColor: 'aqua',
      selections: {
        humanMoment: 'caught-mid-laugh',
        style: 'documentary-realism',
        light: 'golden-hour-spill',
        composition: 'rule-of-thirds',
        cameraBody: 'leica-m6',
        depthOfField: 'shallow-f2-8',
        filmStock: 'portra-400',
        grain: 'fine',
      },
    },
    {
      id: 'neon-noir-street',
      name: 'Neon Noir Street',
      specString: 'Contax T2 · f/2.8 · Cinestill 800T',
      tileColor: 'blue',
      selections: {
        humanMoment: 'stolen-glance',
        style: 'high-contrast-noir',
        light: 'neon-wet-street',
        composition: 'leading-lines',
        cameraBody: 'contax-t2',
        depthOfField: 'shallow-f2-8',
        filmStock: 'cinestill-800t',
        grain: 'pronounced',
      },
    },
    {
      id: 'sun-bleached-memory',
      name: 'Sun-Bleached Memory',
      specString: 'Nikon FM2 · f/5.6 · Superia 400',
      tileColor: 'orange',
      selections: {
        humanMoment: 'walking-away',
        style: 'sun-bleached-nostalgia',
        light: 'hard-midday-sun',
        composition: 'negative-space-left',
        cameraBody: 'nikon-fm2',
        depthOfField: 'balanced-f5-6',
        filmStock: 'fuji-superia-400',
        grain: 'clean',
      },
    },
    {
      id: 'editorial-quiet',
      name: 'Editorial Quiet',
      specString: 'Hasselblad 500C · f/5.6 · Tri-X 400',
      tileColor: 'red',
      selections: {
        humanMoment: 'quiet-aside',
        style: 'muted-editorial',
        light: 'window-light-portrait',
        composition: 'frame-within-a-frame',
        cameraBody: 'hasselblad-500c',
        depthOfField: 'balanced-f5-6',
        filmStock: 'tri-x-400',
        grain: 'fine',
      },
    },
    {
      id: 'verite-handheld',
      name: 'Vérité Handheld',
      specString: 'Leica M6 · f/1.4 · HP5 Plus',
      tileColor: 'aqua',
      selections: {
        humanMoment: 'caught-mid-laugh',
        style: 'grainy-verite',
        light: 'practical-bulb-glow',
        composition: 'dead-center-symmetry',
        cameraBody: 'leica-m6',
        depthOfField: 'wide-open-f1-4',
        filmStock: 'ilford-hp5-plus',
        grain: 'heavy-push',
      },
    },
    {
      id: 'cinematic-wide',
      name: 'Cinematic Wide',
      specString: 'Pentax 67 · f/11 · Portra 400',
      tileColor: 'blue',
      selections: {
        humanMoment: 'lit-by-a-match',
        style: 'cinematic-wide',
        light: 'overcast-softbox',
        composition: 'low-angle-hero',
        cameraBody: 'pentax-67',
        depthOfField: 'deep-focus-f11',
        filmStock: 'portra-400',
        grain: 'clean',
      },
    },
  ],
  sections: [
    {
      id: 'presets',
      number: '01',
      title: 'Presets',
      subtitle: 'Start from a look someone already dialed in.',
      kind: 'presets',
      fields: [],
    },
    {
      id: 'scene',
      number: '02',
      title: 'The Scene',
      subtitle: 'What is actually happening in the frame.',
      kind: 'text',
      fields: [
        {
          kind: 'text',
          id: 'subject',
          label: 'Subject',
          hint: 'Who or what the frame is about.',
          placeholder: 'A woman in a raincoat, a corner newsstand, a parked motorcycle…',
        },
        {
          kind: 'text',
          id: 'environment',
          label: 'Environment',
          hint: 'Where this is happening.',
          placeholder: 'A narrow street between tenement buildings, wet asphalt…',
        },
        {
          kind: 'text',
          id: 'action',
          label: 'Action',
          hint: 'What is happening, mid-motion.',
          placeholder: 'Lighting a cigarette under an awning, glancing back over one shoulder…',
        },
        {
          kind: 'text',
          id: 'lightAtmosphere',
          label: 'Light & Atmosphere',
          hint: 'The mood the light is carrying.',
          placeholder: 'Streetlight haloed in fog, the last color before the sun drops…',
        },
      ],
    },
    {
      id: 'human-moment',
      number: '03',
      title: 'Human Moment',
      subtitle: 'The gesture that makes it feel real.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'humanMoment',
          label: 'Human Moment',
          options: [
            { id: 'caught-mid-laugh', name: 'Caught Mid-Laugh', description: 'A real laugh, not a posed one — head tipped back, eyes creased.', phrase: 'subject caught mid-laugh, head tipped back, unguarded' },
            { id: 'quiet-aside', name: 'Quiet Aside', description: 'Two people leaning in close, a private word passed between them.', phrase: 'a quiet aside between two figures, heads bent close together' },
            { id: 'stolen-glance', name: 'Stolen Glance', description: 'Eyes cutting sideways toward something off-frame.', phrase: 'a stolen glance toward something just outside the frame' },
            { id: 'walking-away', name: 'Walking Away', description: 'Back to the camera, mid-stride, going somewhere you will never see.', phrase: 'subject walking away mid-stride, back to the camera' },
            { id: 'hand-on-the-glass', name: 'Hand on the Glass', description: 'A hand pressed flat against a window, waiting for someone.', phrase: 'a hand pressed flat against glass, someone waiting' },
            { id: 'lit-by-a-match', name: 'Lit by a Match', description: 'A face lit only by the flare of a struck match.', phrase: 'a face lit only by the flare of a struck match' },
          ],
        },
      ],
    },
    {
      id: 'style',
      number: '04',
      title: 'Style',
      subtitle: 'The overall photographic treatment.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'style',
          label: 'Style',
          options: [
            { id: 'documentary-realism', name: 'Documentary Realism', description: 'Unposed, observational, nothing arranged for the camera.', phrase: 'documentary realism, unposed and observational' },
            { id: 'high-contrast-noir', name: 'High-Contrast Noir', description: 'Deep blacks, blown highlights, shadows doing the storytelling.', phrase: 'high-contrast noir styling, deep blacks and blown highlights' },
            { id: 'sun-bleached-nostalgia', name: 'Sun-Bleached Nostalgia', description: 'Faded color, soft edges, a memory more than a photograph.', phrase: 'sun-bleached nostalgic color grading, faded and soft-edged' },
            { id: 'muted-editorial', name: 'Muted Editorial', description: 'Restrained palette, magazine-clean, quietly composed.', phrase: 'muted editorial styling, restrained and quietly composed' },
            { id: 'grainy-verite', name: 'Grainy Vérité', description: 'Handheld energy, visible grain, caught rather than captured.', phrase: 'grainy vérité style, handheld and unpolished' },
            { id: 'cinematic-wide', name: 'Cinematic Wide', description: 'Anamorphic proportions, scope aspect, a frame built for a bigger screen.', phrase: 'cinematic wide framing with anamorphic-style proportions' },
          ],
        },
      ],
    },
    {
      id: 'light',
      number: '05',
      title: 'Light',
      subtitle: 'Where the light is coming from and how hard it hits.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'light',
          label: 'Light',
          options: [
            { id: 'golden-hour-spill', name: 'Golden Hour Spill', description: 'Low sun pouring in sideways, everything rimmed in warmth.', phrase: 'golden hour light spilling in low and warm' },
            { id: 'hard-midday-sun', name: 'Hard Midday Sun', description: 'Short shadows, bleached highlights, no mercy.', phrase: 'hard midday sun with short shadows and bleached highlights' },
            { id: 'neon-wet-street', name: 'Neon Wet Street', description: 'Signage bleeding color into rain-slicked pavement.', phrase: 'neon signage bleeding color across a wet street' },
            { id: 'window-light-portrait', name: 'Window Light Portrait', description: 'Soft directional light off to one side, the rest falling to shadow.', phrase: 'soft window light falling from one side' },
            { id: 'overcast-softbox', name: 'Overcast Softbox', description: 'The whole sky as one giant diffuser.', phrase: 'even, overcast light acting as a natural softbox' },
            { id: 'practical-bulb-glow', name: 'Practical Bulb Glow', description: 'A bare bulb or table lamp doing all the work.', phrase: 'warm practical bulb glow as the only light source' },
          ],
        },
      ],
    },
    {
      id: 'composition',
      number: '06',
      title: 'Composition',
      subtitle: 'How the frame is built.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'composition',
          label: 'Composition',
          options: [
            { id: 'rule-of-thirds', name: 'Rule of Thirds', description: 'Subject off-center, breathing room on the open side.', phrase: 'rule-of-thirds composition with subject off-center' },
            { id: 'dead-center-symmetry', name: 'Dead Center Symmetry', description: 'Subject locked in the middle, everything else in balance around it.', phrase: 'dead-center symmetrical composition' },
            { id: 'negative-space-left', name: 'Negative Space Left', description: 'The subject small, the empty half of the frame doing the talking.', phrase: 'generous negative space to the left of the subject' },
            { id: 'leading-lines', name: 'Leading Lines', description: 'Architecture or road pulling the eye straight to the subject.', phrase: 'leading lines drawing the eye toward the subject' },
            { id: 'frame-within-a-frame', name: 'Frame Within a Frame', description: 'Shot through a doorway, window, or arch.', phrase: 'framed within a doorway or window, a frame within the frame' },
            { id: 'low-angle-hero', name: 'Low Angle Hero', description: 'Camera low, subject looming large against the sky.', phrase: 'low-angle hero framing, subject looming against the sky' },
          ],
        },
      ],
    },
    {
      id: 'camera',
      number: '07',
      title: 'Camera',
      subtitle: 'The gear behind the frame.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'cameraBody',
          label: 'Camera Body',
          options: [
            { id: 'leica-m6', name: 'Leica M6', description: 'Rangefinder classic, quiet shutter, 35mm framing.', phrase: 'shot on a Leica M6 rangefinder' },
            { id: 'contax-t2', name: 'Contax T2', description: 'Pocketable, razor-sharp Zeiss glass.', phrase: 'shot on a Contax T2 point-and-shoot' },
            { id: 'nikon-fm2', name: 'Nikon FM2', description: 'Fully mechanical SLR, built for the long haul.', phrase: 'shot on a Nikon FM2 SLR' },
            { id: 'hasselblad-500c', name: 'Hasselblad 500C', description: 'Square medium format, waist-level and deliberate.', phrase: 'shot on a Hasselblad 500C medium format camera' },
            { id: 'pentax-67', name: 'Pentax 67', description: 'Medium format with the handling of a 35mm SLR.', phrase: 'shot on a Pentax 67 medium format camera' },
          ],
        },
        {
          kind: 'options',
          id: 'depthOfField',
          label: 'Depth of Field',
          options: [
            { id: 'wide-open-f1-4', name: 'Wide Open f/1.4', description: 'Razor-thin focus, the background dissolves.', phrase: 'shot wide open at f/1.4 with razor-thin depth of field' },
            { id: 'shallow-f2-8', name: 'Shallow f/2.8', description: 'Subject sharp, background softly falling away.', phrase: 'shallow depth of field at f/2.8' },
            { id: 'balanced-f5-6', name: 'Balanced f/5.6', description: 'Enough sharpness to hold the scene together.', phrase: 'balanced depth of field at f/5.6' },
            { id: 'deep-focus-f11', name: 'Deep Focus f/11', description: 'Foreground to background, all of it sharp.', phrase: 'deep focus at f/11, sharp from foreground to background' },
          ],
        },
        {
          kind: 'options',
          id: 'filmStock',
          label: 'Film Stock',
          options: [
            { id: 'portra-400', name: 'Kodak Portra 400', description: 'Warm skin tones, gentle color.', phrase: 'on Kodak Portra 400 film stock' },
            { id: 'tri-x-400', name: 'Kodak Tri-X 400 B&W', description: 'Punchy black and white with real grit.', phrase: 'on Kodak Tri-X 400 black and white film' },
            { id: 'fuji-superia-400', name: 'Fuji Superia 400', description: 'Cool greens, everyday color.', phrase: 'on Fuji Superia 400 film stock' },
            { id: 'cinestill-800t', name: 'Cinestill 800T', description: 'Tungsten-balanced, halated neon.', phrase: 'on Cinestill 800T film with characteristic halation' },
            { id: 'ilford-hp5-plus', name: 'Ilford HP5 Plus', description: 'Classic monochrome workhorse.', phrase: 'on Ilford HP5 Plus black and white film' },
          ],
        },
        {
          kind: 'options',
          id: 'grain',
          label: 'Grain',
          options: [
            { id: 'clean', name: 'Clean', description: 'Minimal grain, smooth tonal range.', phrase: 'clean, minimal film grain' },
            { id: 'fine', name: 'Fine', description: 'Just enough texture to read as film.', phrase: 'fine film grain' },
            { id: 'pronounced', name: 'Pronounced', description: 'Visible grain structure throughout.', phrase: 'pronounced, visible film grain' },
            { id: 'heavy-push', name: 'Heavy Push', description: 'Pushed a stop or two, grain doing heavy lifting.', phrase: 'heavy, pushed-stock film grain' },
          ],
        },
      ],
    },
    {
      id: 'time-machine',
      number: '08',
      title: 'Time Machine',
      subtitle: 'Dress the era, if this frame lives somewhere other than now.',
      kind: 'options',
      fields: [
        {
          kind: 'options',
          id: 'period',
          label: 'Period',
          options: [
            { id: '1960s', name: '1960s', description: 'Mod cuts, optimism, clean lines.', phrase: 'set in the 1960s' },
            { id: '1970s', name: '1970s', description: 'Earth tones, long collars, analog warmth.', phrase: 'set in the 1970s' },
            { id: '1980s', name: '1980s', description: 'Bold color, big shapes, neon ambition.', phrase: 'set in the 1980s' },
            { id: '1990s', name: '1990s', description: 'Grunge, minimalism, the last analog decade.', phrase: 'set in the 1990s' },
            { id: 'y2k', name: 'Turn of the Millennium', description: 'Y2K optimism, chrome and gel pens.', phrase: 'set at the turn of the millennium' },
            { id: 'present-day', name: 'Present Day', description: 'Now, exactly as it is.', phrase: 'set in the present day' },
          ],
        },
        {
          kind: 'options',
          id: 'wardrobe',
          label: 'Wardrobe',
          options: [
            { id: 'tailored-vintage', name: 'Tailored Vintage', description: 'Structured cuts and period fabric, nothing off the rack.', phrase: 'wearing tailored vintage clothing' },
            { id: 'workwear', name: 'Workwear', description: 'Denim, canvas, boots built for a shift.', phrase: 'dressed in period workwear' },
            { id: 'eveningwear', name: 'Eveningwear', description: 'Dressed for a night that matters.', phrase: 'dressed in eveningwear' },
            { id: 'streetwear', name: 'Streetwear', description: 'Whatever the block was actually wearing.', phrase: 'dressed in period-accurate streetwear' },
            { id: 'uniform', name: 'Uniform', description: 'A job you can identify at a glance.', phrase: 'wearing a uniform appropriate to the period' },
          ],
        },
        {
          kind: 'options',
          id: 'signage',
          label: 'Signage',
          options: [
            { id: 'hand-painted-storefronts', name: 'Hand-Painted Storefronts', description: 'Lettering done by hand, no two signs matching.', phrase: 'hand-painted storefront signage in the background' },
            { id: 'neon-marquee', name: 'Neon Marquee', description: 'Tube light spelling out a name in the dark.', phrase: 'a neon marquee sign glowing in the background' },
            { id: 'analog-billboards', name: 'Analog Billboards', description: 'Painted or pasted, towering over the street.', phrase: 'analog painted billboards in the background' },
            { id: 'minimal-modern', name: 'Minimal Modern', description: 'Clean type, negative space, nothing shouting.', phrase: 'minimal modern signage in the background' },
          ],
        },
        {
          kind: 'options',
          id: 'vehicles',
          label: 'Vehicles',
          options: [
            { id: 'classic-sedans', name: 'Classic Sedans', description: 'Chrome bumpers and long hoods parked at the curb.', phrase: 'classic sedans parked along the street' },
            { id: 'motorcycles', name: 'Motorcycles', description: 'Something with an engine, leaned on a kickstand.', phrase: 'a motorcycle in frame' },
            { id: 'taxis-and-cabs', name: 'Taxis & Cabs', description: 'A cab idling, meter running, going nowhere yet.', phrase: 'a taxi cab in frame' },
            { id: 'none-in-frame', name: 'None in Frame', description: 'Nothing with wheels — keep the street to the people.', phrase: 'no vehicles in frame' },
          ],
        },
        {
          kind: 'options',
          id: 'streetLife',
          label: 'Street Life',
          options: [
            { id: 'empty-and-quiet', name: 'Empty & Quiet', description: 'The street belongs to just this one moment.', phrase: 'an empty, quiet street' },
            { id: 'bustling-crowd', name: 'Bustling Crowd', description: 'Bodies moving in every direction, none of them posing.', phrase: 'a bustling crowd filling the street' },
            { id: 'market-stalls', name: 'Market Stalls', description: 'Awnings, crates, the noise of people selling things.', phrase: 'market stalls lining the street' },
            { id: 'rain-slicked-and-sparse', name: 'Rain-Slicked & Sparse', description: 'A few figures, the rest left to reflection.', phrase: 'a rain-slicked, sparsely populated street' },
            { id: 'late-night-solitary', name: 'Late-Night Solitary', description: 'One person, one street, everyone else asleep.', phrase: 'a late-night, solitary street scene' },
          ],
        },
      ],
    },
  ],
}
