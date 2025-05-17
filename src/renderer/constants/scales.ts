export const SCALES = [
  { label: 'Any Scale', value: 'any' },
  { label: 'Major', value: 'major' },
  { label: 'Minor', value: 'minor' }
  // { label: 'Harmonic Minor', value: 'harmonicMinor' },
  // { label: 'Melodic Minor', value: 'melodicMinor' },
  // { label: 'Dorian', value: 'dorian' },
  // { label: 'Phrygian', value: 'phrygian' },
  // { label: 'Lydian', value: 'lydian' },
  // { label: 'Mixolydian', value: 'mixolydian' },
  // { label: 'Locrian', value: 'locrian' },
  // { label: 'Pentatonic Major', value: 'pentatonicMajor' },
  // { label: 'Pentatonic Minor', value: 'pentatonicMinor' },
  // { label: 'Blues', value: 'blues' }
]

export const ANY_SCALE = SCALES[0]

export const SCALE_LABELS = SCALES.map((scale) => scale.label)
