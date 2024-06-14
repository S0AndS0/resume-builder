'use strict';

/**
 *
 */
export function fetchJson<T>(url_path: string): Promise<T> {
  const init = {
    headers: new Headers({
      Accept: 'applicaiton/json',
      'Content-Type': 'applicaiton/json',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
    }),
    method: 'GET',
  };

  return fetch(url_path, init)
    .catch((error) => {
      console.error(`Failed to fetch url path -> ${url_path}`);
      throw error;
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Response was not _ok_ -> ${response.status}`);
      }
      return response.json();
    });
}
