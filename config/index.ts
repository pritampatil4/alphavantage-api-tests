import dotenv from 'dotenv';
dotenv.config(); 
interface AppConfig {
    alphaVantageApiKey: string;
    alphaVantageBaseUrl: string;
}

const config: AppConfig = {
    alphaVantageApiKey: process.env.ALPHAVANTAGE_API_KEY || '', 
    alphaVantageBaseUrl: 'https://www.alphavantage.co/query',
};

if (!config.alphaVantageApiKey) {
    console.error('CRITICAL ERROR: ALPHAVANTAGE_API_KEY is not set in your .env file or environment variables.');
    console.error('Please get a free API key from https://www.alphavantage.co/support/#api-key and set it.');
    process.exit(1);
}
export default config;
