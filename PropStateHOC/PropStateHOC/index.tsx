import React, { PureComponent, Component } from "react";
import { IConnectProps, IConnectState, IPropStateProps, IPropStateState } from "./interface";

class PropStateComponent extends Component<IPropStateProps, IPropStateState> {
    constructor(props) {
        super(props);
        this.state = {
            renderItems: []
        }
    }
    initComponent = () => {
        const { filter, listent, render } = this.props;
        const renderItems = render.map((renderItem, index) => {
            const ListentFunction = listent.length > 1 ? listent[index] : listent[0];
            const FilterFunction = filter.length > 1 ? filter[index] : filter[0];
            const Component = Connect(renderItem, FilterFunction, ListentFunction, index);
            return Component;
        })
        return renderItems;
    }
    componentDidMount() {
        const renderItems = this.initComponent();
        this.setState({
            renderItems: [...renderItems]
        })
    }
    render() {
        const { renderItems } = this.state;
        const { data } = this.props;
        return (
            <React.Fragment>
                {
                    renderItems.map((RenderItem, index) => {
                        return <RenderItem {...data} key={index} />
                    })
                }
            </React.Fragment>
        )
    }
}

const Connect = (BaseComponent, filterFunction?, customShouldComponentUpdate?, index?: number) => {
    return class ConnectComponent extends Component<IConnectProps, IConnectState> {
        renderCount = 0;
        constructor(props) {
            super(props);
            this.state = {
                _props: {},
            }
        }
        componentDidMount() {
            this.setState({
                _props: filterFunction(this.props, index) || {}
            })
        }
        isSameProps = (nextProps) => {
            const filterNextProps = filterFunction(nextProps, index);
            const filterCurrentProps = filterFunction(this.props, index);

            const filterNextPropsString = JSON.stringify(filterNextProps);
            const filterCurrentPropsString = JSON.stringify(filterCurrentProps);

            if (filterNextPropsString === filterCurrentPropsString) return true;
        }
        isSameState = (nextState) => {
            const { _props: nextStateProps } = nextState || {};
            const { _props: currentStateProps } = this.state || {};

            const nextStatePropsString = JSON.stringify(nextStateProps);
            const currentStatePropsString = JSON.stringify(currentStateProps);

            if (nextStatePropsString === currentStatePropsString) return true;
        }
        componentWillReceiveProps(nextProps) {
            if (!this.isSameProps(nextProps)) {
                this.setState({
                    _props: {
                        ...filterFunction(nextProps, index)
                    }
                })
            }
        }
        shouldComponentUpdate(nextProps, nextState) {
            const isSameProps = !!this.isSameProps(nextProps);
            const isSameState = !!this.isSameState(nextState);
            let componentCheckResult = [isSameProps, isSameState].some(result => result === false);
            if (componentCheckResult && customShouldComponentUpdate && this.renderCount > 0) {
                componentCheckResult = customShouldComponentUpdate(this.props, nextProps, index);
            }
            componentCheckResult && (this.renderCount = this.renderCount + 1);
            return componentCheckResult;
            // return index === 280
        }
        render() {
            return <BaseComponent {...(this.state._props || {})} />
        }
    }
}

export default PropStateComponent
export {
    Connect
};