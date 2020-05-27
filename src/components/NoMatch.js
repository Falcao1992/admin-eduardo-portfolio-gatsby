import React from "react";
import {useLocation} from "react-router-dom";

const NoMatch = () => {

    let location = useLocation();
    return (
        <h1>"pas de résultat pour" <code>{location.pathname}</code> </h1>
    )
};

export default NoMatch
