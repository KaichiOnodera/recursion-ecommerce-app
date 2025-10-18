import { Item } from "../domains/entities/Item";

export interface IGetItemsInteractor {
  execute(): Promise<Item[]>;
}
