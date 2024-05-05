import Cookies from "js-cookie";
import { Redirect, Route } from "react-router-dom";

const AuthRoute = ({ component: Component, ...rest }) => {
  let accessToken = Cookies.get("access_token");
  let decodeAccessToken = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1]))
    : 0;
    

  if (decodeAccessToken.exp * 1000 < Date.now()) {
    Cookies.set("access_token", "");
  }
    return (
      <Route
        {...rest}
        render={(props) =>
          accessToken != null && accessToken.length ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  
};

export default AuthRoute;
