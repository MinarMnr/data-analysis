import { faPauseCircle } from "@fortawesome/free-regular-svg-icons";
import {
    faExchangeAlt,
    faLaptopCode,
    faUserAltSlash,
    faUserCheck,
    faUserClock,
    faUserGraduate,
    faUserMinus,
    faUserPlus,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col } from "@themesberg/react-bootstrap";
import { Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DefaultCard from "../../../components/card/default/DefaultCard";
import UserRole from "../../../constants/UserRole";
import { AuthUser } from "../../../helpers/AuthUser";
import DashboardWidget from "../_partials/DashboardWidget";
import "./Dashboard.scss";

const Dashboard = ({ props }) => {
    const dispatch = useDispatch();

    const employeepanelCardProps = {
        title: "শিক্ষক/কর্মকর্তা/কর্মচারী প্যানেল",
    };
    const applicationsCardProps = {
        title: "নতুন আবেদন এবং আবেদন সমূহের পর্যালোচনা",
    };
    const reportsCardProps = {
        title: "রিপোর্ট",
    };
    const mpoPaymentOverviewCardProps = {
        title: "শিক্ষক/কর্মকর্তা/কর্মচারী এমপিও পেমেন্ট",
    };
    const IncomeTaxOverviewCardProps = {
        title: "শিক্ষক/কর্মকর্তা/কর্মচারী এডভান্সড আয়কর",
    };
    const ReleaseOverviewCardProps = {
        title: "শিক্ষক/কর্মকর্তা/কর্মচারী অবসর সুবিধা",
    };
    const joiningOverviewCardProps = {
        title: "প্রতিষ্ঠান  প্রধানের অনুমোদন",
    };
    const settingsOverviewCardProps = {
        title: "সেটিংস",
    };

    const correctionOverviewCardProps = {
        title: "সংশোধন ওভারভিউ",
    };

    let roles = AuthUser.getRoles();
    const EmployeepanelChart = [
        {
            id: 1,
            title: "শিক্ষক",
            link: "/",
            icon: faUsers,
            theme: "l-bg-blue-dark",
            count: 15,
        },
        {
            id: 2,
            title: "কর্মকর্তা বা কর্মচারী",
            link: "/",
            icon: faUsers,
            theme: "l-bg-green-dark",
            count: 10,
        },
    ];
    const MpoPaymentChart = [
        {
            id: 1,
            title: "স্যালারি শিট",
            link: "/",
            icon: faUserPlus,
            theme: "l-bg-blue-dark",
            count: 10,
        },
        {
            id: 2,
            title: "বোনাস শিট",
            link: "/",
            icon: faExchangeAlt,
            theme: "l-bg-green-dark",
            count: 5,
        },
    ];
    const JoiningOverviewBoardChart = [
        {
            id: 1,
            title: "যোগদান (JOINING)",
            link: "/",
            icon: faUserCheck,
            theme: "bg-success-gradient",
            count: 7,
        },
        {
            id: 2,
            title: "শিক্ষাগত যোগ্যতা (EDUCATIONAL QUALIFICATION)",
            link: "/",
            icon: faUserClock,
            theme: "bg-success-gradient",
            count: 4,
        },
        {
            id: 2,
            title: "পদক/সম্মাননা (AWARD)",
            link: "/",
            icon: faUserClock,
            theme: "bg-success-gradient",
            count: 4,
        },
        {
            id: 2,
            title: "প্রকাশনা (PUBLICATION)",
            link: "/",
            icon: faUserClock,
            theme: "bg-success-gradient",
            count: 4,
        },
    ];

    const IncomeTaxOverviewBoardChart = [
        {
            id: 1,
            title: "আয়কর",
            link: "/",
            icon: faUserCheck,
            theme: "bg-success-gradient",
            count: 7,
        },
        // {
        //     id: 2,
        //     title: "অনুমোদন অপেক্ষারত",
        //     link: "/",
        //     icon: faUserClock,
        //     theme: "bg-danger-gradient",
        //     count: 4,
        // },
    ];

    const ReleaseOverviewBoardChart = [
        {
            id: 1,
            title: "অবসর উপযুক্ত শিক্ষকদের তালিকা",
            link: "/",
            icon: faUserCheck,
            theme: "bg-success-gradient",
            count: 7,
        },
    ];
    const TransferOverviewBoardChart = [
        {
            id: 1,
            title: "পর্যালোচনা",
            link: "/",
            icon: faUserCheck,
            theme: "bg-success-gradient",
            count: 5,
        },
        {
            id: 2,
            title: "অনুমোদন অপেক্ষারত",
            link: "/",
            icon: faUserClock,
            theme: "bg-danger-gradient",
            count: 3,
        },
    ];

    const CorrectionOverviewBoardChart = [
        {
            id: 1,
            title: "পর্যালোচনা",
            link: "/",
            icon: faUserCheck,
            theme: "bg-success-gradient",
            count: 7,
        },
        {
            id: 2,
            title: "অনুমোদন অপেক্ষারত",
            link: "/",
            icon: faUserClock,
            theme: "bg-danger-gradient",
            count: 5,
        },
    ];
    const SettingsOverviewBoardChart = [
        {
            id: 1,
            title: "এসএমসি/জিবি",
            link: "/",
            icon: faUserCheck,
            theme: "bg-success-gradient",
        },
        {
            id: 2,
            title: "প্রতিষ্ঠান তথ্য",
            link: "/",
            icon: faUserClock,
            theme: "bg-danger-gradient",
        },
        {
            id: 2,
            title: "অতিরিক্ত শ্রেণী/শাখা/বিষয়/বিভাগ",
            link: "/",
            icon: faUserClock,
            theme: "bg-danger-gradient",
        },
    ];
    const RetirementOverviewBoardChart = [
        {
            id: 1,
            title: "পর্যালোচনা",
            link: "/",
            icon: faUserCheck,
            theme: "bg-success-gradient",
            count: 10,
        },
        {
            id: 2,
            title: "অনুমোদন অপেক্ষারত",
            link: "/",
            icon: faUserClock,
            theme: "bg-danger-gradient",
            count: 8,
        },
    ];
    const DashBoardChart = [
        {
            id: 1,
            title: "এম পি ও আবেদন",
            link: "/portal/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-green-dark",
        },
        {
            id: 2,
            title: "বি.এ.ড স্কেল",
            link: "/portal/bed-scale/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-purple",
        },
        {
            id: 3,
            title: "উচ্চতর গ্রেড",
            link: "/portal/upper-grade/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-card1",
        },
        {
            id: 4,
            title: "স্থানান্তর",
            link: "/portal/application/employee-transfer",
            icon: faPauseCircle,
            theme: "l-bg-green-dark",
        },
        {
            id: 5,
            title: "সংশোধন",
            link: "/portal/correction",
            icon: faPauseCircle,
            theme: "l-bg-purple",
        },
        {
            id: 6,
            title: "বকেয়া ",
            link: "/portal/arrear/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-card1",
        },
        // {
        //     id: 7,
        //     title: "অ্যাট্রিশন",
        //     link: "/portal/attrition-list",
        //     icon: faPauseCircle,
        //     theme: "l-bg-green-dark",
        // },
        {
            id: 8,
            title: "মুক্তি",
            link: "/portal/application/index/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-purple",
        },
        {
            id: 9,
            title: " অবসর",
            link: "/portal/retirement/list",
            icon: faPauseCircle,
            theme: "l-bg-card1",
        },
    ];

    return (
        <>
            {(roles.includes(UserRole.INSTITUTE_HEAD) ||
                roles.includes(UserRole.INSTITUTE_ADMIN)) && (
                    <DefaultCard className="mb-10" {...employeepanelCardProps}>
                        <div className="row align-items-center pr-15 ">
                            {EmployeepanelChart.map((item, index) => {
                                return (
                                    <>
                                        <div
                                            key={index}
                                            className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                                        >
                                            <DashboardWidget
                                                title={item.title}
                                                link={item.link}
                                                icon={item.icon}
                                                theme={item.theme}
                                                count={item.count}
                                            />
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </DefaultCard>
                )}

            {(roles.includes(UserRole.INSTITUTE_HEAD) ||
                roles.includes(UserRole.INSTITUTE_ADMIN) ||
                roles.includes(UserRole.USEO) ||
                roles.includes(UserRole.DEO) ||
                roles.includes(UserRole.DDZONAL) ||
                roles.includes(UserRole.DDSCHOOL) ||
                roles.includes(UserRole.DDCOLLEGE) ||
                roles.includes(UserRole.DSHE_Programmer) ||
                roles.includes(UserRole.DSHE_SA) ||
                roles.includes(UserRole.DSHE_DG)) && (
                    <DefaultCard className="mb-10" {...applicationsCardProps}>
                        <div className="row align-items-center pr-15 ">
                            <div
                                // key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <Link>
                                    <Card
                                        className={`info-box bg-success-gradient  order-info-box mt-10 mb-10 p-20`}
                                        border="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        <Card.Body className="info-box-block">
                                            <Card.Title className="float-start m-0">
                                                এমপিও (M.P.O)
                                            </Card.Title>

                                            <Card.Subtitle className="float-end">
                                                <FontAwesomeIcon
                                                    className=""
                                                    icon={faUserPlus}
                                                />
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>

                            <div
                                // key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <Link>
                                    <Card
                                        className={`info-box gradient-mint  order-info-box mt-10 mb-10 p-20`}
                                        border="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        <Card.Body className="info-box-block">
                                            <Card.Title className="float-start m-0">
                                                বি.এ.ড স্কেল (B.ED SCALE)
                                            </Card.Title>

                                            <Card.Subtitle className="float-end">
                                                <FontAwesomeIcon
                                                    className=""
                                                    icon={faUserGraduate}
                                                />
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>
                            <div
                                // key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <Link>
                                    <Card
                                        className={`info-box gradient-king-yna  order-info-box mt-10 mb-10 p-20`}
                                        border="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        <Card.Body className="info-box-block">
                                            <Card.Title className="float-start m-0">
                                                উচ্চতর গ্রেড (UPPER GRADE)
                                            </Card.Title>

                                            <Card.Subtitle className="float-end">
                                                <FontAwesomeIcon
                                                    className=""
                                                    icon={faLaptopCode}
                                                />
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>
                            <div
                                // key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <Link>
                                    <Card
                                        className={`info-box l-bg-cyan-dark  order-info-box mt-10 mb-10 p-20`}
                                        border="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        <Card.Body className="info-box-block">
                                            <Card.Title className="float-start m-0">
                                                সংশোধন (CORRECTION)
                                            </Card.Title>

                                            <Card.Subtitle className="float-end">
                                                <FontAwesomeIcon
                                                    className=""
                                                    icon={faUserCheck}
                                                />
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>
                            <div
                                // key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <Link>
                                    <Card
                                        className={`info-box bg-danger-gradient  order-info-box mt-10 mb-10 p-20`}
                                        border="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        <Card.Body className="info-box-block">
                                            <Card.Title className="float-start m-0">
                                                বকেয়া (ARREAR)
                                            </Card.Title>

                                            <Card.Subtitle className="float-end">
                                                <FontAwesomeIcon
                                                    className=""
                                                    icon={faUserMinus}
                                                />
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>
                            <div
                                // key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <Link>
                                    <Card
                                        className={`info-box gradient-ibiza-sunset  order-info-box mt-10 mb-10 p-20`}
                                        border="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        <Card.Body className="info-box-block">
                                            <Card.Title className="float-start m-0">
                                                বিমুক্তি (INDEX DELETE/RELEASE)
                                            </Card.Title>

                                            <Card.Subtitle className="float-end">
                                                <FontAwesomeIcon
                                                    className=""
                                                    icon={faUserAltSlash}
                                                />
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>

                            <div
                                // key={index}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                            >
                                <Link>
                                    <Card
                                        className={`info-box bg-warning-gradient  order-info-box mt-10 mb-10 p-20`}
                                        border="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        <Card.Body className="info-box-block">
                                            <Card.Title className="float-start m-0">
                                                বদলি (TRANSFER)
                                            </Card.Title>

                                            <Card.Subtitle className="float-end">
                                                <FontAwesomeIcon
                                                    className=""
                                                    icon={faExchangeAlt}
                                                />
                                            </Card.Subtitle>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </div>
                            {/* <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link>
                            <Card
                                className={`info-box l-bg-cyan-dark  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">
                                    অ্যাট্রিশন{" "}
                                    </Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon
                                            className=""
                                            icon={faUserAltSlash}
                                        />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>
                    </div> */}
                        </div>
                    </DefaultCard>
                )}

            <Row>
                {(roles.includes(UserRole.INSTITUTE_HEAD) ||
                    roles.includes(UserRole.INSTITUTE_ADMIN)) && (
                        <Col className="col-lg-12 pr-0">
                            <DefaultCard
                                className="mb-50"
                                {...joiningOverviewCardProps}
                            >
                                <div className="row align-items-center pr-15">
                                    {JoiningOverviewBoardChart.map(
                                        (item, index) => {
                                            return (
                                                <>
                                                    <div
                                                        key={index}
                                                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                                                    >
                                                        <DashboardWidget
                                                            title={item.title}
                                                            link={item.link}
                                                            icon={item.icon}
                                                            theme={item.theme}
                                                        />
                                                    </div>
                                                </>
                                            );
                                        }
                                    )}
                                </div>
                            </DefaultCard>
                        </Col>
                    )}

                {(roles.includes(UserRole.INSTITUTE_HEAD) ||
                    roles.includes(UserRole.INSTITUTE_ADMIN)) && (
                        <>
                            <Col className="col-lg-6 pr-0">
                                <DefaultCard
                                    className="mb-50"
                                    {...mpoPaymentOverviewCardProps}
                                >
                                    <div className="row align-items-center pr-15">
                                        {MpoPaymentChart.map((item, index) => {
                                            return (
                                                <>
                                                    <div
                                                        key={index}
                                                        className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                                    >
                                                        <DashboardWidget
                                                            title={item.title}
                                                            link={item.link}
                                                            icon={item.icon}
                                                            theme={item.theme}
                                                        />
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </div>
                                </DefaultCard>
                            </Col>
                            <Col className="col-lg-6 pl-0">
                                <DefaultCard
                                    className="mb-50"
                                    {...IncomeTaxOverviewCardProps}
                                >
                                    <div className="row align-items-center pr-15">
                                        {IncomeTaxOverviewBoardChart.map(
                                            (item, index) => {
                                                return (
                                                    <>
                                                        <div
                                                            key={index}
                                                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                                        >
                                                            <DashboardWidget
                                                                title={item.title}
                                                                link={item.link}
                                                                icon={item.icon}
                                                                theme={item.theme}
                                                                count={item.count}
                                                            />
                                                        </div>
                                                    </>
                                                );
                                            }
                                        )}
                                    </div>
                                </DefaultCard>
                            </Col>
                            <Col className="col-lg-6 pl-0">
                                <DefaultCard
                                    className="mb-50"
                                    {...ReleaseOverviewCardProps}
                                >
                                    <div className="row align-items-center pr-15">
                                        {ReleaseOverviewBoardChart.map(
                                            (item, index) => {
                                                return (
                                                    <>
                                                        <div
                                                            key={index}
                                                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                                        >
                                                            <DashboardWidget
                                                                title={item.title}
                                                                link={item.link}
                                                                icon={item.icon}
                                                                theme={item.theme}
                                                            />
                                                        </div>
                                                    </>
                                                );
                                            }
                                        )}
                                    </div>
                                </DefaultCard>
                            </Col>
                            <Col className="col-lg-6 pl-0">
                                <DefaultCard
                                    className="mb-50"
                                    {...settingsOverviewCardProps}
                                >
                                    <div className="row align-items-center pr-15">
                                        {SettingsOverviewBoardChart.map(
                                            (item, index) => {
                                                return (
                                                    <>
                                                        <div
                                                            key={index}
                                                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                                        >
                                                            <DashboardWidget
                                                                title={item.title}
                                                                link={item.link}
                                                                icon={item.icon}
                                                                theme={item.theme}
                                                                count={item.count}
                                                            />
                                                        </div>
                                                    </>
                                                );
                                            }
                                        )}
                                    </div>
                                </DefaultCard>
                            </Col>
                        </>
                    )}

                {/* <Col className="col-lg-6 pr-0">
                    <DefaultCard
                        className="mb-50"
                        {...releaseOverviewCardProps}
                    >
                        <div className="row align-items-center pr-15">
                            {ReleaseOverviewBoardChart.map((item, index) => {
                                return (
                                    <>
                                        <div
                                            key={index}
                                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                        >
                                            <DashboardWidget
                                                title={item.title}
                                                link={item.link}
                                                icon={item.icon}
                                                theme={item.theme}
                                                count={item.count}
                                            />
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </DefaultCard>
                </Col> */}

                {/* <Col className="col-lg-6 pr-0">
                    <DefaultCard className="mb-50" {...aCROverviewCardProps}>
                        <div className="row align-items-center pr-15">
                            {(roles.includes(UserRole.INSTITUTE_HEAD) ||
                                roles.includes(UserRole.INSTITUTE_ADMIN)) &&
                                ACROverviewBoardChart.map((item, index) => {
                                    return (
                                        <>
                                            <div
                                                key={index}
                                                className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                            >
                                                <DashboardWidget
                                                    title={item.title}
                                                    link={item.link}
                                                    icon={item.icon}
                                                    theme={item.theme}
                                                />
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </DefaultCard>
                </Col> */}
                {/* <Col className="col-lg-6 pl-0">
                    <DefaultCard
                        className="mb-50"
                        {...correctionOverviewCardProps}
                    >
                        <div className="row align-items-center pr-15">
                            {CorrectionOverviewBoardChart.map((item, index) => {
                                return (
                                    <>
                                        <div
                                            key={index}
                                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                        >
                                            <DashboardWidget
                                                title={item.title}
                                                link={item.link}
                                                icon={item.icon}
                                                theme={item.theme}
                                                count={item.count}
                                            />
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </DefaultCard>
                </Col>
                <Col className="col-lg-6 pl-0">
                    <DefaultCard
                        className="mb-50"
                        {...transferOverviewCardProps}
                    >
                        <div className="row align-items-center pr-15">
                            {TransferOverviewBoardChart.map((item, index) => {
                                return (
                                    <>
                                        <div
                                            key={index}
                                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-0"
                                        >
                                            <DashboardWidget
                                                title={item.title}
                                                link={item.link}
                                                icon={item.icon}
                                                theme={item.theme}
                                                count={item.count}
                                            />
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </DefaultCard>
                </Col> */}
            </Row>

            {/* <DefaultCard className="mb-50" {...surveyCardProps}>
                <div className="row align-items-center pr-15">
                    {(roles.includes(UserRole.INSTITUTE_HEAD) ||
                        roles.includes(UserRole.INSTITUTE_ADMIN)) &&
                        DashBoardChart.map((item, index) => {
                            return (
                                <>
                                    <div
                                        key={index}
                                        className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                                    >
                                        <DashboardWidget
                                            title={item.title}
                                            link={item.link}
                                            icon={item.icon}
                                            theme={item.theme}
                                        />
                                    </div>
                                </>
                            );
                        })}
                </div>
            </DefaultCard> */}
        </>
    );
};

export default Dashboard;
