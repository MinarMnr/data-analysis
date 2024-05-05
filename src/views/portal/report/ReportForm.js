import {
    faClone,
    faPencilAlt,
    faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Button, Col, Modal } from "@themesberg/react-bootstrap";
import { InputField, InputSelect } from "components/form";
import CustomInputComboBox from "components/form/CustomInputComboBox";
import ErrorMessage from "components/text/ErrorMessage";
import ReportSectionType from "constants/ReportSectionType";
import { Field, Form } from "formik/dist/index";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { setToastAlert } from "reducers/toastAlertSlice";
import DefaultCard from "../../../components/card/default/DefaultCard";
import { UrlBuilder } from "../../../helpers/UrlBuilder";
import {
    callApi,
    callApiWithoutLoading,
    selectApi,
} from "../../../reducers/apiSlice";
import ChartWiseModal from "./ChartWiseModal";
import DataSetRelationForm from "./DataSetRelationForm";
import FilterPanel from "./FilterPanel";
import "./ReportForm.scss";
import TypeWiseModal from "./TypeWiseModal";
import UserRole from "constants/UserRole";

const ReportForm = ({
    setFieldValue,
    values,
    errors,
    mode = "add",
    reportType = "",
    isSubmitting,
}) => {
    const [showDefault, setShowDefault] = useState(false);
    const handleClose = () => setShowDefault(false);
    const [isOpen, setIsOpen] = useState(false);
    const [typeName, setTypeName] = useState(undefined);

    const [isChartOpen, setIsChartOpen] = useState(false);
    const [typeChartName, setTypeChartName] = useState(undefined);

    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    useEffect(() => {
        console.log("sad+++", errors);
        if (errors.filterList && isSubmitting) {
            const element = document.getElementById("filterError");
            if (!element) return;
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (errors.datasetRelationList && isSubmitting) {
            const element = document.getElementById("dataSetRelationError");
            if (!element) return;
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (errors.pivotList && isSubmitting) {
            const element = document.getElementById("pivotError");
            if (!element) return;
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [isSubmitting]);

    const GroupCardProps = {
        title: "Segment",
        headerSlot: () => (
            <>
                <Button
                    variant="warning"
                    className="f-right btn-sm p-5 btn-updown"
                    onClick={() => {
                        values?.groupList.length > 0
                            ? (setIsOpen(true), setTypeName("Group"))
                            : dispatch(
                                  setToastAlert({
                                      type: "warn",
                                      message: "Segment list empty",
                                  })
                              );
                    }}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Edit
                </Button>
            </>
        ),
    };

    const PivotCardProps = {
        title: "Pivot",
        headerSlot: () => (
            <>
                <Button
                    variant="warning"
                    className="f-right btn-sm p-5 btn-updown"
                    onClick={() => {
                        values?.pivotList.length > 0
                            ? (setIsOpen(true), setTypeName("Pivot"))
                            : dispatch(
                                  setToastAlert({
                                      type: "warn",
                                      message: "Pivot list is empty",
                                  })
                              );
                    }}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Edit
                </Button>
            </>
        ),
    };
    useEffect(() => {
        if (mode == "add") {
            setFieldValue("reportMenuGroupId", params?.id);
        } else {
            setFieldValue("reportMenuGroupId", values?.reportMenuGroupId);
        }
    }, []);
    const columnsCardProps = {
        title: "Columns",
        headerSlot: () => (
            <>
                <Button
                    variant="warning"
                    className="f-right btn-sm p-5 btn-updown"
                    onClick={() => {
                        values?.columnList.length > 0
                            ? (setIsOpen(true), setTypeName("Column"))
                            : dispatch(
                                  setToastAlert({
                                      type: "warn",
                                      message: "Column list empty",
                                  })
                              );
                    }}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Edit
                </Button>
            </>
        ),
    };
    const valuesCardProps = {
        title: "Values",
        headerSlot: () => (
            <>
                <Button
                    variant="warning"
                    className="f-right btn-sm p-5 btn-updown"
                    onClick={() => {
                        values?.valueList.length > 0
                            ? (setIsOpen(true), setTypeName("Value"))
                            : dispatch(
                                  setToastAlert({
                                      type: "warn",
                                      message: "Value list empty",
                                  })
                              );
                    }}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Edit
                </Button>
            </>
        ),
    };

    const reportValuesCardProps = {
        title: "Report Values",
        headerSlot: () => (
            <>
                <Button
                    variant="warning"
                    className="f-right btn-sm p-5 btn-updown"
                    onClick={() => {
                        Object.keys(
                            values?.reportChart?.valueList == null
                                ? ""
                                : values?.reportChart?.valueList
                        ).length > 0
                            ? (setIsChartOpen(true),
                              setTypeChartName("chartValue"))
                            : dispatch(
                                  setToastAlert({
                                      type: "warn",
                                      message: "Report Value list empty",
                                  })
                              );
                    }}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Edit
                </Button>
            </>
        ),
    };
    const reportDataCardProps = {
        title: "Report Data",
        headerSlot: () => (
            <>
                <Button
                    variant="warning"
                    className="f-right btn-sm p-5 btn-updown"
                    onClick={() => {
                        Object.keys(
                            values?.reportChart?.dataList == null
                                ? ""
                                : values?.reportChart?.dataList
                        ).length > 0
                            ? (setIsChartOpen(true),
                              setTypeChartName("chartData"))
                            : dispatch(
                                  setToastAlert({
                                      type: "warn",
                                      message: "Report data list empty",
                                  })
                              );
                    }}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Edit
                </Button>
            </>
        ),
    };
    const FilterCardProps = {
        title: "Filters",
        headerSlot: () => (
            <>
                <Button
                    variant="warning"
                    className="f-right btn-sm p-5 btn-updown"
                    onClick={() => {
                        values?.filterList.length > 0
                            ? (setIsOpen(true), setTypeName("Filter"))
                            : dispatch(
                                  setToastAlert({
                                      type: "warn",
                                      message: "Filter list empty",
                                  })
                              );
                    }}
                >
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                    Edit
                </Button>
            </>
        ),
    };

    /**
     * Get loading indicator and data from 'selectApi' state
     */
    const {
        loading,
        columns = {
            data: [],
        },
        columnsFiltered = {
            data: [],
        },
        details = {
            data: [],
        },
    } = useSelector(selectApi);

    const closeModal = () => {
        setIsOpen(false);
        setTypeName(undefined);
    };

    const closeChartModal = () => {
        setIsChartOpen(false);
        setTypeChartName(undefined);
    };

    // const changeAddModal = async (val) => {
    //     await setGroupData([]);
    //     await setGroupData(val);
    // };

    /**
     * Get data through api call by dispatching 'callApi'.
     */
    useEffect(() => {
        dispatch(
            callApiWithoutLoading({
                operationId: UrlBuilder.report(
                    `database/table-names?appModuleId=${localStorage.getItem(
                        "moduleId"
                    )}`
                ),
                output: "details",
            })
        );
    }, [mode]);

    return (
        <Form>
            <div className=" m-0 contentBox-modified p-10 rounded-all main-box-inner scrool_ber">
                {/* <h5 className="m-10 text-white text-center h5-all">
                    <span id="headerAnim" className="uldesign">
                        {mode == "add"
                            ? "New report design"
                            : reportType == ""
                            ? "Edit report design"
                            : "Create Clone report design"}
                    </span>
                </h5> */}
                {(localStorage.getItem("moduleRole") == UserRole.DESIGNER ||
                    localStorage.getItem("moduleRole") == UserRole.ADMIN) &&
                    localStorage.getItem("moduleId") != 32 && (
                        <Accordion
                            className="acc-report-custom"
                            defaultExpanded={
                                mode == "add" || reportType == "clone"
                            }
                        >
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                expandIcon={<ExpandMoreIcon />}
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "aliceblue",
                                }}
                            >
                                <Typography
                                    id="designHeaderAnim"
                                    align="center"
                                    sx={{ width: "100%" }}
                                >
                                    Design Panel
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <div className="contentBoxBody mt-10"></div>

                                    <div className="row">
                                        <div className="contentBox-modified bg-box-ser bg-gray-sear">
                                            <div className="section-header-custom">
                                                <h5 className="m-6 text-white">
                                                    Basic Information
                                                </h5>
                                            </div>
                                            <div className="contentBoxBody mt-20"></div>
                                            <div className="card-body">
                                                <Row>
                                                    <Col
                                                        md={4}
                                                        className="mb-10"
                                                    >
                                                        <InputField
                                                            label="Report Title"
                                                            name="reportTitle"
                                                            type="text"
                                                            required={true}
                                                            placeholder="Enter Report Title"
                                                        />
                                                        <ErrorMessage fieldName="reportTitle" />
                                                    </Col>
                                                    <Col
                                                        md={4}
                                                        className="mb-10"
                                                    >
                                                        <InputField
                                                            label="Report Number"
                                                            name="reportNumber"
                                                            type="text"
                                                            placeholder="Enter Report Number"
                                                        />
                                                        <ErrorMessage fieldName="reportTitle" />
                                                    </Col>

                                                    <Col
                                                        md={4}
                                                        className="mb-10"
                                                    >
                                                        <InputField
                                                            label="Report Description"
                                                            name="reportDescription"
                                                            type="text"
                                                            //required={true}
                                                            placeholder="Enter Report Description"
                                                        />
                                                        <ErrorMessage fieldName="reportDescription" />
                                                    </Col>

                                                    <Col
                                                        md={4}
                                                        className="mb-10"
                                                    >
                                                        <InputSelect
                                                            label="Is Analytics?"
                                                            name={`isAnalytics`}
                                                            value="id"
                                                            required={true}
                                                            type="text"
                                                            data={[
                                                                {
                                                                    id: "true",
                                                                    name: "Enable",
                                                                },
                                                                {
                                                                    id: "false",
                                                                    name: "Disable",
                                                                },
                                                            ]}
                                                            text="name"
                                                        />
                                                    </Col>
                                                    <Col
                                                        md={4}
                                                        className="mb-10"
                                                    >
                                                        <InputSelect
                                                            label="Report Orientation Type"
                                                            name={`reportOrientation`}
                                                            value="id"
                                                            required={true}
                                                            type="text"
                                                            data={[
                                                                {
                                                                    id: "Portrait",
                                                                    name: "Portrait",
                                                                },
                                                                {
                                                                    id: "Landscape",
                                                                    name: "Landscape",
                                                                },
                                                            ]}
                                                            text="name"
                                                        />
                                                    </Col>
                                                    <Col
                                                        md={4}
                                                        className="mb-10"
                                                    >
                                                        <InputSelect
                                                            label="Report Page Size"
                                                            name={`reportPageSize`}
                                                            value="id"
                                                            required={true}
                                                            type="text"
                                                            data={[
                                                                {
                                                                    id: "A0",
                                                                    name: "A0",
                                                                },
                                                                {
                                                                    id: "A1",
                                                                    name: "A1",
                                                                },
                                                                {
                                                                    id: "A2",
                                                                    name: "A2",
                                                                },
                                                                {
                                                                    id: "A3",
                                                                    name: "A3",
                                                                },
                                                                {
                                                                    id: "A4",
                                                                    name: "A4",
                                                                },
                                                                {
                                                                    id: "A5",
                                                                    name: "A5",
                                                                },
                                                                {
                                                                    id: "A6",
                                                                    name: "A6",
                                                                },
                                                                {
                                                                    id: "A7",
                                                                    name: "A7",
                                                                },
                                                                {
                                                                    id: "A8",
                                                                    name: "A9",
                                                                },
                                                                {
                                                                    id: "A10",
                                                                    name: "A10",
                                                                },
                                                                {
                                                                    id: "LETTER",
                                                                    name: "LETTER",
                                                                },
                                                                {
                                                                    id: "LEGAL",
                                                                    name: "LEGAL",
                                                                },
                                                                {
                                                                    id: "TABLOID",
                                                                    name: "TABLOID",
                                                                },
                                                                {
                                                                    id: "NOTE",
                                                                    name: "NOTE",
                                                                },

                                                                {
                                                                    id: "HALFLETTER",
                                                                    name: "HALFLETTER",
                                                                },
                                                                {
                                                                    id: "POSTCARD",
                                                                    name: "POSTCARD",
                                                                },
                                                                {
                                                                    id: "CROWN_QUARTO",
                                                                    name: "CROWN_QUARTO",
                                                                },
                                                                {
                                                                    id: "LARGE_CROWN_QUARTO",
                                                                    name: "LARGE_CROWN_QUARTO",
                                                                },

                                                                {
                                                                    id: "DEMY_QUARTO",
                                                                    name: "DEMY_QUARTO",
                                                                },
                                                                {
                                                                    id: "ROYAL_QUARTO",
                                                                    name: "ROYAL_QUARTO",
                                                                },
                                                            ]}
                                                            text="name"
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="contentBoxBody mt-20"></div>
                                    <DataSetRelationForm
                                        data={
                                            mode == "add"
                                                ? details.data.length > 0 &&
                                                  details.data
                                                : values &&
                                                  values?.datasetList &&
                                                  values?.datasetList.length >
                                                      0 &&
                                                  values?.datasetList
                                        }
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        mode={mode}
                                        errors={errors}
                                    />
                                    <div id="dataSetRelationError"></div>
                                    <div className="row">
                                        <Col
                                            xl={6}
                                            lg={6}
                                            md={6}
                                            className="mb-10"
                                        >
                                            <div id="duplicateColumnAlias"></div>
                                            <div className="contentBox-modified">
                                                <DefaultCard
                                                    className="mb-50"
                                                    {...columnsCardProps}
                                                >
                                                    <Field
                                                        //label="Groups"
                                                        name="columnList"
                                                        component={
                                                            CustomInputComboBox
                                                        }
                                                        data={columns?.data}
                                                        value="columnName"
                                                        result="datasetName"
                                                        text="columnAlias"
                                                        isMultiple={true}
                                                        defaultValue={
                                                            values?.columnList
                                                        }
                                                        subTextSubject="datasetName"
                                                        objectType={true}
                                                        formType={mode}
                                                    />
                                                </DefaultCard>
                                            </div>
                                        </Col>

                                        <Col
                                            xl={6}
                                            lg={6}
                                            md={6}
                                            className="mb-10"
                                        >
                                            <div className="contentBox-modified">
                                                <DefaultCard
                                                    className="mb-50"
                                                    {...FilterCardProps}
                                                >
                                                    <Field
                                                        //label="Groups"
                                                        name="filterList"
                                                        component={
                                                            CustomInputComboBox
                                                        }
                                                        data={columns?.data}
                                                        value="columnName"
                                                        result="datasetName"
                                                        text="columnAlias"
                                                        isMultiple={true}
                                                        defaultValue={
                                                            values?.filterList
                                                        }
                                                        subTextSubject="datasetName"
                                                        objectType={true}
                                                        formType={mode}
                                                        id="filterError"
                                                    />
                                                </DefaultCard>
                                                {errors.filterList && (
                                                    <Row>
                                                        <h4 className="text-danger mt-3 mb-0 d-flex justify-content-center">
                                                            <b>
                                                                Select control
                                                                type from edit
                                                                panel
                                                            </b>
                                                        </h4>
                                                    </Row>
                                                )}
                                            </div>

                                            {/* <ErrorMessage fieldName="filterList" /> */}
                                        </Col>

                                        <Col
                                            xl={6}
                                            lg={6}
                                            md={6}
                                            className="mb-10"
                                        >
                                            <div className="contentBox-modified">
                                                <DefaultCard
                                                    className="mb-50"
                                                    {...GroupCardProps}
                                                >
                                                    <Field
                                                        //label="Groups"
                                                        name="groupList"
                                                        component={
                                                            CustomInputComboBox
                                                        }
                                                        data={
                                                            values?.columnList
                                                        }
                                                        value="columnName"
                                                        result="datasetName"
                                                        text="columnAlias"
                                                        isMultiple={true}
                                                        defaultValue={
                                                            values?.groupList
                                                        }
                                                        subTextSubject="datasetName"
                                                        objectType={true}
                                                        formType={mode}
                                                    />
                                                </DefaultCard>
                                            </div>
                                        </Col>

                                        <Col
                                            xl={6}
                                            lg={6}
                                            md={6}
                                            className="mb-10"
                                        >
                                            <div className="contentBox-modified">
                                                <DefaultCard
                                                    className="mb-50"
                                                    {...PivotCardProps}
                                                >
                                                    <Field
                                                        //label="Groups"
                                                        name="pivotList"
                                                        component={
                                                            CustomInputComboBox
                                                        }
                                                        data={columns?.data}
                                                        value="columnName"
                                                        result="datasetName"
                                                        text="columnAlias"
                                                        isMultiple={false}
                                                        defaultValue={
                                                            values?.pivotList
                                                        }
                                                        subTextSubject="datasetName"
                                                        objectType={true}
                                                        formType={mode}
                                                        id="pivotError"
                                                    />
                                                </DefaultCard>
                                                {errors.pivotList && (
                                                    <Row>
                                                        <h4 className="text-danger mt-3 mb-0 d-flex justify-content-center">
                                                            <b>
                                                                Missing required
                                                                field for
                                                                PivotValues
                                                            </b>
                                                        </h4>
                                                    </Row>
                                                )}
                                            </div>
                                        </Col>

                                        {/* <Col xl={6} lg={6} md={6} className="mb-10">
                                    <div className="contentBox-modified">
                                        <DefaultCard
                                            className="mb-50"
                                            {...valuesCardProps}
                                        >
                                            <Field
                                                //label="Groups"
                                                name="valueList"
                                                component={CustomInputComboBox}
                                                data={columnsFiltered?.data}
                                                value="columnName"
                                                result="datasetName"
                                                text="columnAlias"
                                                isMultiple={true}
                                                defaultValue={values?.valueList}
                                                subTextSubject="datasetName"
                                                objectType={true}
                                                formType={mode}
                                            />
                                        </DefaultCard>
                                    </div>
                                </Col> */}
                                    </div>
                                    {/* <div className="row">
                                <div className="contentBox-modified">
                                    <div className="section-header-custom">
                                        <h5 className="m-10 text-white">
                                            Chart layout
                                        </h5>
                                    </div>
                                    <div className="contentBoxBody mt-20"></div>
                                    <div className="card-body">
                                        <Row>
                                            <Col md={6} className="mb-10">
                                                <InputField
                                                    label="Chart Title"
                                                    name="reportChart.chartTitle"
                                                    type="text"
                                                    placeholder="Chart Title"
                                                />
                                                <ErrorMessage fieldName="reportChart.chartTitle" />
                                            </Col>
                                            <Col md={6} className="mb-10">
                                                <InputSelect
                                                    label="show legend"
                                                    name={`reportChart.showLegend`}
                                                    value="id"
                                                    type="text"
                                                    data={[
                                                        {
                                                            id: true,
                                                            name: "Yes",
                                                        },
                                                        {
                                                            id: false,
                                                            name: "No",
                                                        },
                                                    ]}
                                                    text="name"
                                                />
                                            </Col>
                                            <Col md={6} className="mb-10">
                                                <InputSelect
                                                    label="Is Chart Included in a report ?"
                                                    name={`isIncludeChart`}
                                                    value="id"
                                                    type="text"
                                                    data={[
                                                        {
                                                            id: true,
                                                            name: "Yes",
                                                        },
                                                        {
                                                            id: false,
                                                            name: "No",
                                                        },
                                                    ]}
                                                    text="name"
                                                />
                                            </Col>
                                            <Col md={6} className="mb-10">
                                                <InputSelect
                                                    label="Chart Layout type"
                                                    name={`reportChart.layoutType`}
                                                    value="id"
                                                    type="text"
                                                    data={[
                                                        {
                                                            id: "Pie",
                                                            name: "Pie Chart",
                                                        },
                                                        {
                                                            id: "Bar",
                                                            name: "Bar Chart",
                                                        },
                                                        {
                                                            id: "Line",
                                                            name: "Line Chart",
                                                        },
                                                    ]}
                                                    text="name"
                                                />
                                            </Col>

                                            <Col
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                className="mb-10"
                                            >
                                                <div className="contentBox-modified">
                                                    <DefaultCard
                                                        className="mb-50"
                                                        {...reportValuesCardProps}
                                                    >
                                                        <Field
                                                            //label="Groups"
                                                            name={
                                                                "reportChart.valueList"
                                                            }
                                                            component={
                                                                CustomInputComboBox
                                                            }
                                                            data={
                                                                columnsFiltered?.data
                                                            }
                                                            value="columnName"
                                                            result="datasetName"
                                                            text="columnAlias"
                                                            isMultiple={false}
                                                            defaultValue={[
                                                                values
                                                                    ?.reportChart
                                                                    ?.valueList,
                                                            ]}
                                                            subTextSubject="datasetName"
                                                            objectType={true}
                                                            formType={mode}
                                                        />
                                                    </DefaultCard>
                                                </div>
                                            </Col>

                                            <Col
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                className="mb-10"
                                            >
                                                <div className="contentBox-modified">
                                                    <DefaultCard
                                                        className="mb-50"
                                                        {...reportDataCardProps}
                                                    >
                                                        <Field
                                                            //label="Groups"
                                                            name="reportChart.dataList"
                                                            component={
                                                                CustomInputComboBox
                                                            }
                                                            data={columns?.data}
                                                            value="columnName"
                                                            result="datasetName"
                                                            text="columnAlias"
                                                            isMultiple={false}
                                                            defaultValue={[
                                                                values
                                                                    ?.reportChart
                                                                    ?.dataList,
                                                            ]}
                                                            subTextSubject="datasetName"
                                                            objectType={true}
                                                            formType={mode}
                                                        />
                                                    </DefaultCard>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div> */}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )}
                <div className="contentBoxBody mt-0"></div>
                {mode == "edit" && reportType == "" && (
                    <Accordion defaultExpanded={mode == "edit"}>
                        <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            expandIcon={<ExpandMoreIcon />}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f6f5f3",
                            }}
                        >
                            <Typography
                                id="previewHeaderAnim"
                                align="center"
                                sx={{ width: "100%" }}
                            >
                                Preview Panel
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {/* <div className="contentBoxBody mt-0"></div> */}
                                <FilterPanel
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>

            <Modal
                as={Modal.Dialog}
                centered
                show={isOpen}
                onHide={closeModal}
                size="xl"
                scrollable
            >
                <Modal.Header>
                    <>
                        <Modal.Title>
                            Edit {typeName == "Group" ? "Segment" : typeName}{" "}
                            List
                        </Modal.Title>

                        <Button
                            style={{ position: "absolute", right: 0, top: 0 }}
                            variant="secondary"
                            onClick={closeModal}
                        >
                            Close
                        </Button>
                    </>
                </Modal.Header>
                <Modal.Body>
                    {typeName == "Column" && (
                        <div className="row">
                            <div className="col-4">
                                <label className="form-label p-10">
                                    Gruop by all column?
                                    <Field
                                        className="mb-10"
                                        type="checkbox"
                                        name={`isAllColumnSqlGroup`}
                                        onClick={(e) => {
                                            setFieldValue(
                                                `isAllColumnSqlGroup`,
                                                e.target.checked
                                            );
                                        }}
                                    />
                                </label>
                                {/* <InputSelect
                                    label="Gruop by all column?"
                                    name={`isAllColumnSqlGroup`}
                                    type="text"
                                    value="id"
                                    text="name"
                                    data={[
                                        {
                                            id: "true",
                                            name: "YES",
                                        },
                                        {
                                            id: "false",
                                            name: "NO",
                                        },
                                    ]}
                                /> */}
                            </div>
                        </div>
                    )}
                    <TypeWiseModal
                        values={values}
                        setFieldValue={setFieldValue}
                        reportSectionType={ReportSectionType[typeName]}
                        formType={mode}
                    />
                </Modal.Body>
            </Modal>

            <Modal
                as={Modal.Dialog}
                centered
                show={isChartOpen}
                onHide={closeChartModal}
                size="xl"
                scrollable
            >
                <Modal.Header>
                    <Modal.Title>Edit {typeChartName} List</Modal.Title>
                    <Button
                        style={{ position: "absolute", right: 0, top: 0 }}
                        variant="secondary"
                        onClick={closeChartModal}
                    >
                        Close
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <ChartWiseModal
                        values={values}
                        setFieldValue={setFieldValue}
                        reportSectionType={ReportSectionType[typeChartName]}
                    />
                </Modal.Body>
            </Modal>
            {(localStorage.getItem("moduleRole") == UserRole.DESIGNER ||
                localStorage.getItem("moduleRole") == UserRole.ADMIN) &&
                !loading &&
                localStorage.getItem("moduleId") != 32 && (
                    <Row className="footer-update">
                        <Col md={12} className="mb-10 mt-10">
                            {mode == "edit" && reportType == "" && (
                                <Button
                                    className="btn btn-info btn-updown"
                                    onClick={() => {
                                        history.push(
                                            `/portal/report/cloneReport/${values.reportId}`
                                        );
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faClone}
                                        className="me-2"
                                    />{" "}
                                    Clone Report
                                </Button>
                            )}
                            <Button
                                className="f-right btn-primary btn-updown"
                                type="submit"
                            >
                                <FontAwesomeIcon
                                    icon={faSave}
                                    className="me-2"
                                />{" "}
                                {mode == "add"
                                    ? "Submit"
                                    : reportType == ""
                                    ? "Update"
                                    : "Create"}
                            </Button>
                        </Col>
                    </Row>
                )}
        </Form>
    );
};

export default ReportForm;
