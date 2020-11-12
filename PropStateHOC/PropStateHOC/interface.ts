import { ComponentClass, ReactComponentElement, ReactElement } from "react";

export interface IPropStateProps {
    [propName: string]: any
    data: object
    render: Array<ComponentClass>
    listent: Array<Function>
    filter: Array<Function>
}
export interface IPropStateState {
    renderItems: Array<ComponentClass>
}

export interface IConnectProps {
    // addListener(callback: Function): Function
    // removeListener(callback: Function): Function
}
export interface IConnectState {
    _props: object
}