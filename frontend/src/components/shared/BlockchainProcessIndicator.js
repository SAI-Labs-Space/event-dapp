import React from 'react';
import ConditonalRender from './ConditionalRender';

function BlockchainProcessIndicator(props) {
    return (
        <div>
            <ConditonalRender when={props && props.status === 1}>
                <div className="flex">
                    <span className="dot-warning"></span>
                    <span style={{ marginLeft: 10 }}>waiting for confirmations <span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span></span>
                </div>
            </ConditonalRender>
            <ConditonalRender when={props && props.status === 2}>
                <div className="flex">
                    <span className="dot-success"></span>
                    <span style={{ marginLeft: 10 }}>request confirmed</span>
                </div>
            </ConditonalRender>
            <ConditonalRender when={props && props.status === 3}>
                <div className="flex">
                    <span className="dot-success"></span>
                    <span style={{ marginLeft: 10 }}>request success</span>
                </div>
            </ConditonalRender>
        </div>
    )
}

export default BlockchainProcessIndicator;