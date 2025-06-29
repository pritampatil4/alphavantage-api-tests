
export interface AlphaVantageBaseResponse {
    "Error Message"?: string;
    "Note"?: string;
}

export interface GlobalQuoteData {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
}

export interface GlobalQuoteSuccessResponse extends AlphaVantageBaseResponse {
    "Global Quote": GlobalQuoteData;
}

export interface AlphaVantageInformationResponse extends AlphaVantageBaseResponse {
    "Information": string;
}

type EmptyObject = Record<string, never>;

export interface GlobalQuoteEmptyResponse extends AlphaVantageBaseResponse {
    "Global Quote": EmptyObject; 
}


export type GlobalQuoteAPIResponse =
    GlobalQuoteSuccessResponse |
    GlobalQuoteEmptyResponse |         
    AlphaVantageBaseResponse |
    AlphaVantageInformationResponse; 
