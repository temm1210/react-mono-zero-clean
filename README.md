# mono repo + zero config (not CRA)

## 시작방법

1. `yarn install`
2. `yarn build`
3. `yarn storybook`(design-systems packages에있는 storybook 실행) or `yarn start-app`(app package실행)

## 폴더구조

1. `app` : 실제 프로젝트에 해당하는 패키지
2. `design-systems` : 패키지들이 공통으로 사용하는 컴포넌트
3. `hooks` : 패키지들이 공통으로 사용하는 custom hooks(참조링크: [react-use](https://github.com/streamich/react-use))
4. `react-dev-utils` : app package에서 react초기 설정을위한 패키지(참조링크: [react-dev-utils](https://github.com/facebook/create-react-app/tree/main/packages/react-dev-utils))
5. `react-router-utils` : react-router을 쉽게 사용하기위한 패키지
6. `service` : 서버와 통신하기위한 레이어
7. `utils` : 패키지들이 공통으로 사용하는 util 패키지
