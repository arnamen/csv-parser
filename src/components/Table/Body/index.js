import React from 'react';

const Body = ({children}) => {

    const updatedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...child.props, parent: "body" });
          }
          return child;
    })

    return (
        <tbody>
            {updatedChildren}
        </tbody>
    );
}

export default Body;
