import React, { Component, ReactHTML, RefObject } from 'react';
import { isNull } from 'utils/tools';
import styles from "../styles/ConsoleType.module.scss";

interface Props {
    text: TerminalType[];
    type?: keyof ReactHTML,
    keepMiddle?: boolean,
    inputClass?: string,
    underscoreClass ?: string
    sharedClass ?: string
}

export default class ConsoleText extends Component<Props> {
    private text: TerminalType[];
    private textLeft: TerminalTypeLeft;
    private keepMiddle: boolean;
    private inputClass: string;
    private sharedClass: string;
    private underscoreClass: string;

    private type: keyof ReactHTML;

    private span: HTMLSpanElement;
    private spanRef: RefObject<HTMLSpanElement>

    private consoleInput: HTMLDivElement;
    private consoleInputRef: RefObject<HTMLDivElement>

    constructor(props: Props) {
        super(props);

        this.spanRef = React.createRef<HTMLSpanElement>()
        this.consoleInputRef = React.createRef<HTMLDivElement>()

        this.text = props.text;

        this.keepMiddle = props.keepMiddle === undefined ? false : props.keepMiddle;
        this.inputClass = props.inputClass === undefined ? "" : props.inputClass;
        this.underscoreClass = props.underscoreClass === undefined ? "" : props.underscoreClass;
        this.sharedClass = props.sharedClass === undefined ? "" : props.sharedClass;

        this.type = props.type === undefined ? "span" : props.type;
    }

    componentDidMount() {
        if (this.consoleInputRef !== null) {
            if (this.consoleInputRef.current !== null) this.consoleInput = this.consoleInputRef.current;
        }
        if (this.spanRef !== null) {
            if (this.spanRef.current !== null) this.span = this.spanRef.current;
        }

        this.nextElement();
        this.update();
        this.textUpdate();
    }

    public update() {
        if (isNull(this.span)) return;
        let display = this.span.style.display;


        if (display === "") {
            this.span.style.display = "none";
        } else {
            this.span.style.display = "";
        }

        setTimeout(() => { this.update() }, 400);
    }

    public textUpdate() {
        let Character = this.textLeft.name.shift();

        if (Character !== undefined) {
            this.consoleInput.innerHTML += Character;
            setTimeout(() => { this.textUpdate() }, 125);
        } else {
            setTimeout(() => { this.deleteText() }, 1000);
        }

    }

    public deleteText() {
        let text = this.consoleInput.innerHTML;
        if (text === "") {
            this.nextElement();

            setTimeout(() => { this.textUpdate() }, 125);
            return;
        }

        let charArray = text.split("");
        charArray.pop();

        this.consoleInput.innerHTML = charArray.join("");

        setTimeout(() => { this.deleteText() }, 125);
    }

    public nextElement(shift = true) {
        if (shift) {
            let next = this.text.shift();
            if (next === undefined)
                throw new Error("No text given for Console Text");

            this.text.push(next);

            this.textLeft = {
                rules: next.rules,
                name: next.name.split(""),
                originalName: next.name
            };

        } else {
            if (this.text.length === 0 || this.text[0] === undefined) throw new Error("No text given for Console Text");

            this.textLeft = {
                rules: this.text[0].rules,
                name: this.text[0].name.split(""),
                originalName: this.text[0].name
            }
        }

        if (this.consoleInput !== undefined) {
            let rules = this.textLeft.rules;
            let keys = Object.keys(rules);
            let styleStr = "";

            keys.forEach(key => {
                styleStr += `${key}: ${rules[key]};`
            })
            this.consoleInput.setAttribute("style", styleStr)
        }
    }

    render() {
        let longestString: string = "";
        this.text.forEach(element => {
            let name = element.name;
            if (longestString.length < name.length) {
                longestString = name;
            }
        });

        longestString += "_";
        let longestStringInvisible = React.createElement(this.type, { className: `noOpacity ${this.sharedClass}` }, longestString);

        let consoleInputEl = React.createElement(this.type, { ref: this.consoleInputRef, className: `${this.inputClass} ${this.sharedClass}` });
        let underscore = React.createElement(this.type, { ref: this.spanRef, className: `${this.underscoreClass} ${this.sharedClass}` }, "_");
        let underscoreInvisible = React.createElement(this.type, { className: `${styles.underscoreInvisible} ${this.sharedClass}` }, "_");


        return (
            <div className={styles.consoleText}>
                {this.keepMiddle ? longestStringInvisible : (<span></span>)}

                <div className={styles.consoleInput}>
                    {consoleInputEl}
                    <div className={styles.underscore}>
                        {underscoreInvisible}
                        {underscore}
                    </div>
                </div>
            </div>
        )
    }
}

interface TerminalType {
    rules: {
        [key: string]: any
    },
    name: string
}

interface TerminalTypeLeft {
    rules: {
        [key: string]: any
    },
    name: string[],
    originalName: string
}