# `useRect`

element의 getBoundingClientRect()을 계산해주는 hook

## Usage

```typescript

function Component(object:Object) => {
 const [ref, rect] = useRect<HTMLDivElement>();

 // state가 update되기 이전값을 prev에 return
 return <div ref={ref}>header</div>
};

```

## API

```typescript
type Rect = Pick<DOMRectReadOnly, "top" | "left" | "right" | "bottom" | "height" | "width">;

export type UseRectRef<E> = (element: E) => void;
export type UseRectResult<E> = [UseRectRef<E>, Rect];

useRect<E>(): UseRectResult<E>
```

- returns
  - `UseRectResult[0]` — rect를 계산할 element의 ref
  - `UseRectResult[1]` — ref가 적용된 element의 rect값
