import { faBars, faSignOutAlt, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Container,
  Dropdown,
  Image,
  ListGroup,
  Nav,
  Navbar,
  Row,
} from "@themesberg/react-bootstrap";
import { UrlBuilder } from "helpers/UrlBuilder";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactHero from "../../@core/assets/img/technologies/bangladesh-govt-logo-A2C7688845-seeklogo.com.png";
import Environment from "../../components/environments/environment";
import { AuthUser } from "../../helpers/AuthUser";
//import NotificationData from "../../helpers/NotificationData";
import ProgressBar from "react-topbar-progress-indicator";
import { callApi, clearState, selectApi } from "../../reducers/apiSlice";
import "./Navbar.scss";

export default (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  //file url make
  const getFile = (imgs) => {
    return Environment.fileBaseUrl + imgs;
  };

  let { onToggleFun, toggle } = props;

  const [check, setCheck] = useState(false);
  const [moduleId, setModuleID] = useState(localStorage.getItem("moduleId"));
  const [moduleName, setModuleName] = useState(
    localStorage.getItem("moduleName")
  );
  const [module, setModule] = useState(false);

  const onToggleFun2 = () => {
    onToggleFun();
  };

  const [isOpen, setIsOpen] = useState(false);
  const onToggle = (nextShow, event, metadata) => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!check && toggle) {
      onToggleFun2();
      setCheck(true);
    }
    if (check && !toggle) {
      onToggleFun2();
      setCheck(false);
    }
  }, [check, toggle]);

  const {
    loading,
    notifyData = { data: {} },
    // moduleList = {data:{}},
    notificationUpdate,
  } = useSelector(selectApi);

  // useEffect(() => {
  //   if (AuthUser?.isLoggedIn()) {
  //     dispatch(
  //       callApi({
  //         operationId: UrlBuilder.notificationClientApi(
  //           `notification-event/notifications/${AuthUser?.getUserId()}?size=5&appModuleId=${localStorage.getItem(
  //             "moduleId"
  //           )}`
  //         ),
  //         output: "notifyData",
  //         storeName: "notifyData",
  //       })
  //     );

  //     dispatch(
  //       callApi({
  //         operationId: UrlBuilder.report(
  //           `app-module/list`
  //         ),
  //         output: "moduleList",
  //         storeName: "moduleList",
  //       })
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   dispatch(
  //     callApi({
  //       operationId: UrlBuilder.report(
  //         `menu-group/list?appModuleId=${moduleId}`
  //       ),
  //       output: "menuList",
  //     })
  //   );
  //   // history.push("/portal/dashboard");
  // }, [moduleId]);

  var notifications = notifyData?.data;

  let notificationCount = notifyData?.meta?.unreadNotifications;
  if (notificationUpdate && notificationUpdate.status == "success") {
    notificationCount =
      notificationUpdate && notificationUpdate?.meta?.unreadNotifications;

    // AuthUser
  }

  // const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  // const areNotificationsRead = notifications.reduce(
  //   (acc, notification) => acc && notification.read,
  //   true
  // );

  const moduleList = AuthUser.getUserAccess();

  const Notification = (props) => {
    const {
      link,
      sender,
      image,
      createdAt,
      notificationEventMessage,
      read = false,
      actionName,
    } = props;

    // console.log("notificationEventMessage", notificationEventMessage);
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          {/* <Col className="col-auto">
            <Image
              src={image}
              className="user-avatar lg-avatar rounded-circle"
            />
          </Col> */}
          <Col className="ps-0 ms--2">
            <div className="d-flex flex-column justify-content-between align-items-start ml-20">
              <div>
                <h4 className="h6 mb-0 text-small">
                  {actionName.replace(/_/g, " ")}
                </h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{createdAt}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0 ml-20">
              {notificationEventMessage}
            </p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  const logoutUser = () => {
    AuthUser.removeLoginData();

    dispatch(
      clearState({
        output: "authData",
      })
    );

    history.push("/login");
  };

  let roles = AuthUser.getRoles();
  roles = roles.filter((item) => item != "default-roles-banbeis");
  return (
    <Navbar variant="dark" expanded className="p-5 pr-30 bg-white">
      {loading && <ProgressBar />}
      <Container fluid className="px-0">
        <div className="toogleBtn ml-15" id="amarMoto">
          <FontAwesomeIcon
            className="toggleSvg"
            icon={faBars}
            onClick={onToggleFun2}
          />
        </div>
        <div className="d-flex justify-content-between w-100">
          <div
            className=" align-items-center d-none d-lg-block"
            style={{
              display: "block",
              width: "100%",
            }}
          >
            <div
              className="media-body ms-2 text-dark align-items-center "
              style={{
                textAlign: "center",
              }}
            >
              <span
                className="mb-0 font-bold fw-bold"
                style={{
                  float: "left",
                  position: "relative",
                  top: "5px",
                }}
              >
                {
                  // str.toLocaleUpperCase()
                  AuthUser.getUserInstitute()?.instituteName
                }
              </span>
              {roles[roles.length - 1] == "admin" && (
                <span
                  style={{
                    // marginLeft: "40rem",
                    color: "green",
                    fontSize: "30px",
                    textAlign: "center",
                    left: "35%",
                    position: "absolute",
                  }}
                  className="mb-0 fw-bold"
                >
                  {/* {camelCaseToTitle(roles[roles.length - 1])?.toUpperCase()} */}
                </span>
              )}
              {roles[roles.length - 1] != "admin" && (
                <span
                  style={{
                    // marginLeft: `${instituteMargin}`,
                    color: "green",
                    fontSize: "30px",
                    textAlign: "center",
                    left: "35%",
                    position: "absolute",
                  }}
                  className="mb-0 fw-bold"
                >
                  {/* {camelCaseToTitle(roles[roles.length - 1])?.toUpperCase()} */}
                </span>
              )}
            </div>
          </div>
          {/* <div className="mr-10">
          <FontAwesomeIcon
            className="toggleSvg"
            icon={faList}
            onClick={(()=> {
              setModule(!module)
            })}
          />

          </div>
          {module == true && (
            <div className="col-md-2">
            <select
              type="select"
              name="moduleId"
              className="form-control form-select"
              defaultValue={28}
              onChange={(e) => {
                setModuleID(e.target.value);
              }}
            >
              <option value={0}>Select Module</option>
              {moduleList?.data &&
                moduleList?.data.length > 0 &&
                moduleList?.data.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item?.appModuleId}
                      //selected={menuId == item?.reportMenuGroupId?true:false}
                    >
                      {item.appModuleName}
                    </option>
                  );
                })}
            </select>
          
        </div>

          )} */}

          <div className="col-md-6">
            <strong style={{ color: "green", fontSize: "30px" }}>
              <a
                onClick={() => {
                  history.push("/portal/dashboard");
                }}
              >
                {" "}
                {moduleName}
              </a>
            </strong>
          </div>

          <Nav className="align-items-center">
            {/* onToggle={markNotificationsAsRead} */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Nav.Link}
                className="text-dark icon-notifications me-lg-3"
              >
                {/* <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faBell} className="bell-shake" />
                  {notificationCount > 0 && (
                    <span className="position-absolute top-1 ml-0 start-100 translate-middle badge rounded-pill bg-danger fs-6">
                      {notificationCount}
                    </span>
                  )}
                 
                </span> */}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown tuntuni notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup
                  className="list-group-flush "
                  style={{
                    maxHeight: "100 !important",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <Nav.Link
                    href="#"
                    className="text-center text-primary fw-bold border-bottom border-light py-3"
                  >
                    Notifications
                  </Nav.Link>

                  {/* {notifications.map((n) => (
                    <Notification key={`notification-${n.id}`} {...n} />
                  ))} */}

                  {notifications &&
                    notifications.length > 0 &&
                    notifications.map((n) => (
                      <Notification key={`notification-${n.id}`} {...n} />
                    ))}

                  {/* <Dropdown.Item className="text-center text-primary fw-bold py-3">
                    View all
                  </Dropdown.Item> */}
                </ListGroup>
                <div
                  className="text-center text-primary fw-bold py-3 nav-bar_fontsize"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history.push("/portal/notification/list");
                  }}
                >
                  View all
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item} onToggle={onToggle} show={isOpen}>
              <Dropdown.Toggle
                as={Nav.Link}
                className="text-dark icon-notifications me-lg-3"
              >
                <span className="icon icon-sm">
                  <FontAwesomeIcon icon={faTh} className="bell-shake" />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="user-dropdown dropdown-menu-right mt-2 p-25"
                style={{ width: "300px" }}
              >
                <div className="row ">
                  {moduleList &&
                    moduleList?.length > 0 &&
                    moduleList?.map((item, index) => {
                      return (
                        <div key={item + index} className="col-4">
                          <a
                            className="dropdown-icon-item-uper"
                            onClick={(e) => {
                              setModuleID(item.appModuleId);
                              localStorage.setItem(
                                "moduleId",
                                item.appModuleId
                              );
                              localStorage.setItem(
                                "moduleName",
                                item.appModuleName
                              );
                              localStorage.setItem(
                                "moduleRole",
                                item.appModuleRole
                              );
                              setModuleName(item.appModuleName);
                              history.push("/portal/dashboard");
                              setIsOpen(!isOpen);
                            }}
                          >
                            <img
                              src="/images/bangladesh-govt-logo-A2C7688845-seeklogo.com.ee66d627.png"
                              alt="EIIN"
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  item.appModuleId == moduleId
                                    ? "cadetblue"
                                    : "",
                              }}
                              value={item.appModuleId}
                              title={item.appModuleName}
                            />

                            <span
                              style={{
                                color:
                                  item.appModuleId == moduleId ? "green" : "",
                              }}
                              title={item.appModuleName}
                            >
                              {item.appModuleName}
                            </span>
                          </a>
                        </div>
                      );
                    })}

                  {/* <div className="col-4">
                    <a className="dropdown-icon-item-uper" href="#">
                      <img
                        src="/images/3.png"
                        alt="EIIN"
                      />

                      <span>GIS</span>
                    </a>
                  </div>
                  */}
                </div>
                <Dropdown.Divider />
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image
                    src={
                      AuthUser.getUser()?.profileImage
                        ? getFile(AuthUser.getUser().profileImage)
                        : ReactHero
                    }
                    className="user-avatar md-avatar rounded-circle"
                  />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">
                      {AuthUser.getUserFullName()}
                    </span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                {/* <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" /> Role
                  : {AuthUser.getRoles()[AuthUser.getRoles().length - 1]}
                </Dropdown.Item> */}
                <Dropdown.Divider />
                <Dropdown.Item className="fw-bold" onClick={() => logoutUser()}>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-danger me-2"
                  />{" "}
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
      {/* <NotificationData /> */}
    </Navbar>
  );
};
