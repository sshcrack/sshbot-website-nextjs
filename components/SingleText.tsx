import React, { ReactNode, ReactHTML } from "react";
type ReactElement = React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;

interface Props {
    type: keyof ReactHTML,
    className: string,
    text: string,
    animClass: string
}


const SingleText = ({ type, text, className, animClass }: Props) => {
    
    let elements: ReactElement[] = [];

    let index = 0;

    text.split("").forEach(character => {
        let reactElement: ReactElement = React.createElement(type, {key: index}, character);
        
        elements.push(reactElement);
        index++;
    });

    let div = React.createElement("div", {className: className, "data-animclass": animClass}, elements);
    return (div);
}

export default SingleText;