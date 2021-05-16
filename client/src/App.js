import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import AuthRoute from "./util/AuthRoute";
import { AuthProvider } from "./context/auth";
import Search from "./components/Search";
import Menubar from "./components/Menubar";
import SinglePost from "./components/pages/SinglePost";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Menubar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/register" component={Register} />
          <AuthRoute exact path="/login" component={Login} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
