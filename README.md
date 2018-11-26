# Rewire create-react-app to use SASS!

Add SASS to your creat-react-app project without ejecting 

### Use v1.x or v2.x

for [react-app-rewired](https://github.com/timarney/react-app-rewired)

### Use v2.x

for [craco](https://github.com/sharegate/craco)

Inspired by [react-app-rewire-scss](https://github.com/aze3ma/react-app-rewire-scss). It has `withRuleOptions`which allows you to configure the rule options except `test`

## Install

```bash
$ yarn add react-app-rewired react-app-rewire-sass-rule -D
$ npm install react-app-rewired react-app-rewire-sass-rule --save-dev
```

## Usaga
```javascript
/* config-overrides.js */
const SassRuleRewirer = require('react-app-rewire-sass-rule');

// Basic
module.exports = function override(config, env) {
  config = new SassRuleRewirer()
    .rewire(config, env);
  return config;
}

// Advanced
module.exports = function override(config, env) {
  config = new SassRuleRewirer()
    .withRuleOptions({...})
    .withLoaderOptions({...})
    .rewire(config, env);
  return config;
}
```
