import { Button, Row } from "@themesberg/react-bootstrap";
import { Form } from "formik/dist/index";
import InputField from "../../../components/form/InputField";
import "./login.scss";
const LoginForm = () => {
  return (
    <Form>
      <Row>
        <div className="form-group form-box">
          <InputField
            className="input-text"
            name="username"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="form-group form-box">
          <InputField
            className="input-text"
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>

        {/* <div className="form-group checkbox clearfix">
          <div className="form-check checkbox-theme">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              আমাকে মনে রাখুন
            </label>
          </div>

          <p>
            {" "}
            <Link to="/reset-password" className="reset-password ml-50">
              পাসওয়ার্ড ভুলে গিয়েছি
            </Link>
          </p>
        </div> */}
        {/* <Button variant="success" className="btn btn-block btn-lg btn-primary" type="submit">
                        <FontAwesomeIcon icon={faLock} className="me-2"/> লগ-ইন
                    </Button> */}
        <Button
          variant=""
          className=" btn-md btn-theme btn-block"
          type="submit"
        >
          {/* <FontAwesomeIcon icon={faSave} className='me-2' /> */}
          Login
        </Button>
      </Row>
    </Form>
    // <Form>
    //     <Row>
    //         <Col md={12} className="mb-20">
    //             <InputField
    //                 label="Username"
    //                 name="username"
    //                 type="text"
    //                 placeholder=" Username"
    //             />
    //             <ErrorMessage fieldName="username"/>
    //         </Col>
    //         <Col md={12} className="mb-20">
    //             <InputField
    //                 label="Password"
    //                 name="password"
    //                 type="password"
    //                 placeholder=" Password"
    //             />
    //             <ErrorMessage fieldName="password"/>
    //         </Col>
    //         <Col md={12} className="mb-10 mt-10">

    //         </Col>
    //     </Row>
    // </Form>
  );
};

export default LoginForm;
