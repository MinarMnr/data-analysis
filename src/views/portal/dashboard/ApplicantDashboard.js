import {
    faFileAlt,
    faPauseCircle
} from "@fortawesome/free-regular-svg-icons";
import {
    faAward,
    faBuilding,
    faCertificate,
    faExchangeAlt,
    faFile,
    faGraduationCap,
    faHeadSideCough,
    faLanguage,
    faUserEdit,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import DefaultCard from "../../../components/card/default/DefaultCard";





import { } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import "./Dashboard.scss";

const Dashboard = (props) => {
    const surveyCardProps = {
        title: "পরিদর্শন",
    };
    const profileCardProps = {
        title: "প্রোফাইল",
    };
    const applicationsCardProps = {
        title: "আবেদন সমূহ",
    };
    const reportsCardProps = {
        title: "রিপোর্ট",
    };
    const otherCardProps = {
        title:"অন্যান্য"
    }
    const ApplicationsChart = [
        {
            id: 1,
            title: "যোগদান",
            link: "/",
            icon: faUserPlus,
            theme: "l-bg-blue-dark",
        },
        {
            id: 2,
            title: "বদলি",
            link: "/",
            icon: faExchangeAlt,
            theme: "l-bg-green-dark",
        },

    ];
    const DashBoardChart = [
        {
            id: 1,
            title: "Joining",
            link: "/portal/application/joining",
            icon: faPauseCircle,
            theme: "l-bg-green-dark",
        },
        {
            id: 2,
            title: "B.E.D Scale",
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
        // {
        //     id: 4,
        //     title: "স্থানান্তর",
        //     link: "/portal/general-info/add",
        //     icon: faPauseCircle,
        //     theme: "l-bg-green-dark",
        // },
        // {
        //     id: 5,
        //     title: "সংশোধন",
        //     link: "/portal/correction",
        //     icon: faPauseCircle,
        //     theme: "l-bg-purple",
        // },
        {
            id: 6,
            title: "বকেয়া ",
            link: "/portal/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-card1",
        },
        {
            id: 7,
            title: "অ্যাট্রিশন",
            link: "/portal/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-green-dark",
        },
        {
            id: 8,
            title: "মুক্তি",
            link: "/portal/release/general-info/add",
            icon: faPauseCircle,
            theme: "l-bg-purple",
        },
        {
            id: 9,
            title: "Retirement",
            link: "/portal/retirement/list",
            icon: faPauseCircle,
            theme: "l-bg-card1",
        },
    ];

    return (
        <>
        <DefaultCard className="mb-50" {...profileCardProps}>
                <div className="row align-items-center pr-15 ">
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box l-bg-green-dark  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0"> সাধারণ তথ্য</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faFileAlt} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box l-bg-orange-dark  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">কাজের তথ্য</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faFile} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-mint  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">শিক্ষাগত যোগ্যতা</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={ faGraduationCap} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                   
                    <div
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box bg-warning-gradient  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">অবসর,কল্যাণ সুবিধাদি বিস্তারিত</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faCertificate} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-purple-love  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">প্রশিক্ষণ</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={ faHeadSideCough} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-ibiza-sunset  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">প্রকাশনা</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faUserEdit} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box l-bg-yellow  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">পদক/সম্মাননা</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={ faAward} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box l-bg-blue-dark  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">ভাষা জ্ঞান</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={ faLanguage} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        // key={index}
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box l-bg-purple  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">ব্যাংক হিসাব</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faBuilding} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                </div>
            </DefaultCard>
            {/* <DefaultCard className="mb-10" {...applicationsCardProps}>
                <div className="row align-items-center pr-15 ">
                <div
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link to={"/portal/application/joining"}>
                            <Card
                                className={`info-box bg-success-gradient  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">যোগদান (JOINING)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faUserPlus} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>

                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link to={"/portal/application/mpo/approval"}>
                            <Card
                                className={`info-box bg-success-gradient  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">এমপিও (M.P.O)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faUserPlus} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                   
                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-mint  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">বি.এ.ড স্কেল (B.ED SCALE)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faFile } />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                       
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-king-yna  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">উচ্চতর গ্রেড (UPPER GRADE)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faLaptopCode} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box l-bg-cyan-dark  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">সংশোধন (CORRECTION)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faUserCheck} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box bg-danger-gradient  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">বকেয়া (ARREAR)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faUserMinus} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-ibiza-sunset  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">বিমুক্তি (INDEX DELETE/RELEASE)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faUserAltSlash} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-ibiza-sunset  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">বদলি (TRANSFER)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faExchangeAlt} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>
                </div>
            </DefaultCard> */}
            
            {/* <DefaultCard className="mb-10" {...reportsCardProps}>
                <div className="row align-items-center pr-15 ">
                    <div
                       
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-purple-love  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0"> পিডিএস</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faFileDownload} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>

                </div>
            </DefaultCard> */}

            {/* <DefaultCard className="mb-10" {...otherCardProps}>
                <div className="row align-items-center pr-15 ">
                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-purple-love  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">নিজ অবসর সুবিধা</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faFileDownload} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>

                    <div
                        
                        className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 pr-0"
                    >
                        <Link >
                            <Card
                                className={`info-box gradient-purple-love  order-info-box mt-10 mb-10 p-20`}
                                border="secondary"
                                style={{ width: "100%" }}
                            >
                                <Card.Body className="info-box-block">
                                    <Card.Title className="float-start m-0">এডভান্সড আয়কর (INCOME TAX)</Card.Title>

                                    <Card.Subtitle className="float-end">
                                        <FontAwesomeIcon className="" icon={faFileDownload} />
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Link>

                    </div>

                </div>
            </DefaultCard> */}
        </>
    );
};

export default Dashboard;
