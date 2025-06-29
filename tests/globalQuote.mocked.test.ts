import axios from 'axios';
import { AlphaVantageClient } from "../src/api/alphaAvantageClient";
import {
    GlobalQuoteAPIResponse,
    GlobalQuoteData,
    GlobalQuoteEmptyResponse,
} from "../src/types/globalQuote";
import { AlphaVantageAPIRateLimitError } from "../src/types/errors";
import { GLOBAL_QUOTE_RESPONSE_KEYS } from "./utils/globalQuoteResponseKeys";
import { globalQuoteMockResponse } from "./utils/globalQuoteMockResponse";
import { mockAxiosInstance } from "./utils/mockAxiosInstance";

jest.mock('axios', () => {
    const mockedAxios = {
        create: jest.fn(() => mockAxiosInstance),
    };
    return mockedAxios;
});

describe("Alpha Vantage Global Quote API Tests (MOCKED)", () => {
    const mockedAxiosCreate = axios.create as jest.MockedFunction<typeof axios.create>;
    const mockedAxiosGet = mockAxiosInstance.get as jest.MockedFunction<typeof mockAxiosInstance.get>;

    let apiClient: AlphaVantageClient;

    beforeEach(() => {
        mockedAxiosGet.mockClear();
        mockedAxiosCreate.mockClear();
        apiClient = new AlphaVantageClient();
    });

    test("Should return a global quote for a valid symbol (MSFT) when API responds successfully", async () => {
        const symbol = "MSFT";
        mockedAxiosGet.mockResolvedValueOnce({ data: globalQuoteMockResponse });
        const response = await apiClient.getGlobalQuote(symbol);
        expect(mockedAxiosGet).toHaveBeenCalledWith(
            '', //base url is already set in the client
            {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                },
            }
        );
        expect(response).toBeDefined();
        expect(response).toHaveProperty("Global Quote");
        const globalQuote = (response as { "Global Quote": GlobalQuoteData })["Global Quote"];
        expect(typeof globalQuote).toBe("object");
        expect(globalQuote).not.toBeNull();
        expect(globalQuote["01. symbol"]).toBe("MSFT");
        expect(Object.keys(globalQuote)).toEqual(GLOBAL_QUOTE_RESPONSE_KEYS);
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
    });

    test("Should return an empty Global Quote for a non-existent symbol when API responds as empty", async () => {
        const symbol = "NONEXISTENTSTOCK1234";
        const mockEmptyResponse: GlobalQuoteEmptyResponse = { "Global Quote": {} };
        mockedAxiosGet.mockResolvedValueOnce({ data: mockEmptyResponse });
        const response = await apiClient.getGlobalQuote(symbol) as GlobalQuoteEmptyResponse;
        expect(response).toHaveProperty('Global Quote');
        expect(response['Global Quote']).toEqual({});
        expect(Object.keys(response['Global Quote'])).toHaveLength(0);
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);

    });

    test("Should throw AlphaVantageAPIRateLimitError when API responds with a rate limit message", async () => {
        const symbol = "TESTSYMBOL";
        const rateLimitMessage = "Alpha Vantage Rate Limit Exceeded";
        mockedAxiosGet.mockImplementationOnce(async () => {
            const response = {
                data: {
                    "Information": rateLimitMessage
                }
            };
            throw new AlphaVantageAPIRateLimitError(response.data.Information);
        });
        try {
            await apiClient.getGlobalQuote(symbol);
        } catch (error) {
            expect(error).toBeInstanceOf(AlphaVantageAPIRateLimitError);
            expect((error as AlphaVantageAPIRateLimitError).message).toBe(rateLimitMessage);
        }
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
    });

    test("Should throw a generic error for an unexpected API error response", async () => {
        const symbol = "ERRORTEST";
        const errorMessage = "Internal Server Error";
        mockedAxiosGet.mockRejectedValueOnce(new Error(errorMessage));
        await expect(apiClient.getGlobalQuote(symbol)).rejects.toThrow(errorMessage);
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
    });
});
