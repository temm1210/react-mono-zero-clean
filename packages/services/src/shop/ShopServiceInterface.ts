import { IShop } from "./types";

export interface IShopService {
  getShop(id: string): IShop;
}
