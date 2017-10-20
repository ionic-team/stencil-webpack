[![npm][npm-badge]][npm-badge-url]
# Stencil: A Compiler for Web Components

Stencil is a simple compiler for generating Web Components.

Stencil combines the best concepts of the most popular front-end frameworks into a compile-time rather than a run-time tool.  Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all. In many cases, Stencil can be used as a drop-in replacement for traditional frontend frameworks given the capabilities now available in the browser, though using it as such is certainly not required.

The Stencil Webpack Plugin allows you to easily use Stencil Component Collections with applications that are built using Webpack.

## Using the Plugin

Using this plugin is a two-step process. You must import your collections into your project code at some appropriate location depending on the architecture of your application, and you must update your `webpack.config.js` file.

### Importing the Collections

In order to use your component collections within an application, you generally have to import them in some manner. This will result in Webpack adding the appropriate Stencil loader scripting to the appropriate bundle.

#### Angular

In an Angular application, you should add the component collection imports to the `app.module.ts` file. You should also make sure you are using the `CUSTOM_ELEMENTS_SCHEMA` as in the following example.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 
import { AppComponent } from './app.component';
 
import 'accounting-components';
import 'payroll-components';
import 'purchasing-components';
import 'web-components';
 
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
```

### Updating `webpack.config.js`

Once you have the proper Stencil loader scripts bundling with your project, you need to have the collections copied to a known location in the build so the loader can load them as needed. This is where the Stencil Webpack Plugin is used.

After installing the plugin, modify your `webpack.config.js` file as such:

```js
const stencil = require('@stencil/webpack');

...


  "plugins": [
    new stencil.StencilPlugin({
      collections: [
        'node-modules/accounting-components',
        'node-modules/payroll-components',
        'node-modules/purchasing-components',
        'node-modules/web-components'
    ]}),

```

The plugin constructor takes a configuration object. At this time, the only property in this object is the `collections` property. This is in order to support future options.

The `collections` property contains an array of component collections you would like to use. If you only have one collection, you can specify just a string instead of an array of strings.

The component collections do not have to be installed in `node-modules` if you do not want to publish them to an NPM registry (though publishing them to either the public registry or to a private registry is suggested). You could, for example, install them in a `web-components` directory if you so desired. Manually copying the component collections as such is beyond the scope of this document.

Once you have this set up, a build (`npm run build` for example) will copy the components to a `build` directory under the output directory for the build following usual Stencil conventions.

**Important:** If you are in an Angular CLI project, you must first eject the project in order to modify the `webpack.config.js` file.


## Contributing

Please see our [Contributor Code of Conduct](https://github.com/ionic-team/ionic/blob/master/CODE_OF_CONDUCT.md) for information on our rules of conduct.

### Creating an Issue

* If you have a question about using this plugin, please ask on the [Stencil Worldwide Slac](https://stencil-worldwide.slack.com) group.

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
