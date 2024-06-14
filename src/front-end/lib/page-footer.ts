'use strict';

import { cloneTemplate } from './clone-template';
import { fetchJson } from './fetch-json';

/**
 *
 */
export async function pageFooter({
  container_selector,
}: {
  container_selector: string;
}): Promise<void> {
  const container = document.querySelector(container_selector) as HTMLDivElement;

  const template_id = container.dataset.templateId;
  if (!template_id) {
    throw new Error(
      `No "data-template-id" attribute defined on container_selector -> ${container_selector}`
    );
  }

  const json_path = container.dataset.jsonPath;
  if (!json_path) {
    throw new Error(
      `No "data-json-path" attribute defined on container_selector -> ${container_selector}`
    );
  }

  return fetchJson<Resume.Page_Footer>(json_path).then((data) => {
    const template_clone = cloneTemplate(template_id);

    const copyright__text = template_clone.querySelector('.copyright__text') as HTMLSpanElement;
    const author = data.author;
    const license = data.license?.length ? data.license : 'All Rights Reserved';
    copyright__text.innerText = `-- ${author} -- ${license} --`;

    const copyright__date = template_clone.querySelector('.copyright__date') as HTMLSpanElement;
    const date = new Date();
    copyright__date.innerText = `${date.getFullYear()}`;

    container.appendChild(template_clone);
  });
}
