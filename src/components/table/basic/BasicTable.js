import {
  faDownload,
  faSearch,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
// import ColSpan from "../../../views/portal/mpoSummaryReport/ColSpan";

import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Nav,
  Row,
  Table,
} from "@themesberg/react-bootstrap";
import Pagination from "react-js-pagination";
// import AccordionComponent from "../../accordion/AccordionComponent";
import "./BasicTable.scss";
import swal from "sweetalert";
// import { Button } from "bootstrap";
// import { useDispatch } from "react-redux";

const BasicTable = (props) => {
  const {
    headers,
    perPage,
    totalData,
    onSizeChange,
    onSearch,
    meta,
    onPageChange,
    children,
    type = false,
    setAllSelectedData,
    flag,
    isTableCustomStyle = false,
    customStyle,
    searchOption = true,
    sizeOption = true,
    extraHeader,
    extraHeaderTwo,
    newHeader = false,
    bonusHeader = false,
    advancedTable,
    downloadProps,
    downloadFunction,
    dataLength,
    onSortBy,
  } = props;

  const [searchKeyValue, setSearchKeyValue] = useState("");
  const onSearchKeyValue = (val) => {
    return onSearch(val);
  };

  const onChangeKey = (e) => {
    setSearchKeyValue(e.target.value);
  };

  const onSizeChangeDown = (value) => {
    return onSizeChange(value);
  };

  const allSelect = (e) => {

    return onAllSelect(e);
  };

  const onSortByValue = (value) => {
    return onSortBy(value);
  };

  return (
    <>
      <Card border="white" className="table-wrapper ">
        <Card.Body>
          <div className="table-settings d-block mb-5">
            <Row className="justify-content-between align-items-center">
              {searchOption === true && (
                <Col xs={12} sm={10} md={10} lg={8} xl={6}>
                  <InputGroup style={{ width: "60%", display: "inline-flex" }}>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="অনুসন্ধান"
                      onChange={(e) =>
                        //   onChangeKey(e) }
                        setSearchKeyValue(e.target.value)
                      }
                      onKeyUp={(e) => {
                        if (e.keyCode === 13) {
                          onSearchKeyValue(searchKeyValue);
                        }
                      }}
                    />
                  </InputGroup>
                  <div
                    style={{
                      width: " 30%",
                      display: " inline-flex",
                      margin: "8px",
                    }}
                  >
                    <button
                      className="form-control btn btn-primary text-white"
                      onClick={() => onSearchKeyValue(searchKeyValue)}
                    >
                      অনুসন্ধান করুন
                    </button>
                  </div>
                </Col>
              )}

              {flag === undefined && sizeOption === true && (
                <>
                  {downloadProps === true && (
                    <Col>
                      <Button
                        variant="success"
                        className="f-right m-10"
                        type="button"
                        disabled={dataLength == 0 ? true : false}
                        onClick={() => {
                          swal(
                            {
                              title: "Do you want to Download ?",
                              icon: "success",
                              buttons: true,
                              dangerMode: false,
                            }
                          ).then(
                            (
                              willDownload
                            ) => {
                              willDownload && downloadFunction()
                            }
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faDownload} className="me-2" />
                        Download
                      </Button>
                    </Col>
                  )}
                  <Col
                    xs={4}
                    sm={2}
                    md={2}
                    lg={2}
                    xl={1}
                    className="ps-md-0 text-end"
                  >
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Select
                          onChange={(e) => onSizeChangeDown(e.target.value)}
                        >
                          {perPage.map((size, index) => (
                            <option value={size} key={index}>
                              {size}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Form>
                  </Col>
                </>
              )}
            </Row>
          </div>
          <div
            className="table-responsive"
            style={isTableCustomStyle ? customStyle : {}}
          >
            <Table striped hover className="user-table align-items-center">
              <thead
                style={{ backgroundColor: "#01579b", color: "whitesmoke" }}
              >
                {newHeader == true && <tr style={{ backgroundColor: "#3a74bc" }}>
                  <th colSpan={4} style={{ backgroundColor: "white" }}></th>
                  <th colSpan={2} className="text-center " >শিক্ষাগত যোগ্যতা</th>
                  <th colSpan={2} className="text-center">বয়স</th>
                </tr>

                }
                {
                  bonusHeader == true && <tr style={{ backgroundColor: "#3a74bc" }}>
                    <th colSpan={7} style={{ backgroundColor: "white" }}></th>
                    <th colSpan={2} className="text-center " >Bonus</th>
                  </tr>
                }
                <tr>
                  {type === true && (
                    <th style={{ textDecoration: "none" }}>
                      <input
                        type="checkbox"
                        className="d-inline mr-4"
                        onClick={allSelect}
                      />
                      <label style={{ color: "white" }}> All</label>
                    </th>
                  )}

                  {headers.map((header, headerIndex) => {
                    if (header.width !== undefined) {
                      return (
                        <th
                          key={headerIndex}
                          className="border-bottom"
                          style={{ width: "100px" }}
                        // rowSpan={header?.rowSpan}
                        >
                          {header.label}
                        </th>
                      );
                    } else {
                      return (
                        <th
                          key={headerIndex}
                          className={`border-bottom ${header?.className}`}
                          rowSpan={header?.rowSpan}
                          colSpan={header?.colSpan}
                        // style={totalStylt}
                        >
                          <div className={newHeader == true ? "d-flex justify-content-center " : "d-flex justify-content-between"}>
                            {" "}
                            <div>
                              {header.label} {"    "}{" "}
                            </div>
                            <span className="d-flex flex-column">
                              {header.icon && (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    onSortByValue("Up");
                                  }}
                                  icon={faSortUp}
                                />
                              )}
                              {header.icon && (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    onSortByValue("Down");
                                  }}
                                  className="iconResizing"
                                  icon={faSortDown}
                                />
                              )}
                            </span>
                          </div>
                        </th>
                      );
                    }
                  })}
                </tr>



                {/* {advancedTable !== undefined && (
                  <ColSpan
                    extraHeader={extraHeader}
                    extraHeaderTwo={extraHeaderTwo}
                  />
                )} */}
              </thead>
              <tbody style={{ minHeight: "540px !important" }}>
                {!children ? (
                  <tr>
                    {" "}
                    <td colSpan={20} className="text-center">
                      <span className="fw-bold h4 text-danger">
                        NO DATA FOUND
                      </span>
                    </td>{" "}
                  </tr>
                ) : (
                  children
                )}
              </tbody>
            </Table>
          </div>

          {flag === undefined && (
            <Card.Footer className="px-0 border-0 d-lg-flex align-items-center justify-content-between pb-0">
              <Nav>
                <Pagination
                  innerClass="pagination"
                  itemClass="page-item"
                  linkClass="page-link"
                  activePage={meta.currentPage}
                  itemsCountPerPage={meta.size}
                  totalItemsCount={meta.total}
                  pageRangeDisplayed={10}
                  onChange={(page) => {
                    // console.log("page", page);
                    onPageChange(page);
                  }}
                ></Pagination>
              </Nav>
              <small className="fw-bold">
                Showing{" "}
                <b>
                  {meta.size > meta.total
                    ? meta.total
                    : totalData >= meta.size
                      ? totalData * meta.currentPage
                      : meta.size * meta.currentPage - (meta.size - totalData)}
                </b>{" "}
                out of <b>{meta.total}</b> entries
              </small>
            </Card.Footer>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default BasicTable;
