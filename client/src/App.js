import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import AuthRoute from "./util/AuthRoute";
import { AuthProvider } from "./context/auth";
import Search from "./components/Search";
import SingleUser from "./components/pages/SingleUser";
import SinglePost from "./components/pages/SinglePost";
import Home from "./components/pages/Home";
import UpdateProfile from "./components/pages/UpdateProfile";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route exact path="/" component={Home} />
        <AuthRoute exact path="/register" component={Register} />
        <AuthRoute exact path="/login" component={Login} />
        <Route exact path="/update/:username" component={UpdateProfile} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/posts/:postId" component={SinglePost} />
        <Route exact path="/user/:username" component={SingleUser} />
      </Router>
    </AuthProvider>
  );
}

export default App;
