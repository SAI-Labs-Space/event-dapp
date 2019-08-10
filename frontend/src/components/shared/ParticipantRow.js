import React, { useState } from 'react';

function ParticipantRow(props) {
    return (
        <tr>
            <td>
                <span className="badge badge-warning">{props.item.checkIn}</span>
            </td>
            <td>
                {props.item.name}
            </td>
            <td>
                {props.item.email}
            </td>
            <td>
                {props.item.address}
            </td>
            <td>
                {props.item.checkIn=='No' &&
                                    <button className="btn btn-sm btn-success" onClick={()=>props.callback(props.item.address,props.index)}>mark attend</button>
                }

            </td>
        </tr>
    );
}

export default ParticipantRow;