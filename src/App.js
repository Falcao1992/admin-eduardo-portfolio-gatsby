import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import './App.css';
import Home from "./components/Home/Home";
import NoMatch from "./components/NoMatch";
import PrivateRoute from "./components/PrivateRoute";
import {AuthProvider} from "./components/Auth";
import Login from "./components/Login/Login";

import theme from "./assets/theme";
import {ThemeProvider} from "styled-components";
import Projects from "./components/Projects/Projects";
import CreateProjects from "./components/Projects/CreateProjects";
import EditProjects from "./components/Projects/EditProjects";
import Messages from "./components/Messages/Messages";
import Message from "./components/Messages/Message";
import Banners from "./components/Banner/Banners";


function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <PrivateRoute exact path="/" component={Home}/>
                        <PrivateRoute exact path="/projects" component={Projects}/>
                        <PrivateRoute exact path="/projects/create" component={CreateProjects}/>
                        <PrivateRoute exact path="/projects/edit/:projectkey" component={EditProjects}/>
                        <PrivateRoute exact path="/messages" component={Messages}/>
                        <PrivateRoute exact path="/message/:keymessage" component={Message}/>
                        <PrivateRoute exact path="/banners" component={Banners}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
