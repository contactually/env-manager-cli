# env-manager-cli
Contactually's environmental variable management CLI. It updates your local `.env` as well as runs the commands for your staging and production values.

[![Build Status](https://travis-ci.org/contactually/env-manager-cli.svg?branch=master)](https://travis-ci.org/contactually/env-manager-cli)
[![Coverage Status](https://coveralls.io/repos/github/contactually/env-manager-cli/badge.svg?branch=master)](https://coveralls.io/github/contactually/env-manager-cli?branch=master)

![Demo](https://github.com/contactually/env-manager-cli/blob/master/demo.gif?raw=true)


### Installation

```
yarn add --dev env-manager-cli
```

### Implementation
`envManager.js`
```javascript
import envManager from 'env-manager-cli'

envManager({
  stagingCommand: (key, value) => `heroku config:set ${key}=${value} test`,
  productionCommand: (key, value) => `heroku config:set ${key}=${value} prod`
})
```
`package.json`
```javascript

  "scripts": {
    "env:set": "node ./envManager",
  },
```

now running `yarn env:set` will result in the following prompt

### Configuration

  * **envFilePath**: `String` *Optional* this is the path to your local .env file. The default is "./.env"
  * **stagingCommand**: `Function` a function which accepts a key and value, and returns the staging update command. This will be logged and executed in the terminal
  * **productionCommand**: `Function` a function which accepts a key and value, and returns the production update command. This will be logged and executed in the terminal
