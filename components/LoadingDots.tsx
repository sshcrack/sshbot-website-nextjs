import { Component, ReactHTML, RefObject } from 'react';
import React from 'react';

interface Props {
    type: keyof ReactHTML
}

export default class LoadingDots extends Component<Props> {
    private type: keyof ReactHTML;
    private ref: RefObject<any>
    private element: any;

    constructor(props: Props) {
        super(props)

        this.ref = React.createRef();
        this.type = props.type;
    }
    
    componentDidMount() {
        this.element = this.ref.current;
        this.update();
    }


    private update() {
        if(this.ref === null) return;

        let text: string = this.element.innerHTML;
        
        if(text.length === 3) {
            text = ""
        } else {
            text += "."
        }

        this.element.innerHTML = text;

        setTimeout(() => { this.update() }, 100);
    }
    
    render() {
        let component = React.createElement(this.type, {ref: this.ref})
        return component
    }
}