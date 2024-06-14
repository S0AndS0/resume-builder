# Resume Builder
[heading__top]:
  #resume-builder
  "&#x2B06; Résumé builder using pure CSS, HTML, JSON, and a sprinkling of TypeScript"


Résumé builder using pure CSS, HTML, JSON, and a sprinkling of TypeScript

## [![Byte size of Public Résumé][badge__main__public_resume__source_code]][public_resume__main__source_code] [![Open Issues][badge__issues__public_resume]][issues__public_resume] [![Open Pull Requests][badge__pull_requests__public_resume]][pull_requests__public_resume] [![Latest commits][badge__commits__public_resume__main]][commits__public_resume__main] [![License][badge__license]][branch__current__license]
<!-- [![GitHub Actions Build Status][badge__github_actions]][activity_log__github_actions] --> 


---


- [:arrow_up: Top of Document][heading__top]
- [:building_construction: Requirements][heading__requirements]
  - [Arch Linux (BTW™)][heading__arch_linux_btw]
- [:zap: Quick Start][heading__quick_start]
- [&#x1F9F0; Usage][heading__usage]
- [&#x1F5D2; Notes][heading__notes]
  - [Code structure][heading__code_structure]
    - [`index.html` file][heading__indexhtml_file]
    - [`assets/css/style.css` file][heading__assetscssstylecss_file]
    - [`src/front-end/main.ts` file][heading__srcfrontendmaints_file]
    - [`src/front-end/lib/` directory][heading__srcfrontendlib_directory]
    - [`assets/json/` directory][heading__assetsjson_directory]
- [:chart_with_upwards_trend: Contributing][heading__contributing]
  - [:trident: Forking][heading__forking]
  - [:currency_exchange: Sponsor][heading__sponsor]
- [:card_index: Attribution][heading__attribution]
- [:balance_scale: Licensing][heading__license]
  - [Commercial and/or proprietary use][heading__commercial_andor_proprietary_use]
  - [Non-commercial and FOSS use][heading__noncommercial_and_foss_use]


---



## Requirements
[heading__requirements]:
  #requirements
  "&#x1F3D7; Prerequisites and/or dependencies that this project needs to function properly"


Access to GitHub Actions if using on GitHub, or manually assigning environment
variables prior to running `npm test`.  NodeJS dependencies may be installed
via NPM...


```Bash
npm install
```


---


### Arch Linux (BTW™)
[heading__arch_linux_btw]: #arch-linux-btw

```bash
sudo pacman -S go-yq \
  jq \
  okular
```

______


## Quick Start
[heading__quick_start]:
  #quick-start
  "&#9889; Perhaps as easy as one, 2.0,..."


- Follow the [Forking][heading__forking] instructions
- Update JSON files within the `assets/json/` directory
- Update `index.html` file
- Check [Usage][heading__usage] for tips on available NPM commands
- Publish to GitHub and/or utilize the `scripts/chromium-print-to-pdf.sh`


______


## Usage
[heading__usage]:
  #usage
  "&#x1F9F0; How to utilize this repository"


- Serve locally via
   ```bash
   npm run serve 
   ```
- Check if/when a company has been applied to
   ```bash
   npm run --silent has-applied-to -- 'Company Name'
   ```
- Generate PDFs after customizing `assets/json/` files and/or `index.html` file
   ```bash
   npm run --silent chromium-print-to-pdf -- --preview --job 'Open Position' --company 'Company Name'
   ```
- Check changes to TypeScript files under `src/` directory against linter rules
   ```bash
   npm run lint
   ```
- Check changes to TypeScript files under `src/` directory against `tsc`
   ```bash
   npm run check
   ```
- Build JavaScript after editing any TypeScript files under `src/` directory
   ```bash
   npm run build
   ```


______


## Notes
[heading__notes]:
  #notes
  "&#x1F5D2; Additional things to keep in mind when developing"


This repository may not be feature complete and/or fully functional, Pull
Requests that add features or fix bugs are certainly welcomed.

It is recommended to make use of the `--preview` option prior to submitting
resume, because page-breaks are tough to predict after editing JSON files.


---


### Code structure
[heading__code_structure]: #code-structure


No client-side libraries/frameworks (meta or otherwise) are utilized by this
project!  Instead standard/built-in web APIs are embraced and extended only
where convenience outweighs normal conventions.

#### `index.html` file
[heading__indexhtml_file]: #indexhtml-file

Within the `index.html` file custom `data-` attributes are defined to clue
JavaScript code in on intent and any additional assets to load and/or parse;

- `data-json-path` points to path, relative to the index file, where a JSON may
  be fetched
- `data-template-id` points to a template HTML element, within the index file,
  that JavaScript should clone and populate with parsed JSON data
- `data-container-selector` provides a child selector, unique to the parent
  element's scope, where JavaScript should append the cloned template element

> Note; elements that have both `data-json-path` and `data-template-id`
> attributes, but **no** `data-container-selector` attribute, generally will
> have cloned template element appended to the parent.

#### `assets/css/style.css` file
[heading__assetscssstylecss_file]: #assetscssstylecss-file

The `style.css` file hints to web-browsers, and PDF generation tooling, how
HTML elements should be rendered.  Chromium based browsers currently for
generating PDF are the most well behaved in regards to accuracy, and currently
Firefox derived browsers get a bit creative in regards to respecting explicitly
defined font sizes.

#### `src/front-end/main.ts` file
[heading__srcfrontendmaints_file]: #srcfrontendmaints-file

The `main.ts` file is the main entry point into JavaScript logics, and by
calling various functions defined within the `src/front-end/lib/` directory
populates the `index.html` file with content parsed from fetched JSON files.

#### `src/front-end/lib/` directory
[heading__srcfrontendlib_directory]: #srcfrontendlib-directory

The `lib/` directory harbors helper functions either named after related JSON
files, a group of HTML elements, or a discreet action that needs preformed.

#### `assets/json/` directory
[heading__assetsjson_directory]: #assetsjson-directory

The `json/` directory collects content of various components of resulting
Résumé, as well as defines visibility for sub-sections.  This facilitates swift
per company customizations, by toggling `hidden` states, while also allowing
adventurous content consumers to query data almost as though it were served
from an API.


______


## Contributing
[heading__contributing]:
  #contributing
  "&#x1F4C8; Options for contributing to public-resume and S0AndS0"


Options for contributing to public-resume and S0AndS0


---


### Forking
[heading__forking]:
  #forking
  "&#x1F531; Tips for forking public-resume"


Start making a [Fork][public_resume__fork_it] of this repository to an account
that you have write permissions for.


- Add remote for fork URL. The URL syntax is _`git@github.com:<NAME>/<REPO>.git`_...


```Bash
cd ~/git/hub/S0AndS0/public-resume

git remote add fork git@github.com:<NAME>/public-resume.git
```


- Commit your changes and push to your fork, eg. to fix an issue...


```Bash
cd ~/git/hub/S0AndS0/public-resume


git commit -F- <<'EOF'
:bug: Fixes #42 Issue


**Edits**


- `<SCRIPT-NAME>` script, fixes some bug reported in issue
EOF


git push fork main
```


> Note, the `-u` option may be used to set `fork` as the default remote, eg.
> _`git push -u fork main`_ however, this will also default the `fork` remote
> for pulling from too! Meaning that pulling updates from `origin` must be done
> explicitly, eg. _`git pull origin main`_


- Then on GitHub submit a Pull Request through the Web-UI, the URL syntax is
  _`https://github.com/<NAME>/<REPO>/pull/new/<BRANCH>`_


> Note; to decrease the chances of your Pull Request needing modifications
> before being accepted, please check the
> [dot-github](https://github.com/S0AndS0/.github) repository for detailed
> contributing guidelines.


---


### Sponsor
  [heading__sponsor]:
  #sponsor
  "&#x1F4B1; Methods for financially supporting S0AndS0 that maintains public-resume"


Thanks for even considering it!


Via Liberapay you may
<sub>[![sponsor__shields_io__liberapay]][sponsor__link__liberapay]</sub> on a
repeating basis.


Regardless of if you're able to financially support projects such as
public-resume that S0AndS0 maintains, please consider sharing projects that are
useful with others, because one of the goals of maintaining Open Source
repositories is to provide value to the community.


______


## Attribution
[heading__attribution]:
  #attribution
  "&#x1F4C7; Resources that where helpful in building this project so far."


- [ESLint -- Configuration Migration Guide `--ext`](https://eslint.org/docs/latest/use/configure/migration-guide#--ext)
- [GitHub -- `github-utilities/make-readme`](https://github.com/github-utilities/make-readme)


______


## License
[heading__license]:
  #license
  "&#x2696; Legal side of Open Source"


This project is licensed based on use-case


---


### Commercial and/or proprietary use
[heading__commercial_andor_proprietary_use]: #commercial-andor-proprietary-use


If a project is **either** commercial or (`||`) proprietary, then please
contact the author for pricing and licensing options to make use of code and/or
features from this repository.


---


### Non-commercial and FOSS use
[heading__noncommercial_and_foss_use]: #noncommercial-and-foss-use


If a project is **both** non-commercial and (`&&`) published with a licence
compatible with AGPL-3.0, then it may utilize code from this repository under
the following terms.


```
Résumé builder using pure CSS, HTML, JSON, and a sprinkling of TypeScript
Copyright (C) 2024 S0AndS0

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

For further details review full length version of
[AGPL-3.0][branch__current__license] License.

The above licence is applicable **only** to the following files;

- `.eslintrc.js`
- `.github/README.md`
- `.github/workflows/pages.yaml`
- `@types/front-end/resume.d.ts`
- `assets/css/style.css`
- `index.html`
- `package.json`
- `scripts/chromium-print-to-pdf.sh`
- `scripts/has-applied-to.sh`
- `src/front-end/lib/clone-template.ts`
- `src/front-end/lib/contact-methods.ts`
- `src/front-end/lib/date-difference.ts`
- `src/front-end/lib/fetch-json.ts`
- `src/front-end/lib/modify-article.ts`
- `src/front-end/lib/page-footer.ts`
- `src/front-end/lib/page-header.ts`
- `src/front-end/main.ts`
- `tsconfig.json`
- `tsup.config.ts`

... Files not listed above are instead shared under "All rights reserved"
terms/conditions/licensing agreement/copy-right.


[branch__current__license]:
  /LICENSE
  "&#x2696; Full length version of AGPL-3.0 License"

[badge__license]:
  https://img.shields.io/github/license/S0AndS0/public-resume

[badge__commits__public_resume__main]:
  https://img.shields.io/github/last-commit/S0AndS0/public-resume/main.svg

[commits__public_resume__main]:
  https://github.com/S0AndS0/public-resume/commits/main
  "&#x1F4DD; History of changes on this branch"


[public_resume__community]:
  https://github.com/S0AndS0/public-resume/community
  "&#x1F331; Dedicated to functioning code"


[issues__public_resume]:
  https://github.com/S0AndS0/public-resume/issues
  "&#x2622; Search for and _bump_ existing issues or open new issues for project maintainer to address."

[public_resume__fork_it]:
  https://github.com/S0AndS0/public-resume/fork
  "&#x1F531; Fork it!"

[pull_requests__public_resume]:
  https://github.com/S0AndS0/public-resume/pulls
  "&#x1F3D7; Pull Request friendly, though please check the Community guidelines"

[public_resume__main__source_code]:
  https://github.com/S0AndS0/public-resume/
  "&#x2328; Project source!"

[badge__issues__public_resume]:
  https://img.shields.io/github/issues/S0AndS0/public-resume.svg

[badge__pull_requests__public_resume]:
  https://img.shields.io/github/issues-pr/S0AndS0/public-resume.svg

[badge__main__public_resume__source_code]:
  https://img.shields.io/github/repo-size/S0AndS0/public-resume






[sponsor__shields_io__liberapay]:
  https://img.shields.io/static/v1?logo=liberapay&label=Sponsor&message=S0AndS0

[sponsor__link__liberapay]:
  https://liberapay.com/S0AndS0
  "&#x1F4B1; Sponsor developments and projects that S0AndS0 maintains via Liberapay"



[badge__github_actions]:
  https://github.com/S0AndS0/public-resume/actions/workflows/pages.yaml/badge.svg?branch=main

[activity_log__github_actions]:
  https://github.com/S0AndS0/public-resume/deployments/activity_log

