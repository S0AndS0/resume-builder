export {};

/**
 * @see {link} https://www.typescriptlang.org/docs/handbook/namespaces.html
 * @see {link} https://jsdoc.app/tags-namespace.html
 * @see {link} https://medium.com/javascript-in-plain-english/typescript-configuration-options-tsconfig-json-561d4a2ad4b#460e
 * @namespace ICC
 */
declare global {
  namespace Resume {
    /**
     * Structure of data shared by;
     *
     * - assets/json/professional-experiences.json
     * - assets/json/technical-experiences.json
     * - assets/json/contact-methods.json
     */
    export interface External_Link {
      [key: string]: unknown;
      name: string;
      url:
        | string
        | {
            [key: string]: string;
            protocol: string;
            link: string;
          };
      title: string | null | undefined;
      hidden?: boolean;
    }

    /**
     * Structure of data shared by;
     *
     * - assets/json/professional-experiences.json
     * - assets/json/technical-experiences.json
     */
    export interface Section {
      [key: string]: unknown;
      hidden?: boolean;
      heading: string;
      description: string | null | undefined;
      date: {
        from: string | null | undefined;
        to: string | null | undefined;
        difference: string | null | undefined;
      };
      items:
        | null
        | undefined
        | string[]
        | {
            [key: string]: unknown;
            value: string;
            hidden?: boolean;
          }[];
      links: Resume.External_Link[];
    }

    /**
     * Structure of data shared by;
     *
     * - assets/json/professional-experiences.json
     * - assets/json/technical-experiences.json
     */
    export interface Article {
      title: string;
      description: string;
      sections: Resume.Section[];
    }

    /**
     * Structure of data within;
     *
     * - assets/json/contact-methods.json
     */
    export interface Contact_Methods {
      heading?: string;
      description?: string;
      links: Resume.External_Link[];
    }

    /**
     * Structure of data within;
     *
     * - assets/json/page-footer.json
     */
    export interface Page_Footer {
      [key: string]: unknown;
      author?: string;
      license?: string;
    }

    /**
     * Structure of data within;
     *
     * assets/json/page-header.json
     */
    export interface Page_Header {
      [key: string]: unknown;
      title?: string;
      sub_title?: string;
    }
  }
}
