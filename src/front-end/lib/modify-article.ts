'use strict';

import { fetchJson } from './fetch-json';
import { cloneTemplate } from './clone-template';
import { dateDifference } from './date-difference';

/**
 * Namespace of static methods for limited MarkDown syntax recognition
 */
class MarkDown {
  /**
   * Return `true` if input `text` starts and ends with either `__` or `**`
   */
  static textIsBold(text: string): boolean {
    return !!text.match(/^(\*\*|__)\w.*(\*\*|__)$/);
  }

  /**
   * Return `true` if input `text` starts and ends with either `_` or `*`
   */
  static textIsItalic(text: string): boolean {
    return !!text.match(/^(\*|_)\w.*(\*|_)$/);
  }

  /**
   * Return HTML elements when `text` matches known MarkDown syntax
   * Failing that `undefined` is returned, and it is up to the caller to handle result
   */
  static toHTML(text: string) {
    if (MarkDown.textIsBold(text)) {
      const bold = document.createElement('b');
      bold.innerText = text.replace(/__|\*\*/g, '');
      return bold;
    } else if (MarkDown.textIsItalic(text)) {
      const emphasis = document.createElement('em');
      emphasis.innerText = text.replace(/_|\*/g, '');
      return emphasis;
    }
  }
}

/**
 * Namespace of static methods for abstracting article modifications
 */
class Modify_Article {
  /**
   * Set `element.innerText` with `value` or remove `element` from `parent`
   */
  static populateElementOrRemove({
    parent,
    element,
    value,
  }: {
    parent: HTMLElement;
    element: HTMLElement | undefined;
    value: null | string | undefined;
  }) {
    if (!!element && !!value) {
      element.innerText = value;
    } else if (element) {
      parent.removeChild(element);
    }
  }

  /**
   * If `section_data.data.difference` is predefined use that
   * Else attempt to calculate difference via `section_data.data.from` and `..to`
   * Failing both remove `element` from `container`
   */
  static sectionTimeRange({
    element,
    selectors,
    section_data,
  }: {
    element: HTMLElement;
    selectors: {
      container: string;
      from: string;
      to: string;
      difference: string;
    };
    section_data: Resume.Section;
  }) {
    const container = element.querySelector(selectors.container) as HTMLDivElement;
    if (!container) {
      return undefined;
    }

    const template_id = container.dataset.templateId;
    if (!template_id?.length) {
      return undefined;
    }

    const template_clone = cloneTemplate(template_id);

    const time_range__from = template_clone.querySelector(selectors.from) as HTMLTimeElement;
    const time_range__to = template_clone.querySelector(selectors.to) as HTMLTimeElement;
    const time_range__difference = template_clone.querySelector(
      selectors.difference
    ) as HTMLSpanElement;

    if ([section_data?.date.difference, time_range__difference].every((x) => !!x)) {
      time_range__difference.innerText = section_data.date.difference as string;
      container.appendChild(time_range__difference);

      return undefined;
    } else if (
      [section_data.date?.from, section_data.date?.to, time_range__difference].every((x) => !!x)
    ) {
      if (![time_range__from, time_range__to].every((x) => !!x)) {
        return undefined;
      }

      time_range__from.innerText = section_data.date.from as string;
      time_range__to.innerText = section_data.date.to as string;

      container.appendChild(time_range__from);
      container.appendChild(time_range__to);

      dateDifference({
        left: section_data.date.from as string,
        right: section_data.date.to as string,
      })
        .then((difference) => {
          time_range__difference.innerText = difference;
          container.appendChild(time_range__difference);
        })
        .catch((error) => {
          console.error(error);
        });

      return undefined;
    }

    [time_range__to, time_range__from, time_range__difference].forEach((element) => {
      if (element) {
        container.removeChild(element);
      }
    });
  }
}

/**
 *
 */
