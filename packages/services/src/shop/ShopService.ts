import { IShopService } from "./ShopServiceInterface";

class ShopService {
  private shopService: IShopService;

  constructor(shopService: IShopService) {
    this.shopService = shopService;
  }

  getShop = (id: string) => {
    return this.shopService.getShop(id);
  };
}

export default ShopService;
