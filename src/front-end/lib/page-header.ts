'use strict';

import { cloneTemplate } from './clone-template';
import { fetchJson } from './fetch-json';

/**
 *
 */
export async function pageHeader({
  container_selector,
}: {
  container_selector: string;
}): Promise<void> {
  const container = document.querySelector(container_selector) as HTMLElement;

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
  const template_clone = cloneTemplate(template_id);

  return fetchJson<Resume.Page_Header>(json_path).then((data) => {
    const container = document.querySelector(container_selector) as HTMLElement;

    const h1 = template_clone.querySelector('h1') as HTMLHeadingElement;

    const title = data.title;
    if (title) {
      h1.innerText = title;
    } else {
      console.error('Undefined "title" within fetched JSON', { data });
      template_clone.removeChild(h1);
    }

    const time = template_clone.querySelector('time') as HTMLTimeElement;
    const date = new Date();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    time.innerText = `${date.getFullYear()}-${month}-${day}`;

    if (data.sub_title?.length) {
      const p = document.createElement('p') as HTMLParagraphElement;
      p.innerText = data.sub_title;
      template_clone.appendChild(p);
    } else {
      console.warn('Undefined "sub_title" within fetched JSON', { data });
    }

    container.appendChild(template_clone);
  });
}
