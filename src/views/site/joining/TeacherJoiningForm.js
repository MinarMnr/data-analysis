import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Box, Divider, Grid, Modal, Typography } from "@mui/material";
import { Form } from "formik/dist/index";
import { InputField, InputSelect } from "components/form";
import InputSelectApi from "../../../components/form/InputSelectApi";
import ErrorMessage from "../../../components/text/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import InstituteSelectModal from "./InstituteSelectModal";
import { UrlBuilder } from "helpers/UrlBuilder";
import { useHistory } from "react-router-dom";
import useListApi from "../../../hooks/useListApi";
import GenderType from "../../../constants/GenderType";
import { callApi, selectApi } from "reducers/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import DemoImage from "./demoImage.png";
import nidDemo from "./Voter-ID-Card.jpg";
import Certificates from "./certificate.png";

const TeacherJoiningForm = ({ values, setFieldValue, setToggle, toggle }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [imagePreview, setImagePreview] = useState();
  const [nidPreview, setNidPreview] = useState();
  const [joiningPreview, setJoiningPreview] = useState();

  const getDataFromNtrca = () => {
    if (
      values?.ntrcaExamRollNumber !== undefined &&
      values?.ntrcaExamBatch !== undefined
    ) {
      dispatch(
        callApi({
          operationId: UrlBuilder.mpoDsheApi(
            `educational-qualification/find/qualification-by-batch-and-roll?examBatch=${values?.ntrcaExamBatch}&rollNo=${values?.ntrcaExamRollNumber}`
          ),
          output: "ntrcaData",
          storeName: "ntrcaData",
        })
      );
      setToggle(true);
    }
  };

  return (
    <Form>
      <Row>
        <Col md={4} className="mb-15">
          <InputField
            label="রোল"
            name="ntrcaExamRollNumber"
            type="text"
            placeholder="রোল"
            required={true}
          />
          <ErrorMessage fieldName="ntrcaExamRollNumber" />
        </Col>
        <Col md={4} className="mb-15">
          <InputField
            label="ব্যাচ"
            name="ntrcaExamBatch"
            type="text"
            required={true}
            placeholder="ব্যাচ"
          />
          <ErrorMessage fieldName="ntrcaExamBatch" />
        </Col>
        <Col md={2}>
          <Button
            variant="success"
            type="button"
            className="mt-33"
            onClick={() => {
              getDataFromNtrca();
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Col>
      </Row>
      {toggle == true && (
        <>
          <Row>
            <div class="mb-10 col-md-12 col-12">
              <h4 class="text-start">সাধারণ তথ্য</h4>
              <hr class="border border-info border-1" />
            </div>
            <Col md={6} className="mb-15">
              <InputField
                label="নাম (বাংলায়)"
                name="employeeNameBn"
                type="text"
                required={true}
                isDisabled={true}
                placeholder="Full Name (Bn)"
              />
              <ErrorMessage fieldName="employeeNameBn" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="নাম (ইংরেজিতে)"
                name="employeeName"
                required={true}
                isDisabled={true}
                type="text"
                placeholder=" Full Name"
              />
              <ErrorMessage fieldName="employeeName" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="পিতার নাম (ইংরেজিতে)"
                name="fathersName"
                required={true}
                isDisabled={true}
                type="text"
                placeholder="Father's Name"
              />
              <ErrorMessage fieldName="fathersName" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="মাতার নাম (ইংরেজিতে)"
                name="mothersName"
                required={true}
                isDisabled={true}
                type="text"
                placeholder=" Mother's Name"
              />
              <ErrorMessage fieldName="mothersName" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="জন্মতারিখ"
                name="dateOfBirth"
                placeholder=" জন্ম তারিখ"
                required={true}
                isDisabled={true}
                type="text"
              />
              <ErrorMessage fieldName="dateOfBirth" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="পুরুষ/মহিলা"
                name="gender"
                placeholder="পুরুষ/মহিলা"
                required={true}
                isDisabled={true}
                type="text"
              />
              <ErrorMessage fieldName="gender" />
              {/* <div>
                <InputSelect
                  label="পুরুষ/মহিলা"
                  name="gender"
                  required={true}
                  isDisabled={true}
                  type="text"
                  value="name"
                  text="name"
                  data={[
                    {
                      id: 1,
                      name: "MALE",
                    },
                    {
                      id: 2,
                      name: "FEMALE",
                    },
                    {
                      id: 3,
                      name: "TRANS_GENDER",
                    },
                  ]}
                />
              </div> */}
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="জাতীয়তা"
                name="nationality"
                required={true}
                isDisabled={true}
                type="text"
                placeholder="Nationality"
              />
              <ErrorMessage fieldName="nationality" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="জাতীয় পরিচয়পত্র নম্বর"
                name="nid"
                required={true}
                isDisabled={true}
                type="text"
                placeholder="এনআইডি Number"
              />
            </Col>
            <Col md={6} className="mb-15">
              <div>
                <InputField
                  label="জন্ম নিবন্ধন নম্বর"
                  required={true}
                  isDisabled={true}
                  name="birthRegNo"
                  type="text"
                  placeholder="Birth Reg Number"
                />
                <ErrorMessage fieldName="birthRegNo" />
              </div>
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="মোবাইল নম্বর"
                required={true}
                // isDisabled={true}
                name="mobile"
                type="text"
                placeholder=" Contact Number"
              />
              <ErrorMessage fieldName="mobile" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="ই-মেইল"
                name="email"
                required={true}
                // isDisabled={true}
                type="email"
                placeholder=" Email address"
              />
              <ErrorMessage fieldName="email" />
            </Col>
          </Row>
          <Row className="p-20 pb-4 gx-6 gy-2">
            <Col xs={12} md={12} className="mb-10">
              <h4 className="text-start">কর্মস্থলের তথ্য</h4>
              <hr className="border border-info border-1" />
            </Col>
            {/* <Col xs={12} md={6} className="mb-10">
              <InputSelect
                label="পদের ধরন"
                name="positionType"
                type="number"
                value="name"
                data={[
                  { id: 1, name: "GENERAL" },
                  { id: 2, name: "ADMINISTRATIVE" },
                  { id: 3, name: "NON_GOVT_EMPLOYEE" },
                ]}
                required={true}
                // isDisabled={true}
                text="name"
              />
            </Col> */}

            <Col xs={12} md={6} className="mb-10">
              <InputField
                label="পদবি"
                name="designationName"
                required={true}
                isDisabled={true}
                type="text"
                placeholder="পদবি"
              />
              <ErrorMessage fieldName="designationName" />
            </Col>

            <Col xs={12} md={6} className="mb-10">
              <InputField
                label="বিষয়"
                name="subjectName"
                required={true}
                isDisabled={true}
                type="text"
                placeholder="বিষয়"
              />
              <ErrorMessage fieldName="subjectName" />
            </Col>
            <Col xs={12} md={6} className="mb-10">
              <InputField
                label="যোগদানের তারিখ"
                name="joiningDate"
                //placeholder=" Joining Date"
                type="date"
                required={true}
              />
              <ErrorMessage fieldName="joiningDate" />
            </Col>

            <Col xs={12} md={6} className="mb-10">
              <InputSelect
                label="যোগদানের সময়"
                name="joiningTime"
                // type="text"
                value="id"
                data={[
                  { id: "MORNING", name: "প্রভাত" },
                  { id: "EVENING", name: "সায়াহ্ন" },
                  { id: "AFTERNOON", name: "অপরাহ্ন" },
                  { id: "FORENOON", name: "পূর্বাহ্ন" },
                  { id: "NOON", name: "দুপুর" },
                ]}
                required={true}
                text="name"
              />
            </Col>

            <Col md={6}>
              <InputField
                label="প্রতিষ্ঠানের নামঃ"
                name="instituteName"
                required={true}
                type="text"
                isDisabled={true}
              />
            </Col>
          </Row>
          <Row className="p-20 pb-4 gx-6 gy-2">
            <Col xs={12} md={12} className="mb-10">
              <h4 className="text-start">সংযুক্তি</h4>
              <hr className="border border-info border-1" />
            </Col>
            <Col xs={12} md={6} className="mb-10">
              <label className="mb-10">
                ছবি{" "}
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
                <br />
                <ul>
                  <li> photo format (jpg, jpeg, png)</li>
                  <li> file size must be 160kb or less</li>
                </ul>
              </label>

              <input
                required
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  // setEmpImage(event.target.files[0]);
                  setFieldValue("employeeImage", event.target.files[0]);
                  setImagePreview(URL.createObjectURL(event.target.files[0]));
                }}
                className="form-control"
              />
              {/* {props?.errors?.employeeImage && (
                <div id="feedback" className="invalid-feedback">
                  {props?.errors?.employeeImage}
                </div>
              )} */}
            </Col>
            <Col xs={12} md={6}>
              <img
                src={imagePreview ? imagePreview : DemoImage}
                height="130px"
                style={{ marginLeft: "200px" }}
                // width="100px"
              />
            </Col>
            {/* <Col xs={12} md={6} className="mb-10">
              <label className="mb-10">
                শিক্ষাগত যোগ্যতার সনদপত্র{" "}
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
                <br />
                <ul>
                  <li> photo format (jpg, jpeg, png)</li>
                  <li> file size must be 160kb or less</li>
                </ul>
              </label>

              <input
                required
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue("educationCertificate", event.target.files[0]);
                  setCertificatePreview(
                    URL.createObjectURL(event.target.files[0])
                  );
                }}
                className="form-control"
              />
            </Col>
            <Col xs={12} md={6}>
              <img
                src={certificate ? certificate : ""}
                height="150px"
                style={{ marginLeft: "200px" }}
              />
            </Col> */}
            <Col xs={12} md={6} className="mb-10">
              <label className="mb-10">
                জাতীয় পরিচয়পত্র{" "}
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
                <br />
                <ul>
                  <li> photo format (jpg, jpeg, png)</li>
                  <li> file size must be 160kb or less</li>
                </ul>
              </label>

              {/* {preview && (
                  <img
                    src={preview}
                    onError={(i) => (i.target.style.display = "none")}
                    height="200px"
                  />
                )} */}

              <input
                required
                id="file"
                name="file"
                type="file"
                onChange={(event) => {
                  setFieldValue("nidCopy", event.target.files[0]); //nidCopy
                  setNidPreview(URL.createObjectURL(event.target.files[0]));
                }}
                className="form-control"
              />
              {/* {props.errors.employeeImage && (
                  <div id="feedback" className="invalid-feedback">
                    {props.errors.employeeImage}
                  </div>
                )} */}
            </Col>
            <Col xs={12} md={6}>
              <img
                src={nidPreview ? nidPreview : nidDemo}
                height="150px"
                style={{ marginLeft: "200px" }}
                // width="100px"
              />
            </Col>
            <Col xs={12} md={6} className="mb-10">
              <label className="mb-10">
                নিয়োগ সংক্রান্ত সংযুক্তি(যোগদানপত্র){" "}
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
                <br />
                <ul>
                  <li> file format (jpg, jpeg, png, pdf, docx)</li>
                  <li> total file size must be 5mb or less</li>
                </ul>
              </label>

              <input
                required
                id="file"
                name="file"
                type="file"
                // value={joiningLetter}
                onChange={(event) => {
                  setFieldValue("joiningLetter", event.target.files[0]);
                  setJoiningPreview(URL.createObjectURL(event.target.files[0]));
                }}
                className="form-control"
              />
              {/* {props.errors.employeeAppoinment && (
                  <div id="feedback" className="invalid-feedback">
                    {props.errors.employeeAppoinment}
                  </div>
                )} */}
            </Col>
            <Col xs={12} md={6}>
              <img
                src={joiningPreview ? joiningPreview : ""}
                height="130px"
                style={{ marginLeft: "200px" }}

                // width="100px"
              />
            </Col>
          </Row>
          <Row className="p-20 pb-4 gx-6 gy-2 justify-content-end">
            <Col xs={12} md={4} className="mb-10">
              <Button
                variant=""
                className="mt-2 btn-theme btn-block"
                type="submit"
              >
                যোগদান করুন
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

export default TeacherJoiningForm;
