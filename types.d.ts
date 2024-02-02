export interface ItemWithoutId {
  categoryId: number,
  placeId: number,
  name: string,
  description: string | null,
  createdAt: string,
  image: string | null
}

export type UpdateValues = number | string | null | File