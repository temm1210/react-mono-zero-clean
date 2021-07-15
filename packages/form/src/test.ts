export interface TY {
  a: string;
  b: string;
  c: string;
}

const a: TY = {
  a: "a",
  b: "b",
  c: "c",
};

console.log("a:", a);

// declare를 만듬
export default a;
