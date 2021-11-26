# `usePrevious`

parameter값이 업데이트 되기 이전값을 return

## Usage

```typescript

function Element(object:Object) => {
 const [state, setState] = useState(false);

 // state가 update되기 이전값을 prev에 return
 const prev = usePrevious(state);
};

```

## API

```typescript
usePrevious<D>(data: D): D
```

- paremeters
  - `data` — update되기 이전 값을 가져올 target
- returns
  - `data` — paremeter로 받은 data의 update되기 이전 값
