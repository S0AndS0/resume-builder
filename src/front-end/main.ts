'use strict';

import { pageHeader } from './lib/page-header';
import { pageFooter } from './lib/page-footer';
import { contactMethods } from './lib/contact-methods';
import { modifyArticle } from './lib/modify-article';
import { windowLocationSearchParamsToObject } from './lib/window-location-search-params-to-object'

/**
 *
 */
window.addEventListener('load', (_event) => {
  const search_params = windowLocationSearchParamsToObject();

  pageHeader({
    container_selector: '#page__header',
  }).catch((error) => {
    console.error(error);
  });

  pageFooter({
    container_selector: '#container__copyright',
  }).catch((error) => {
    console.error(error);
  });

  contactMethods({
    container_selector: '#container__contact_methods',
    search_params,
  }).catch((error) => {
    console.error(error);
  });

  const main = document.querySelector('main') as HTMLElement;
  const articles = main.querySelectorAll('article') as NodeListOf<HTMLElement>;
  for (const article of articles) {
    const article_id = article.id;
    const container_selector = article.dataset.containerSelector as string;
    const json_path = article.dataset.jsonPath as string;
    const template_id = article.dataset.templateId as string;

    if (
      [container_selector, json_path, template_id].some(
        (data_attribute) => data_attribute == undefined
      )
    ) {
      console.warn('Skipping article because of missing data attributes in ->', {
        article,
      });
      continue;
    }

    modifyArticle({
      article_id,
      container_selector,
      json_path,
      template_id,
    }).catch((error) => {
      console.error({
        error,
        article_id,
        container_selector,
        json_path,
        template_id,
      });
    });
  }
});
