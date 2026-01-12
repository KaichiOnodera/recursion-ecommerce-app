export const DisplayStatus = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type DisplayStatus = (typeof DisplayStatus)[keyof typeof DisplayStatus];

import { ItemImage } from './ItemImage';
import { Tag } from '../../../tags/domains/entities/Tag';

export type Item = {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly type: number;
  readonly price: number;
  readonly displayStatus: DisplayStatus;
  readonly inventory: {
    readonly amount: number;
  };
  readonly images: ItemImage[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isFavorite?: boolean | null;
  readonly tags?: Tag[];
};
