export interface ItemWithoutId {
  id: number,
  categoryId: number,
  placeId: number,
  name: string,
  description: string | null,
  createdAt: string,
  image: string | null
}