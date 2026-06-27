/** Error class for Hikka API errors. */
export class HikkaApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code: string,
        public data?: unknown,
    ) {
        super(message);
        this.name = 'HikkaApiError';
        Object.setPrototypeOf(this, HikkaApiError.prototype);
    }
}
