import * as React from "react";
import { useDispatch } from "react-redux";
import { setState } from "reducers/apiSlice";
import UserRole from "../../../constants/UserRole";
import { AuthUser } from "../../../helpers/AuthUser";
import AdminDashboard from "./AdminDashboard";
import ApplicantDashboard from "./ApplicantDashboard";
import "./Dashboard.scss";
import EmployeeDashboard from "./EmployeeDashboard";
import ReviewerDashboard from "./ReviewerDashboard";

const Dashboard = (props) => {
    // console.log('props', props)
    let roles = AuthUser.getRoles();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(
            setState({
                output: "toggle",
                storeName: "toggle",
                data: false,
            })
        );
    }, []);

    if (roles.includes(UserRole.ADMIN)) {
        return (
            <div className="row">
                <div className="col-md-12">
                    <AdminDashboard />
                </div>
                <div className="col-md-12">{/* <ReviewerDashboard/> */}</div>
                {/* <div className="col-md-8">
                    <RegistrationsOverviewall/>
                </div> */}
            </div>
        );
    } else if (
        roles.includes(UserRole.DSHE_Programmer) ||
        roles.includes(UserRole.INSTITUTE_HEAD) ||
        roles.includes(UserRole.REVIEWER) ||
        roles.includes(UserRole.USEO) ||
        roles.includes(UserRole.DEO) ||
        roles.includes(UserRole.DSHE_SA) ||
        roles.includes(UserRole.DSHE_DG) ||
        roles.includes(UserRole.INSTITUTE_ADMIN) ||
        roles.includes(UserRole.DDCOLLEGE) ||
        roles.includes(UserRole.DDSCHOOL) ||
        roles.includes(UserRole.DDZONAL)
    ) {
        return (
            <div className="row">
                <div className="col-md-12">
                    <ReviewerDashboard props={props} />
                </div>
            </div>
        );
    } else if (roles.includes(UserRole.APPLICANT)) {
        return (
            <div className="row">
                <div className="col-md-12">
                    <ApplicantDashboard />
                </div>
            </div>
        );
    } else if (roles.includes(UserRole.OFFICE_EMPLOYEE)) {
        return (
            <div className="row">
                <div className="col-md-12">
                    <EmployeeDashboard />
                </div>
            </div>
        );
    } else {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="card backimg">

                    </div>
                    {/* <ApplicantDashboard /> */}
                </div>
            </div>
        );
    }
};

export default Dashboard;
