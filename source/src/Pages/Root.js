import React from "react";


/*--Import-Pages-Dashboard--*/
import CompHeader from "../Components/CompHeader";

class Root extends React.Component {


    render = () => {
        return (
            <div>
                <CompHeader {...this.props} />
            </div>
        );
    };
};
export default Root;