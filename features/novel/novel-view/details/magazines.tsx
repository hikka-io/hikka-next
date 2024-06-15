import Link from 'next/link';
import { FC } from 'react';

import { Label } from '@/components/ui/label';

interface Props {
    magazines: API.Magazine[];
}

const Magazines: FC<Props> = ({ magazines }) => {
    if (!magazines || magazines.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-24">
                <Label className="text-muted-foreground">Видавець:</Label>
            </div>
            <div className="flex flex-1 items-center gap-1">
                {magazines.map((magazine) => (
                    <Label key={magazine.slug}>
                        <Link href={`/novel?magazines=${magazine.slug}`}>
                            {magazine.name_en}
                        </Link>
                    </Label>
                ))}
            </div>
        </div>
    );
};

export default Magazines;
