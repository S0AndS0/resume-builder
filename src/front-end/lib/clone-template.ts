'use strict';

/**
 *
 */
export function cloneTemplate(template_id: string): DocumentFragment {
  const template = document.getElementById(template_id) as HTMLTemplateElement;
  if (!template) {
    throw new Error(`Cannot find template element with id -> ${template_id}`);
  }
  return template.content.cloneNode(true) as DocumentFragment;
}
