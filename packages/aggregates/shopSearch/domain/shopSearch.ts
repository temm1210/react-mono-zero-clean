class ShopSearch {
  private _id: number;

  constructor(id: number) {
    this._id = id;
  }

  search = () => {
    console.log("test:", this._id);
  };
}

export default ShopSearch;
