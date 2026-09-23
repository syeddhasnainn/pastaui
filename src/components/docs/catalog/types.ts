export interface ApiProperty {
  name: string
  type: string
  defaultValue: string
  description: string
}

export interface ComponentDocument {
  category?: string
  isNew?: boolean
  slug: string
  name: string
  group: string
  description: string
  installation: string
  usage: string
  source: string
  examples?: { title: string; previewSlug: string }[]
  api: ApiProperty[]
}
