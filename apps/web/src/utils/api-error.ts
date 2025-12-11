import { ERRORS } from './constants/errors';

export default function getApiErrorMessage(error: any) {
    const splittedCode = error.code.split(':');

    if (splittedCode.length === 2) {
        return ERRORS[splittedCode[0]][splittedCode[1]];
    }
}

