'use client';

import { useSession } from '@hikka/react';
import { FC } from 'react';

import { useFormContext } from '@/components/form/form-context';
import { Button } from '@/components/ui/button';

const AutoButton: FC = () => {
    const { user: loggedUser } = useSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useFormContext() as any;

    if (!loggedUser || loggedUser.role === 'user') {
        return null;
    }

    const handleAutoSubmit = () => {
        form.setFieldValue('auto', true);
        form.handleSubmit();
    };

    return (
        <Button
            className="w-fit"
            variant="outline"
            onClick={handleAutoSubmit}
        >
            Прийняти
        </Button>
    );
};

export default AutoButton;
