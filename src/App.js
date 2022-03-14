import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { Auth } from "./pages/auth/Auth";
import { ForgotPassword } from "./pages/forgotPassword/ForgotPassword";
import { DashboardRoute } from "./routes/DashboardRoute";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthentication, startLogoutAuth } from "./duck/auth";
function App() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);

  const { isAuthenticated, rol } = state;

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const token_expires_in =
      parseInt(localStorage.getItem("token_expires_in")) || null;

    if (!!usuario && !!access_token && !!refresh_token && !!token_expires_in) {
      const current_time = new Date().getTime();
      if (token_expires_in >= current_time) {
        dispatch(setAuthentication(usuario));
      } else {
        dispatch(startLogoutAuth());
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Switch>
          <PublicRoute
            exact
            path="/login"
            isAuthenticated={isAuthenticated}
            component={Auth}
          />
          <PublicRoute
            exact
            path="/forgotPassword"
            isAuthenticated={isAuthenticated}
            component={ForgotPassword}
          />
          <PrivateRoute
            path="/"
            rol={rol}
            isAuthenticated={isAuthenticated}
            component={DashboardRoute}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
