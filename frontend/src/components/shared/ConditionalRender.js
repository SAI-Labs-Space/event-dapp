import React from 'react';

function ConditionalRender(props) {
    if (props && props.when) {
        return props.children
    } else {
        return null;
    }
}

export default ConditionalRender;