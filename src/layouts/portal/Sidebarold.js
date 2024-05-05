import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  Badge,
  Button,
  Col,
  Image,
  Nav,
  Navbar,
  Row,
} from "@themesberg/react-bootstrap";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import SimpleBar from "simplebar-react";
import { NaiveOption } from "../../navs";
// import ReactHero from "../../@core/assets/img/technologies/react-hero-logo.svg";
import { UrlBuilder } from "helpers/UrlBuilder";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactHero from "../../@core/assets/img/technologies/bangladesh-govt-logo-A2C7688845-seeklogo.com.png";
import DefaultModal from "../../components/modal/default/DefaultModal";
import UserRole from "../../constants/UserRole";
import { AuthUser } from "../../helpers/AuthUser";
import { callApi, clearState, selectApi } from "../../reducers/apiSlice";
import "./sidebar.css";

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState();
  const showClass = show ? "show" : "";
  const onCollapse = () => setShow(!show);
  const menuListId = useRef();
  const reportTitleAlias = useRef();

  const {
    menuList = {
      data: {},
    },
  } = useSelector(selectApi);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    //const defaultKey = pathname.indexOf(children) !== -1 ? eventKey : "";
    let defaultKey = "";
    children.map((item, index) => {
      if (item.props.link === pathname) {
        defaultKey = eventKey;
      }
    });

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button
            as={Nav.Link}
            className="d-flex justify-content-between align-items-center sidemenuicon"
          >
            <span>
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
              <span className="sidebar-text ">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">{children}</Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
    } = props;

    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : `${className}`;
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item
        className={navItemClassName}
        onClick={() => {
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

            <span className="sidebar-text ">{title}</span>
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
    let roles = AuthUser.getRoles();
    if (roles.includes(UserRole.ADMIN)) {
      navs = NaiveOption.adminUser();
    }
  } else {
    AuthUser.removeLoginData();

    dispatch(
      clearState({
        output: "authData",
      })
    );

    history.push("/login");
  }

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
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className="sidebar-inner px-4 pt-3">
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
              {/* <NavItem title="BANBEIS " link="/" className="logo"  image={ReactHero}/> */}
              <Link to="/">
                <div
                  id="banbeis_home"
                  className="d-flex justify-content-center text-primary align-items-center p-5"
                >
                  <Image src={ReactHero} width={22} height={22} />
                  <span className="text-primary text-uppercase fw-bold">
                    Banbeis
                  </span>
                </div>
              </Link>
              {navs.length > 0 &&
                navs.map((nav, navIndex) => {
                  if (nav.children !== undefined && nav.children.length) {
                    return (
                      <CollapsableNavItem
                        key={navIndex + 1}
                        eventKey={nav.path}
                        title={nav.title}
                        icon={nav.icon}
                      >
                        {nav.children.map((navChild, navChildIndex) => {
                          if (
                            navChild.grandChildren &&
                            Array.isArray(navChild.grandChildren)
                          ) {
                            return (
                              <CollapsableNavItem
                                key={navChildIndex}
                                eventKey={navChild.path}
                                title={navChild.title}
                                icon={navChild.icon}
                                // className={navChild?.className}
                              >
                                {Array.isArray(navChild.grandChildren) &&
                                  navChild.grandChildren.map(
                                    (gchild, gIndex) => {
                                      return (
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faPencilAlt}
                                            className="text-white"
                                            onClick={() => {
                                              setData(gchild?.data);
                                              setModal(true);
                                              console.log(gchild, "gchild");
                                            }}
                                          />
                                          <div className="d-inline-block">
                                            <NavItem
                                              key={gIndex}
                                              title={gchild.title}
                                              link={gchild.path}
                                              // icon={gchild.icon}
                                            />
                                          </div>
                                        </span>
                                      );
                                    }
                                  )}
                              </CollapsableNavItem>
                            );
                          } else {
                            return (
                              <NavItem
                                key={navChildIndex}
                                title={navChild.title}
                                link={navChild.path}
                                icon={navChild.icon}
                                className={navChild?.className}
                              />
                            );
                          }
                        })}
                      </CollapsableNavItem>
                    );
                  } else {
                    return (
                      <NavItem
                        key={navIndex}
                        title={nav.title}
                        icon={nav.icon}
                        link={nav.path}
                      />
                    );
                  }
                })}
            </Nav>
            <DefaultModal
              show={modal}
              title="Edit Report Name"
              salModal={true}
              children={
                <>
                  <Row>
                    <Col md={6}>
                      <label>Menu List</label>
                      <select
                        type="select"
                        name="EDIT_NAME"
                        className="form-control form-select"
                        onChange={(e) => {
                          menuListId.current = e.target.value;
                        }}
                      >
                        <option>Select Menu</option>
                        {menuList?.data &&
                          menuList?.data.length > 0 &&
                          menuList?.data.map((item, index) => {
                            return (
                              <option
                                key={index}
                                value={item.reportMenuGroupId}
                              >
                                {item.reportMenuGroupTitleBn}
                              </option>
                            );
                          })}
                      </select>
                    </Col>
                    <Col md={6}>
                      <label>Report Title</label>
                      <input
                        name="EDIT_NAME"
                        className="form-control"
                        defaultValue={data?.reportMenuGroupTitle}
                        onChange={(e) => {
                          reportTitleAlias.current = e.target.value;
                        }}
                      />
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
                            parentReportMenuGroupId: menuListId.current,
                            reportMenuGroupTitle: reportTitleAlias.current,
                          };

                          dispatch(
                            callApi({
                              operationId:
                                UrlBuilder.report(`menu-group/update`),
                              output: "reportTitle",
                              parameters: {
                                method: "PUT",
                                body: JSON.stringify(dataValue),
                                header: {
                                  "Content-Type": "application/json",
                                },
                              },
                            })
                          );
                          setModal(false);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                          setModal(false);
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
