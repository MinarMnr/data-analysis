import {
  faListOl,
  faPencilAlt,
  faPlus,
  faSearch,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  Badge,
  Button,
  Col,
  Image,
  Modal,
  Nav,
  Navbar,
  Row,
} from "@themesberg/react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import SimpleBar from "simplebar-react";
import { NaiveOption } from "../../navs";
// import ReactHero from "../../@core/assets/img/technologies/react-hero-logo.svg";
import { faReadme } from "@fortawesome/free-brands-svg-icons";
import UserRole from "constants/UserRole";
import { UrlBuilder } from "helpers/UrlBuilder";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import ReactHero from "../../@core/assets/img/technologies/bangladesh-govt-logo-A2C7688845-seeklogo.com.png";
import DefaultModal from "../../components/modal/default/DefaultModal";
import { AuthUser } from "../../helpers/AuthUser";
import { callApi, clearState, selectApi } from "../../reducers/apiSlice";
import ReorderMenuModal from "./ReorderMenuModal";
import "./sidebar.css";

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportEdit, setReportEdit] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState();
  const showClass = show ? "show" : "";
  const onCollapse = () => setShow(!show);
  const menuListId = useRef();
  const [reportListId, setReportListId] = useState(0);
  const groupListId = useRef();
  const menuGroupTitle = useRef();
  const [menuId, setMenuId] = useState("");
  const [reportId, setReportId] = useState(null);
  const [parentPath, setParentPath] = useState("");
  const [routePath, setRoutePath] = useState("");
  const [status, setStatus] = useState(true);
  const [reportMenuId, setReportMenuId] = useState(0);
  const [reportGroupId, setReportGroupId] = useState(0);
  const [type, setType] = useState(0);
  const [editMenuGroupTitle, setEditMenuGroupTitle] = useState("");
  const [editGroupId, setEditGroupId] = useState(0);
  const [editGroupParentId, setEditGroupParentId] = useState(0);
  const [isRoot, setIsRoot] = useState(false);
  const [menuModal, setMenuModal] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const closeModal = () => {
    setMenuModal(false);
  };

  const {
    menuList = {
      data: {},
    },
    groupList = {
      data: {},
    },
    reportList = { data: {} },
    reportTitleSave,
    reportMenuEdit,
    menuGroupUpdate,
    moduleWiseReport,
    deleteGroup,
  } = useSelector(selectApi);

  useEffect(() => {
    if (menuId > 0) {
      dispatch(
        callApi({
          operationId: UrlBuilder.report(`menu-group/children/${menuId}`),
          output: "groupList",
        })
      );
    }
  }, [menuId]);

  useEffect(() => {
    dispatch(
      callApi({
        operationId: UrlBuilder.report(`report/list`),
        output: "reportList",
      })
    );
  }, [reportEdit]);

  useEffect(() => {
    if (deleteGroup?.status == "success") {
      dispatch(
        clearState({
          output: "menuList",
        })
      );
      dispatch(
        callApi({
          operationId: UrlBuilder.report(
            `menu-group/list?appModuleId=${localStorage.getItem("moduleId")}`
          ),
          output: "menuList",
        })
      );
    }
  }, [deleteGroup]);

  useEffect(() => {
    if (
      reportMenuEdit?.status == "success" ||
      menuGroupUpdate?.status == "success" ||
      reportTitleSave?.status == "success"
    ) {
      setMenuId("");
      let storageModuleId = localStorage.getItem("moduleId");
      dispatch(
        clearState({
          output: "menuList",
        })
      );

      dispatch(
        callApi({
          operationId: UrlBuilder.report(
            `menu-group/list?appModuleId=${storageModuleId}`
          ),
          output: "menuList",
        })
      );

      dispatch(
        clearState({
          output: "reportMenuEdit",
        })
      );
      dispatch(
        clearState({
          output: "menuGroupUpdate",
        })
      );
      dispatch(
        clearState({
          output: "reportTitleSave",
        })
      );
    }
  }, [
    reportMenuEdit,
    menuGroupUpdate,
    reportTitleSave,
    localStorage.getItem("moduleId"),
  ]);

  // useEffect(() => {
  //   dispatch(
  //     callApi({
  //       operationId: UrlBuilder.report(
  //         `report/list-by-module?appModuleId=${localStorage.getItem(
  //           "moduleId"
  //         )}`
  //       ),
  //       output: "moduleWiseReport",
  //     })
  //   );
  // }, [localStorage.getItem("moduleId")]);

  useEffect(() => {
    setFilterList([]);
    setSearchValue("");
    dispatch(
      clearState({
        output: "moduleWiseReport",
      })
    );

    dispatch(
      callApi({
        operationId: UrlBuilder.report(
          `report/list-by-module?appModuleId=${localStorage.getItem(
            "moduleId"
          )}`
        ),
        output: "moduleWiseReport",
      })
    );
  }, [localStorage.getItem("moduleId")]);

  const findReport = (searchData) => {
    let reportList = moduleWiseReport?.data;
    let re = new RegExp(searchData.toLowerCase(), "g");
    let searchList = reportList?.filter((item) =>
      item?.reportTitle.toLowerCase().match(re)
    );
    setFilterList(searchList);
  };

  const [rootPath, setRootPath] = useState();
  const [root, setRoot] = useState();
  let eventPath = [];
  let newPath = [];

  const CollapsableNavItem = ({
    eventKey,
    title,
    icon,
    data,
    children = null,
    dataChildren,
  }) => {
    //const {eventKey, title, icon, data, children = null, parentEventKey, dataChildren  } = props;

    let defaultKey = "";
    //let eventKey = "";
    const isCurrentPath = eventKey === parentPath;
    var activeNav = false;
    var currentRoute = false;
    var rootCheck = false;
    eventPath.push(eventKey);

    eventPath?.length > 0 &&
      eventPath.map((item) => {
        if (item == parentPath) {
          activeNav = true;
          defaultKey = eventKey;
        }
      });

    dataChildren &&
      dataChildren?.length > 0 &&
      dataChildren?.map((item) => {
        item?.aChild?.length > 0 &&
          item?.aChild.map((itm) => {
            if (itm.path == pathname) {
              currentRoute = true;
            }
          });
      });
    if (currentRoute == false) {
      {
        data?.length > 0 &&
          data.map((itm) => {
            if (itm.path == pathname) {
              currentRoute = true;
            }
          });
      }
    }

    rootPath &&
      rootPath?.length > 0 &&
      rootPath?.map((item) => {
        if (eventKey === item) {
          setRoot(eventKey);
          rootCheck = true;
        }
      });

    return (
      <>
        <Accordion
          as={Nav.Item}
          defaultActiveKey={!currentRoute ? pathname : defaultKey}
        >
          <Accordion.Item eventKey={eventKey == parentPath ? eventKey : ""}>
            <Accordion.Button
              as={Nav.Link}
              className={`d-flex justify-content-between align-items-center sidemenuicon`}
            >
              <span>
                <span className="sidebar-icon">
                  <FontAwesomeIcon icon={icon} />{" "}
                </span>
                <span className="sidebar-text" title={title}>
                  {title}
                </span>
              </span>
            </Accordion.Button>
            {dataChildren && (
              <Accordion.Body className="multi-level">
                <Nav className="flex-column">{children}</Nav>
              </Accordion.Body>
            )}
          </Accordion.Item>
        </Accordion>
      </>
    );
  };

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon,
      className,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
      style,
      data,
      parentPath,
    } = props;

    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : `${className}`;
    const navItemClassName = link == pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item
        className={navItemClassName}
        onClick={() => {
          setParentPath(parentPath);
          setShow(true);
        }}
      >
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text" title={title}>
              {title}
            </span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  let navs = [];
  //AuthUser.isExpired() >= 0 &&
  if (AuthUser?.isLoggedIn()) {
    navs = NaiveOption.adminUser();
    // let roles = AuthUser.getRoles();
    // if (roles.includes(UserRole.ADMIN)) {
    //   navs = NaiveOption.adminUser();
    // }
  } else {
    AuthUser.removeLoginData();

    dispatch(
      clearState({
        output: "authData",
      })
    );

    history.push("/login");
  }

  const childNav = (child) => {
    return (
      <>
        {child?.children?.length > 0
          ? child?.children?.map((item, index) => {
              if (item.children && item.children?.length > 0) {
                return (
                  <>
                    {localStorage.getItem("moduleRole") != UserRole.VIEWER &&
                      localStorage.getItem("moduleId") != 32 && (
                        <div className="d-flex">
                          <div className="mxx-auto">
                            <span className="btn-success btn-icon">
                              <FontAwesomeIcon
                                icon={faPlus}
                                title="New Report"
                                className="text-red"
                                onClick={() => {
                                  setData(item?.data);
                                  history.push(
                                    `/portal/report/newReport/${item?.data?.reportMenuGroupId}`
                                  );
                                }}
                              />
                            </span>

                            <span className="btn-info btn-icon">
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                title="Edit Group"
                                // style={{ color: "red" }}
                                onClick={() => {
                                  modalCheck(item?.data);
                                }}
                              />
                            </span>
                            {localStorage.getItem("moduleRole") ==
                              UserRole.ADMIN && (
                              <span className="btn-danger btn-icon">
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  title="Delete Group"
                                  onClick={() => {
                                    swal({
                                      title: "Are you sure you want to delete?",
                                      icon: "warning",
                                      buttons: true,
                                      dangerMode: true,
                                    }).then((willDelete) => {
                                      if (willDelete == true) {
                                        dispatch(
                                          callApi({
                                            operationId: UrlBuilder.report(
                                              `menu-group/delete/${item?.data?.reportMenuGroupId}`
                                            ),
                                            output: "deleteGroup",
                                            parameters: {
                                              method: "DELETE",
                                              header: {
                                                "Content-Type":
                                                  "application/json",
                                              },
                                            },
                                          })
                                        );
                                      }
                                    });
                                  }}
                                />
                              </span>
                            )}
                          </div>
                          <CollapsableNavItem
                            key={index + 1}
                            eventKey={item.path}
                            title={item.title}
                            icon={item.icon}
                            data={item?.aChild}
                            dataChildren={item?.children}
                          >
                            {item.aChild &&
                              Array.isArray(item.aChild) &&
                              item.aChild.map((aItem, aIndex) => {
                                return (
                                  <NavItem
                                    key={aIndex}
                                    title={aItem.title}
                                    link={aItem.path}
                                    icon={faReadme}
                                    className={aItem?.className}
                                    parentPath={item.path}
                                    data={item.data}
                                  />
                                );
                              })}
                            {childNav(item)}
                          </CollapsableNavItem>
                        </div>
                      )}
                  </>
                );
              } else {
                return (
                  <>
                    {localStorage.getItem("moduleRole") != UserRole.VIEWER &&
                      localStorage.getItem("moduleId") != 32 && (
                        <div className="d-flex">
                          <div className="mxx-auto">
                            <span className="btn-success btn-icon">
                              <FontAwesomeIcon
                                icon={faPlus}
                                title="New Report"
                                className="text-red"
                                onClick={() => {
                                  setData(item?.data);
                                  history.push(
                                    `/portal/report/newReport/${item?.data?.reportMenuGroupId}`
                                  );
                                }}
                              />
                            </span>

                            <span className="btn-info btn-icon">
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                title="Edit Group"
                                // style={{ color: "red" }}
                                onClick={() => {
                                  modalCheck(item?.data);
                                }}
                              />
                            </span>
                            {localStorage.getItem("moduleRole") ==
                              UserRole.ADMIN && (
                              <span className="btn-danger btn-icon">
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  title="Delete Group"
                                  onClick={() => {
                                    swal({
                                      title: "Are you sure you want to delete?",
                                      icon: "warning",
                                      buttons: true,
                                      dangerMode: true,
                                    }).then((willDelete) => {
                                      console.log(willDelete, "delete");
                                      if (willDelete == true) {
                                        dispatch(
                                          callApi({
                                            operationId: UrlBuilder.report(
                                              `menu-group/delete/${item?.data?.reportMenuGroupId}`
                                            ),
                                            output: "deleteGroup",
                                            parameters: {
                                              method: "DELETE",
                                              header: {
                                                "Content-Type":
                                                  "application/json",
                                              },
                                            },
                                          })
                                        );
                                      }
                                    });
                                  }}
                                />
                              </span>
                            )}
                          </div>

                          <CollapsableNavItem
                            key={index + 1}
                            eventKey={item.path}
                            title={item.title}
                            icon={item.icon}
                            data={item?.aChild}
                            dataChildren={item?.children}
                          >
                            <div>
                              {item.aChild &&
                                Array.isArray(item.aChild) &&
                                item.aChild.map((aItem, aIndex) => {
                                  return (
                                    <NavItem
                                      key={aIndex}
                                      title={aItem.title}
                                      link={aItem.path}
                                      icon={faReadme}
                                      className={aItem?.className}
                                      parentPath={item.path}
                                      data={item.data}
                                    />
                                  );
                                })}
                            </div>
                          </CollapsableNavItem>
                        </div>
                      )}
                  </>
                );
              }
            })
          : child.aChild &&
            Array.isArray(child.aChild) &&
            child.aChild.map((aItem, aIndex) => {
              return (
                <NavItem
                  key={aIndex}
                  title={aItem.title}
                  link={aItem.path}
                  icon={faReadme}
                  className={aItem?.className}
                  parentPath={child.path}
                  data={child.data}
                />
              );
            })}
      </>
    );
  };

  const modalCheck = (data) => {
    groupListId.current = 0;
    menuListId.current = 0;
    setData(data);
    setMenuId(data?.rootParentMenuGroupId);
    setReportId(data?.reportMenuGroupId);
    setEditMenuGroupTitle(data?.reportMenuGroupTitle);
    setEditGroupId(data?.parentReportMenuGroupId);
    setEditGroupParentId(data?.parentReportMenuGroupId);
    setModal(true);
  };

  // useEffect(() => {
  //   const CheckList = ({ data, targetPath, parentPath = [] }) => {
  //     console.log(data, "checkk");
  //     for (const item of data) {
  //       const currentPath = [...parentPath, item.path];

  //       if (item.path === targetPath) {
  //         // Found the target path, log or return the parent path
  //         console.log("Parent Path:", parentPath);
  //         setRootPath(parentPath);
  //         // You can return or do something with the parent path here
  //         return;
  //       }

  //       if (item.children && item.children.length > 0) {
  //         // Recursively check children
  //         CheckList({
  //           data: item.children,
  //           targetPath,
  //           parentPath: currentPath,
  //         });
  //       }
  //     }
  //   };

  //   let findPath = CheckList({
  //     data: navs && navs?.length > 0 ? navs : [],
  //     targetPath: parentPath,
  //   });

  //   console.log(findPath, "find");
  // }, [parentPath]);

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand className="me-lg-5" as={Link} to="/">
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-white text-white`}
        >
          <div className="sidebar-inner px-3 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center"></div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0 side-Logo-link">
              <Link to="/">
                <div
                  id="banbeis_home"
                  className="d-flex justify-content-center text-primary align-items-center p-5"
                >
                  <Image src={ReactHero} width={22} height={22} />
                  <span className=" text-uppercase fw-bold">Banbeis</span>
                </div>
              </Link>

              <div className="search-report-top">
                <input
                  type="text"
                  placeholder="search report"
                  className="f-right btn-add placeholders"
                  value={searchValue}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setFilterList([]);
                      setSearchValue("");
                    } else {
                      setSearchValue(e.target.value);
                      findReport(e.target.value);
                    }
                  }}
                />
                <Button
                  variant="danger"
                  className="btn btn-danger p-5 f-right mr-5 rounded-pill ms-1"
                  type="button"
                  onClick={() => {
                    setFilterList([]);
                    setSearchValue("");
                  }}
                >
                  <FontAwesomeIcon icon={faSearch} className="me-0" />

                  <span>Reset</span>
                </Button>
              </div>

              <div className="searchList">
                {filterList &&
                  filterList?.length > 0 &&
                  filterList?.map((item, index) => {
                    return (
                      <>
                        <div>
                          <NavItem
                            key={index}
                            title={item?.reportTitle}
                            link={`/portal/report/updateReport/${item.reportId}`}
                          />
                        </div>
                      </>
                    );
                  })}
              </div>

              {navs &&
                navs?.length > 0 &&
                navs.map((nav, navIndex) => {
                  if (nav.children !== undefined && nav.children.length > 0) {
                    return (
                      <CollapsableNavItem
                        key={navIndex + 1}
                        eventKey={nav.path}
                        title={nav.title}
                        icon={nav.icon}
                        data={nav?.aChild}
                        dataChildren={nav?.children}
                      >
                        {localStorage.getItem("moduleRole") !=
                          UserRole.VIEWER &&
                          localStorage.getItem("moduleId") != 32 && (
                            <div className="icon-new mxx-auto">
                              <span className="btn-success btn-icon">
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  className="text-red"
                                  title="New Report"
                                  onClick={() => {
                                    setData(nav?.data);
                                    history.push(
                                      `/portal/report/newReport/${nav?.data?.reportMenuGroupId}`
                                    );
                                  }}
                                />
                              </span>
                              <span className="btn-info btn-icon">
                                <FontAwesomeIcon
                                  icon={faPencilAlt}
                                  title="Edit Group"
                                  onClick={() => {
                                    modalCheck(nav?.data);
                                  }}
                                />
                              </span>
                              {localStorage.getItem("moduleRole") ==
                                UserRole.ADMIN && (
                                <span className="btn-danger btn-icon">
                                  <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    title="Delete Group"
                                    onClick={() => {
                                      swal({
                                        title:
                                          "Are you sure you want to delete?",
                                        icon: "warning",
                                        buttons: true,
                                        dangerMode: true,
                                      }).then((willDelete) => {
                                        if (willDelete == true) {
                                          dispatch(
                                            callApi({
                                              operationId: UrlBuilder.report(
                                                `menu-group/delete/${nav?.data?.reportMenuGroupId}`
                                              ),
                                              output: "deleteGroup",
                                              parameters: {
                                                method: "DELETE",
                                                header: {
                                                  "Content-Type":
                                                    "application/json",
                                                },
                                              },
                                            })
                                          );
                                        }
                                      });
                                    }}
                                  />
                                </span>
                              )}
                            </div>
                          )}
                        {nav.aChild &&
                          Array.isArray(nav.aChild) &&
                          nav.aChild.map((aItem, aIndex) => {
                            return (
                              <NavItem
                                key={aIndex}
                                title={aItem.title}
                                link={aItem.path}
                                icon={faReadme}
                                className={aItem?.className}
                                parentPath={nav.path}
                                data={nav.data}
                              />
                            );
                          })}

                        {nav.children.map((navChild, navChildIndex) => {
                          if (
                            navChild.children &&
                            Array.isArray(navChild.children)
                          ) {
                            return (
                              <CollapsableNavItem
                                key={navChild + 1}
                                eventKey={navChild.path}
                                title={navChild.title}
                                icon={navChild.icon}
                                data={navChild?.aChild}
                                dataChildren={navChild?.children}
                              >
                                {localStorage.getItem("moduleRole") !=
                                  UserRole.VIEWER &&
                                  localStorage.getItem("moduleId") != 32 && (
                                    <div className="icon-new mxx-auto">
                                      <span className="btn-success btn-icon">
                                        <FontAwesomeIcon
                                          icon={faPlus}
                                          className="text-red"
                                          title="New Report"
                                          onClick={() => {
                                            setData(navChild?.data);
                                            history.push(
                                              `/portal/report/newReport/${navChild?.data?.reportMenuGroupId}`
                                            );
                                          }}
                                        />
                                      </span>

                                      <span className="btn-info btn-icon">
                                        <FontAwesomeIcon
                                          icon={faPencilAlt}
                                          title="Edit Group"
                                          onClick={() => {
                                            modalCheck(navChild?.data);
                                          }}
                                        />
                                      </span>
                                      {localStorage.getItem("moduleRole") ==
                                        UserRole.ADMIN && (
                                        <span className="btn-danger btn-icon">
                                          <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            title="Delete Group"
                                            onClick={() => {
                                              swal({
                                                title:
                                                  "Are you sure you want to delete?",
                                                icon: "warning",
                                                buttons: true,
                                                dangerMode: true,
                                              }).then((willDelete) => {
                                                if (willDelete == true) {
                                                  dispatch(
                                                    callApi({
                                                      operationId:
                                                        UrlBuilder.report(
                                                          `menu-group/delete/${navChild?.data?.reportMenuGroupId}`
                                                        ),
                                                      output: "deleteGroup",
                                                      parameters: {
                                                        method: "DELETE",
                                                        header: {
                                                          "Content-Type":
                                                            "application/json",
                                                        },
                                                      },
                                                    })
                                                  );
                                                }
                                              });
                                            }}
                                          />
                                        </span>
                                      )}
                                    </div>
                                  )}

                                {navChild.aChild &&
                                  Array.isArray(navChild.aChild) &&
                                  navChild.aChild.map((aItem, aIndex) => {
                                    return (
                                      <NavItem
                                        key={aIndex}
                                        title={aItem.title}
                                        link={aItem.path}
                                        icon={faReadme}
                                        className={aItem?.className}
                                        parentPath={navChild.path}
                                        data={navChild.data}
                                      />
                                    );
                                  })}

                                {navChild.children?.length > 0 &&
                                  childNav(navChild)}
                              </CollapsableNavItem>
                            );
                          } else {
                            return (
                              <>
                                <NavItem
                                  key={navChildIndex}
                                  title={navChild.title}
                                  link={navChild.path}
                                  icon={navChild.icon}
                                  className={navChild?.className}
                                  parentPath={navChild.path}
                                />
                                {navChild.aChild &&
                                  Array.isArray(navChild.aChild) &&
                                  navChild.aChild.map((aItem, aIndex) => {
                                    return (
                                      <NavItem
                                        key={aIndex}
                                        title={aItem.title}
                                        link={aItem.path}
                                        icon={faReadme}
                                        className={aItem?.className}
                                        parentPath={navChild.path}
                                        data={navChild.data}
                                      />
                                    );
                                  })}
                              </>
                            );
                          }
                        })}
                      </CollapsableNavItem>
                    );
                  } else {
                    return (
                      <>
                        <CollapsableNavItem
                          key={navIndex}
                          eventKey={nav.path}
                          title={nav.title}
                          icon={nav.icon}
                          data={nav?.aChild}
                          dataChildren={nav?.children}
                        >
                          {localStorage.getItem("moduleRole") !=
                            UserRole.VIEWER &&
                            localStorage.getItem("moduleId") != 32 && (
                              <div className="icon-new mxx-auto">
                                <span className="btn-success btn-icon">
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    className="text-red"
                                    title="New Report"
                                    onClick={() => {
                                      setData(nav?.data);
                                      history.push(
                                        `/portal/report/newReport/${nav?.data?.reportMenuGroupId}`
                                      );
                                    }}
                                  />
                                </span>
                                <span className="btn-info btn-icon">
                                  <FontAwesomeIcon
                                    icon={faPencilAlt}
                                    title="Edit Group"
                                    // style={{ color: "red" }}
                                    onClick={() => {
                                      modalCheck(nav?.data);
                                    }}
                                  />
                                </span>
                                {localStorage.getItem("moduleRole") ==
                                  UserRole.ADMIN && (
                                  <span className="btn-danger btn-icon">
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      title="Delete Group"
                                      onClick={() => {
                                        swal({
                                          title:
                                            "Are you sure you want to delete?",
                                          icon: "warning",
                                          buttons: true,
                                          dangerMode: true,
                                        }).then((willDelete) => {
                                          if (willDelete == true) {
                                            dispatch(
                                              callApi({
                                                operationId: UrlBuilder.report(
                                                  `menu-group/delete/${nav?.data?.reportMenuGroupId}`
                                                ),
                                                output: "deleteGroup",
                                                parameters: {
                                                  method: "DELETE",
                                                  header: {
                                                    "Content-Type":
                                                      "application/json",
                                                  },
                                                },
                                              })
                                            );
                                          }
                                        });
                                      }}
                                    />
                                  </span>
                                )}
                              </div>
                            )}
                          {nav.aChild &&
                            Array.isArray(nav.aChild) &&
                            nav.aChild.map((aItem, aIndex) => {
                              return (
                                <NavItem
                                  key={aIndex}
                                  title={aItem.title}
                                  link={aItem.path}
                                  icon={faReadme}
                                  className={aItem?.className}
                                  parentPath={nav.path}
                                  data={nav.data}
                                />
                              );
                            })}
                        </CollapsableNavItem>

                        {/* <Accordion as={Nav.Item}>
                        
                          <NavItem
                            key={navIndex}
                            title={nav.title}
                            icon={nav.icon}
                            link={nav.path}
                            className={`${nav.className}`}
                            parentPath={nav.path}
                          >
                           
                            </NavItem>
                        </Accordion> */}
                      </>
                    );
                  }
                })}
            </Nav>
            {localStorage.getItem("moduleRole") != UserRole.VIEWER &&
              localStorage.getItem("moduleId") != 32 && (
                <>
                  <span md={12} className="new-g-btn">
                    <Button
                      onClick={() => {
                        setReportModal(true);
                      }}
                      className="col-md-12"
                    >
                      Add New Root Menu/Group
                      <FontAwesomeIcon
                        icon={faPlus}
                        title="Add New Root Menu/Group"
                        className="text-red"
                      />
                    </Button>
                  </span>

                  <span md={12} className="new-g-btn">
                    <Button
                      onClick={() => {
                        setReportEdit(true);
                      }}
                      className="col-md-12"
                    >
                      Report Menu Group Change
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        title="Report Menu Group Change"
                        className="text-red"
                      />
                    </Button>
                  </span>
                  <span md={12} className="new-g-btn">
                    <Button
                      onClick={() => {
                        setMenuModal(true);
                      }}
                      className="col-md-12"
                    >
                      Reorder Menu
                      <FontAwesomeIcon
                        icon={faListOl}
                        title="Reorder Menu"
                        className="text-red"
                      />
                    </Button>
                  </span>
                </>
              )}

            <Modal
              as={Modal.Dialog}
              centered
              show={menuModal}
              onHide={closeModal}
              size="xl"
              scrollable
            >
              <Modal.Header>
                <>
                  <Modal.Title>Reorder menu list</Modal.Title>

                  <Button
                    style={{ float: "left" }}
                    variant="secondary"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                </>
              </Modal.Header>
              <Modal.Body>
                <ReorderMenuModal modalStatus={() => closeModal()} />
              </Modal.Body>
            </Modal>

            <DefaultModal
              show={modal}
              title="Edit Group"
              salModal={true}
              size={"lg"}
              onClose={() => {
                setEditMenuGroupTitle("");
                setEditGroupParentId(0);
                setEditGroupId(0);
                setModal(false);
                setIsRoot(false);
                setMenuId("");
              }}
              children={
                <>
                  <Row className="font-style">
                    <Col md={12}>
                      <label className="mb-0">Group Title</label>
                      <input
                        name="EDIT_NAME"
                        className="form-control text-center"
                        defaultValue={data?.reportMenuGroupTitle}
                        disabled={true}
                      />
                    </Col>

                    {!isRoot && (
                      <>
                        <Col md={12} className="mt-4 pt-4 pt-4">
                          <label className="mb-0">
                            Renamed Group Title{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            name="EDIT_NAME"
                            className="form-control"
                            defaultValue={data?.reportMenuGroupTitle}
                            onChange={(e) => {
                              document.getElementById(
                                "editGroupTitle"
                              ).style.display = "NONE";
                              setEditMenuGroupTitle(e.target.value);
                            }}
                          />
                          <div id="editGroupTitle"></div>
                        </Col>
                        <Col md={6} className="mt-4 pt-4">
                          <label className="mb-0">
                            Menu List <span className="text-danger">*</span>
                          </label>
                          <select
                            type="select"
                            name="EDIT_NAME"
                            className="form-control form-select"
                            defaultValue={menuId}
                            onChange={(e) => {
                              setMenuId(e.target.value);
                              setEditGroupParentId(e.target.value);
                              setEditGroupId(0);
                              document.getElementById(
                                "editGroupMenu"
                              ).style.display = "NONE";
                            }}
                          >
                            <option value={0}>Select Menu</option>
                            {menuList?.data &&
                              menuList?.data.length > 0 &&
                              menuList?.data.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item?.reportMenuGroupId}
                                    //selected={menuId == item?.reportMenuGroupId?true:false}
                                  >
                                    {item.reportMenuGroupTitle}
                                  </option>
                                );
                              })}
                          </select>
                          <div id="editGroupMenu"></div>
                        </Col>

                        <Col md={6} className="mt-4 pt-4">
                          <label className="mb-0">
                            Group List <span className="text-danger">*</span>
                          </label>
                          <select
                            type="select"
                            name="ADD_NAME"
                            className="form-control form-select"
                            onChange={(e) => {
                              setEditGroupId(e.target.value);
                              document.getElementById(
                                "editMenuGroup"
                              ).style.display = "NONE";
                            }}
                          >
                            <option value={0}>Select Group</option>
                            {groupList?.data &&
                              groupList?.data.length > 0 &&
                              groupList?.data.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item?.reportMenuGroupId}
                                    selected={
                                      reportId == item?.reportMenuGroupId
                                        ? true
                                        : false
                                    }
                                  >
                                    {item.menuGroupTitle}
                                  </option>
                                );
                              })}
                          </select>
                          <div id="editMenuGroup"></div>
                        </Col>
                      </>
                    )}

                    <Col md={12} className="mt-4 pt-4 pt-4">
                      <label className="form-label">
                        Is Root?
                        <input
                          className="mb-10"
                          type="checkbox"
                          onClick={(e) => {
                            console.log("sad12", isRoot);
                            setIsRoot(e.target.checked);
                          }}
                        />
                      </label>
                    </Col>
                  </Row>

                  <Row>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-10">
                      <button
                        className="btn btn-primary me-md-2"
                        type="button"
                        onClick={() => {
                          let dataValue = {
                            id: data?.reportMenuGroupId,
                            parentReportMenuGroupId: isRoot
                              ? null
                              : editGroupId,
                            reportMenuGroupTitle: isRoot
                              ? data?.reportMenuGroupTitle
                              : editMenuGroupTitle,
                            appModuleId: localStorage.getItem("moduleId"),
                          };

                          if (isRoot) {
                            dispatch(
                              callApi({
                                operationId:
                                  UrlBuilder.report(`menu-group/update`),
                                output: "menuGroupUpdate",
                                parameters: {
                                  method: "PUT",
                                  body: JSON.stringify(dataValue),
                                  header: {
                                    "Content-Type": "application/json",
                                  },
                                },
                              })
                            );
                            setEditMenuGroupTitle("");
                            setEditGroupParentId(0);
                            setEditGroupId(0);
                            setModal(false);
                            setIsRoot(false);
                            setMenuId("");
                          } else if (
                            editMenuGroupTitle != "" &&
                            editGroupId != 0 &&
                            editGroupParentId != 0
                          ) {
                            dispatch(
                              callApi({
                                operationId:
                                  UrlBuilder.report(`menu-group/update`),
                                output: "menuGroupUpdate",
                                parameters: {
                                  method: "PUT",
                                  body: JSON.stringify(dataValue),
                                  header: {
                                    "Content-Type": "application/json",
                                  },
                                },
                              })
                            );
                            setEditMenuGroupTitle("");
                            setEditGroupParentId(0);
                            setEditGroupId(0);
                            setModal(false);
                            setIsRoot(false);
                            setMenuId("");
                          } else {
                            if (editMenuGroupTitle == "") {
                              document.getElementById(
                                "editGroupTitle"
                              ).style.display = "BLOCK";
                              document.getElementById(
                                "editGroupTitle"
                              ).style.color = "red";
                              document.getElementById(
                                "editGroupTitle"
                              ).innerHTML = "REQUIRED";
                            }
                            if (editGroupParentId == 0) {
                              document.getElementById(
                                "editGroupMenu"
                              ).style.display = "BLOCK";
                              document.getElementById(
                                "editGroupMenu"
                              ).style.color = "red";
                              document.getElementById(
                                "editGroupMenu"
                              ).innerHTML = "REQUIRED";
                            }
                            if (editGroupId == 0) {
                              document.getElementById(
                                "editMenuGroup"
                              ).style.display = "BLOCK";
                              document.getElementById(
                                "editMenuGroup"
                              ).style.color = "red";
                              document.getElementById(
                                "editMenuGroup"
                              ).innerHTML = "REQUIRED";
                            }
                          }
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                          setEditMenuGroupTitle("");
                          setEditGroupParentId(0);
                          setEditGroupId(0);
                          setModal(false);
                          setIsRoot(false);
                          setMenuId("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Row>
                </>
              }
            />

            <DefaultModal
              show={reportModal}
              title="Add New Root Menu/Group"
              salModal={true}
              size={"lg"}
              onClose={() => {
                setMenuId("");
                menuGroupTitle.current = "";
                menuListId.current = 0;
                groupListId.current = 0;
                setReportModal(false);
              }}
              children={
                <>
                  <Row>
                    <Col md={6}>
                      <label>Type List</label>
                      <select
                        type="select"
                        name="ADD_NAME"
                        className="form-control form-select"
                        //value={data?.reportMenuGroupId}
                        onChange={(e) => {
                          menuGroupTitle.current = "";
                          menuListId.current = 0;
                          groupListId.current = 0;

                          setType(e.target.value);
                        }}
                      >
                        <option value={0}>Select Type</option>
                        <option value={"menu"}>Add Root Menu</option>
                        <option value={"group"}>Add Group</option>
                      </select>
                    </Col>
                    {type == "menu" ? (
                      <>
                        <Col md={6}>
                          <label>
                            Menu Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => {
                              document.getElementById(
                                "menuGroupTitle"
                              ).style.display = "NONE";
                              menuGroupTitle.current = e.target.value;
                            }}
                          />
                          <div id="menuGroupTitle"></div>
                        </Col>
                      </>
                    ) : type == "group" ? (
                      <>
                        <Col md={6}>
                          <label>
                            Menu List <span className="text-danger">*</span>
                          </label>
                          <select
                            type="select"
                            className="form-control form-select"
                            //value={data?.reportMenuGroupId}
                            onChange={(e) => {
                              groupListId.current = 0;
                              menuListId.current = e.target.value;
                              e.target.value > 0 && setMenuId(e.target.value);

                              document.getElementById(
                                "menuTitleId"
                              ).style.display = "NONE";

                              document.getElementById(
                                "groupTitleId"
                              ).style.display = "NONE";
                              document.getElementById(
                                "menuGroupTitle"
                              ).style.display = "NONE";
                            }}
                          >
                            <option value={0}>Select Menu</option>
                            {menuList?.data &&
                              menuList?.data.length > 0 &&
                              menuList?.data.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item?.reportMenuGroupId}
                                  >
                                    {item.reportMenuGroupTitle}
                                  </option>
                                );
                              })}
                          </select>
                          <div id="menuTitleId"></div>
                        </Col>
                        <Col md={6}>
                          <label>
                            Group List <span className="text-danger">*</span>
                          </label>
                          <select
                            type="select"
                            className="form-control form-select"
                            //value={data?.reportMenuGroupId}
                            onChange={(e) => {
                              document.getElementById(
                                "groupTitleId"
                              ).style.display = "NONE";
                              groupListId.current = e.target.value;
                            }}
                          >
                            <option value={0}>Select Group</option>
                            {groupList?.data &&
                              groupList?.data.length > 0 &&
                              groupList?.data.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item?.reportMenuGroupId}
                                  >
                                    {item.menuGroupTitle}
                                  </option>
                                );
                              })}
                          </select>
                          <div id="groupTitleId"></div>
                        </Col>
                        <Col md={6}>
                          <label>
                            Group Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => {
                              document.getElementById(
                                "menuGroupTitle"
                              ).style.display = "NONE";
                              menuGroupTitle.current = e.target.value;
                            }}
                          />
                          <div id="menuGroupTitle"></div>
                        </Col>
                      </>
                    ) : null}
                  </Row>
                  {type != 0 && (
                    <Row>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-10">
                        <button
                          className="btn btn-primary me-md-2"
                          type="button"
                          onClick={() => {
                            var submit = 1;
                            if (
                              type == "menu" &&
                              menuGroupTitle.current == ""
                            ) {
                              submit = 0;
                              document.getElementById(
                                "menuGroupTitle"
                              ).style.display = "BLOCK";
                              document.getElementById(
                                "menuGroupTitle"
                              ).style.color = "red";
                              document.getElementById(
                                "menuGroupTitle"
                              ).innerHTML = "REQUIRED";
                            } else if (
                              type == "group" &&
                              (menuGroupTitle.current == "" ||
                                !menuListId.current ||
                                menuListId.current == 0 ||
                                !groupListId.current ||
                                groupListId.current == 0)
                            ) {
                              submit = 0;
                              if (
                                !menuListId.current ||
                                menuListId.current == 0
                              ) {
                                document.getElementById(
                                  "menuTitleId"
                                ).style.color = "red";
                                document.getElementById(
                                  "menuTitleId"
                                ).innerHTML = "REQUIRED";
                                document.getElementById(
                                  "menuTitleId"
                                ).style.display = "BLOCK";
                              }

                              if (
                                !groupListId.current ||
                                groupListId.current == 0
                              ) {
                                document.getElementById(
                                  "groupTitleId"
                                ).style.color = "red";
                                document.getElementById(
                                  "groupTitleId"
                                ).innerHTML = "REQUIRED";
                                document.getElementById(
                                  "groupTitleId"
                                ).style.display = "BLOCK";
                              }

                              if (menuGroupTitle.current == "") {
                                document.getElementById(
                                  "menuGroupTitle"
                                ).style.color = "red";
                                document.getElementById(
                                  "menuGroupTitle"
                                ).innerHTML = "REQUIRED";
                                document.getElementById(
                                  "menuGroupTitle"
                                ).style.display = "BLOCK";
                              }
                            }

                            let dataValue = {
                              parentReportMenuGroupId: groupListId.current,
                              reportMenuGroupTitle: menuGroupTitle.current,
                              appModuleId: localStorage.getItem("moduleId"),
                            };

                            // return;
                            if (submit == 1) {
                              dispatch(
                                callApi({
                                  operationId:
                                    UrlBuilder.report(`menu-group/save`),
                                  output: "reportTitleSave",
                                  parameters: {
                                    method: "POST",
                                    body: JSON.stringify(dataValue),
                                    header: {
                                      "Content-Type": "application/json",
                                    },
                                  },
                                })
                              );
                              menuGroupTitle.current = "";
                              menuListId.current = 0;
                              groupListId.current = 0;
                              setReportModal(false);
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => {
                            setMenuId("");
                            menuGroupTitle.current = "";
                            menuListId.current = 0;
                            groupListId.current = 0;
                            setReportModal(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </Row>
                  )}
                </>
              }
            />

            <DefaultModal
              show={reportEdit}
              title="Report Menu Group Change"
              salModal={true}
              size={"lg"}
              onClose={() => {
                setMenuId("");
                setReportListId(0);
                groupListId.current = 0;
                menuListId.current = 0;
                setReportEdit(false);
              }}
              children={
                <>
                  <Row>
                    <Col md={12}>
                      <label>
                        Report List
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        type="select"
                        name="EDIT_REPORT"
                        className="form-control selectpicker"
                        data-live-search="true"
                        //value={data?.reportMenuGroupId}
                        onChange={(e) => {
                          setReportListId(e.target.value);
                          document.getElementById(
                            "reportListId"
                          ).style.display = "NONE";
                        }}
                      >
                        <option value={0}>Select Report</option>
                        {reportList?.data &&
                          reportList?.data.length > 0 &&
                          reportList?.data.map((item, index) => {
                            return (
                              <option key={index} value={item?.reportId}>
                                {item.reportTitle}
                              </option>
                            );
                          })}
                      </select>
                      <div id="reportListId"></div>
                    </Col>
                    <Col md={6}>
                      <label>
                        Menu List
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        type="select"
                        name="ADD_NAME"
                        className="form-control form-select"
                        //value={data?.reportMenuGroupId}
                        onChange={(e) => {
                          setReportMenuId(e.target.value);
                          setMenuId(e.target.value);

                          document.getElementById(
                            "reportMenuId"
                          ).style.display = "NONE";
                        }}
                      >
                        <option value={0}>Select Menu</option>
                        {menuList?.data &&
                          menuList?.data.length > 0 &&
                          menuList?.data.map((item, index) => {
                            return (
                              <option
                                key={index}
                                value={item?.reportMenuGroupId}
                              >
                                {item.reportMenuGroupTitle}
                              </option>
                            );
                          })}
                      </select>
                      <div id="reportMenuId"></div>
                    </Col>
                    <Col md={6}>
                      <label>
                        Group List
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        type="select"
                        name="ADD_NAME"
                        className="form-control form-select"
                        //value={data?.reportMenuGroupId}

                        onChange={(e) => {
                          setReportGroupId(e.target.value);
                          document.getElementById(
                            "reportGroupId"
                          ).style.display = "NONE";
                        }}
                      >
                        <option value={0}>Select Group</option>
                        {groupList?.data &&
                          groupList?.data.length > 0 &&
                          groupList?.data.map((item, index) => {
                            return (
                              <option
                                key={index}
                                value={item?.reportMenuGroupId}
                              >
                                {item.menuGroupTitle}
                              </option>
                            );
                          })}
                      </select>
                      <div id="reportGroupId"></div>
                    </Col>
                  </Row>

                  <Row>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-10">
                      <button
                        className="btn btn-primary me-md-2"
                        type="button"
                        onClick={() => {
                          let dataValue = {
                            reportMenuGroupId: groupList.current,
                            appModuleId: menuList?.data[0]?.appModuleId,
                          };

                          if (
                            reportListId != 0 &&
                            reportGroupId != 0 &&
                            reportMenuId != 0
                          ) {
                            dispatch(
                              callApi({
                                operationId: UrlBuilder.report(
                                  `report/update-menu-group/${reportListId}?reportMenuGroupId=${reportGroupId}`
                                ),
                                output: "reportMenuEdit",
                                parameters: {
                                  method: "POST",
                                  body: JSON.stringify(dataValue),
                                  header: {
                                    "Content-Type": "application/json",
                                  },
                                },
                              })
                            );
                            setReportEdit(false);
                          } else {
                            //alert("Every Field Is Required");
                            if (reportListId == 0) {
                              document.getElementById(
                                "reportListId"
                              ).style.display = "BLOCK";
                              document.getElementById(
                                "reportListId"
                              ).style.color = "red";
                              document.getElementById(
                                "reportListId"
                              ).innerHTML = "REQUIRED";
                            }

                            if (reportMenuId == 0) {
                              document.getElementById(
                                "reportMenuId"
                              ).style.display = "BLOCK";
                              document.getElementById(
                                "reportMenuId"
                              ).style.color = "red";
                              document.getElementById(
                                "reportMenuId"
                              ).innerHTML = "REQUIRED";
                            }

                            if (reportGroupId == 0) {
                              document.getElementById(
                                "reportGroupId"
                              ).style.display = "BLOCK";
                              document.getElementById(
                                "reportGroupId"
                              ).style.color = "red";
                              document.getElementById(
                                "reportGroupId"
                              ).innerHTML = "REQUIRED";
                            }
                          }
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                          setReportListId(0);
                          groupListId.current = 0;
                          menuListId.current = 0;
                          setReportEdit(false);
                          setMenuId("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </Row>
                </>
              }
            />
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
