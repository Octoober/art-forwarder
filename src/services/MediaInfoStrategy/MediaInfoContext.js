export class MediaInfoContext {
    constructor() {
        this.strategies = new Map();
    }

    setStrategy(domain, strategies) {
        this.strategies.set(domain, strategies);
    }

    executeStrategy(url) {
        const domain = this._extractDomain(url);
        const strategy = this.strategies.get(domain);

        if (strategy) {
            return strategy.collectMediaInfo(url);
        }

        throw new Error('Stategy for ${domain} not found');
    }

    _extractDomain(url) {
        const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/;
        const matches = url.match(domainRegex);

        return matches ? matches[1] : '';
    }
}
