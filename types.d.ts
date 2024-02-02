export interface Item {
  categoryId: number;
  placeId: number;
  name: string;
  description: string | null;
  createdAt: string;
  image: string | null;
}

export interface Category {
  name: string;
  description: string | null;
}

export interface Place extends Category {}

export type UpdateValues = number | string | null | File;
