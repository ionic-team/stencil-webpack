[![npm][npm-badge]][npm-badge-url]
# Stencil: A Compiler for Web Components

Stencil is a simple compiler for generating Web Components.

The webpack plugin allows apps to easily import components using the webpack bundler. The plugin is for apps with build scripts already using a traditional webpack toolchain. However, webpack is not required to use web components built by Stencil since they are already lazy-load themselves on-demand, and use standardized ES Modules imports.

Stencil combines the best concepts of the most popular front-end frameworks into a compile-time rather than a run-time tool. Stencil's output is just Web Components, so they work in any major framework or with no framework at all.


## Import Components

First install the component library to be used, such as:

```
npm install @ionic/core
```

Next, import the component library within the app's entry file, such as:

```js
import `@ionic/core`;
```


### Updating `webpack.config.js`

Webpack will bundle the simple "registry" information of all the components into webpack's main bundle, but it does not include the actual component code. Instead the plugin copies external component assets to webpack's output directory, which allows for the web components to be lazy-loaded on-demand by the browser, and only pull down polyfills when required.

After installing the plugin, modify your `webpack.config.js` file as such:

```
npm install --save-dev @stencil/webpack
```

```js
const stencil = require('@stencil/webpack');

...

  "plugins": [
    new stencil.StencilPlugin()
  ]

```

## Related

* [Stencil](https://stenciljs.com/)
* [Stencil Worldwide Slack](https://stencil-worldwide.slack.com)
* [Ionic Components](https://www.npmjs.com/package/@ionic/core)
* [Ionicons](http://ionicons.com/)


## Contributing

Please see our [Contributor Code of Conduct](https://github.com/ionic-team/ionic/blob/master/CODE_OF_CONDUCT.md) for information on our rules of conduct.

### Creating an Issue

* If you have a question about using this plugin, please ask on the [Stencil Worldwide Slack](https://stencil-worldwide.slack.com) group.

* It is required that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

* The issue list of this repository is exclusively for bug reports and feature requests. Non-conforming issues will be closed immediately.

* Issues with no clear steps to reproduce will not be triaged. If an issue is labeled with "needs reply" and receives no further replies from the author of the issue for more than 5 days, it will be closed.

* If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported](https://github.com/ionic-team/stencil-webpack/issues?utf8=%E2%9C%93&q=is%3Aissue). You can search through existing issues to see if there is a similar one reported. Include closed issues as it may have been closed with a solution.

* Next, [create a new issue](https://github.com/ionic-team/stencil-webpack/issues/new) that thoroughly explains the problem. Please fill out the populated issue form before submitting the issue.

### Creating a Pull Request

* We appreciate you taking the time to contribute! Before submitting a pull request, we ask that you please [create an issue](#creating-an-issue) that explains the bug or feature request and let us know that you plan on creating a pull request for it. If an issue already exists, please comment on that issue letting us know you would like to submit a pull request for it. This helps us to keep track of the pull request and make sure there isn't duplicated effort.

* Looking for an issue to fix? Make sure to look through our issues with the [help wanted](https://github.com/ionic-team/stencil-webkit/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label!

#### Setup

1. Fork the repo.
2. Clone your fork.
3. Make a branch for your change.
4. Run `npm install` (make sure you have [node](https://nodejs.org/en/) and [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) installed first)
5. Run `npm test`

#### Modifying the Plugin

1. Create a test that demonstrates an aspect of the bug or a requirement of the feature
2. Run `npm test` to verify your test fails
3. Write the code
4. Run `npm test` to verify your test passes
4. Repeat

**NOTE**: Only well-tested pull requests will be merged


[npm-badge]: https://img.shields.io/npm/v/@stencil/core.svg
[npm-badge-url]: https://www.npmjs.com/package/@stencil/webpack
