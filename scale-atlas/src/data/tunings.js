const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const MIDI_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

export function midiToName(midi) {
  return MIDI_NAMES[midi % 12] + Math.floor(midi / 12 - 1)
}

export function noteNameSimple(midi) {
  return MIDI_NAMES[midi % 12]
}

// Returns [{fret, chord}] for a full-barre open tuning
export function barreChordMap(openChordRoot) {
  const rootIdx = CHROMATIC.indexOf(openChordRoot)
  return Array.from({ length: 13 }, (_, fret) => ({
    fret,
    chord: CHROMATIC[(rootIdx + fret) % 12],
  }))
}

// Diatonic roles in major key for a given chord on a given root
export function diatonicRole(homeKey, chord) {
  const majorScale = [0,2,4,5,7,9,11]
  const homeIdx = CHROMATIC.indexOf(homeKey)
  const chordIdx = CHROMATIC.indexOf(chord)
  const interval = (chordIdx - homeIdx + 12) % 12
  const degreeNames = {
    0: { roman: 'I', quality: 'major' },
    2: { roman: 'II', quality: 'major' },
    3: { roman: '♭III', quality: 'major' },
    4: { roman: 'III', quality: 'major' },
    5: { roman: 'IV', quality: 'major' },
    7: { roman: 'V', quality: 'major' },
    9: { roman: 'VI', quality: 'major' },
    10: { roman: '♭VII', quality: 'major' },
    11: { roman: 'VII', quality: 'major' },
  }
  const isDiatonic = majorScale.includes(interval)
  return { isDiatonic, ...degreeNames[interval] }
}

