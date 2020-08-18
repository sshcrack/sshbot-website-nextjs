import React, { ReactNode, ReactHTML } from "react";
type ReactElement = React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface Props {
    type: keyof ReactHTML,
    className: string,
    text: string
}


const SingleText = ({ type, text, className }: Props) => {
    
    let elements: ReactElement[] = [];

    let div = React.createElement("div", {className: className}, elements);

    text.split("").forEach(character => {
        let reactElement: ReactElement = React.createElement(type, {}, character);
        
        
        elements.push(reactElement);
    });
    return (div);
}

export default SingleText;