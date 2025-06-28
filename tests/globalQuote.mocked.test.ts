// tests/globalQuote.mocked.test.ts

import { AlphaVantageClient } from "../src/api/alphaAvantageClient";
import {
    GlobalQuoteAPIResponse,
    GlobalQuoteData,
    isGlobalQuoteEmptyResponse
} from "../src/types/globalQuote";
import { AlphaVantageAPIRateLimitError } from "../src/types/errors";
import { GLOBAL_QUOTE_RESPONSE_KEYS } from "./utils/globalQuoteResponseKeys";


const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),

    interceptors: {
        request: {
            use: jest.fn(),
            eject: jest.fn(),
        },
        response: {
            use: jest.fn(),
            eject: jest.fn(),
        },
    },

};

jest.mock('axios', () => {
    const mockedAxios = {
        create: jest.fn(() => mockAxiosInstance),
    };
    return mockedAxios;
});


import axios from 'axios';

const mockedAxiosCreate = axios.create as jest.MockedFunction<typeof axios.create>;
const mockedAxiosGet = mockAxiosInstance.get as jest.MockedFunction<typeof mockAxiosInstance.get>;


let apiClient: AlphaVantageClient;

beforeEach(() => {
    mockedAxiosGet.mockClear();
    mockedAxiosCreate.mockClear();
    apiClient = new AlphaVantageClient();
});

describe("Alpha Vantage Global Quote API Tests (MOCKED)", () => {
    test("Should return a global quote for a valid symbol (MSFT) when API responds successfully", async () => {
        const symbol = "MSFT";
        const mockSuccessResponse: GlobalQuoteAPIResponse = {
            "Global Quote": {
                "01. symbol": "MSFT",
                "02. open": "100.00",
                "03. high": "105.00",
                "04. low": "99.00",
                "05. price": "104.50",
                "06. volume": "1000000",
                "07. latest trading day": "2025-06-27",
                "08. previous close": "100.00",
                "09. change": "4.50",
                "10. change percent": "4.5000%"
            }
        };
        mockedAxiosGet.mockResolvedValueOnce({ data: mockSuccessResponse });
        const response = await apiClient.getGlobalQuote(symbol);
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
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
    });

    test("Should return an empty Global Quote for a non-existent symbol when API responds as empty", async () => {
        const symbol = "NONEXISTENTSTOCK1234";
        const mockEmptyResponse: GlobalQuoteAPIResponse = {
            "Global Quote": {}
        };
        mockedAxiosGet.mockResolvedValueOnce({ data: mockEmptyResponse });
        const response = await apiClient.getGlobalQuote(symbol);
        expect(mockedAxiosGet).toHaveBeenCalledTimes(1);
        expect(response).toHaveProperty('Global Quote');
        if (isGlobalQuoteEmptyResponse(response)) {
            expect(response['Global Quote']).toEqual({});
            expect(Object.keys(response['Global Quote'])).toHaveLength(0);
        } else {
            fail('Expected an empty Global Quote response, but received a non-empty one.');
        }
    });

    test.skip("Should throw AlphaVantageAPIRateLimitError when API responds with a rate limit message", async () => {
        const symbol = "TESTSYMBOL";
        const rateLimitMessage = "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ to upgrade your membership.";
        mockedAxiosGet.mockResolvedValueOnce({
            data: {
                "Information": rateLimitMessage
            }
        });
        await expect(apiClient.getGlobalQuote(symbol)).rejects.toThrow(AlphaVantageAPIRateLimitError);
        await expect(apiClient.getGlobalQuote(symbol)).rejects.toThrow(rateLimitMessage);
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
