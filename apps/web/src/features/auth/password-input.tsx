import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PasswordInput = ({
    id,
    value,
    placeholder,
    onChange,
    onBlur,
}: {
    id: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    onBlur: () => void;
}) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <Input
                id={id}
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-2 size-8 -translate-y-1/2"
                onClick={() => setShow(!show)}
            >
                {show ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </Button>
        </div>
    );
};

export default PasswordInput;
