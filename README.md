# OpenAds-appnexus
[![Build Status](https://travis-ci.org/scm-spain/OpenAds-appnexus.svg?branch=master)](https://travis-ci.org/scm-spain/OpenAds-appnexus)

[OpenAds](https://github.com/scm-spain/OpenAds) AppNexus seller tag module for handle ads.

OpenAds now support sources as modules by configuration so you can include whatever module available you want.
To build your own module take a look at the section ```Build your own module```

# Installation
AppNexus module is available as the ```@schibstedspain/openads-appnexus``` package on [npm](https://www.npmjs.com/)

To install the stable version:
```
npm install --save @schibstedspain/openads-appnexus
```

# Usage

To use it with OpenAds first you must install and import OpenAds as explained in the [readme](https://github.com/scm-spain/OpenAds)
After that you must init the AppNexusConnector with the configuration member account
Now you are able to put the instance as a source available in OpenAds configuration

```ecmascript 6
import OpenAds from '@schibstedspain/openads'
import AppNexusConnector from '@schibstedspain/openads-appnexus'

const appNexusConnector = AppNexusConnector.init({
  config: {
    pageOpts: {
        member: 4242
    }
  }
})

const openAds = OpenAds.init({config:{
  Sources: {
    AppNexus: appNexusConnector
  }
}})
```

This connector implements these [Connector API](https://github.com/scm-spain/OpenAds-ConnectorAPI) interfaces:
* AdViewable
* AdLoadable
* Logger

# Specification

In order to make calls according to the Connector API, you'll need to set up the _specification_ data into the *loadAd* and *refresh* methods like this:

```
loadAd({
    id: 'ad-1'
    specification: {
        source: 'AppNexusConnector' // the name you've given to your AppNexusConnector instance
        appnexus: {
            targetId: 'ad-1',
            keywords: {...}
            invCode: '...'
        }
        // appnexus is required to take the data and send it to the AST (AppNexus Seller Tag)
        // It has to contain the data as it's specified in the AST API Reference
    }
})
```

# Build your own module
All modules to work fine with OpenAds must **implement** at least one interface of type AdLoadable or AdViewable
The idea is that your module implements only the interfaces that support, for example AppNexus supports both

# License
OpenAds is [MIT licensed](./LICENSE).
