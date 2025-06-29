
import { AlphaVantageClient } from "../src/api/alphaAvantageClient";
import {
    GlobalQuoteAPIResponse,
    GlobalQuoteData,
    GlobalQuoteEmptyResponse,
} from "../src/types/globalQuote";
import { GLOBAL_QUOTE_RESPONSE_KEYS } from "./utils/globalQuoteResponseKeys";
import { handleAlphaVantageApiCall } from "./utils/apiTestHelpers";

let apiClient: AlphaVantageClient;
beforeAll(() => {
    apiClient = new AlphaVantageClient();
});

describe("Alpha Vantage Global Quote API Tests", () => {
    test("Should return a global quote for a valid symbol (MSFT) or indicate rate limit", async () => {
        const symbol = "MSFT";
        const response = await handleAlphaVantageApiCall<GlobalQuoteAPIResponse>(
            apiClient.getGlobalQuote(symbol),
            symbol
        );
        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response).toHaveProperty("Global Quote");
        const globalQuote = (response as { "Global Quote": GlobalQuoteData })["Global Quote"];
        expect(typeof globalQuote).toBe("object");
        expect(globalQuote).not.toBeNull();
        expect(globalQuote["01. symbol"]).toBe("MSFT");
        expect(Object.keys(globalQuote)).toEqual(GLOBAL_QUOTE_RESPONSE_KEYS);
        expect(globalQuote["07. latest trading day"]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test("Should return an empty object of Global Quote for a non-existent symbol or indicate rate limit", async () => {
        const symbol = "NONEXISTENTSTOCK1234";
        const response = await handleAlphaVantageApiCall<GlobalQuoteEmptyResponse>(
            apiClient.getGlobalQuote(symbol) as Promise<GlobalQuoteEmptyResponse>,
            symbol
        );
        expect(response).toBeDefined();
        expect(typeof response).toBe("object");     
        expect(response['Global Quote']).toEqual({});
        expect(Object.keys(response['Global Quote'])).toHaveLength(0);     
    });

    test.each(['AAPL', 'GOOG', 'AMZN'])(
        '[Parameterized]: Should return a global quote for valid symbols or indicate rate limit',
        async (symbol) => {
            const response = await handleAlphaVantageApiCall<GlobalQuoteAPIResponse>(
                apiClient.getGlobalQuote(symbol),
                symbol
            );
            expect(response).toBeDefined();
            expect(typeof response).toBe("object");
            expect(response).toHaveProperty("Global Quote");
            const globalQuote = (response as { "Global Quote": GlobalQuoteData })["Global Quote"];
            expect(typeof globalQuote).toBe("object");
            expect(globalQuote["01. symbol"]).toBe(symbol);
            expect(Object.keys(globalQuote)).toEqual(GLOBAL_QUOTE_RESPONSE_KEYS);
        }
    );
});
