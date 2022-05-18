/**
 * @description map함수의 첫번째 타입
 * parameter와 Return typ 두 개의 값을 Generic로 입력받음
 */
const fpTsMap = <P, R>(data: P[], fn: (d: P) => R): R[] => {
  const result = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const d of data) {
    result.push(fn(d));
  }

  return result;
};

export default fpTsMap;
