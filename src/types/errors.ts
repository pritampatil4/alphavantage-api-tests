export class AlphaVantageAPIRateLimitError extends Error {
    constructor(message: string) {
        super(`Alpha Vantage Rate Limit Exceeded: ${message}`);
        this.name = 'AlphaVantageRateLimitError';
    }
}
