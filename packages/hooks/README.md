# 프로젝트 전체에서 공통으로 사용하는 hooks.

- `useEvent` : event를 등록하고 제거하는 hook
- `useDeepCompareEffect` : dependency로 object가 주어질때 deep compare해서 값이 바뀔경우만 effect를 실행하도록 해주는 hook
- `useClosetParent` : 현재 element를 기준으로 주어진 selector에 맞는 가장 가까운 부모 element를 찾아주는 hook
- `useDidMount` : component가 mount된 직후에 호출되는 hook
- `usePrevious` : parameter값이 업데이트 되기 이전값을 return하는 hook
- `useRect` : element의 getBoundingClientRect()을 계산해주는 hook
