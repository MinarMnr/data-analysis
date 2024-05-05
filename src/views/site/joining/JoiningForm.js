import React, { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Form } from "formik/dist/index";
import { InputField, InputSelect } from "components/form";
import InputSelectApi from "../../../components/form/InputSelectApi";
import ErrorMessage from "../../../components/text/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import InstituteSelectModal from "./InstituteSelectModal";
import { UrlBuilder } from "helpers/UrlBuilder";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callApi, selectApi } from "reducers/apiSlice";
import InputDatePicker from "components/form/InputDatePicker";

const JoiningForm = ({
  values,
  setInstitute,
  setCssData,
  setFieldValue,
  errors,
  touched,
}) => {
  // console.log("valuesddddddddewtrt4w", values?.employeeTypeStatus);
  // console.log("errorsdsdd", errors);
  console.log("touched", touched);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [data, setData] = useState(false);

  const {
    loading,
    nidData = {
      data: {},
    },

    designationList = {
      data: {}
    }
  } = useSelector(selectApi);
  // console.log('designationList', designationList.data)

  const getDataFromNid = () => {
    if (values?.nid !== undefined && values?.dateOfBirth !== undefined && values?.employeeTypeStatus !== undefined) {
      dispatch(
        callApi({
          operationId: UrlBuilder.mpoDsheApi(
            `employee/find/mock-nid-by-nid-and-dob?dob=${values?.dateOfBirth}&nid=${values?.nid}`
          ),
          output: "nidData",
          storeName: "nidData",
        })
      );
      setData(true);
      setCssData(true);
    }
  };


  return (
    <Form>
      <Row className="mb-20">
        <Col md={3} className="mb-10 ml-93">
          <InputField
            label="জাতীয় পরিচয়পত্রঃ"
            name="nid"
            required={true}
            type="text"
            placeholder="১০, ১৩ অথবা ১৭ সংখ্যার জাতীয় পরিচয়পত্র নম্বর প্রদান করুন"
          />
          <ErrorMessage fieldName="nid" />
        </Col>
        <Col md={3} className="mb-15">
          <InputDatePicker
            label="জন্মতারিখ"
            name="dateOfBirth"
            required={true}
            setField={setFieldValue}
            dataValue={values?.dateOfBirth}
          />
          <ErrorMessage fieldName="dateOfBirth" />
        </Col>

        <Col xs={12} md={3} className="mb-10">
          <InputSelect
            label="যোগদানকারীর ধরণ"
            name="employeeTypeStatus"
            // type="number"
            value="id"
            data={[
              { id: "TEACHING_EMPLOYEE", name: "শিক্ষক" },
              { id: "NON_TEACHING_EMPLOYEE", name: "কর্মচারী" },
            ]}
            required={true}
            text="name"
            onChange={(e) => {
              console.log('e', e?.target?.value),
                setFieldValue("employeeTypeStatus", e?.target?.value);
              localStorage.setItem("employeeTypeStatus", e?.target?.value)

            }}
          />
          <ErrorMessage fieldName="employeeTypeStatus" />
        </Col>

        <Col md={2}>
          <Button
            variant="success"
            type="submit"
            className="mt-33"
            onClick={getDataFromNid}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Col>
      </Row>

      {nidData?.data?.status === "success" && (
        <>
          <Row>
            <div class="mb-10 col-md-12 col-12">
              <h4 class="text-start">সাধারণ তথ্য</h4>
              <hr class="border border-info border-1" />
            </div>
            <Col md={6} className="mb-15">
              <InputField
                label="নাম (ইংরেজিতে)"
                name="employeeName"
                type="text"
                isDisabled={true}
                placeholder=" Full Name"
              />
              <ErrorMessage fieldName="employeeName" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="পিতার নাম (ইংরেজিতে)"
                name="fathersName"
                type="text"
                isDisabled={true}
                placeholder="Father's Name"
              />
              <ErrorMessage fieldName="fathersName" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="মাতার নাম (ইংরেজিতে)"
                name="mothersName"
                type="text"
                isDisabled={true}
                placeholder=" Mother's Name"
              />
              <ErrorMessage fieldName="mothersName" />
            </Col>
            <Col md={6} className="">
              <InputDatePicker
                label="জন্মতারিখ"
                name="dateOfBirth"
                setField={setFieldValue}
                dataValue={values?.dateOfBirth}
              />
              <ErrorMessage fieldName="dateOfBirth" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="পুরুষ/মহিলা"
                name="gender"
                placeholder=" জন্ম তারিখ"
                isDisabled={true}
                type="text"
              />
              <ErrorMessage fieldName="gender" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="জাতীয়তা"
                name="nationality"
                type="text"
                isDisabled={true}
                placeholder="Nationality"
              />
              <ErrorMessage fieldName="nationality" />
            </Col>
            <Col xs={12} md={6} className="mb-10">
              <InputSelect
                label="ধর্ম"
                name="religionInfo"
                // type="text"
                value="id"
                data={[
                  { id: "ISLAM", name: "Islam" },
                  { id: "HINDUISM", name: "Hinduism" },
                  { id: "BUDDHISM", name: "Buddhism" },
                  { id: "CHRISTIANITY", name: "Christianity" },
                  { id: "OTHER", name: "Other" },
                ]}
                required={true}
                text="name"
              />
              <ErrorMessage fieldName="religionInfo" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="জাতীয় পরিচয়পত্র নম্বর"
                name="nid"
                type="text"
                isDisabled={true}
                placeholder="এনআইডি Number"
              />
            </Col>
            <Col md={6} className="mb-15">
              <div>
                <InputField
                  label="জন্ম নিবন্ধন নম্বর"
                  name="birthRegNo"
                  type="text"
                  isDisabled={false}
                  placeholder="Birth Reg Number"
                />
                <ErrorMessage fieldName="birthRegNo" />
              </div>
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="মোবাইল নম্বর"
                name="mobile"
                required={true}
                // isDisabled={true}
                type="text"
                placeholder="Contact Number"
              />
              <ErrorMessage fieldName="mobile" />
            </Col>
            <Col md={6} className="mb-15">
              <InputField
                label="ই-মেইল"
                name="email"
                type="email"
                required={true}
                // isDisabled={true}
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

            <Col xs={12} md={6} className="mb-10">

              <InputField
                label="প্রতিষ্ঠান নির্বাচন"
                name="activeInstituteName"
                //placeholder=" Joining Date"
                type="text"
                required={true}
                isDisabled={true}

              />
              <FontAwesomeIcon
                icon={faSearch}
                color="green"
                size="2x"
                className="pl-5"
                onClick={() => {
                  setShow(true);
                }}
              />

              <InstituteSelectModal
                show={show}
                setShow={setShow}
                setInstitute={setInstitute}
                values={values}
              // mobile={values?.mobile}
              />

              <ErrorMessage fieldName="activeInstituteName" />
            </Col>

            <Col xs={12} md={6} className="mb-10">
              <InputSelectApi
                label="পদবি"
                name="designation"
                operationId={
                  values?.activeInstituteName && localStorage.getItem("employeeTypeStatus") === "NON_TEACHING_EMPLOYEE"
                    ? UrlBuilder.mpoDsheApi(
                      `employee/designation/list?positionType=ADMINISTRATIVE`
                    )
                    : values?.activeInstituteName && localStorage.getItem("employeeTypeStatus") === "TEACHING_EMPLOYEE" ? UrlBuilder.ntrcaApi(
                      `designation/all`
                    ) : ""
                }
                storeName="designationList"
                type="text"
                value={localStorage.getItem("employeeTypeStatus") === "TEACHING_EMPLOYEE" ? "designationCode" : localStorage.getItem("employeeTypeStatus") === "NON_TEACHING_EMPLOYEE" ? "id" : "id"}
                required={true}
                // isDisabled={true}
                text="designationName"
              // onChange={() => getInstituteHeadTeacher()}
              />
              <ErrorMessage fieldName="designation" />
            </Col>
            {localStorage.getItem("employeeTypeStatus") == "TEACHING_EMPLOYEE" && (
              <Col xs={12} md={6} className="mb-10">
                <InputSelectApi
                  label="বিষয়"
                  name="subject"
                  operationId={UrlBuilder.ntrcaApi(`subject/all`)}
                  storeName="subjectList"
                  type="text"
                  value="id"
                  required={false}
                  // isDisabled={true}
                  text="subjectName"
                />
                <ErrorMessage fieldName="subject" />
              </Col>
            )}
            <Col xs={12} md={6} className="mb-10">
              <InputDatePicker
                label="যোগদানের তারিখ"
                name="joiningDate"
                required={true}
                setField={setFieldValue}
                dataValue={values?.joiningDate}
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
                isDisable={values?.activeInstituteName ? false : true}
                text="name"
              />
              <ErrorMessage fieldName="joiningTime" />
            </Col>
          </Row>
          <Row className="p-20 pb-4 gx-6 gy-2">
            <Col xs={12} md={12} className="mb-10">
              <h4 className="text-start">সংযুক্তি</h4>
              <hr className="border border-info border-1" />
            </Col>
            <Col xs={12} md={6} className="mb-10">
              <label>
                ছবি <span className="text-danger">*</span>
              </label>
              <span className="text-primary">
                {" "}
                Allowed photo format (jpg, jpeg, png) and max file size
                500 kb or less
              </span>
              <input
                id="employeeImage"
                name="employeeImage"
                type="file"
                // accept="image/*"
                onChange={(event) => {
                  setFieldValue(
                    "employeeImage",
                    event.target.files[0]
                  );
                }}
                className={`form-control mt-7 ${errors?.employeeImage ? "is-invalid" : ""
                  }`}
              />
              <span className="text-danger">{errors?.employeeImage}</span>
              {/* <span className={errors?.employeeImage == "Unsupported Format" ? "text-danger" : ""}>{errors?.employeeImage == "Unsupported Format" ? "Unsupported Format-Please Select jpg, jpeg or png file" : ""}</span> */}
            </Col>

            <Col xs={12} md={6} className="mb-10">
              <label className="mb-10">
                সনদপত্র{" "}
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
                <br />
              </label>
              <span className="text-primary">
                {" "}
                Allowed photo format (jpg, jpeg, png) and max file size
                500kb
              </span>

              <input

                id="educationCertificate"
                name="educationCertificate"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue("educationCertificate", event.target.files[0]);
                }}
                className={`form-control mt-7 ${errors?.educationCertificate ? "is-invalid" : ""
                  }`}
              />
              <span className="text-danger">{errors?.educationCertificate}</span>
            </Col>
            <Col xs={12} md={6} className="mb-10">
              <label className="mb-10">
                জাতীয় পরিচয়পত্র{" "}
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
                <br />
              </label>
              <span className="text-primary">
                {" "}
                Allowed photo format (jpg, jpeg, png) and max file size
                500kb
              </span>
              <input

                id="nidCopy"
                name="nidCopy"
                type="file"
                onChange={(event) => {
                  setFieldValue("nidCopy", event.target.files[0]);
                }}
                className={`form-control mt-7 ${errors?.nidCopy ? "is-invalid" : ""
                  }`}
              />
              <span className="text-danger">{errors?.nidCopy}</span>
            </Col>
            <Col xs={12} md={6} className="mb-10">
              <label className="mb-10">
                নিয়োগ সংক্রান্ত সংযুক্তি(যোগদানপত্র){" "}
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
                <br />
              </label>
              <span className="text-primary">
                {" "}
                Allowed format pdf,docs and max file size 500 kb
              </span>
              <input

                id="joiningLetter"
                name="joiningLetter"
                type="file"
                // value={joiningLetter}
                onChange={(event) => {
                  setFieldValue("joiningLetter", event.target.files[0]);
                }}
                className={`form-control mt-7 ${errors?.joiningLetter ? "is-invalid" : ""
                  }`}
              />
              <span className="text-danger">{errors?.joiningLetter}</span>
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

export default JoiningForm;
