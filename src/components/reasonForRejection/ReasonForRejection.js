import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { Formik } from "formik/dist/index";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { callApi } from "reducers/apiSlice";
// import { faList } from "@fortawesome/free-solid-svg-icons";
// import ProgressBar from "react-topbar-progress-indicator";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { UrlBuilder } from "helpers/UrlBuilder";
// import { Button, Col, Row } from "@themesberg/react-bootstrap";
import {
    InputTextArea
} from "components/form";
import InputSelectApi from "components/form/InputSelectApi";
import ErrorMessage from "components/text/ErrorMessage";
import { Form } from "formik/dist/index";
const ReasonForRejection = ({ data, apiEndPoint }) => {
    const dispatch = useDispatch();
    return (

        <Formik
            initialValues={data}
            // validationSchema={Bank.validation()}
            onSubmit={(values, { resetForm }) => {

                dispatch(
                    callApi({
                        operationId:
                            UrlBuilder.mpoDsheApi(apiEndPoint),
                        output: "salaryReviewData",
                        parameters: {
                            method: "POST",
                            body: JSON.stringify(values),
                            hasFile: false,
                        },
                    }));

            }}
        >
            {({ values, setFieldValue }) => {
                return (
                    <Form>
                        <Row>

                            <Col md={12} className="mb-10">
                                <InputSelectApi
                                    label="Reason For Rejection"
                                    name="reasonForRejectionId"
                                    operationId={UrlBuilder.commonApi(
                                        `reason-for-rejection/all`
                                    )}
                                    storeName="reasonData"
                                    value="id"
                                    text="reasonForRejection"
                                    type="number"
                                    required={true}
                                />
                                <ErrorMessage fieldName="reasonForRejectionId" />
                            </Col>


                            <Col md={12} className="mb-10">

                                <InputTextArea
                                    label="Review Note"
                                    name="reviewNote"
                                    type="text"
                                    required="no"
                                />
                            </Col>

                            <Col md={12} className="mb-10 mt-10">
                                <Button
                                    variant="success"
                                    className="f-right btn-color"
                                    type="submit"
                                >
                                    <FontAwesomeIcon icon={faSave} className="me-2" /> Yes
                                </Button>
                                <Link to="/portal/payment/salary-preview">

                                    <Button
                                        variant="danger"
                                        className="f-right mr-10"
                                    // type="c"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="me-2" />{" "}
                                        No
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Form>
                )
            }}
        </Formik>

    )
}

export default ReasonForRejection