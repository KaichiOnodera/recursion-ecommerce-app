/**
 * 値が数値配列であるかを検証する型ガード関数
 * @param value - 検証する値
 * @returns valueが数値配列の場合true、それ以外はfalse
 */
export function isNumberArray(value: unknown): value is number[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every(
    (item) =>
      typeof item === 'number' && !isNaN(item) && Number.isInteger(item),
  );
}
