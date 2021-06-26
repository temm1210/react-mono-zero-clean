/* eslint-disable @typescript-eslint/no-explicit-any */
// global타입을 확장시키는 작업
// .env에 정의한 변수를 여기서도 선언해줘야 타입추론이 이루어짐
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PUBLIC_URL: string;
      PORT: string;
      test: string;
    }
  }
  interface NodeModule {
    hot: any;
  }

  const __webpack_hash__: string;
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
