import React, { Component } from 'react';
import { Text } from 'react-native';
import * as root from '../Root';

export default class AppText extends Component {
    constructor(props) {
        super(props)
        this.style = [root.allWeb && {}]; //fontFamily: 'segoeui' 
        if (props.style) {
            if (Array.isArray(props.style)) {
                this.style = this.style.concat(props.style)
            } else {
                this.style.push(props.style)
            }
        }
    }

    render() {
        return (
            <Text {...this.props} style={this.style}>
                {this.props.children}
            </Text>
        )
    }
}