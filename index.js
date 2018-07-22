const { getLoader, loaderNameMatches } = require('react-app-rewired');

class SassRuleRewirer {
	constructor() {
		this.loaderOptions = {};
	}

	withLoaderOptions(loaderOptions) {
		this.loaderOptions = loaderOptions;
		return this;
	}

	withRuleOptions(ruleOptions) {
		this.ruleOptions = ruleOptions;
		return this;
	}

	rewire(config, env) {
		const sassExtension = /(\.scss|\.sass)$/;
		const isDev = env !== 'production';
		const fileLoader = getLoader(config.module.rules, rule => loaderNameMatches(rule, 'file-loader'));

		fileLoader.exclude.push(sassExtension);

		const cssRules = getLoader(config.module.rules, rule => String(rule.test) === String(/\.css$/));
		var sassRules;

		if (isDev) {
			sassRules = {
				...this.ruleOptions,
				test: sassExtension,
				use: [...cssRules.use, { loader: 'sass-loader', options: this.loaderOptions }],
			};
		} else {
			sassRules = {
				...this.ruleOptions,
				test: sassExtension,
				use: [...cssRules.loader, { loader: 'sass-loader', options: this.loaderOptions }],
			};
		}

		const oneOfRule = config.module.rules
			.find(rule => rule.oneOf != null);

		if (oneOfRule) {
			oneOfRule.oneOf.unshift(sassRules);
		} else {
			config.module.rules.push(sassRules);
		}

		return config;
	}
}

module.exports = SassRuleRewirer;
