import { type ComponentProps, useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

type Props = Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange'> & {
    value: string;
    onChange: (value: string) => void;
};

const PasswordInput = ({ className, value, onChange, ...props }: Props) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                type={show ? 'text' : 'password'}
                className={cn('pr-12', className)}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {/*
             * Out of the tab order: Tab from a password goes to the next
             * field, not to this icon. It stays a real button for the
             * pointer and for assistive tech, hence the label and state.
             */}
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                tabIndex={-1}
                aria-label={show ? 'Приховати пароль' : 'Показати пароль'}
                aria-pressed={show}
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
