import React from 'react';
import _ from 'styled-components';

const StyledColumnTd = _.td`
    background: ${props => !props.isValid ? "rgba(255,0,0,0.5)" : "transparent"};
    padding: 12px;
    text-align: left;
    vertical-align: middle;
    font-weight: 300;
    font-size: 15px;
    text-shadow: -1px -1px 1px rgb(0 0 0 / 10%);
    border-right: 1px solid #C1C3D1;
    border-left: 1px solid #C1C3D1;
`

const StyledColumnTh = _.th`
    color: #D5DDE5;
    background: #1b1e24;
    border-bottom: 4px solid #9ea7af;
    border-left: 1px solid #C1C3D1;
    border-right: 1px solid #343a45;
    font-size: 15px;
    font-weight: 100;
    padding: 12px;
    text-align: left;
    text-shadow: 0 1px 1px rgb(0 0 0 / 10%);
    vertical-align: middle;
    }
`

const Column = ({children, isValid, parent /* body or head */}) => {
    if(!parent) throw new Error("cannot create column")

    let ColumnElement = StyledColumnTd;

    if(parent === "head") ColumnElement = StyledColumnTh;
    return (
        <ColumnElement isValid={isValid}>
            {children}
        </ColumnElement>
    );
}

export default Column;
