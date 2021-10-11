# `useClosetParent`

현재 element를 기준으로 주어진 selector에 맞는 가장 가까운 부모 element를 찾아주는 hook

## Usage

```typescript
function ReactElement() {
  const { parentRef, assignParent } = useClosetParent(".sticky-container");

  if (parentRef) {
    // TODO
    // ex)) parentRef.current?.getBoundingClientRect()...
  }

  return (
    <div ref={assignParent}>
      <div>palceholder</div>
      <div>palceholder</div>
    </div>
  );
}
```

## API

```typescript
useClosetParent(parentSelector:string): {
  parentRef:RefObject<Element | undefined>,
  assignParent:(node: HTMLDivElement) => void
}
```

- paremeters
  - `parentSelector` — 찾을 부모 selector
- returns
  - `parentRef` — 찾은 부모 element의 값
  - `assignParent()` — 해당 함수가 등록된 element에서부터 가까운 부모 element를 찾기시작(element의 ref값으로 넘겨줘야함)
