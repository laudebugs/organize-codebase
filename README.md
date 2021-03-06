<h1 align="center">Welcome to organize-codebase 👋</h1>

<p>
  <a href="https://github.com/laudebugs/organize-codebase/actions/workflows/release.yml" target="_blank">
    <img alt="Release Pipeline" src="https://github.com/laudebugs/organize-codebase/actions/workflows/release.yml/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/organize-codebase" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/organize-codebase.svg">
  </a>
  <a href="https://github.com/laudebugs/organize-codebase#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/semantic-release/semantic-release" target="_blank">
    <img alt="Semantic Release: Angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release" />
  </a>
  <a href="https://github.com/laudebugs/organize-codebase/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://twitter.com/laudebugs" target="_blank">
    <img alt="Twitter: laudebugs" src="https://img.shields.io/twitter/follow/laudebugs.svg?style=social" />
  </a>
</p>

> Quickly organize your codebase with useful automation tools in development

### 🏠 [Homepage](https://github.com/laudebugs/organize-codebase)

## Description
This Command Line Tool is useful to get up and running with the most common set ups when maintaining a JavaScript project. It handles setup of the following: 
- [`prettier`](https://prettier.io/) - formatting code
- [`eslint`](https://eslint.org/) - finds and fixes problems in your code
- [`commitlint`](https://commitlint.js.org/#/) - for linting commit messages
- [`commitizen`](http://commitizen.github.io/cz-cli/) - a cli tool to easily create good commit messages
- [`husky`](https://typicode.github.io/husky/#/) - enforces good commit messages/code formatting
- [`standard-version`](https://github.com/conventional-changelog/standard-version) or [`semantic-release`](https://semantic-release.gitbook.io/semantic-release/) - for npm packages


## Usage
As simple as running the following command within your project directory:

```sh
npx organize-codebase
```

## TODO
- [x] Add commit commands to scripts of `package.json`
- [x] Add semantic-release config to `package.json`
- [ ] Add ability to choose prettier format
- [ ] Merge config formats if config format is found in the project
- [ ] Add ability to add more ESLint plugins after setting up ESLint

## Author

👤 **Laurence B. Ininda**

* Website: https://laudebugs.me
* Twitter: [@laudebugs](https://twitter.com/laudebugs)
* Github: [@laudebugs](https://github.com/laudebugs)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/laudebugs/organize-codebase/issues). You can also take a look at the [contributing guide](https://github.com/laudebugs/organize-codebase/blob/master/docs/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Laurence B. Ininda](https://github.com/laudebugs).<br />
This project is [ISC](https://github.com/laudebugs/organize-codebase/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
