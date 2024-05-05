import moment from "moment";
import * as Yup from "yup";
import JobRecommendationType from "../../../constants/JobRecommendationType";
const mobileRegEx = /^(?:\+88|0088)?(01[3-9]\d{8})$/;
const nidRegEx = /^[0-9](\d{9}|\d{12}|\d{16})$/;
const birthRegRegEx = /^[0-9]\d{16}$/;
//const banglaLang = /^[\u0980-\u09FF\s]{1,50}$/i;
const banglaLang = /^[\p{sc=Bengali}\s]+$/u;
const PHOTO_SIZE = 160 * 1024;
const FILE_SIZE = 5242880; // 5 MB = 5242880 Bytes
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
class RegisterModel {
  /**
   * Model properties
   */
  constructor() {
    this.isIndex = "";
    this.employeeName = "";
    this.employeeNameBn = "";
    this.fathersName = "";
    this.mothersName = "";
    this.dateOfBirth = "";
    this.gender = "";
    this.religion = "";
    this.nid = "";
    this.birthRegNo = "";
    this.nationality = "Bangladeshi";
    // this.recruitmentTypeId = {
    //   id: null,
    //   recruitmentTypeName: "",
    //   recruitmentTypeNameBn: "",
    //   description: "",
    //   descriptionBn: "",
    //   appEntityId: null,
    //   recordStatus: "",
    // };
    this.homeDistrict = "";
    this.emergencyContactMobile = "";
    this.emergencyContactEmail = "";
    this.positionType = "";
    this.employmentType = "";
    this.designation = "";
    this.subject = "";
    this.recruitmentTypeNameBn = "";
    this.institute = "";
    this.activeInstituteId = "";
    this.activeInstituteDateOfJoining = "";
    this.isNtrca = false;
    this.ntrcaExamRollNumber = "";
    this.ntrcaExamYear = "";
    this.employeeImage = "";
    this.employeeAppoinment = "";
    this.instituteTypeId = "";
    this.instituteFieldValue = "";
    this.managementId = "";
    this.divisionId = "";
    this.districtId = "";
    this.thanaId = "";
    this.unionId = "";
    this.jobRecommendationType = "";
    this.employeeTypeName = "";
    this.employeeTypeStatus = "";
    this.eiinNumber = "";
  }

  /**
   * Get model instance from json
   */
  fromJson(data = {}) {
    let obj = new RegisterModel();
    // if (data.id !== undefined && data.id) {
    //   obj.id = data.id;
    // }
    obj.employeeName = data.employeeName ?? "";
    obj.employeeNameBn = data.employeeNameBn ?? "";
    obj.mothersName = data.mothersName ?? "";
    obj.fathersName = data.fathersName ?? "";
    obj.dateOfBirth = data.dateOfBirth ?? "";
    obj.gender = data.gender ?? "";
    obj.nationality = data.nationality.toUpperCase() ?? "";
    obj.religion = data.religion ?? "";
    obj.birthRegNo = data.birthRegNo ?? "";
    obj.nid = data.nid ?? "";
    obj.homeDistrict = data.homeDistrict ?? "";
    obj.emergencyContactMobile = data.emergencyContactMobile ?? "";
    obj.emergencyContactEmail = data.emergencyContactEmail ?? "";
    obj.positionType = data.positionType ?? "";
    obj.employmentType = data.employmentType ?? "";
    obj.designation = data.designation ?? "";
    obj.subject = data.subject ?? "";
    //obj.recruitmentTypeNameBn = data.recruitmentTypeNameBn ?? "";
    obj.institute = data.institute ?? "";
    obj.activeInstituteId = data.activeInstituteId ?? "";
    obj.jobRecommendationType = data.jobRecommendationType ?? "";
    obj.activeInstituteDateOfJoining = data.activeInstituteDateOfJoining ?? "";
    obj.isNtrca = data.isNtrca ?? "";
    obj.ntrcaExamRollNumber = data.ntrcaExamRollNumber ?? "";
    obj.ntrcaExamYear = data.ntrcaExamYear ?? "";
    obj.employeeImage = "";
    obj.employeeAppoinment = "";
    return obj;
  }

  /**
   * Get string from model instance
   */
  toString(data = {}) {
    let obj = new RegisterModel().fromJson(data);
    return JSON.stringify(obj);
  }
  /**
   * Get form data from model instance
   * section for file upload
   */
  toFormData(obj = {}) {
    let data = new FormData();
    data.append("request", new RegisterModel().toString(obj));
    //data.get("request");
    return data;
  }

