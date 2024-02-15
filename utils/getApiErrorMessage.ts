import { ERRORS } from '@/utils/constants';

export default function (error: Hikka.Error) {
    const splittedCode = error.code.split(':');

    if (splittedCode.length === 2) {
        return ERRORS[splittedCode[0]][splittedCode[1]];
    }
}
