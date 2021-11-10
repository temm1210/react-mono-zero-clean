# `useDidMount`

component가 mount되고 나서 실행되는 hook

## Usage

```typescript
function ReactElement() {
  useDidMount(() => {
    // TODO
  });
}
```

## API

```typescript
useDidMount(effect: EffectCallback): void
```

- paremeters
  - `effect` — 실행할 effect 함수
