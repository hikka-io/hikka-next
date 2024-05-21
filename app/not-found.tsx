import Link from 'next/link';
import React from 'react';

import H1 from '@/components/typography/h1';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';

const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex grow flex-col items-center justify-center gap-8">
                <div className="flex flex-col justify-center">
                    <div className="flex justify-center gap-4">
                        <Image
                            src="/logo.svg"
                            alt="Hikka"
                            width={80}
                            height={24}
                        />
                        <H1 className="text-center text-[3rem]">404</H1>
                    </div>
                    <P>На жаль, такої сторінки не існує 😢</P>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/">На головну</Link>
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
