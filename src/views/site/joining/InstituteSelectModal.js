import { faRedo, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nav } from "@themesberg/react-bootstrap";
import { InputField, InputSelect } from "components/form";
import { Form, Formik } from "formik/dist/index";
import { useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import InputSelectApi from "../../../components/form/InputSelectApi";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import { callApi, selectApi } from "../../../reducers/apiSlice";

const InstituteSelectModal = ({ show, setShow, setInstitute, values }) => {
  console.log("values233", values);
  const dispatch = useDispatch();
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [filteredData, setfilteredData] = useState();
  // console.log("AllData", AllData);

  const {
    InstituteList = {
      data: [],
    },
  } = useSelector(selectApi);

  let getInstituteList = [];
  InstituteList?.data.forEach((element) => {
    getInstituteList.push(element);
  });

  let totalData = 0;
  const onPageChange = (value) => {
    setPage(value);
    dispatch(
      callApi({
        operationId: UrlBuilder.mpoDsheApi(
          `employee/institute/all?divisionId=${filteredData.divisionId}&districtId=${filteredData.districtId}&thanaId=${filteredData.thanaId}&search=${filteredData.search}&instituteTypeId=${filteredData?.instituteTypeId}&page=${value}&size=${size}`
        ),
        output: "InstituteList",
      })
    );
  };

  return (
    <Modal
      animation={true}
      show={show}
      onHide={() => setShow(false)}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          প্রতিষ্ঠান নির্বাচন করুন
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            search: "",
            instituteTypeId: "",
            divisionId: "",
            districtId: "",
            thanaId: "",
          }}
          onSubmit={(values, { resetForm }) => {
            setfilteredData(values);
            setPage.current = 1;
            dispatch(
              callApi({
                operationId: UrlBuilder.mpoDsheApi(
                  `employee/institute/all?divisionId=${values.divisionId}&districtId=${values.districtId}&thanaId=${values.thanaId}&search=${values.search}&instituteTypeId=${values?.instituteTypeId}&page=${setPage.current}&size=${size}`
                ),
                output: "InstituteList",
              })
            );
          }}
        >
          {({ values }) => (
            // console.log("VaLueProps", values),
            <Form>
              <div className="p-10 m-20">
                <Row>
                  <Col md={2}>
                    <InputField
                      label="EIIN নম্বর"
                      name="search"
                      type="text"
                      //placeholder=" EIIN Number"
                    />
                  </Col>
                  <Col md={2}>
                    <InputSelect
                      label="প্রতিষ্ঠানের ধরন"
                      name="instituteTypeId"
                      value="id"
                      data={[
                        {
                          id: 11,
                          name: "SCHOOL",
                        },
                        {
                          id: 2,
                          name: "COLLEGE",
                        },
                        {
                          id: 5,
                          name: "MADRASHA",
                        },
                      ]}
                      text="name"
                    />
                  </Col>
                  <Col md={2}>
                    <InputSelectApi
                      label="বিভাগ"
                      name="divisionId"
                      operationId={UrlBuilder.mpoDsheApi(
                        "employee/division/list"
                      )}
                      storeName="division"
                      value="id"
                      text="divisionName"
                    />
                  </Col>
                  <Col md={2}>
                    <InputSelectApi
                      label="জেলা"
                      name="districtId"
                      operationId={
                        values.divisionId &&
                        UrlBuilder.mpoDsheApi(
                          `employee/district/all?divisionId=${values.divisionId}`
                        )
                      }
                      storeName="district"
                      value="id"
                      text="districtName"
                    />
                  </Col>

                  <Col md={2}>
                    <InputSelectApi
                      label="থানা"
                      name="thanaId"
                      operationId={
                        values.districtId &&
                        UrlBuilder.mpoDsheApi(
                          `employee/thana/all?districtId=${values.districtId}`
                        )
                      }
                      storeName="thana"
                      value="id"
                      text="thanaName"
                    />
                  </Col>

                  <Col md={2}>
                    {" "}
                    <InputSelectApi
                      label="ইউনিয়ন"
                      name="unionId"
                      operationId={
                        values.thanaId &&
                        UrlBuilder.mpoDsheApi(
                          `employee/union/all?thanaId=${values.thanaId}`
                        )
                      }
                      storeName="union"
                      value="id"
                      text="unionName"
                    />
                  </Col>

                  <Col md={12}>
                    <Button className="mt-35 f-right ml-10" type="submit">
                      <FontAwesomeIcon icon={faSearch} />
                      Search
                    </Button>
                    <Button className="mt-35 f-right" type="reset">
                      <FontAwesomeIcon icon={faRedo} />
                      Reset
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </Formik>

        <Table striped bordered hover className="mt-10">
          <thead>
            <tr>
              <th>#</th>
              <th className="fw-bold">প্রতিষ্ঠানের নাম</th>
              <th className="fw-bold">EIIN</th>
              <th className="fw-bold">প্রতিষ্ঠানের ধরন</th>
              <th className="fw-bold">বিভাগ</th>
              <th className="fw-bold">জেলা</th>
              <th className="fw-bold">থানা</th>
              <th className="fw-bold">প্রতিষ্ঠান নির্বাচন করুন</th>
            </tr>
          </thead>
          <tbody>
            {getInstituteList?.map((item, index) => {
              // console.log("item", item);
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item?.instituteName}</td>
                  <td>{item?.eiinNo}</td>
                  <td>{item?.instituteTypeName}</td>
                  <td>{item?.divisionName}</td>
                  <td>{item?.districtName}</td>
                  <td>{item?.thanaName}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setInstitute({ ...item, values });
                        // localStorage?.setItem(
                        //   "instituteInfo",
                        //   JSON.stringify(item)
                        // );
                        setShow(false);
                      }}
                    >
                      নির্বাচন করুন
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Nav>
          <Pagination
            innerClass="pagination"
            itemClass="page-item"
            linkClass="page-link"
            activePage={InstituteList?.meta?.currentPage}
            itemsCountPerPage={InstituteList?.meta?.size}
            totalItemsCount={InstituteList?.meta?.total}
            pageRangeDisplayed={10}
            onChange={(page) => {
              console.log("page", page);
              onPageChange(page);
            }}
          ></Pagination>
        </Nav>
        <small className="fw-bold">
          Showing{" "}
          <b>
            {InstituteList?.meta?.size > InstituteList?.meta?.total
              ? InstituteList?.meta.total
              : totalData >= InstituteList?.meta?.size
              ? totalData * InstituteList?.meta?.currentPage
              : InstituteList?.meta?.size * InstituteList?.meta?.currentPage -
                (InstituteList?.meta?.size - totalData)}
          </b>{" "}
          out of <b>{InstituteList?.meta?.total}</b> entries
        </small>
        
      </Modal.Body>
    </Modal>
  );
};

export default InstituteSelectModal;
