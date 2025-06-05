/**
 * Error class for Hikka API errors
 */
export class HikkaApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code: string,
        public data?: any,
    ) {
        super(message);
        this.name = 'HikkaApiError';

        // This line is needed for proper inheritance in TypeScript
        Object.setPrototypeOf(this, HikkaApiError.prototype);
    }
}
