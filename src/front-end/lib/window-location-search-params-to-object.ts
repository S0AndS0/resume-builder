/**
 * @note - Proxy may be faster but we'd loose-out on using iterable stuff
 */
export function windowLocationSearchParamsToObject() {
  return Object.fromEntries(new URL(window.location.toString()).searchParams.entries());
}
