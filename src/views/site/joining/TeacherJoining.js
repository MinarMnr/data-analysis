import React, { useEffect, useState } from "react";
import { Formik } from "formik/dist/index";
import { Col, Row } from "@themesberg/react-bootstrap";
import { InputField, InputSelect } from "../../../components/form";
import InputSelectApi from "../../../components/form/InputSelectApi";
import { BasicTable } from "../../../components/table";
import { Card } from "react-bootstrap";
import { Box, Button, Divider, Grid, Modal, Typography } from "@mui/material";
import { Form as ThemeForm } from "@themesberg/react-bootstrap";
import { Form } from "formik/dist/index";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import ErrorMessage from "../../../components/text/ErrorMessage";
import JobRecommendationType from "../../../constants/JobRecommendationType";
import PositionType from "../../../constants/PositionType";
import { UrlBuilder } from "../../../helpers/UrlBuilder";

import { callApi, clearState, selectApi } from "../../../reducers/apiSlice";
import "./Register.scss";
import { useDispatch, useSelector } from "react-redux";
import TeacherJoiningForm from "./TeacherJoiningForm";
import ProgressBar from "react-topbar-progress-indicator";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
const TeacherJoining = () => {
  const dispatch = useDispatch();

  const [toggle, setToggle] = useState(false);

  // const history = useHistory();

  const {
    loading,
    TeacherJoining = {
      data: {},
    },
    ntrcaData = {
      data: {},
    },
  } = useSelector(selectApi);

  // useEffect(() => {
  //   if (TeacherJoining.data !== undefined) {
  //     dispatch(
  //       clearState({
  //         output: "TeacherJoining",
  //       })
  //     );
  //     history.push("/login");
  //   }
  // }, [dispatch, TeacherJoining]);

  let data = {
    employeeNameBn: ntrcaData?.data?.applicantNameBn,
    employeeName: ntrcaData?.data?.applicantName,
    fathersName: ntrcaData?.data?.fatherName,
    mothersName: ntrcaData?.data?.motherName,
    dateOfBirth: ntrcaData?.data?.dob,
    gender:
      ntrcaData?.data?.gender == "MALE"
        ? "Male"
        : ntrcaData?.data?.gender == "FEMALE"
        ? "Female"
        : "",
    nationality: "BANGLADESHI",
    nid: ntrcaData?.data?.nid,
    birthRegNo: ntrcaData?.data?.birthRegNo,
    mobile: ntrcaData?.data?.mobileNo,
    email: ntrcaData?.data?.email,
    designationName: ntrcaData?.data?.designationName,
    designationCode: ntrcaData?.data?.designationCode,
    subjectName: ntrcaData?.data?.subjectName,
    subjectCode: ntrcaData?.data?.subjectCode,
    instituteName: ntrcaData?.data?.joiningInstituteName,
    activeInstituteId: 1452,
    ntrcaExamRollNumber: ntrcaData?.data?.rollNo,
    ntrcaExamBatch: ntrcaData?.data?.examBatch,
    employeeTypeStatus: "TEACHING_EMPLOYEE",
  };

  const TeacherJoiningSchema = Yup.object().shape({
    ntrcaExamRollNumber: Yup.string().required("Required"),
    ntrcaExamBatch: Yup.string().required("Required"),
    joiningDate: Yup.string().required("Required"),
  });
  return (
    <main
      className={
        toggle == true
          ? "registration_main_div main2-registration pt-30 pb-30"
          : "registration_main_div pt-30 pb-30"
      }
    >
      {/* <h3 className="text-center text-white">ব্যানবেইস আইইআইএমএস</h3> */}
      {loading && <ProgressBar />}
      <div className="row">
        <div className="col-lg-12">
          <div className="registration rounded p-30">
            <h3>শিক্ষক যোগদান ফরম</h3>
            <Formik
              initialValues={data}
              enableReinitialize={true}
              validationSchema={TeacherJoiningSchema}
              onSubmit={(values) => {
                let request = new FormData();
                request.append("nid", values.nid);
                request.append(
                  "dateOfBirth",
                  moment(values.dateOfBirth).format("YYYY-MM-DD")
                );
                request.append("employeeName", values.employeeName);
                request.append("employeeNameBn", values.employeeNameBn);
                request.append("fathersName", values.fathersName);
                request.append("mothersName", values.mothersName);
                request.append("gender", ntrcaData?.data?.gender);
                request.append("nationality", values.nationality);
                request.append("birthRegNo", values.birthRegNo);
                request.append("mobile", values.mobile);
                request.append("email", values.email);
                request.append("positionType", "GENERAL");
                request.append("designationName", values.designationName);
                request.append("subjectName", values.subjectName);
                request.append(
                  "joiningDate",
                  moment(values.joiningDate).format("YYYY-MM-DD")
                );
                request.append("employeeTypeStatus", values.employeeTypeStatus);
                request.append("joiningTime", values.joiningTime);
                request.append("activeInstituteId", values?.activeInstituteId);
                request.append("instituteName", values.instituteName);
                request.append("employeeImage.file", values?.employeeImage);
                // request.append(
                //   "educationCertificate.file",
                //   values.educationCertificate
                // );
                request.append("joiningLetter.file", values.joiningLetter);
                request.append("nidCopy.file", values.nidCopy);
                request.append(
                  "ntrcaExamRollNumber",
                  values.ntrcaExamRollNumber
                );
                request.append("ntrcaExamBatch", values.ntrcaExamBatch);
                dispatch(
                  callApi({
                    operationId: UrlBuilder.mpoDsheApi("employee/joining"),
                    output: "TeacherJoining",
                    parameters: {
                      method: "POST",
                      body: request,
                      hasFile: true,
                    },
                  })
                );
              }}
            >
              {(props) => {
                return (
                  <TeacherJoiningForm
                    {...props}
                    setToggle={setToggle}
                    toggle={toggle}
                  />
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeacherJoining;
