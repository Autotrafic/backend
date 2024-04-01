export interface ErrorWithCode {
    code: string;
}

class CustomError extends Error implements ErrorWithCode {
    code: string;

    constructor(
        public statusCode: number,
        public publicMessage: string,
        public privateMessage: string
    ) {
        super(publicMessage);
    }
}

export default CustomError;
