import { AlphaVantageAPIRateLimitError } from '../../src/types/errors';

/**
 * Executes an Alpha Vantage API call and handles AlphaVantageAPIRateLimitError gracefully.
 * Logs a warning if a rate limit is detected and returns null. Other errors are re-thrown.
 *
 * @template T The expected type of the API response.
 * @param apiCallPromise The Promise representing the API call (e.g., apiClient.getGlobalQuote(symbol)).
 * @param symbol The symbol associated with the API call, used for logging purposes.
 * @returns A Promise resolving to the API response of type T on success, or `null` if a rate limit error occurred.
 */
export async function handleAlphaVantageApiCall<T>(
    apiCallPromise: Promise<T>,
    symbol: string
): Promise<T | null> {
    try {
        return await apiCallPromise;
    } catch (error) {
        if (error instanceof AlphaVantageAPIRateLimitError) {
            console.warn(`API Rate Limit Detected for ${symbol} (Test Passed by Design): ${error.message}`);
            return null; 
        }
        throw error;
    }
}
