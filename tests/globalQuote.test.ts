import { AlphaVantageClient } from "../src/api/alphaAvantageClient";
import {
    GlobalQuoteAPIResponse,
    GlobalQuoteData,
} from "../src/types/globalQuote";
import { AlphaVantageAPIRateLimitError } from "../src/types/errors";

let apiClient: AlphaVantageClient;
beforeAll(() => {
    apiClient = new AlphaVantageClient();
});

describe("AlphaVantage Global Quote API Tests", () => {
    test("Should return a global quote for a valid symbol (MSFT) or indicate rate limit", async () => {
        const symbol = "MSFT";
        try {
            const response: GlobalQuoteAPIResponse = await apiClient.getGlobalQuote(symbol);
            expect(response).toBeDefined();
            expect(response).toHaveProperty("Global Quote");
            const globalQuote = (response as { "Global Quote": GlobalQuoteData })["Global Quote"];
            expect(globalQuote).toHaveProperty("01. symbol");
            expect(globalQuote["01. symbol"]).toBe(symbol);
            expect(globalQuote).toHaveProperty("02. open");
            expect(globalQuote).toHaveProperty("03. high");
            expect(globalQuote).toHaveProperty("04. low");
            expect(globalQuote).toHaveProperty("05. price");
            expect(globalQuote).toHaveProperty("06. volume");
            expect(globalQuote).toHaveProperty("07. latest trading day");
            expect(globalQuote["07. latest trading day"]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(globalQuote).toHaveProperty("08. previous close");
            expect(globalQuote).toHaveProperty("09. change");
            expect(globalQuote).toHaveProperty("10. change percent");
        } catch (error) {
            if (error instanceof AlphaVantageAPIRateLimitError) {
                console.warn(
                    `API Rate Limit Detected for ${symbol} (Test Passed by Design): ${error.message}`
                );
            } else {
                fail(`Test failed with unexpected error: ${error}`);
            }
        }
    });
});
