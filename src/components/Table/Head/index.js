import React from 'react';

const Head = ({children}) => {

    const updatedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {...child.props, parent: "head" });
          }
          return child;
    })

    return (
        <thead>
            {updatedChildren}
        </thead>
    );
}

export default Head;
