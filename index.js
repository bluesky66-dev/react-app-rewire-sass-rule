const path = require('path');


function loaderNameMatches(rule, loaderName) {
	return rule && rule.loader && typeof rule.loader === 'string' &&
		(rule.loader.indexOf(`${path.sep}${loaderName}${path.sep}`) !== -1 ||
			rule.loader.indexOf(`@${loaderName}${path.sep}`) !== -1);
};

function getLoader(rules, matcher) {
	let loader;

	rules.some(rule => {
		return (loader = matcher(rule)
			? rule
			: getLoader(rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || [], matcher));
	});

	return loader;
};


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

	rewire(config) {
		const sassExtension = /(\.scss|\.sass)$/;
		const fileLoader = getLoader(config.module.rules, rule => loaderNameMatches(rule, 'file-loader'));

		fileLoader.exclude.push(sassExtension);

		const cssRules = getLoader(config.module.rules, rule => String(rule.test) === String(/\.css$/));

		const { use, ...otherRulesOptions } = this.ruleOptions;

		const sassRules = {
			...otherRulesOptions,
			test: sassExtension,
			use: [...cssRules.use, { loader: 'sass-loader', options: this.loaderOptions }].concat(use),
		};

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