  /**
   * Validator schema
   */
  validator() {
    return Yup.object().shape({
      employeeName: Yup.string().required("user full name is a required field"),
      employeeNameBn: Yup.string()
        .required("user full name (in Bangla) is a required field")
        .matches(banglaLang, "Please type in bangla"),
      mothersName: Yup.string().required("mothers name is a required field"),
      fathersName: Yup.string().required("fathers name is a required field"),
      //institute: Yup.string().required("institute name is a required field"),
      // instituteNameBn: Yup.string().required(
      //   "institute name (in Bangla) is a required field"
      // ),
      dateOfBirth: Yup.string().test(
        "dateOfBirth",
        "date of birth must be less then or equal today Date",
        (value) => {
          return value <= moment(new Date()).format("YYYY-MM-DD");
        }
      ),
      gender: Yup.string().required("gender of birth is a required field"),
      religion: Yup.string().required("religion is a required field"),
      nid: Yup.string()
        .required("nid is a required field")
        .matches(nidRegEx, "please enter valid number format"),
      // nid: Yup.string()
      //   .required("জাতীয় পরিচয়পত্র নম্বর ১০, ১৩ অথবা ১৭ ডিজিট হতে হবে।")
      //   .matches(nidRegEx, "জাতীয় পরিচয়পত্র নম্বর ১০, ১৩ অথবা ১৭ ডিজিট হতে হবে।"),
      nationality: Yup.string().required("nationality is a required field"),
      birthRegNo: Yup.string().matches(
        birthRegRegEx,
        "please enter valid number format"
      ),
      // birthRegNo: Yup.string().matches(
      //   birthRegRegEx,
      //   "জন্ম নিবন্ধন সনদপত্র নম্বর ১৭ ডিজিট হতে হবে"
      // ),
      //.required("birth reg no of birth is a required field"),
      positionType: Yup.string().required("position type is a required field"),
      employmentType: Yup.string().required(
        "employment Type type is a required field"
      ),
      subject: Yup.number().when("employeeTypeStatus", {
        is: (value) => value && value === "TEACHING_EMPLOYEE",
        then: Yup.number().required("subject is a required field"),
      }),
      //subject: Yup.number().required("subject is a required field"),
      designation: Yup.string().required("designation is a required field"),
      //institute: Yup.string().required("institute is a required field"),
      activeInstituteId: Yup.number().required("institute is a required field"),
      homeDistrict: Yup.number().required("home district is a required field"),
      // recruitmentTypeId: Yup.string().required(
      //   "recruitmentTypeId is a required field"
      // ),
      jobRecommendationType: Yup.string().required(
        "job recommendation type is a required field"
      ),
      activeInstituteDateOfJoining: Yup.date().required(
        "join date is a required field"
      ),
      activeInstituteDateOfJoining: Yup.string().test(
        "activeInstituteDateOfJoining",
        "Join date Must be greater  or equal today Date",
        (value) => {
          return value >= moment(new Date()).format("YYYY-MM-DD");
        }
      ),
      ntrcaExamRollNumber: Yup.number().when("jobRecommendationType", {
        is: (value) => value && value === JobRecommendationType.এনটিআরসিএ,
        then: Yup.number().required(
          "ntrca exam roll number is a required field."
        ),
      }),
      ntrcaExamYear: Yup.date().when("jobRecommendationType", {
        is: (value) => value && value === JobRecommendationType.এনটিআরসিএ,
        then: Yup.date().required("passing date is a required field"),
      }),
      //ntrcaExamYear: Yup.date().required("passing date is a required field"),
      emergencyContactMobile: Yup.string()
        .required("mobile is a required field")
        .matches(mobileRegEx, "mobile number is not valid"),
      emergencyContactEmail: Yup.string()
        .email("must be a valid email")
        .required("email is a required field"),
      employeeImage: Yup.mixed()
        .required("employee image is a required field")
        .test("fileFormat", "unsupported Format", (value) => {
          return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test(
          "fileSize",
          `File too large. Max file size ${PHOTO_SIZE / 1024} kb`,
          (value) => value && value.size <= PHOTO_SIZE
        ),
      employeeAppoinment: Yup.mixed()
        .required("attachment is a required field")
        // .test("fileFormat", "Unsupported Format", (value) => {
        //   console.log("uploaded file", value);
        //   return value && SUPPORTED_FORMATS.includes(value.type);
        // })
        .test(
          "fileSize",
          `File too large. Max file size ${FILE_SIZE / (1024 * 1024)} mb`,
          (value) => {
            // console.log("values", value);
            return value && value[0].size <= FILE_SIZE;
          }
        ),
    });
  }
}

export const Register = new RegisterModel();
