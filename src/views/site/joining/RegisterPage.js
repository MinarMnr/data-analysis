import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik/dist/index";
import moment from "moment";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ProgressBar from "react-topbar-progress-indicator";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { callApi, clearState, selectApi } from "../../../reducers/apiSlice";
import { setToastAlert } from "../../../reducers/toastAlertSlice";
import JoiningForm from "./JoiningForm";
import { Register } from "./Register";
import RegisterForm from "./RegisterForm";
import * as Yup from "yup";
const RegisterPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    loading,
    EmployeeJoining = {
      data: {},
    },
    nidData = {
      data: {},
    },
  } = useSelector(selectApi);

  useEffect(() => {
    if (EmployeeJoining.data !== undefined) {
      dispatch(
        clearState({
          output: "EmployeeJoining",
        })
      );
      history.push("/login");
    }

    localStorage.setItem("employeeTypeStatus", "");
  }, [dispatch, EmployeeJoining]);


  // Essential DataSet

  const [institute, setInstitute] = React.useState();
  const [cssdata, setCssData] = React.useState(false);
  console.log('institute', institute)


  const data = {
    nid: nidData?.data?.data?.nidNumber,
    dateOfBirth: nidData?.data?.data?.dateOfBirth,
    birthRegNo: institute?.values?.birthRegNo,
    employeeNameBn: nidData?.data?.data?.name,
    employeeName: nidData?.data?.data?.name,
    fathersName: nidData?.data?.data?.fatherName,
    mothersName: nidData?.data?.data?.motherName,
    gender: nidData?.data?.data?.gender.toUpperCase(),
    activeInstituteName: institute?.instituteName,
    nationality: "BANGLADESHI",
    employeeTypeStatus: localStorage.getItem("employeeTypeStatus")
  };

  const nidRegEx = /^[0-9](\d{9}|\d{12}|\d{16})$/;
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const PHOTO_SIZE = 500 * 1024;
  const FILE_SIZE = 500 * 1024;//500kb ----- // 5 MB = 5242880 Bytes
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
  const FILE_SUPPORTED_FORMATS = ["application/pdf"];



  const EmployeeJoiningSchema = Yup.object().shape({
    nid: Yup.string().required("জাতীয় পরিচয়পত্র বাধ্যতামূলক").matches(nidRegEx, "জাতীয় পরিচয়পত্র নম্বর ১০, ১৩ অথবা ১৭ সংখ্যার হতে হবে।"),
    dateOfBirth: Yup.string().required("জাতীয় পরিচয়পত্রে উল্লেখিত জন্মতারিখ"),
    email: Yup.string().email('বৈধ ই-মেইল হতে হবে').max(50).required('ই-মেইল বাধ্যতামূলক'),
    mobile: Yup.string()
      .required("মোবাইল নম্বর বাধ্যতামূলক")
      .matches(phoneRegExp, 'মোবাইল নম্বর সঠিক না')
      .min(11, "Too short")
      .max(11, "Too long"),
    activeInstituteName: Yup.string().required("প্রতিষ্ঠান নির্বাচন বাধ্যতামূলক"),
    designation: Yup.string().required("যোগদানকারীর ধরণ বাধ্যতামূলক"),
    employeeTypeStatus: Yup.string().required("যোগদানকারীর ধরণ বাধ্যতামূলক"),
    joiningDate: Yup.string().required("যোগদানের তারিখ বাধ্যতামূলক"),
    joiningTime: Yup.string().required("যোগদানের সময় বাধ্যতামূলক"),
    religionInfo: Yup.string().required("ধর্ম বাধ্যতামূলক"),
    employeeImage: Yup.mixed()
      .required("যোগদানকারীর ছবি বাধ্যতামূলক")
      .test("fileFormat", "unsupported Format", (value) => {
        return value && SUPPORTED_FORMATS.includes(value.type);
      })
      .test(
        "fileSize",
        `File too large. Max file size ${PHOTO_SIZE / 1024} kb`,
        (value) => value && value.size <= PHOTO_SIZE
      ),
    educationCertificate: Yup.mixed()
      .required("যোগদানকারীর সনদপত্র বাধ্যতামূলক")
      .test("fileFormat", "unsupported Format", (value) => {
        return value && SUPPORTED_FORMATS.includes(value.type);
      })
      .test(
        "fileSize",
        `File too large. Max file size ${PHOTO_SIZE / 1024} kb`,
        (value) => value && value.size <= PHOTO_SIZE
      ),
    nidCopy: Yup.mixed()
      .required("যোগদানকারীর জাতীয় পরিচয়পত্র বাধ্যতামূলক")
      .test("fileFormat", "unsupported Format", (value) => {
        return value && SUPPORTED_FORMATS.includes(value.type);
      })
      .test(
        "fileSize",
        `File too large. Max file size ${PHOTO_SIZE / 1024} kb`,
        (value) => value && value.size <= PHOTO_SIZE
      ),
    joiningLetter: Yup.mixed()
      .required("যোগদানপত্র বাধ্যতামূলক")
      .test("fileFormat", "unsupported Format", (value) => {
        return value && FILE_SUPPORTED_FORMATS.includes(value.type);
      })
      .test(
        "fileSize",
        `File too large. Max file size ${FILE_SIZE / 1024} kb`,
        (value) => value && value.size <= FILE_SIZE
      ),
  });

  return (
    <main
      className={
        cssdata == true
          ? "registration_main_div main2-registration  pt-30 pb-30"
          : "registration_main_div  pt-30 pb-30"
      }
    >
      {loading && <ProgressBar />}
      <div className="row">
        <div className="col-lg-12">
          <div className="registration rounded p-30">
            <h3 className="mb-50 text-success">যোগদান ফরম</h3>
            <Formik
              initialValues={{ ...data, email: institute?.values?.email, mobile: institute?.values?.mobile, religionInfo: institute?.values?.religionInfo }}
              enableReinitialize={true}
              validationSchema={EmployeeJoiningSchema}
              onSubmit={(values, { resetForm }) => {
                // console.log('submitValues', values)
                delete values?.instituteName;
                let request = new FormData();

                request.append("nid", values?.nid);
                request.append(
                  "dateOfBirth",
                  moment(values.dateOfBirth).format("YYYY-MM-DD")
                );
                request.append(
                  "employeeTypeStatus",
                  values?.employeeTypeStatus
                );
                request.append("employeeName", values?.employeeName);
                request.append("employeeNameBn", values?.employeeNameBn);
                request.append("fathersName", values?.fathersName);
                request.append("mothersName", values?.mothersName);
                request.append("gender", values?.gender);
                request.append("nationality", values?.nationality);
                request.append("birthRegNo", values?.birthRegNo);
                request.append("mobile", values?.mobile);
                request.append("email", values?.email);
                request.append("religionInfo", values.religionInfo)
                // request.append("positionType", "ADMINISTRATIVE");
                if (localStorage.getItem("employeeTypeStatus") === "TEACHING_EMPLOYEE") {
                  request.append("designationCode", values.designation);
                } else if (localStorage.getItem("employeeTypeStatus") === "NON_TEACHING_EMPLOYEE") {
                  request.append("designation", values.designation);
                }
                request.append(
                  "joiningDate",
                  moment(values.joiningDate).format("YYYY-MM-DD")
                );
                request.append("joiningTime", values?.joiningTime);
                request.append("activeInstituteId", institute?.id);
                request.append("employeeImage.file", values?.employeeImage);
                request.append(
                  "educationCertificate.file",
                  values?.educationCertificate
                );
                request.append("joiningLetter.file", values?.joiningLetter);
                request.append("nidCopy.file", values?.nidCopy);
                request.append("isNtrca", false);

                dispatch(
                  callApi({
                    operationId: UrlBuilder.mpoDsheApi("employee/joining"),
                    output: "EmployeeJoining",
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
                  <JoiningForm
                    {...props}
                    setInstitute={setInstitute}
                    setCssData={setCssData}
                  />
                );
                // return <RegisterForm {...props} />;
              }}
            </Formik>
            <p>
              ইতিমধ্যে যোগদান করেছেন?
              <Link to="/login" className="thembo ml-2">
                এখানে লগ-ইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
