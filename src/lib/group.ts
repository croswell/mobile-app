export function groupBy<T, K extends string | number | symbol>(
  items: T[],
  getKey: (i: T) => K
) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
