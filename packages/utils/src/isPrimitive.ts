/**
 * 주어진 value에 대해서 원시타입인지 아닌지를 판별하는 함수
 * @param value 원시타입 여부를 확인할 값
 * @returns {Boolean} 원시타입여부
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPrimitive = (value: any) => value !== Object(value);

export default isPrimitive;
