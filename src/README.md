# 🚨 Deprecated 🚨

This package has been deprecated in favor of `DevoInc/App-Developer-Kit`.

Therefore, this repository will serve as archive and will be no longer supported.

You can access the new project repository here: https://github.com/DevoInc/App-Developer-Kit

# Devo Applications Data Library

This library links the charts created in the Devo platform with applications
using the Devo Query API. It also allows for the retrieval of data from an
external source.

The library provides classes that prepare and allow requests to the tables according to
the indicated query, domain, and logged-in user. When
later obtaining the data, it returns the necessary data structure for the widget
in question.

The idea is to use this library as a complementary tool when working with the Devo
Applications Builder.

Check out our [documentation](doc/index.md) for more information.

## Requirements

- Node 14
- npm 7
- Devo account

## Installation

If you want to install this library locally for testing and development
purposes, you must download the Devo Applications Builder and install
it locally. Once installed, follow the steps below:

Install the library

```shell
> npm install
```

Create a symlink

```shell
> cd src
> npm link
```

Link the library with Devo Applications Builder

```shell
> cd /path/to/devo-applications-builder
> npm link @devoinc/applications-data-library
```
