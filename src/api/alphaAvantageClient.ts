import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import config from '../../config';
import { GlobalQuoteAPIResponse, AlphaVantageBaseResponse } from '../types/globalQuote';

export class AlphaVantageClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.alphaVantageBaseUrl,
            timeout: 15000,
            params: {
                apikey: config.alphaVantageApiKey,
            },
        });

        this.client.interceptors.response.use(
            response => response,
            (error: AxiosError) => {
                if (error.response) {
                    console.error(
                        `[API Client Error] Request failed with status ${error.response.status}:`,
                        error.response.data
                    );
                } else if (error.request) {
                    console.error('[API Client Error] No response received:', error.request);
                } else {
                    console.error('[API Client Error] Error setting up request:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Retrieves the global quote for a given stock symbol.
     * @param symbol The stock ticker symbol (e.g., "IBM").
     * @returns A promise that resolves to the API response data.
     */
    public async getGlobalQuote(symbol: string): Promise<GlobalQuoteAPIResponse> {
        const params = {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
        };
        const response: AxiosResponse<GlobalQuoteAPIResponse> = await this.client.get('', { params });
        return response.data;
    }
}
