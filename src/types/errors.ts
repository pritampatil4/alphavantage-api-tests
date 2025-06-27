export class AlphaVantageAPIRateLimitError extends Error {
    constructor(message: string) {
        super(`AlphaVantage Rate Limit Exceeded: ${message}`);
        this.name = 'AlphaVantageRateLimitError';
    }
}
