
import { AlphaVantageClient } from "../src/api/alphaAvantageClient";
import {
    GlobalQuoteAPIResponse,
    GlobalQuoteData,
    isGlobalQuoteEmptyResponse
} from "../src/types/globalQuote";
import { AlphaVantageAPIRateLimitError } from "../src/types/errors";

let apiClient: AlphaVantageClient;
beforeAll(() => {
    apiClient = new AlphaVantageClient();
});

describe("AlphaVantage Global Quote API Tests", () => {
    test("Should return a global quote for a valid symbol (MSFT) or indicate rate limit", async () => {
        const symbol = "MSFT";
        const responseKeys = [
            '01. symbol',
            '02. open',
            '03. high',
            '04. low',
            '05. price',
            '06. volume',
            '07. latest trading day',
            '08. previous close',
            '09. change',
            '10. change percent'
        ]
        try {
            const response: GlobalQuoteAPIResponse = await apiClient.getGlobalQuote(symbol);
            expect(response).toBeDefined();
            expect(typeof response).toBe("object");
            expect(response).toHaveProperty("Global Quote");
            const globalQuote = (response as { "Global Quote": GlobalQuoteData })["Global Quote"];
            expect(typeof globalQuote).toBe("object");
            expect(globalQuote).not.toBeNull();
            expect(globalQuote["01. symbol"]).toBe("MSFT");
            expect(Object.keys(globalQuote)).toEqual(responseKeys);
            expect(globalQuote["07. latest trading day"]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        } catch (error) {
            if (error instanceof AlphaVantageAPIRateLimitError) {
                console.warn(
                    `API Rate Limit Detected for ${symbol} (Test Passed by Design): ${error.message}`
                );
            } else {
                throw error;
            }
        }
    });

    test("Should return an empty object of Global Quote for a non-existent symbol", async () => {
        const symbol = "NONEXISTENTSTOCK1234";
        try {
            const response: GlobalQuoteAPIResponse = await apiClient.getGlobalQuote(symbol);  
            expect(response).toBeDefined();
            expect(typeof response).toBe("object");
            if (isGlobalQuoteEmptyResponse(response)) {
                expect(response['Global Quote']).toEqual({});
                expect(Object.keys(response['Global Quote'])).toHaveLength(0);
            }
        } catch (error) {
            if (error instanceof AlphaVantageAPIRateLimitError) {
                console.warn(
                    `API Rate Limit Detected for ${symbol} (Test Passed by Design - Thrown Error): ${error.message}`
                );
            } else {
                throw error; 
            }
        }
    });
});
