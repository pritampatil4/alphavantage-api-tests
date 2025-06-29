export class AlphaVantageAPIRateLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AlphaVantageRateLimitError';
    }
}
