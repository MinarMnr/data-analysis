import * as React from "react";
import LoginForm from "./LoginForm";
import { Formik } from "formik/dist/index";
import { Login } from "./Login";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callApi, selectApi } from "../../../reducers/apiSlice";
import { Redirect } from "react-router-dom";
import { AuthUser } from "../../../helpers/AuthUser";
import ProgressBar from "react-topbar-progress-indicator";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUndo,
  faTimes,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import RoleSelectionPage from "../home/RoleSelectionPage";
const LoginPage = () => {
  const dispatch = useDispatch();

  const {
    loading,
    authData = {
      data: {},
    },
  } = useSelector(selectApi);

  if (authData.accessToken !== undefined) {
    // if (authData.roles.length > 2) {
    //   return <RoleSelectionPage authData={authData} />;
    // } else {
    //   AuthUser.saveLoginData(authData);
    // }
    AuthUser.saveLoginData(authData);
    //return <Redirect to='/portal/dashboard' />;
  }

  return (
    <main className="login_main_div pt-30 pb-30">
      {loading && <ProgressBar />}
      {/* <h3 className="text-center text-white"> ব্যানবেইস আইইআইএমএস-এ স্বাগতম</h3> */}
      <div className="row">
        <div className="col-lg-6 offset-lg-3">
          <div className="login rounded p-30">
            {/* <h3 className="text-center mb-50 fw-bold text-muted">LOGIN FORM</h3> */}
            <h3 className="text-center mb-15 gradient-text"> Login Form</h3>
            {/* <div className="text-center mb-10">
              <FontAwesomeIcon icon={faUsers} className="loginicon" />
            </div> */}

            <Formik
              initialValues={Login}
              enableReinitialize={true}
              validationSchema={Login.validator()}
              onSubmit={(values, { resetForm }) => {
                dispatch(
                  callApi({
                    operationId: UrlBuilder.authApi("auth/login"),
                    output: "authData",
                    parameters: {
                      method: "POST",
                      body: Login.toString(values),
                    },
                  })
                );

                /**
                 *  রিসেট করুনform data.
                 */
                // resetForm({});
              }}
            >
              <LoginForm />
            </Formik>
            {/* <p>
              যোগদান করেন নি?
              <Link to="/register" className="thembo ml-2">
                যোগদান করুন
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
