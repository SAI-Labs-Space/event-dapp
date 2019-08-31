import React from 'react';
import moment from 'moment';

function DateTimeLabel(props) {
    if (props && props.date) {
        return (
            <span>{moment(props.date).format('LLL')}</span>
        );
    } else {
        return (
            <span>-</span>
        )
    }
}

export default DateTimeLabel;