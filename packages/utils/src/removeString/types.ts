export type TStringRemove = "start" | "base" | "end";

export type TStringRemoveStrategy = { [key in TStringRemove]: (target: string, findIndex: number) => string };
