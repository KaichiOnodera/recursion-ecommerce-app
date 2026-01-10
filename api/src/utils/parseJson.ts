import { isNumberArray } from './isNumberArray';

/**
 * JSON文字列または配列をパースして数値配列に変換する
 * @param value - パース対象の値（JSON文字列、配列、undefinedなど）
 * @returns パース成功時は数値配列、失敗時はnull、undefinedの場合はundefined
 */
export function parseJsonToNumberArray(
  value: unknown,
): number[] | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  // FormDataから送られてくる場合、JSON文字列として送られる
  let parsedValue: unknown;
  if (typeof value === 'string') {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      return null; // JSONパース失敗
    }
  } else {
    parsedValue = value;
  }

  // 型チェック
  if (!isNumberArray(parsedValue)) {
    return null; // 型チェック失敗
  }

  return parsedValue;
}
