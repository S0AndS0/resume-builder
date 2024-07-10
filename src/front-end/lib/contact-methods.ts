'use strict';

import { cloneTemplate } from './clone-template';
import { fetchJson } from './fetch-json';

/**
 *
 */
export async function contactMethods({
  container_selector,
  search_params,
}: {
  container_selector: string;
  search_params: { [key: string]: string };
}): Promise<Resume.Contact_Methods> {
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

  return fetchJson<Resume.Contact_Methods>(json_path).then((data) => {
    const template_clone = cloneTemplate(template_id);

    const header = template_clone.querySelector('header') as HTMLElement;
    const heading = header.querySelector('.heading') as HTMLHeadingElement;
    const description = header.querySelector('.description') as HTMLParagraphElement;
    const link__list = template_clone.querySelector('.list') as HTMLUListElement;

    if (!data.heading) {
      throw new Error(`"heading" undefined within JSON data from -> ${json_path}`);
    }
    heading.innerText = data.heading;

    if (data.description) {
      description.innerText = data.description;
    } else {
      console.warn(`"description" undefined within JSON data from -> ${json_path}`);
      header.removeChild(description);
    }

    if (!data.links?.length) {
      throw new Error(`"links" undefined or empty within JSON data from -> ${json_path}`);
    }

    data.links.forEach((link_data) => {
      if (!link_data.url) {
        console.error('URL undefined for link data ->', link_data);
        return undefined;
      }

      if (link_data.hidden) {
        console.warn('Skipping because hidden is true for data ->', link_data);
        return undefined;
      }

      const list__item = cloneTemplate('template__link_container');
      const anchor = list__item.querySelector('a') as HTMLAnchorElement;
      if (typeof link_data.url === 'string') {
        anchor.href = link_data.url;
      } else if (
        typeof link_data.url === 'object' &&
        typeof link_data.url.protocol === 'string' &&
        typeof link_data.url.link === 'string'
      ) {
        if (
          link_data.url.protocol === 'mailto:' &&
          !link_data.url.link.includes('+') &&
          search_params['email-alias']?.length
        ) {
          const [email_name, email_url] = link_data.url.link.split('@');
          const email_alias = search_params['email-alias'];
          anchor.href = `${link_data.url.protocol}${email_name}+${email_alias}@${email_url}`;
        } else {
          anchor.href = `${link_data.url.protocol}${link_data.url.link}`;
        }
      }
      anchor.innerText = link_data.name;

      if (link_data.title) {
        anchor.title = link_data.title;
      }

      link__list.appendChild(list__item);
    });

    container.appendChild(template_clone);

    return data;
  });
}
