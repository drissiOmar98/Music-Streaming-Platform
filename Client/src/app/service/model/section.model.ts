// section.model.ts
export interface Section {
  section: string; // Title of the section (e.g., "Popular Artists")
  type: 'artist' | 'song' | 'playlist' | 'album'; // Type of the section
  category: string; // Category for filtering (e.g., "null" for no category)
}
