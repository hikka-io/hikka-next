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
                fillRule="evenodd"
                d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4ZM8 7h2.2v4L14 7h2.8l-4.2 4.8L17 17h-2.8l-3.2-4-.8.8V17H8Z"
            />
        </svg>
    );
}
export default CustomUserLinkMikai;
