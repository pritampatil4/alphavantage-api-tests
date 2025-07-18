export const mockAxiosInstance = {
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
