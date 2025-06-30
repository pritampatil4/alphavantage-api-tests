# AlphaVantage API Test Automation Framework

This project provides a well-structured automated testing framework for the AlphaVantage API, focusing on the `GLOBAL_QUOTE` endpoint. 

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Technology Stack](#2-technology-stack)
3.  [Setup Instructions](#3-setup-instructions)
4.  [Running the Tests](#4-running-the-tests)
    * [Run All Tests](#run-all-tests)
    * [Run Only Mocked Tests](#run-only-mocked-tests)
    * [Run Only Live/Integration Tests](#run-only-liveintegration-tests)
    * [Viewing the HTML Test Report](#viewing-the-html-test-report)
    * [Accessing Historical Reports (GitHub Actions)](#accessing-historical-reports-github-actions)
5.  [Client Architecture Notes](#5-client-architecture-notes)
6.  [Test Cases Overview - `GLOBAL_QUOTE` Endpoint](#6-test-cases-overview---global_quote-endpoint)
7.  [Automated Test Cases (Chosen for Demonstration)](#7-automated-test-cases-chosen-for-demonstration)
8.  [Future Enhancements](#8-future-enhancements)

---

## 1. Project Overview

This framework is designed to validate the functionality and error handling of the AlphaVantage API's `GLOBAL_QUOTE` endpoint. It features a custom API client (`AlphaVantageClient`) built with Axios, which includes robust error handling through interceptors. The test suite leverages Jest for testing, with a clear separation between tests that interact with the live API and those that use mocking for predictable and fast execution. An HTML report is generated for easy result visualization.

## 2. Technology Stack

* **Node.js (v20+):** Runtime environment for executing JavaScript/TypeScript code.
* **TypeScript:** Provides static type checking for improved code quality, maintainability, and developer experience.
* **Jest:** A powerful and widely-used JavaScript testing framework for unit and integration tests.
* **Axios:** A promise-based HTTP client for making API requests.
* **`jest-html-reporter`:** A simple HTML reporter for Jest, providing a visual summary of test results.

**Rationale for Choices:** Jest is simple, fast, and great for mocking, making it ideal for API testing. Playwright can be added later for end-to-end or browser-related tests. TypeScript adds type safety, Axios handles API calls, and the HTML reporter makes test results easy to read and share.

## 3. Setup Instructions

To set up and run the tests locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pritampatil4/alphavantage-api-tests.git
    cd alphavantage-api-tests
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure AlphaVantage API Key:**
    * Obtain a free API Key from [AlphaVantage](https://www.alphavantage.co/support/#api-key).
    * Create a `.env` file in the project root (check .env.example).
    * Add your API key to the `.env` file:
        ```
        ALPHAVANTAGE_API_KEY=YOUR_API_KEY_HERE
        ```
    * **Note:** For GitHub Actions, ensure you've added `ALPHAVANTAGE_API_KEY` as a repository secret.

## 4. Running the Tests

The `package.json` includes scripts to run different subsets of tests.

### Run All Tests

This command will execute all test files (`.test.ts` and `.mocked.test.ts`).

```bash
npm test
# or yarn test
````

### Run Only Mocked Tests

This command will execute only the tests located in files named `*.mocked.test.ts`. These tests do not make actual calls to Alpha Vantage API .

```bash
npm run test:mocked
# or yarn test:mocked
```

### Run Only Live/Integration Tests

This command will execute tests that are NOT named `*.mocked.test.ts`. These tests will attempt to make actual network calls to the AlphaVantage API.

```bash
npm run test:live
# or yarn test:live
```

### Viewing the HTML Test Report

After any test run, an HTML report will be generated in the `reports` folder:

  * **`test-report.html`**: Open this file in your web browser to view a detailed summary of the test results.

This folder is automatically generated/overwritten with the latest test results and is ignored by Git (`.gitignore`).

### Accessing Historical Reports (GitHub Actions)

For historical test reports, refer to the GitHub Actions workflow runs:

1.  Go to this GitHub repository.
2.  Click on the **Actions** tab.
3.  Select the workflow run you are interested in.
4.  In the "Summary" section, locate and download the "Artifacts" (e.g., `test-report-<commit-sha>.zip`).
5.  Unzip the downloaded file to access the `test-report.html` from that specific run.

## 5\. Client Architecture Notes

The `AlphaVantageClient` (`src/api/alphaAvantageClient.ts`) is built using Axios and incorporates a robust response interceptor. This interceptor is crucial for:

  * **Centralized Error Handling:** It inspects the API response data for specific AlphaVantage error patterns (like `"Information"` for rate limits or `"Error Message"` for general API errors).
  * **Custom Error Throwing:** Upon detecting these patterns, it throws custom error class (`AlphaVantageAPIRateLimitError`) making error handling in the calling code explicit and type-safe.
  * **Implicit HTTP Status Code Validation:** It's important to note that explicit HTTP status code assertions (e.g., expect(response.status).toBe(200)) are not present in the tests. This is by design. Axios, by default, automatically rejects promises for non-2xx HTTP status codes, which is handled by the interceptor's error path.
  * **Separation of Concerns:** This approach ensures that the core API call methods (e.g., `getGlobalQuote`) remain clean and focused on making the request, while error interpretation is handled systematically.

This design choice enhances the client's reliability and makes the test suite more effective at validating error paths.

## 6\. Test Cases Overview - `GLOBAL_QUOTE` Endpoint

This section outlines the designed test cases for the `GLOBAL_QUOTE` endpoint, covering both successful operations and various error conditions. The `function=GLOBAL_QUOTE` parameter is always kept fixed in API calls because the goal is to test how the `GLOBAL_QUOTE` endpoint behaves, not to test the `function` parameter itself.

-----

### **1. Successful Operation: Valid Symbol Returns Complete Data**

  * **Test Case ID:** GQ-001
  * **Description:** Verify that calling the `getGlobalQuote` method with a valid stock symbol returns a complete and correctly structured global quote response.
  * **Preconditions:** Alpha Vantage API Key configured.
  * **Steps to Reproduce:**
    1.  Call the `getGlobalQuote` method with a known valid stock symbol (e.g., "MSFT").
  * **Expected Result:**
      * The API client returns a successful response object.
      * The response contains a "Global Quote" object.
      * The "Global Quote" object contains all expected fields (symbol, open, high, low, price, volume, etc.) with valid data types and non-empty values.
  * **Automation Status:** Automated
  * **Corresponding Automated Test:** `tests/globalQuote.test.ts` -\> "Should return a global quote for a valid symbol (MSFT) or indicate rate limit"

-----

### **2. Successful Operation: Non-Existent Symbol Returns Empty Data**

  * **Test Case ID:** GQ-002
  * **Description:** Verify that calling the `getGlobalQuote` method with a symbol that does not exist returns an empty `Global Quote` object as per Alpha Vantage API's specification.
  * **Preconditions:** Alpha Vantage API Key configured.
  * **Steps to Reproduce:**
    1.  Call the `getGlobalQuote` method with a highly unlikely or fictional stock symbol (e.g., "NONEXISTENTSTOCK1234").
  * **Expected Result:**
      * The API client returns a successful response object.
      * The response contains a "Global Quote" object.
      * The "Global Quote" object is empty (`{}`).
  * **Automation Status:** Automated
  * **Corresponding Automated Test:** `tests/globalQuote.test.ts` -\> "Should return an empty object of Global Quote for a non-existent symbol or indicate rate limit"
-----

### **3. Error Condition: API Rate Limit Exceeded**

  * **Test Case ID:** GQ-003
  * **Description:** Verify that the API client correctly identifies and handles responses indicating that the Alpha Vantage API rate limit has been reached, throwing a specific `AlphaVantageAPIRateLimitError`.
  * **Preconditions:** Alpha Vantage API Key configured.
  * **Steps to Reproduce:**
    (Manual Scenario): Make more than 25 calls per day to the live Alpha Vantage API.
  * **Expected Result:**
      * The `getGlobalQuote` method throws an `AlphaVantageAPIRateLimitError`.
      * The error message includes text like "Alpha Vantage Rate Limit Exceeded..."
  * **Automation Status:** Automated
  * **Corresponding Automated Test:** `tests/globalQuote.mocked.test.ts` -\> "Should throw AlphaVantageAPIRateLimitError when API responds with a rate limit message"

-----

### **4. Error Condition: General API Error Message**

  * **Test Case ID:** GQ-004
  * **Description:** Verify that the API client correctly identifies and handles responses containing a general `"Error Message"` from Alpha Vantage (e.g., invalid API key, invalid function parameter), throwing a specific error.
  * **Preconditions:** Alpha Vantage API Key configured.
  * **Steps to Reproduce:**
    1.  (Manual Scenario 1): Use an intentionally incorrect or revoked API key in the client configuration.
    2.  (Manual Scenario 2): Attempt to call the API with a malformed `function` parameter (if possible via the client).
    3.  Call the `getGlobalQuote` method.
  * **Expected Result:**
      * The `getGlobalQuote` method throws an error.
      * The error message reflects the specific API error (e.g., "Invalid API Key...", "Invalid function call...").
  * **Automation Status:** Manual (Mocked version can be added, but not chosen for primary demo)

-----

### **5. Error Condition: Network/HTTP Level Error**

  * **Test Case ID:** GQ-005
  * **Description:** Verify that the API client robustly handles underlying network or HTTP-level errors (e.g., server unavailable, connection timeout, 5xx status codes).
  * **Preconditions:** Alpha Vantage API Key configured.
  * **Steps to Reproduce:**
    1.  (Manual Scenario 1): Temporarily block network access to `www.alphavantage.co`.
    2.  (Manual Scenario 2): Simulate a server-side error (this would be through mocking in automation, harder manually).
    3.  Call the `getGlobalQuote` method.
  * **Expected Result:**
      * The `getGlobalQuote` method throws an `AxiosError` or a similar network-related error.
      * The error might include details like HTTP status code (e.g., 500) or network message (e.g., "Network Error").
  * **Automation Status:** Automated
  * **Corresponding Automated Test:** `tests/globalQuote.mocked.test.ts` -\> "Should throw a generic error for an unexpected API error response"

-----

## 7\. Automated Test Cases (Chosen for Demonstration)

As per the assignment's focus on quality and thoughtfulness, two key test cases have been automated to best demonstrate technical skills:

1.  **Successful Global Quote for a Valid Symbol (`GQ-001`)**

      * **Reasoning:** This foundational test validates the core "happy path" of the API client. It demonstrates the ability to correctly make requests, parse expected successful data structures, and assert on their content. **Another test in automation suite is parameterized test to cover multiple valid symbols.** 
  
2.  **Successful Operation: Non-Existent Symbol Returns Empty Data (`GQ-002`)**

     * **Reasoning:** This test case is crucial for verifying the client's ability to correctly handle Alpha Vantage's specific "no data" response for non-existent symbols (`"Global Quote": {}`). Accurately parsing of a valid, yet empty, API response.

3.  **API Rate Limit Exceeded (`GQ-003`)**

      * **Reasoning:** This test was chosen to showcase advanced error handling and mocking capabilities. Alpha Vantage's rate limit messages are embedded within a 200 OK HTTP response, requiring custom logic to interpret them as errors.
  
    **Successful Test Run Screenshot:**
<img width="1151" alt="Screenshot 2025-06-30 at 13 40 14" src="https://github.com/user-attachments/assets/08615a29-f9b5-4b73-b869-26e5ca03fd35" />



## 8\. Future Enhancements

  * **Full API Coverage:** Expand test coverage to other AlphaVantage API endpoints (e.g., Time Series).
  * **Data Validation:** Implement more rigorous data validation beyond just type and presence (e.g., value ranges, format validation for numerical fields).
  * **Test Data Management:** Explore more sophisticated test data management strategies for complex scenarios.
  * **Contract Testing:** Implement contract tests (e.g., using Pact) to ensure the API client's expectations align with the actual API contract.
  * **Performance Testing:** Integrate basic performance tests to monitor API response times.
  * **Reporting Enhancements:** Explore more advanced reporting tools (e.g., Allure) for richer test execution details and dashboards.
  * **CI/CD Pipeline Expansion:** Further integrate tests into the CI/CD pipeline, potentially adding gates for deployment based on test results.