export async function modifyArticle({
  article_id,
  container_selector,
  json_path,
  template_id,
  search_params,
}: {
  article_id: string;
  container_selector: string;
  json_path: string;
  template_id: string;
  search_params: {
    [key: string]: string | undefined;
    tags?: string;
  };
}): Promise<void> {
  const article = document.getElementById(article_id) as HTMLElement;

  const article__header = article.querySelector('header') as HTMLElement;

  const article__header__heading = article__header.querySelector(
    '.article__heading'
  ) as HTMLHeadingElement;

  const article__header__description = article__header.querySelector(
    '.article__description'
  ) as HTMLParagraphElement;

  const container = article.querySelector(container_selector) as HTMLDivElement;

  return fetchJson<Resume.Article>(json_path).then((data) => {
    if (data.title) {
      article__header__heading.innerText = data.title;
      article__header__heading.id = data.title.replace(new RegExp(' ', 'g'), '_').toLowerCase();
    }

    Modify_Article.populateElementOrRemove({
      parent: article__header,
      element: article__header__description,
      value: data.description,
    });

    if (!data.sections?.length) {
      console.error('Sections list undefined for ->', json_path);
      container.innerText = '';
      return undefined;
    }

    const section_count = { hidden: 0, shown: 0 };
    data.sections.forEach((section_data) => {
      if (section_data.hidden) {
        section_count.hidden++;
        return undefined;
      }

      const template_clone = cloneTemplate(template_id);
      const section = template_clone.querySelector('section') as HTMLElement;
      const section__heading = section.querySelector('.heading') as HTMLHeadingElement;

      if (![section__heading, section_data.heading].every((x) => !!x)) {
        console.warn('Skipping because heading undefined ->', { section }, { section_data });
        return undefined;
      }

      section__heading.innerText = section_data.heading;

      const section__description = section.querySelector('.description') as HTMLParagraphElement;

      Modify_Article.populateElementOrRemove({
        parent: section,
        element: section__description,
        value: section_data.description,
      });

      Modify_Article.sectionTimeRange({
        element: section,
        section_data,
        selectors: {
          container: '.time_range__container',
          from: '.time_range__from',
          to: '.time_range__to',
          difference: '.time_range__difference',
        },
      });

      // Note; we use a _classy_ for loop because `.querySelectorAll` returns a
      // collection not an Array, and conversion would be wasteful
      for (const section__list of section.querySelectorAll('.list')) {
        if (!section__list.classList.contains('list__links') && section_data.items?.length) {
          // Likely dealing with data similar to `assets/json/technical-skills.json`
          const hidden_items: [string, boolean][] = [];

          section_data.items.forEach((item_data) => {
            let [item_value, item_hidden] = ((item: typeof item_data) => {
              switch (typeof item) {
                case 'string': {
                  return [item, false];
                }
                case 'object': {
                  return [item.value, item.hidden];
                }
                default: {
                  throw new Error(`Unknown typeof -> ${JSON.stringify({ item }, null, 2)}`);
                }
              }
            })(item_data) as [string, boolean];

            if (!item_value) {
              throw new Error(`No value found for ${JSON.stringify({ item_data }, null, 2)}`);
            }

            if (item_hidden) {
              hidden_items.push([item_value, item_hidden]);
              return;
            }

            // Add bold MarkDown syntax when tag is and skill are matched
            if (
              search_params?.tags?.length &&
              search_params.tags.toLowerCase().match(item_value.toLowerCase())?.length
            ) {
              item_value = `**${item_value}**`;
            }

            const list__item = document.createElement('li') as HTMLLIElement;

            const html_element = MarkDown.toHTML(item_value);
            if (html_element instanceof HTMLElement) {
              list__item.appendChild(html_element);
            } else {
              list__item.innerText = item_value;
            }

            section__list.appendChild(list__item);
          });

          if (hidden_items.length) {
            const list__item = document.createElement('li') as HTMLLIElement;

            const title = hidden_items.map(([value]) => value).join(', ');
            list__item.classList.add('hidden_items');
            list__item.innerText = `... And ${hidden_items.length} more`;
            list__item.title = title;
            list__item.dataset.title = title;

            section__list.appendChild(list__item);
          }
        } else if (section__list.classList.contains('list__links') && section_data.links?.length) {
          // Likely dealing with data similar to `assets/json/professional-experiences.json`
          // or `assets/json/technical-experiences.json`
          section_data.links.forEach((link_data) => {
            if (![link_data.name, link_data.url].every((x) => !!x)) {
              console.warn('Skipping link ->', { link_data });
              return undefined;
            }

            if (link_data.hidden) {
              console.warn('Skipping link ->', { link_data });
              return undefined;
            }

            const list__item = cloneTemplate('template__link_container');
            const anchor = list__item.querySelector('a') as HTMLAnchorElement;

            if (typeof link_data.url === 'string') {
              anchor.href = link_data.url as string;
            } else if (typeof link_data.url === 'object') {
              anchor.href = `${link_data.url.protocol}${link_data.url.link}`;
            } else {
              console.warn('Skipping link ->', { link_data });
              return undefined;
            }

            anchor.innerText = link_data.name;

            if (link_data.title) {
              anchor.title = link_data.title;
            }

            section__list.appendChild(list__item);
          });
        } else if (section__list) {
          // Warn we do not yet handle this case before trying next chunk of data
          console.warn('Removing list element from ->', { section });
          section__list.parentNode?.removeChild(section__list);
        }
      }

      section_count.shown++;
      container.appendChild(template_clone);
    });
  });
}
// vim: expandtab
