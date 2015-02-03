# Neo
### Modular isomorphic Fluxible web application platform

> Warning: This project is in very early conceptual development phase.

Neo is a nu-generation web application platform. Neo presents a modular and pluggable architecture, designed to be 
composable, flexible and scalable.

Although Neo prescribes an opinionated project structure and Flux pattern - it favours convention over configuration and 
does not aim to be another full fat framework - rather a pluggable platform, allowing you to plug the features your app, 
or cluster of apps, require.

## Neo Architecture

Neo's core architecture is build on top of these great libraries:

- [React](http://facebook.github.io/react/)
- [Fluxible](http://www.fluxible.io/)
- [Express](http://expressjs.com/)
- [Webpack](http://webpack.github.io/)
- [Gulp](http://gulpjs.com/)
- [Jest](http://facebook.github.io/jest/)

TODO: Overview of architectural principles:

#### Flux

TODO: Overview of Flux in Neo's architecture

#### Fluxible & React

TODO: Overview of Fluxible & React's role in Neo's architecture

#### Server

TODO: Overview of Neo's server, boot cycle and cluster engine

####  Client

TODO: Overview of Neo's client feature

## Neo Concepts
 
### Atomic design

Traditionally files of type are grouped together eg. Styles, Images, Models, Services etc. 
Neo implements an atomic design pattern, where resources required to provide a feature are grouped together into a module folder.
This practices aims to:

- break project features into DRY and modular encapsulated sections
- favour composability over inheritance
- promote feature and component re-use
- be declarative, not imperative

#### Modularity

Each module, be it a feature, component, service or theme, contains all the markup, scripting, styling and any other assets
required to render or encapsulate itself.
A module may, and is promoted to be, composed of other modules.

### Pods

Web applications in Neo are organised into Pods. 
All web application features are grouped together in sub folders within the Pods folder.

Fluxible web application pods have the following structure:

```

    /[pod-name]
        /components (React components)
            /[ComponentName]
                /images
                [ComponentName].jsx
                [ComponentName].less
        /public (Destination for webpack built assets; images, fonts, css, scripts)
        /theme
            /[framework-name] (bootstrap, foundation, skeleton etc imports)
                _[framework-name].less
            /[brand] (brand specific styles)
                /fonts
                /images
                _[brand].less
                _[brand]-[framework-name]-variables.less
                _[brand]-fonts.less
            theme.less
        /views (Fluxible Controller Views)
            /App
                App.jsx
                AppStore.js
            /[FeatureName]
                /images
                [FeatureName].jsx
                [FeatureName].less
            Index.jsx
        bower.json
        client.js
        package.json
        routes.js
        webpack.config

```

Pods have access to the Neo Global components, features and plugins.

#### Pod Configuration

TODO: describe configuring pods in Neo

### Global

TODO: Introduce Neo Global 

#### Components

TODO: Introduce the Global components folder

#### Features

TODO: Introduce the Global features folder

#### Plugins

TODO: Introduce the Global plugins folder

## Style Guide

TODO: Suggested Neo style guide

## Getting started

TODO: Getting Started guide

## Issue Submission

TODO: Issue submission guide and libs repos

## Contribution

TODO: Contribution guide

## License

MIT
