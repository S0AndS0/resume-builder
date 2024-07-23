# Changelog
[heading__changelog]: #changelog


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][] and this project adheres to
[Semantic Versioning][].


## [Unreleased]
[heading__unreleased]: #unreleased


- [ ] Check code for consistency of JSON data accessors
  - [ ] Get clever about `template__link_container` ID JavaScript injection
- [ ] Maybe refactor `src/assets/js/main.ts` → `modifyArticle`
- [ ] Maybe utilize more HTML `data-` attributes in `index.html` and TS files
- [ ] Remove `article` elements if defined JSON is not parsed or accessible


## [0.1.0] - 2024-07-23
[heading__010_20240723]: #010-20240723


Track new features for customizing Résumé via URL query strings


### Added in [0.1.0]
[heading__added_in_010]: #added-in-010


- `scripts/chromium-print-to-pdf.sh` new parameters
  - `--alias <STRING>` passes `email-alias=<URL_ENCODED_VALUE>` query string
  - `--tags <STRING>` passes `tags=<URL_ENCODED_VALUE>` query string
- `src/front-end/lib/modify-article.ts` new behaviors
  - `tags=<URL_ENCODED_VALUE>` is parsed to bold matched skills and job titles
- `src/front-end/lib/contact-methods.ts` new behaviors
  - `email-alias=<URL_ENCODED_VALUE>` is parsed to inject email alias when not
    already defined


## [0.0.1] - 2024-06-14
[heading__001_20240614]: #001-20240614


Publish first pubic version of Résumé builder!


### Added in [0.0.1]
[heading__added_in_001]: #added-in-001


- Start maintaining versions and a changelog.



[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html

