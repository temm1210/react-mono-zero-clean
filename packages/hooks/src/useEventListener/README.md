# `useEventListener`

주어진 listener를 event에 등록하고 제거해주는 hook

## Usage

```typescript

function Element() => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEventListener("scroll", handleUpdate, { passive: true });
  useEventListener("resize", handleUpdate);
  useEventListener("click", handleUpdate, undefined, containerRef.current);

  return <div ref={containerRef}>Element</div>
};

```

## API

```typescript
useEventListener(eventName: ListenerEventType, listener: Listener, options?: ListenerOptions, context: Context = window,): void
```

- paremeters
  - `eventName` — 실제 등록할 Event의 종류(click, scroll..)
  - `listener` — Event가 발생했을때 실행할 listener
  - `options` — listener함수가 실행될때 적용할 options
  - `listener` — Event에 등록할 대상(기본값 Window)
