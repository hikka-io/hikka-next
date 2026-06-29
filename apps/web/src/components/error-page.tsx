import type { ErrorComponentProps } from '@tanstack/react-router';

import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Image from '@/components/ui/image';
import { Link } from '@/utils/navigation';

const ErrorPage: React.FC<ErrorComponentProps> = (props) => {
    const details = props.error.stack ?? props.error.message;

    return (
        <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center"
            >
                <span className="font-black text-[18rem] text-foreground/5 leading-none md:text-[24rem]">
                    500
                </span>
            </div>

            <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
                <div className="logo-full h-5 w-16" />

                <Image
                    src="/stickers/hmm.webp"
                    width={224}
                    height={224}
                    background="transparent"
                    className="size-56"
                    alt="hikka face"
                />

                <div className="flex flex-col gap-2">
                    <p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
                        Помилка 500
                    </p>
                    <h1 className="font-bold text-3xl tracking-tight md:text-4xl">
                        Щось пішло не так
                    </h1>
                    <p className="text-muted-foreground">
                        Сталася непередбачена помилка. Спробуйте ще раз або
                        поверніться на головну.
                    </p>
                </div>

                {details && (
                    <Collapsible defaultOpen className="w-full">
                        <CollapsibleTrigger className="group flex w-full items-center justify-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground">
                            Технічні деталі
                            <MaterialSymbolsKeyboardArrowDownRounded className="size-5 transition-transform group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <pre className="mt-3 max-h-48 select-text overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-secondary/20 p-4 text-left font-mono text-muted-foreground text-xs">
                                {details}
                            </pre>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                <div className="flex w-full flex-col gap-4 sm:flex-row">
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => props.reset()}
                    >
                        Спробувати ще раз
                    </Button>
                    <Button className="flex-1" asChild>
                        <Link to="/">На головну</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
