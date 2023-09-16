export interface TaalMetadata {
  vibhagMarkers: string
  matrasPerVibhag: number[]
}

export type Taal = 'teental' | 'rupak' | 'jhaptaal' | 'ektaal'

export const TAALS: Record<Taal, TaalMetadata> = {
  teental: {
    vibhagMarkers: 'X 2 0 3',
    matrasPerVibhag: [4, 4, 4, 4],
  },
  rupak: {
    vibhagMarkers: 'X 2 3',
    matrasPerVibhag: [3, 2, 2],
  },
  jhaptaal: {
    vibhagMarkers: 'X 2 3 2',
    matrasPerVibhag: [2, 3, 2, 3],
  },
  ektaal: {
    vibhagMarkers: 'X 0 2 0 3 4',
    matrasPerVibhag: [2, 2, 2, 2, 2, 2],
  },
}
