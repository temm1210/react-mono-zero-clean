# useDeepCompareEffect

`useEffect`를 사용할 때 dependency값으로 object를 할당하면 값은 변하지않아도 object가 새로 만들어질 경우 effect가 실행되는 문제를 해결하기위한 hook. object를 deep compare해서 값이 바뀐경우만 effect를 실행

# Usage

```typescript

function Element(object:Object) => {

  useDeepCompareEffect(() => {
    if(!object) return

    const {id, handlers, active} = object;
    ....
  }, [object]);
};

```

# API

```typescript
useDeepCompareEffect(effect: EffectCallback, dependencies: DependencyList): void
```

- paremeters
  - `effect` — 실행할 effect 함수
  - `dependencies` — `useEffect`의 dependency. 반드시 원시타입이 아닌 타입이 하나이상 포함되어야함.
