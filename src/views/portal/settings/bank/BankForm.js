import { faSave, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { Form } from "formik/dist/index";
import { Link } from "react-router-dom";
import {
    InputField
} from "../../../../components/form";
import ErrorMessage from "../../../../components/text/ErrorMessage";

const BankForm = ({ setFieldValue, values }) => {
    return (
        <Form>
            <Row>
                <Col md={6} className="mb-10">
                    <InputField
                        label="ব্যাংক নাম"
                        name="bankName"
                        required={true}
                        type="text"
                        placeholder="ব্যাংক নাম "
                    />
                    <ErrorMessage fieldName="bankName" />
                </Col>
                <Col md={6} className="mb-10">
                    <InputField
                        label="ব্যাংক নাম (বাংলা)"
                        name="bankNameBn"
                        required={true}
                        type="text"
                        placeholder="ব্যাংক নাম (বাংলা)"
                    />
                    <ErrorMessage fieldName="bankNameBn" />
                </Col>
                {/* <Col md={6} className="mb-10">
                    <InputField
                        label="ব্যাংক আইডি"
                        name="bankId"
                        type="number"
                        placeholder="ব্যাংক আইডি "
                    />
                    <ErrorMessage fieldName="bankId" />
                </Col> */}
                <Col md={6} className="mb-10">
                    <InputField
                        label="সুইফট কোড"
                        name="swiftcode"
                        required={true}
                        type="text"
                        placeholder="ব্যাংক সুইট কোড "
                    />
                    <ErrorMessage fieldName="swiftcode" />
                </Col>
                <Col md={6} className="mb-10">
                    <InputField
                        label="ওয়েব সাইট এড্রেস"
                        name="bankWebUrl"
                        required={true}
                        type="text"
                        placeholder=" ওয়েবসাইটের লিংক লিখুন"
                    />
                    <ErrorMessage fieldName="url" />
                </Col>
                <Col md={12} className="mb-10 mt-10">
                    <Button
                        variant=""
                        className="f-right btn-color"
                        type="submit"
                    >
                        <FontAwesomeIcon icon={faSave} className="me-2" /> জমা
                        দিন
                    </Button>
                    <Button
                        variant="white"
                        className="f-right mr-10"
                        type="reset"
                    >
                        <FontAwesomeIcon icon={faUndo} className="me-2" /> রিসেট
                        করুন
                    </Button>
                    <Link to="/portal/settings/bank">
                        <Button
                            variant="white"
                            className="f-right mr-10"
                            type="cancle"
                        >
                            <FontAwesomeIcon icon={faTimes} className="me-2" />{" "}
                            বাতিল করুন
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Form>
    );
};

export default BankForm;
