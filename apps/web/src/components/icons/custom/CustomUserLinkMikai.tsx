import type { SVGProps } from 'react';

export function CustomUserLinkMikai(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="currentColor"
                fillRule="nonzero"
                d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7ZM3 14c0 5 4 8 9 8s9-3 9-8c0-.8-1.1-1-1.5-.4C18.5 16.5 15.5 19 12 19s-6.5-2.500-7.500-5.400C4.100 13 3 13.200 3 14Z"
            />
        </svg>
    );
}
export default CustomUserLinkMikai;
