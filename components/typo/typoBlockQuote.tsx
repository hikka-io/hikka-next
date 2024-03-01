import {TTypoProps} from "./type";

const typoBlockQuote = ({children, className, ...props}: TTypoProps) => {
    return (
        <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`} {...props}>
            {children}
        </blockquote>
    );
};

export default typoBlockQuote;
