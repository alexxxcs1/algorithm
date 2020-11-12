
import React, { PureComponent, Component } from "react";
import { Connect } from './PropStateHOC';

class TestComponent extends Component<any> {
    constructor(props) {
        super(props);
    }
    render() {
        const { index, selectIndex } = this.props;
        (selectIndex === index) && selectIndex && console.log(this.props, '===re-render', new Date().getTime());

        return (
            <div>
                <i>index:{index}</i> / <i>currentSelectIndex:{selectIndex}</i>
            </div>
        )
    }
}
export default TestComponent;

// export default Connect(TestComponent, (state) => {
//     const { selectIndex, index } = state;
//     return {
//         selectIndex,
//         index
//     }
// }, (currentProps, nextProps) => {
//     const { selectIndex: currentSelectIndex } = currentProps || {};
//     const { selectIndex: nextSelectIndex, index } = nextProps || {};
//     if (currentSelectIndex !== nextSelectIndex && (nextSelectIndex === index || currentSelectIndex === index)) {
//         return true;
//     } else {
//         return false;
//     }
// })
