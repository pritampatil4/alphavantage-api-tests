import { GlobalQuoteData } from "../../src/types/globalQuote";

export const GLOBAL_QUOTE_RESPONSE_KEYS: (keyof GlobalQuoteData)[] = [
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
];
