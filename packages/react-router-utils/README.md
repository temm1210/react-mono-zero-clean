# react-router-dom 관련 utils파일들이 위치

- `mapRouter`함수를 사용하여 라우터를 설정
- `param`타입 추론을 위해 `ParamsFromPath<P>` 타입 사용

## mapRouter

```typescript
import mapRouter from "@project/react-router-utils";

const route = mapRouter({
  component: function AuthPage(args) {
    return <Auth {...args} />;
  },

  regexPath: "/auth/:entity(a|b|c)",
  title: "Auth",
  children: {
    auth2: {
      regexPath: "/auth23",
      title: "Auth",
      component: function AuthPage(args) {
        return <Auth {...args} />;
      },
    },
  },
  // children: {
  //   auth2: { regexPath: "/auth/:id", title: "auth2" },
  //   auth3: { regexPath: "/auth/:id/:type?", title: "auth3" },
  //   auth4: { regexPath: "/auth/:id(a|b)/:type?", title: "auth3" },
  // },
} as const);
```

## ParamsFromPath<P>

```typescript
import mapRouter from "@project/react-router-utils";

const route = mapRouter({regexPath: "/auth/:entity(a|b|c)",...});

function Page() {
    // entity는 a,b,c로 타입추론이 이루어짐
    const { entity } = useParams<ParamsFromPath<typeof routes.auth.regexPath>>();

    return <div>{entity}</div>
}
```