export const TUNINGS = [
  {
    id: 'open-g',
    name: 'Open G',
    strings: ['D2','G2','D3','G3','B3','D4'],
    midi: [38, 43, 50, 55, 59, 62],
    openChord: 'G major',
    barreRoot: 'G',
    description: 'Open strings form a G major chord. Barre across all strings at any fret gives a major chord. Keith Richards plays 5-string Open G (muted low string) for a crisper sound.',
    character: 'Resonant, rich major sound. Great for slide and rhythm blues.',
    famousFor: 'Delta blues, rock, slide guitar',
    players: ['Keith Richards', 'Robert Johnson', 'Ry Cooder', 'Duane Allman'],
    relatedScaleIds: ['pentatonic-major', 'blues-scale', 'pentatonic-minor', 'mixolydian-mode'],
    tips: 'Try playing with the low D string muted (5-string) for cleaner chord tones. Barre at 5 = C, barre at 7 = D — your I-IV-V are at frets 0, 5, 7.',
  },
  {
    id: 'open-d',
    name: 'Open D',
    strings: ['D2','A2','D3','F#3','A3','D4'],
    midi: [38, 45, 50, 54, 57, 62],
    openChord: 'D major',
    barreRoot: 'D',
    description: 'Open strings form a D major chord with deep bass resonance. One of the most popular tunings for slide guitar, fingerpicking, and folk. Shares the same interval pattern as Open E, just tuned down a tone.',
    character: 'Deep bass, warm major sound. Very forgiving for slide.',
    famousFor: 'Delta blues, folk, slide guitar',
    players: ['Son House', 'Bonnie Raitt', 'Nick Drake', 'Leo Kottke'],
    relatedScaleIds: ['pentatonic-major', 'blues-scale', 'major-scale'],
    tips: 'I-IV-V are at frets 0, 5, 7. The tuning is especially beautiful in the key of D for fingerpicking — the two low D strings create a natural drone.',
  },
  {
    id: 'open-e',
    name: 'Open E',
    strings: ['E2','B2','E3','G#3','B3','E4'],
    midi: [40, 47, 52, 56, 59, 64],
    openChord: 'E major',
    barreRoot: 'E',
    description: 'Open strings form a bright E major chord. Identical to Open D in intervals but pitched a tone higher — players sometimes prefer Open D with a capo at 2 to get Open E tension. Slide players love it for the higher pitch.',
    character: 'Bright, cutting, high tension. Brilliant for slide.',
    famousFor: 'Slide guitar, Southern rock, blues',
    players: ['Derek Trucks', 'Duane Allman', 'Elmore James', 'Blind Willie Johnson'],
    relatedScaleIds: ['blues-scale', 'pentatonic-minor', 'pentatonic-major'],
    tips: 'Use lighter gauge strings — the higher tension can stress the neck. I-IV-V are at frets 0, 5, 7. Derek Trucks rarely uses any other tuning.',
  },
  {
    id: 'open-a',
    name: 'Open A',
    strings: ['E2','A2','E3','A3','C#4','E4'],
    midi: [40, 45, 52, 57, 61, 64],
    openChord: 'A major',
    barreRoot: 'A',
    description: 'Open A is a bright, cutting open tuning that became foundational in early blues. The top strings remain in standard tuning, making it easier to adapt standard licks. Shares the same interval pattern as Open G, just a second higher.',
    character: 'Brighter and higher than Open G. Close to standard on upper strings.',
    famousFor: 'Early blues, country, R&B',
    players: ['Muddy Waters', 'Tampa Red', 'Elmore James'],
    relatedScaleIds: ['blues-scale', 'pentatonic-major', 'pentatonic-minor'],
    tips: 'Because the top three strings are the same as standard, many standard licks translate directly. I-IV-V are at frets 0, 5, 7.',
  },
  {
    id: 'open-c',
    name: 'Open C',
    strings: ['C2','G2','C3','G3','C4','E4'],
    midi: [36, 43, 48, 55, 60, 64],
    openChord: 'C major',
    barreRoot: 'C',
    description: 'Open C produces a uniquely deep, harp-like C major chord with two low C bass strings. The wide interval range (two octaves on the bass strings) gives it an orchestral richness. Joni Mitchell and John Fahey used it for complex fingerstyle compositions.',
    character: 'Deep, harp-like, wide-ranging. Very resonant bass register.',
    famousFor: 'Fingerstyle, folk, ambient',
    players: ['Joni Mitchell', 'John Butler', 'John Fahey', 'Chris Cornell'],
    relatedScaleIds: ['major-scale', 'pentatonic-major', 'lydian-mode'],
    tips: 'The two low C strings create a bass drone that underpins anything you play. I-IV-V are at frets 0, 5, 7. Try alternating thumb on the low strings with melody above.',
  },
  {
    id: 'dadgad',
    name: 'DADGAD',
    strings: ['D2','A2','D3','G3','A3','D4'],
    midi: [38, 45, 50, 55, 57, 62],
    openChord: 'Dsus4',
    barreRoot: null,
    description: 'DADGAD creates an open Dsus4 — suspended between major and minor, intensely modal. Popularised by Jimmy Page (Kashmir, Bron-Y-Aur Stomp) and Pierre Bensusan. Beloved in Celtic music for its drone-friendly resonance and ambiguous tonality.',
    character: 'Modal, ambiguous, droning. Neither major nor minor — perfect for modal improvisation.',
    famousFor: 'Celtic, fingerstyle folk, rock, Middle Eastern',
    players: ['Jimmy Page', 'Pierre Bensusan', 'Laurence Juber', 'Al Petteway'],
    relatedScaleIds: ['dorian-mode', 'mixolydian-mode', 'celtic-minor', 'scottish-mixolydian'],
    tips: 'The open strings in D give you D Dorian and D Mixolydian naturally. String 2 (A) and 3 (G) together suggest a Gsus2. For D minor: barre 3 strings at fret 2 for an E minor shape.',
    barreNote: 'The open tuning is Dsus4 — full barres give suspended chords, not major. Main key centres: D, G, A, Em.',
  },
  {
    id: 'drop-d',
    name: 'Drop D',
    strings: ['D2','A2','D3','G3','B3','E4'],
    midi: [38, 45, 50, 55, 59, 64],
    openChord: null,
    barreRoot: null,
    description: 'The low E string drops to D, adding a rumbling bass D and enabling one-finger power chords on strings 4-5-6. The most popular alternate tuning in rock, metal, and grunge — almost everything else stays the same as standard.',
    character: 'Heavy low end, easy power chords, familiar otherwise.',
    famousFor: 'Rock, metal, grunge, folk',
    players: ['Led Zeppelin', 'Foo Fighters', 'Neil Young', 'Alice in Chains'],
    relatedScaleIds: ['natural-minor-scale', 'pentatonic-minor', 'blues-scale'],
    tips: 'Power chords (5th chords) on strings 4-5-6 use one finger as a barre. For D major chord: 0 0 0 2 3 2. The familiar string 2-1 stay in standard so lead licks transfer.',
    barreNote: null,
  },
  {
    id: 'double-drop-d',
    name: 'Double Drop D',
    strings: ['D2','A2','D3','G3','B3','D4'],
    midi: [38, 45, 50, 55, 59, 62],
    openChord: 'Dadd9 (no 3rd)',
    barreRoot: null,
    description: 'Both E strings tune down to D, creating a D drone that frames everything. Neil Young uses this extensively. The ambiguity between D major and D minor makes it ideal for modal and folk-rock playing.',
    character: 'D drone, modal ambiguity, folk resonance.',
    famousFor: 'Folk rock, Neil Young, grunge',
    players: ['Neil Young', 'CSNY', 'The Grateful Dead'],
    relatedScaleIds: ['dorian-mode', 'mixolydian-mode', 'natural-minor-scale'],
    tips: 'Open is Dadd9 (no third). For D major barre: 0 0 0 2 3 0. For D minor: 0 0 0 0 1 0. The drone D on both ends gives every chord a pedal tone quality.',
    barreNote: null,
  },
]
