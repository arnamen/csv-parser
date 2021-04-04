import React from 'react';
import _ from 'styled-components';

const StyledRow = _.tr`
    border-top: 1px solid #C1C3D1;
    border-bottom: 1px solid #C1C3D1;
    color: #666B85;
    font-size: 12px;
    font-weight: normal;
    text-shadow: 0 1px 1px rgb(255 255 255 / 10%);
    :first-child {
        border-top: none;
    }
    :nth-child(odd) {
        background: #EBEBEB;
    }
    :hover {
        background: #4E5066;
        color: #FFFFFF;
        border-top: ${props => props.parent === "body" ? "1px solid #22262e" : null};
    }
`

const Row = ({children, parent}) => {
    //pass parent prop to cells
    const updatedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { parent: parent });
          }
          return child;
    })
    return (
        <StyledRow parent={parent}>
            {updatedChildren}
        </StyledRow>
    );
}

export default Row;
