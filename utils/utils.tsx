import { CxOptions, VariantProps, cva } from 'class-variance-authority';
import { type ClassValue, clsx } from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';

/** Tailwind CSS classnames merge. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Set default props with `React.forwardRef`.
 *
 * - Use `withCn` if only setting `className`
 */
export function withProps<
    T extends React.ComponentType<any> | keyof HTMLElementTagNameMap,
>(Component: T, defaultProps: Partial<React.ComponentPropsWithoutRef<T>>) {
    const ComponentWithClassName = Component as React.FC<{ className: string }>;

    return React.forwardRef<
        React.ElementRef<T>,
        React.ComponentPropsWithoutRef<T>
    >(function ExtendComponent(props, ref) {
        return (
            <ComponentWithClassName
                ref={ref}
                {...defaultProps}
                {...props}
                className={cn(
                    (defaultProps as any).className,
                    (props as any).className,
                )}
            />
        );
    });
}

/**
 * Set default `className` with `cn`.
 *
 * - IntelliSense: add `withCn` to `classAttributes`
 * - ESLint: add `withCn` to `settings.tailwindcss.callees`
 */
export function withCn<T extends React.ComponentType<any>>(
    Component: T,
    ...inputs: CxOptions
) {
    return withProps(Component, { className: cn(inputs) } as any);
}

/**
 * Set default `className` with `cn` and `variants`.
 *
 * @param Component - The component to which props will be added.
 * @param variants - Variants from `cva`. `Component` props will be extended
 *   with `variants` props.
 * @param onlyVariantsProps - Props to exclude from `Component`. Set the props
 *   that are only used for variants.
 */
export function withVariants<
    T extends React.ComponentType<any> | keyof HTMLElementTagNameMap,
    V extends ReturnType<typeof cva>,
>(Component: T, variants: V, onlyVariantsProps?: (keyof VariantProps<V>)[]) {
    const ComponentWithClassName = Component as React.FC<{ className: string }>;

    return React.forwardRef<
        React.ElementRef<T>,
        React.ComponentPropsWithoutRef<T> & VariantProps<V>
    >(function ExtendComponent(allProps, ref) {
        const { className, ...props } = allProps as any;
        const rest = { ...props };

        if (onlyVariantsProps) {
            onlyVariantsProps.forEach((key) => {
                if (props[key as string] !== undefined) {
                    delete rest[key as string];
                }
            });
        }

        return (
            <ComponentWithClassName
                className={cn(variants(props), className)}
                ref={ref}
                {...(rest as any)}
            />
        );
    });
}

/**
 * Shorter alternative to `React.forwardRef`.
 *
 * @generic1 Component type or element type
 * @generic2 Extended prop types
 */
export function withRef<
    T extends React.ComponentType<any> | keyof HTMLElementTagNameMap,
    E = {},
>(
    renderFunction: React.ForwardRefRenderFunction<
        React.ElementRef<T>,
        E & Omit<React.ComponentPropsWithoutRef<T>, keyof E>
    >,
) {
    return React.forwardRef(renderFunction);
}
