import { useEffect, useState } from "react";
import {
    faPlus,
    faPlusSquare,
    faSearch,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Row, Col } from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToastAlert } from "reducers/toastAlertSlice";
import { InputField, InputSelect } from "components/form";
import { clearState, selectApi } from "reducers/apiSlice";
import InputSelectApi from "components/form/InputSelectApi";
import { UrlBuilder } from "helpers/UrlBuilder";
import { Field, FieldArray, Form, Formik } from "formik/dist/index";
import Cookies from "js-cookie";
import "./FilterPanel.scss";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import ProgressBar from "react-topbar-progress-indicator";
import PDFLOGO from "./logo";
import jsPDF from "jspdf";
import font from "./Font";
import { Autocomplete, TextField } from "@mui/material";

// declaring filter param in a global scope for updating filter param
var filterParams = [];

const FilterPanel = ({ values, setFieldValue }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector(selectApi);
    var stringifyValues = JSON.parse(JSON.stringify(values)) || [];

    const [reportFilters, setReportFilters] = useState([]);

    const [previewData, setPreviewData] = useState([]);

    const [previewCloumnData, setPreviewColumnData] = useState([]);

    const [loader, setLoader] = useState(false);

    const [generateReportTime, setGenerateReportTime] = useState("");

    const [topValues, setTopValues] = useState("");

    const [isDistinct, setIsDistinct] = useState(false);

    const [previewFilterData, setPreviewFilterData] = useState([]);

    const [grandCalcJson, setGrandCalcJson] = useState([]);

    const [reportParams, setReportParams] = useState([]);

    const [options, setOptions] = useState([]);

    const [analyticsColumnTitleData, setAnalyticsColumnTitleData] = useState(
        []
    );
    const [tableData, setTableData] = useState([]);

    const [tableGroupBy, setTableGroupBy] = useState([]);

    const [tableColumns, setTableColumns] = useState([]);

    const [filterListLoading, setFilterListLoading] = useState(false);

    const handleInputChange = async (field) => {
        setOptions([]);
        setFilterListLoading(true);
        var multipleStatus = false;
        if (field.parentColumnName) {
            values.filterList.map((item) => {
                if (field.parentColumnName == item.columnName) {
                    multipleStatus = item?.isMultiSelect ?? false;
                }
            });
        }
        var encodedArray = field.parentColumnValue;
        if (multipleStatus) {
            var parentAsString = JSON.stringify(field.parentColumnValue);
            encodedArray = encodeURIComponent(parentAsString);
        }

        console.log(values, "sad", field.parentColumnValue);
        await fetch(
            UrlBuilder.report(
                `filter/dropdown-options?datasetName=${
                    field.datasetName
                }&columnName=${field.columnName}${
                    field.columnText ? `&columnText=${field.columnText}` : ""
                }${
                    field.parentColumnName
                        ? `&parentColumnName=${field.parentColumnName}`
                        : ""
                }${
                    field.parentColumnValue
                        ? `&parentColumnValue=${encodedArray}`
                        : ""
                }&isMultiple=${multipleStatus}&appModuleId=${
                    localStorage.getItem("moduleId") != "32"
                        ? localStorage.getItem("moduleId")
                        : values?.appModuleId
                }`
            ),
            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookies.get("access_token"),
                },
            }
        )
            .then((response) => response.json())
            .then(async (data) => {
                if (data?.status == "success" && data.data) {
                    setFilterListLoading(false);
                    setOptions(data.data);
                }
            });
    };

    useEffect(() => {
        if (reportParams && reportParams?.length > 0) {
            filterParams = reportParams;
        }
    }, [reportParams]);

    useEffect(() => {
        document.getElementById("previewDataTable")
            ? (document.getElementById("previewDataTable").style.display =
                  "none")
            : null;
        setReportParams([]);
        setReportFilters([]);
        setPreviewData([]);
        setPreviewColumnData([]);
        setFieldValue("analytics", []);
        setPreviewFilterData([]);
        filterParams = [];
        // Cleanup function
        return () => {
            document.getElementById("previewDataTable")
                ? (document.getElementById("previewDataTable").style.display =
                      "none")
                : null;
            setReportParams([]);
            setReportFilters([]);
            setPreviewData([]);
            setPreviewColumnData([]);
            setPreviewFilterData([]);
            setFieldValue("analytics", []);
        };
    }, [values?.reportId]);

    const handleSubmit = async (e) => {
        let removeNullFromFilter = reportFilters.filter((item) => item);
        var arrayAsString = JSON.stringify(removeNullFromFilter);
        var encodedArray = encodeURIComponent(arrayAsString);

        let numberOfIsRequired = stringifyValues?.filterList.filter(
            (item) => item?.isRequired
        );

        let isRequiredCheck = numberOfIsRequired.map((item) => {
            let found = false;
            if (item.isMultiSelect) {
                removeNullFromFilter.map((filterItem) => {
                    if (
                        filterItem?.DRB_REPORT_DATASET_FILTER_ID ==
                            item.drbReportDatasetFilterId &&
                        filterItem?.FILTER_VALUE.length > 0
                    ) {
                        found = true;
                    }
                });
            } else {
                removeNullFromFilter.map((filterItem) => {
                    if (
                        filterItem?.DRB_REPORT_DATASET_FILTER_ID ==
                            item.drbReportDatasetFilterId &&
                        filterItem?.FILTER_VALUE
                    ) {
                        found = true;
                    }
                });
            }
            return found ? null : `${item?.columnName} is required`;
        });
        let msg = isRequiredCheck.filter((item) => item);

        setPreviewData([]);
        setPreviewColumnData([]);
        setLoader(true);
        setFieldValue("analytics", []);

        document.getElementById("previewDataTable")
            ? (document.getElementById("previewDataTable").style.display =
                  "none")
            : null;
        if (msg.length > 0 && document.getElementById("previewDataTable")) {
            document.getElementById("previewDataTable").style.display = "flex";

            document.getElementById("previewDataTable").style.justifyContent =
                "center";
            document.getElementById("previewDataTable").style.color = "red";

            document.getElementById("previewDataTable").innerHTML = msg[0];
            setLoader(false);
        } else {
            await fetch(
                UrlBuilder.report(
                    `report/execute?userId=1&reportId=${
                        values?.reportId
                    }&reportFilters=${encodedArray}&reportTopRecord=${topValues}&isDistinct=${isDistinct}&appModuleId=${
                        localStorage.getItem("moduleId") != "32"
                            ? localStorage.getItem("moduleId")
                            : values?.appModuleId
                    }`
                ),

                {
                    //mode: "no-cors",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + Cookies.get("access_token"),
                    },
                }
            )
                .then((response) => response.json())
                .then(async (data) => {
                    if (data?.status == "success" && data.data) {
                        setPreviewData(data.data);
                        var res = Object.keys(data.data[0]);

                        var columnsGrandCalcJson = data.grand_calc_json;

                        var filterParams = data.filter_json ?? [];

                        var reportParams =
                            filterParams.length > 0 &&
                            filterParams.map((item, index) => {
                                var newObj = {};
                                newObj[item.PARAM_KEY] = item.PARAM_VALUE;
                                return newObj;
                            });

                        setReportParams(reportParams);

                        setGrandCalcJson(columnsGrandCalcJson);

                        var calcEnable = false;

                        for (var key of columnsGrandCalcJson) {
                            if (key["COLUMN_GRAND_CALC_TYPE"]) {
                                calcEnable = true;
                            }
                        }

                        var groupBy = [];

                        for (var key of columnsGrandCalcJson) {
                            if (
                                key["REPORT_GROUPING"] &&
                                key["VISIBLE"] == true
                            ) {
                                groupBy.push(key["REPORT_GROUPING"]);
                            }
                        }
                        setLoader(false);

                        setGenerateReportTime(data.executed_at);

                        let columnsTitle = res.map((item, index) => {
                            var setVisible;
                            var setBottomClac;
                            var setPrecision;
                            var setAlign;
                            var megredHeader;
                            var dataType;

                            columnsGrandCalcJson.filter((colItem, colIndex) => {
                                if (colItem.COLUMN_NAME == item) {
                                    setVisible = colItem.REPORT_GROUPING
                                        ? false
                                        : colItem.VISIBLE ?? true;

                                    setBottomClac =
                                        colItem.COLUMN_GRAND_CALC_TYPE;

                                    setPrecision = colItem.COLUMN_PRECISION;

                                    setAlign = colItem.hozAlign;

                                    megredHeader = colItem.MERGED_COLUMN_NAME;

                                    dataType = colItem.DATA_TYPE;
                                }
                            });

                            return calcEnable
                                ? {
                                      field: item.replace(/\./g, ""),
                                      title: item,
                                      formatterParams: {
                                          precision: setPrecision,
                                      },
                                      resizable: true,

                                      visible: setVisible,

                                      bottomCalc: setBottomClac,

                                      bottomCalcParams: {
                                          precision: setPrecision,
                                      },

                                      bottomCalcFormatter: "plaintext",

                                      hozAlign: setAlign ?? undefined,

                                      megredHeader: megredHeader ?? undefined,

                                      dataType: dataType ?? undefined,
                                  }
                                : {
                                      field: item.replace(/\./g, ""),
                                      title: item,
                                      resizable: true,
                                      visible: setVisible,
                                      bottomCalcFormatter: "plaintext",
                                      hozAlign: setAlign ?? undefined,
                                      megredHeader: megredHeader ?? undefined,
                                      dataType: dataType ?? undefined,
                                  };
                        });
                        var result = [];
                        columnsTitle.forEach((entry) => {
                            // If entry has PARENT_COLUMN property
                            if (entry?.megredHeader) {
                                // Check if a column group with the title already exists in result
                                const columnGroupIndex = result.findIndex(
                                    (group) =>
                                        group?.title === entry?.megredHeader
                                );

                                // If column group doesn't exist, create a new one
                                if (columnGroupIndex === -1) {
                                    result.push({
                                        title: entry?.megredHeader,
                                        columns: [],
                                    });
                                    result[result.length - 1].columns.push({
                                        ...entry,
                                    });
                                } else {
                                    result[columnGroupIndex].columns.push({
                                        ...entry,
                                    });
                                }
                            } else {
                                result.push({ ...entry });
                            }
                        });

                        setPreviewColumnData(columnsTitle);

                        let visibleColumnTitle = columnsTitle.filter((item) => {
                            if (
                                item.visible &&
                                (item.dataType == "TINYINT".toLowerCase() ||
                                    item.dataType == "SMALLINT".toLowerCase() ||
                                    item.dataType ==
                                        "MEDIUMINT".toLowerCase() ||
                                    item.dataType == "INT".toLowerCase() ||
                                    item.dataType == "INTEGER".toLowerCase() ||
                                    item.dataType == "BIGINT".toLowerCase() ||
                                    item.dataType == "FLOAT".toLowerCase() ||
                                    item.dataType == "DOUBLE".toLowerCase() ||
                                    item.dataType == "DECIMAL".toLowerCase() ||
                                    item.dataType == "DEC".toLowerCase() ||
                                    item.dataType ==
                                        "DOUBLE PRECISION".toLowerCase())
                            )
                                return item;
                        });
                        //for analytics list
                        setAnalyticsColumnTitleData(visibleColumnTitle);

                        function removeDotsFromKeys(obj) {
                            const newObj = {};
                            for (const key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    const newKey = key.replace(/\./g, ""); // Remove dots from the key
                                    newObj[newKey] = obj[key];
                                }
                            }
                            return newObj;
                        }

                        // Apply the function to each object in the array
                        const columnsData = data.data.map(removeDotsFromKeys);

                        document.getElementById("previewDataTable")
                            ? (document.getElementById(
                                  "previewDataTable"
                              ).style.display = "block")
                            : null;

                        setTableData(columnsData);
                        setTableGroupBy(groupBy);
                        setTableColumns(result);

                        // Create Tabulator
                        var table = new Tabulator("#previewDataTable", {
                            data: columnsData ?? [],
                            height: 600,
                            //layout: "fitColumns",
                            layout: "fitDataFill",
                            layoutColumnsOnNewData: true,
                            //resizableColumnFit: true,
                            columns: result,
                            responsiveLayout: false,
                            groupBy: groupBy.length > 0 ? groupBy : "",
                            columnCalcs: "both",
                            movableColumns: true,

                            groupHeaderDownload: function (
                                value,
                                count,
                                data,
                                group
                            ) {
                                return value + " (" + count + " items)";
                            },
                        });
                        window.addEventListener("resize", function () {
                            document.getElementById("previewDataTable")
                                ? (document.getElementById(
                                      "previewDataTable"
                                  ).style.display = "block")
                                : null;
                            table.redraw(true);
                        });
                        return table;
                    } else {
                        if (document.getElementById("previewDataTable")) {
                            document.getElementById(
                                "previewDataTable"
                            ).style.display = "flex";

                            document.getElementById(
                                "previewDataTable"
                            ).style.justifyContent = "center";

                            document.getElementById(
                                "previewDataTable"
                            ).style.color = "red";

                            document.getElementById("previewDataTable")
                                ? (document.getElementById(
                                      "previewDataTable"
                                  ).innerHTML = "DATA NOT FOUND")
                                : null;
                        }
                        setLoader(false);
                    }
                })
                .then((table) => {
                    const formatDate = (date) => {
                        // Get individual components
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        let hours = date.getHours();
                        const minutes = String(date.getMinutes()).padStart(
                            2,
                            "0"
                        );
                        const seconds = String(date.getSeconds()).padStart(
                            2,
                            "0"
                        );
                        const ampm = hours >= 12 ? "pm" : "am";

                        // Convert to 12-hour format
                        hours = hours % 12;
                        hours = hours ? hours : 12; // If hours is 0, set it to 12

                        // Create the formatted date string
                        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;

                        return formattedDate;
                    };

                    const generateCleanPdf = (reportTitle) => {
                        const paramArray = filterParams;
                        let rowCount = paramArray.length;
                        //let topPos = rowCount * 5 + 20;
                        let topPos = Math.abs(rowCount / 2) * 5 + 30;
                        const doc = new jsPDF();

                        table.download(
                            "pdf",
                            `${reportTitle}-${new Date().getTime()}.pdf`,

                            {
                                showHead: "firstPage",
                                showFoot: "lastPage",
                                jsPDF: {
                                    orientation: values?.reportOrientation,
                                    unit: "mm",
                                    format: values?.reportPageSize,
                                },

                                autoTable: function (doc) {
                                    doc.addFileToVFS(
                                        "NotoSans-normal.ttf",
                                        font
                                    );
                                    doc.addFont(
                                        "NotoSans-normal.ttf",
                                        "NotoSans",
                                        "normal",
                                        "Unicode"
                                    );
                                    doc.setFont("NotoSans", "Unicodenormal");
                                    return {
                                        styles: {
                                            font: "NotoSans",
                                            fontStyle: "Unicodenormal",
                                        },
                                        columnStyles: {
                                            //id: {fillColor: 255}
                                        },
                                        margin: { top: topPos },
                                        didDrawPage: function (data) {
                                            if (data.pageNumber > 0) {
                                                data.settings.margin.top = 10;
                                            }
                                        },
                                        didParseCell: function (data) {
                                            data.cell.styles.cellPadding = 1;
                                        },

                                        headStyles: {
                                            halign: "center",
                                        },
                                        footStyles: {
                                            halign: "left",
                                        },
                                        theme: "grid",
                                        tableWidth: "auto",
                                        columnWidth: "wrap",
                                        showHead: "everyPage",
                                        tableLineColor: 200,
                                        tableLineWidth: 0,
                                        pageBreak: "auto",
                                        rowPageBreak: "avoid",
                                    };
                                },

                                documentProcessing: function (doc) {
                                    // doc = new jsPDF();
                                    const currentDate = new Date();
                                    const formattedDate =
                                        formatDate(currentDate);

                                    // Add parameters, page number, and date to the footer
                                    const pageCount =
                                        doc.internal.getNumberOfPages();

                                    var splitTitle = doc.splitTextToSize(
                                        reportTitle,
                                        180
                                    );
                                    for (let i = 1; i <= pageCount; i++) {
                                        doc.setPage(i);
                                        if (i == 1) {
                                            doc.setFontSize(14);
                                            doc.setFont(
                                                "NotoSans",
                                                "Unicodenormal"
                                            );
                                            doc.text(splitTitle, 15, 10);

                                            doc.addImage(
                                                PDFLOGO,
                                                "png",
                                                doc.internal.pageSize.width -
                                                    35,
                                                5,
                                                14,
                                                14
                                            );

                                            // Add parameters below the title

                                            doc.setFontSize(10);
                                            doc.setFont(
                                                "NotoSans",
                                                "Unicodenormal"
                                            );

                                            let paramHeight = 25;
                                            let n = 1;

                                            paramArray.forEach(function (
                                                paramObject
                                            ) {
                                                for (let key in paramObject) {
                                                    if (
                                                        paramObject.hasOwnProperty(
                                                            key
                                                        )
                                                    ) {
                                                        const value =
                                                            paramObject[key];
                                                        //doc.text(`${key}: ${value}`, 15, paramHeight);
                                                        if (n % 2 == 0) {
                                                            // doc.setFont(
                                                            //     "helvetica",
                                                            //     "bold"
                                                            // );
                                                            doc.setFont(
                                                                "NotoSans",
                                                                "Unicodenormal"
                                                            );
                                                            doc.text(
                                                                `${key}: `,
                                                                (doc.internal.pageSize.getWidth() +
                                                                    15) /
                                                                    2,
                                                                paramHeight
                                                            );
                                                            // doc.setFont(
                                                            //     "helvetica",
                                                            //     "normal"
                                                            // );
                                                            doc.setFont(
                                                                "NotoSans",
                                                                "Unicodenormal"
                                                            );
                                                            doc.text(
                                                                ` ${value}`,
                                                                (doc.internal.pageSize.getWidth() +
                                                                    15) /
                                                                    2 +
                                                                    2 +
                                                                    doc.getTextWidth(
                                                                        `${key}: `
                                                                    ),
                                                                paramHeight
                                                            );
                                                            paramHeight += 10;
                                                        } else {
                                                            //paramHeight=paramHeight-10;
                                                            // doc.setFont(
                                                            //     "helvetica",
                                                            //     "bold"
                                                            // );
                                                            doc.setFont(
                                                                "NotoSans",
                                                                "Unicodenormal"
                                                            );
                                                            doc.text(
                                                                `${key}: `,
                                                                15,
                                                                paramHeight
                                                            );
                                                            // doc.setFont(
                                                            //     "helvetica",
                                                            //     "normal"
                                                            // );
                                                            doc.setFont(
                                                                "NotoSans",
                                                                "Unicodenormal"
                                                            );
                                                            doc.text(
                                                                ` ${value}`,
                                                                15 +
                                                                    2 +
                                                                    doc.getTextWidth(
                                                                        `${key}: `
                                                                    ),
                                                                paramHeight
                                                            );
                                                            paramHeight += 5;
                                                        }
                                                        n++;
                                                    }
                                                    paramHeight =
                                                        paramHeight - 5;
                                                }
                                            });
                                        }

                                        doc.setFontSize(8);
                                        doc.setFont("helvetica", "bold");
                                        // doc.setFont(
                                        //     "NotoSans",
                                        //     "Unicodenormal"
                                        // );

                                        var pageWidth =
                                            doc.internal.pageSize.width ||
                                            doc.internal.pageSize.getWidth();

                                        doc.text(
                                            `Report Id: ${values.reportId}`,
                                            pageWidth / 2,
                                            doc.internal.pageSize.height - 10,
                                            "center"
                                        );

                                        doc.text(
                                            `Page ${i} of ${pageCount}`,
                                            doc.internal.pageSize.width - 14,
                                            doc.internal.pageSize.height - 10,
                                            { align: "right" }
                                        );

                                        doc.text(
                                            "Date: " + formattedDate,
                                            15,
                                            doc.internal.pageSize.height - 10
                                        );
                                    }

                                    return doc;
                                },
                            }
                        );
                    };

                    if (table) {
                        document
                            .getElementById("download-csv")
                            .addEventListener("click", function (e) {
                                e.preventDefault();
                                table.download(
                                    "csv",
                                    `${
                                        values?.reportTitle
                                    }-${new Date().getTime()}.csv`,
                                    { bom: true }
                                );
                            });

                        document
                            .getElementById("download-pdf")
                            .addEventListener("click", (e) => {
                                e.preventDefault();
                                generateCleanPdf(values?.reportTitle);
                            });

                        document
                            .getElementById("download-xlsx")
                            .addEventListener("click", function (e) {
                                //table.download("xlsx", "data.xlsx", {sheetName:"DRB_DATA"});
                                e.preventDefault();
                                table.download(
                                    "xlsx",
                                    `${
                                        values?.reportTitle
                                    }-${new Date().getTime()}.xlsx`,
                                    { sheetName: "tabledatabig" }
                                );
                            });
                    }
                })

                .catch((error) => {
                    setPreviewData([]);
                    setPreviewColumnData([]);
                    setLoader(false);
                    throw error;
                });
        }
    };

    return (
        <>
            <h2 className="m-10 text-black text-center">
                <b>{values?.reportTitle}</b>
                <hr />
            </h2>
            <Card.Body>
                {/* <Row>Filter Panel</Row> */}

                <Form>
                    <Row>
                        {values.filterList.map((field, index) => {
                            var myField = field.controlType;
                            console.log(reportFilters, "sad", field);
                            switch (myField) {
                                case "1": //dropdown
                                    if (field.isMultiSelect) {
                                        return (
                                            <Col md={4} className="mt-20">
                                                <Autocomplete
                                                    key={`${field?.datasetName}${values.reportId}${field.columnName}`}
                                                    noOptionsText=""
                                                    loading={
                                                        filterListLoading
                                                            ? true
                                                            : false
                                                    }
                                                    loadingText="Loading..."
                                                    id="tags-standard"
                                                    options={options}
                                                    getOptionLabel={(option) =>
                                                        option.name ?? ""
                                                    }
                                                    onChange={(
                                                        event,
                                                        value
                                                    ) => {
                                                        reportFilters[index] = {
                                                            DRB_REPORT_DATASET_FILTER_ID:
                                                                field?.drbReportDatasetFilterId,
                                                            FILTER_VALUE: value,
                                                        };
                                                        previewFilterData[
                                                            index
                                                        ] = {
                                                            [field?.columnName]:
                                                                value,
                                                        };

                                                        values.filterList.map(
                                                            (item, idx) => {
                                                                if (
                                                                    item.parentColumnName ==
                                                                    field.columnName
                                                                ) {
                                                                    setFieldValue(
                                                                        `filterList.${idx}.parentColumnValue`,
                                                                        value
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }}
                                                    multiple
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => {
                                                        return (
                                                            option?.id ==
                                                            value?.id
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            onClick={(ev) => {
                                                                if (
                                                                    ev.target
                                                                        .value !==
                                                                        "" ||
                                                                    ev.target
                                                                        .value !==
                                                                        null
                                                                ) {
                                                                    handleInputChange(
                                                                        field
                                                                    );
                                                                }
                                                            }}
                                                            {...params}
                                                            //variant="standard"
                                                            required={
                                                                field?.isRequired
                                                            }
                                                            label={`${
                                                                field?.columnAlias
                                                                    ? field?.columnAlias
                                                                    : columnAliasfield.columnName.replace(
                                                                          /_/g,
                                                                          " "
                                                                      )
                                                            }`}
                                                            placeholder={`${
                                                                field?.columnAlias
                                                                    ? field?.columnAlias
                                                                    : columnAliasfield.columnName.replace(
                                                                          /_/g,
                                                                          " "
                                                                      )
                                                            }`}
                                                        />
                                                    )}
                                                />
                                            </Col>
                                        );
                                    } else {
                                        // var parentAsString = JSON.stringify(
                                        //     field.parentColumnValue
                                        // );
                                        // var encodedArray =
                                        //     encodeURIComponent(parentAsString);

                                        var multipleStatus = false;
                                        if (field.parentColumnName) {
                                            values.filterList.map((item) => {
                                                if (
                                                    field.parentColumnName ==
                                                    item.columnName
                                                ) {
                                                    multipleStatus =
                                                        item?.isMultiSelect ??
                                                        false;
                                                }
                                            });
                                        }

                                        var encodedArray =
                                            field.parentColumnValue;
                                        if (multipleStatus) {
                                            var parentAsString = JSON.stringify(
                                                field.parentColumnValue
                                            );
                                            encodedArray =
                                                encodeURIComponent(
                                                    parentAsString
                                                );
                                        }

                                        return (
                                            <Col md={4} className="mb-10">
                                                <InputSelectApi
                                                    label={`${
                                                        field?.columnAlias
                                                            ? field?.columnAlias
                                                            : columnAliasfield.columnName.replace(
                                                                  /_/g,
                                                                  " "
                                                              )
                                                    }`}
                                                    name={`DRB_REPORT_DATASET.${index}`}
                                                    operationId={UrlBuilder.report(
                                                        `filter/dropdown-options?datasetName=${
                                                            field.datasetName
                                                        }&columnName=${
                                                            field.columnName
                                                        }${
                                                            field.columnText
                                                                ? `&columnText=${field.columnText}`
                                                                : ""
                                                        }${
                                                            field.parentColumnName
                                                                ? `&parentColumnName=${field.parentColumnName}`
                                                                : ""
                                                        }${
                                                            field.parentColumnValue
                                                                ? `&parentColumnValue=${encodedArray}`
                                                                : ""
                                                        }&isMultiple=${multipleStatus}&appModuleId=${
                                                            localStorage.getItem(
                                                                "moduleId"
                                                            ) != "32"
                                                                ? localStorage.getItem(
                                                                      "moduleId"
                                                                  )
                                                                : values?.appModuleId
                                                        }`
                                                    )}
                                                    storeName={`${field?.datasetName}${values.reportId}${field.columnName}`}
                                                    text="name"
                                                    value="id"
                                                    type="text"
                                                    required={field?.isRequired}
                                                    onChange={(e) => {
                                                        reportFilters[index] = {
                                                            DRB_REPORT_DATASET_FILTER_ID:
                                                                field?.drbReportDatasetFilterId,
                                                            FILTER_VALUE:
                                                                e.target.value,
                                                        };
                                                        previewFilterData[
                                                            index
                                                        ] = {
                                                            [field?.columnName]:
                                                                e.target.value,
                                                        };

                                                        values.filterList.map(
                                                            (item, idx) => {
                                                                if (
                                                                    item.parentColumnName ==
                                                                    field.columnName
                                                                ) {
                                                                    setFieldValue(
                                                                        `filterList.${idx}.parentColumnValue`,
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }}
                                                />
                                            </Col>
                                        );
                                    }

                                case "2": //input field
                                    return (
                                        <Col md={4} className="mb-10">
                                            <InputField
                                                label={`${
                                                    field?.columnAlias
                                                        ? field?.columnAlias
                                                        : columnAliasfield.columnName.replace(
                                                              /_/g,
                                                              " "
                                                          )
                                                }`}
                                                name={`DRB_REPORT_DATASET.${index}`}
                                                type="text"
                                                placeholder={`Enter ${field.columnName.replace(
                                                    /_/g,
                                                    " "
                                                )}`}
                                                required={field?.isRequired}
                                                onChange={(e) => {
                                                    reportFilters[index] = {
                                                        DRB_REPORT_DATASET_FILTER_ID:
                                                            field?.drbReportDatasetFilterId,
                                                        FILTER_VALUE:
                                                            e.target.value,
                                                    };
                                                    previewFilterData[index] = {
                                                        [field?.columnName]:
                                                            e.target.value,
                                                    };
                                                }}
                                            />
                                        </Col>
                                    );

                                case "3": // calender
                                    return (
                                        <Col md={4} className="mb-10">
                                            <InputField
                                                label={`${
                                                    field?.columnAlias
                                                        ? field?.columnAlias
                                                        : columnAliasfield.columnName.replace(
                                                              /_/g,
                                                              " "
                                                          )
                                                }`}
                                                required={field?.isRequired}
                                                name={`DRB_REPORT_DATASET.${index}`}
                                                type="date"
                                                placeholder={`Enter ${field.label}`}
                                                onChange={(e) => {
                                                    reportFilters[index] = {
                                                        DRB_REPORT_DATASET_FILTER_ID:
                                                            field?.drbReportDatasetFilterId,
                                                        FILTER_VALUE:
                                                            e.target.value,
                                                    };
                                                    previewFilterData[index] = {
                                                        [field?.columnName]:
                                                            e.target.value,
                                                    };
                                                }}
                                            />
                                        </Col>
                                    );

                                case "4": //number range
                                    return (
                                        <>
                                            <Col md={4} className="mb-10">
                                                <InputField
                                                    //label={`${field.label}`}
                                                    label={`${
                                                        field?.columnAlias
                                                            ? `From ${field?.columnAlias}`
                                                            : `From ${field.columnName.replace(
                                                                  /_/g,
                                                                  " "
                                                              )}`
                                                    }`}
                                                    name={`DRB_REPORT_DATASET.${index}`}
                                                    type="text"
                                                    required={field?.isRequired}
                                                    placeholder={`Enter From Number`}
                                                    onChange={(e) => {
                                                        reportFilters[index] = {
                                                            ...reportFilters[
                                                                index
                                                            ],
                                                            DRB_REPORT_DATASET_FILTER_ID:
                                                                field?.drbReportDatasetFilterId,
                                                            FILTER_VALUE:
                                                                e.target.value,
                                                        };
                                                        previewFilterData[
                                                            index
                                                        ] = {
                                                            ...previewFilterData[
                                                                index
                                                            ],
                                                            [field?.columnName]:
                                                                e.target.value,
                                                        };
                                                    }}
                                                />
                                            </Col>
                                            <Col md={4} className="mb-10">
                                                <InputField
                                                    //label={`${field.label}`}
                                                    label={`${
                                                        field?.columnAlias
                                                            ? `To ${field?.columnAlias}`
                                                            : `To ${field.columnName.replace(
                                                                  /_/g,
                                                                  " "
                                                              )}`
                                                    }`}
                                                    name={`DRB_REPORT_DATASET.${index}`}
                                                    type="number"
                                                    placeholder={`Enter To Number`}
                                                    required={field?.isRequired}
                                                    onChange={(e) => {
                                                        reportFilters[index] = {
                                                            ...reportFilters[
                                                                index
                                                            ],
                                                            DRB_REPORT_DATASET_FILTER_ID:
                                                                field?.drbReportDatasetFilterId,
                                                            FILTER_VALUE_TO:
                                                                e.target.value,
                                                        };
                                                        previewFilterData[
                                                            index
                                                        ] = {
                                                            ...previewFilterData[
                                                                index
                                                            ],
                                                            [field?.columnName]:
                                                                e.target.value,
                                                        };
                                                    }}
                                                />
                                            </Col>
                                        </>
                                    );

                                case "5": // date range
                                    return (
                                        <>
                                            <Col md={4} className="mb-10">
                                                <InputField
                                                    //label={`${field.label}`}
                                                    label={`${
                                                        field?.columnAlias
                                                            ? `From ${field?.columnAlias}`
                                                            : `From ${field.columnName.replace(
                                                                  /_/g,
                                                                  " "
                                                              )}`
                                                    }`}
                                                    name={`DRB_REPORT_DATASET.${index}`}
                                                    type="date"
                                                    placeholder={`Enter From Date`}
                                                    required={field?.isRequired}
                                                    onChange={(e) => {
                                                        reportFilters[index] = {
                                                            ...reportFilters[
                                                                index
                                                            ],
                                                            DRB_REPORT_DATASET_FILTER_ID:
                                                                field?.drbReportDatasetFilterId,
                                                            FILTER_VALUE:
                                                                e.target.value,
                                                        };
                                                        previewFilterData[
                                                            index
                                                        ] = {
                                                            ...previewFilterData[
                                                                index
                                                            ],
                                                            [field?.columnName]:
                                                                e.target.value,
                                                        };
                                                    }}
                                                />
                                            </Col>
                                            <Col
                                                md={4}
                                                className="mb-10 maxw33"
                                            >
                                                <InputField
                                                    label={`${
                                                        field?.columnAlias
                                                            ? `To ${field?.columnAlias}`
                                                            : `To ${field.columnName.replace(
                                                                  /_/g,
                                                                  " "
                                                              )}`
                                                    }`}
                                                    name={`DRB_REPORT_DATASET.${index}`}
                                                    type="date"
                                                    placeholder={`Enter To Date`}
                                                    required={field?.isRequired}
                                                    onChange={(e) => {
                                                        reportFilters[index] = {
                                                            ...reportFilters[
                                                                index
                                                            ],
                                                            DRB_REPORT_DATASET_FILTER_ID:
                                                                field?.drbReportDatasetFilterId,
                                                            FILTER_VALUE_TO:
                                                                e.target.value,
                                                        };
                                                        previewFilterData[
                                                            index
                                                        ] = {
                                                            ...previewFilterData[
                                                                index
                                                            ],
                                                            [field?.columnName]:
                                                                e.target.value,
                                                        };
                                                    }}
                                                />
                                            </Col>
                                        </>
                                    );

                                default:
                            }
                        })}

                        <>
                            <Col
                                md={4}
                                className="mb-10 maxw33"
                                style={{
                                    justifyContent: "center",
                                    display: "flex",
                                }}
                            >
                                <label className="form-label p-10 mb-3 mt30a">
                                    Distinct?
                                    <Field
                                        className="mb-10"
                                        type="checkbox"
                                        name="isDistinct"
                                        onClick={(e) => {
                                            setIsDistinct(e.target.checked);
                                        }}
                                    />
                                </label>
                            </Col>
                            <Col
                                md={4}
                                className="mb-10 maxw33"
                                style={{
                                    justifyContent: "center",
                                    display: "flex",
                                }}
                            >
                                <label className="form-label p-10 mb-3 mt30a">
                                    Top Record?
                                    <Field
                                        className="mb-10"
                                        type="checkbox"
                                        name="isTopRecord"
                                        onClick={(e) => {
                                            if (!e.target.checked) {
                                                setTopValues("");
                                            }
                                        }}
                                    />
                                </label>
                            </Col>
                            {values.isTopRecord && (
                                <Col md={4} className="mb-10">
                                    <InputField
                                        label="Number of Top Record"
                                        name={`topRecord`}
                                        type="number"
                                        placeholder={`Enter Number of Top Record`}
                                        onChange={(e) => {
                                            setTopValues(e.target.value);
                                        }}
                                    />
                                </Col>
                            )}

                            <Col md={12} className="mb-10 mt-10 bg-search">
                                <Button
                                    className="btn-primary btn-updown"
                                    onClick={() => handleSubmit()}
                                    disabled={loading ? true : false}
                                >
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="me-20"
                                    />
                                    Search
                                </Button>
                            </Col>

                            {localStorage.getItem("moduleId") == 32 && //need to sift at env -- 32 means one stop
                                previewCloumnData &&
                                previewCloumnData.length > 0 && (
                                    <Col md={12} className="">
                                        <Col md={12} className="mb-12">
                                            <div className="row">
                                                <FieldArray
                                                    name="analytics"
                                                    render={(arrayHelpers) => (
                                                        <div className="contentBox-modified">
                                                            <div className="row">
                                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 p-5 border-bottom-cus mb-5">
                                                                    <Button
                                                                        onClick={(
                                                                            count
                                                                        ) => {
                                                                            arrayHelpers.push(
                                                                                {
                                                                                    columnName:
                                                                                        "",
                                                                                    change: "",
                                                                                    type: "",
                                                                                    value: "",
                                                                                }
                                                                            );
                                                                        }}
                                                                        variant="info"
                                                                        className="f-right mt-5  btn-add"
                                                                        type="button"
                                                                    >
                                                                        <span className="icon-add">
                                                                            {" "}
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faPlus
                                                                                }
                                                                                className="me-0"
                                                                            />
                                                                        </span>
                                                                        <span>
                                                                            Add
                                                                            New
                                                                        </span>
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <Col
                                                                md={12}
                                                                className="mb-10"
                                                            >
                                                                <div className="table-responsive mt-5">
                                                                    <table className="table table-bordered table-custom">
                                                                        <thead>
                                                                            <tr className="text-center">
                                                                                <th className="wd-100">
                                                                                    #
                                                                                </th>
                                                                                <th className="wd-300">
                                                                                    Column
                                                                                    Name
                                                                                </th>
                                                                                <th className="wd-300">
                                                                                    Inc
                                                                                    or
                                                                                    Desc
                                                                                </th>

                                                                                <th className="wd-300">
                                                                                    Value
                                                                                </th>
                                                                                <th className="wd-300">
                                                                                    Type
                                                                                </th>

                                                                                <th
                                                                                    style={{
                                                                                        width: "30px",
                                                                                    }}
                                                                                >
                                                                                    Remove
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {values.analytics &&
                                                                            values
                                                                                .analytics
                                                                                .length >
                                                                                0 ? (
                                                                                values.analytics.map(
                                                                                    (
                                                                                        item,
                                                                                        index
                                                                                    ) => (
                                                                                        <tr
                                                                                            key={
                                                                                                item +
                                                                                                index
                                                                                            }
                                                                                        >
                                                                                            <td>
                                                                                                {index +
                                                                                                    1}
                                                                                            </td>
                                                                                            <td>
                                                                                                <InputSelect
                                                                                                    name={`analytics[${index}].columnName`}
                                                                                                    type="text"
                                                                                                    value="field"
                                                                                                    text="title"
                                                                                                    data={
                                                                                                        analyticsColumnTitleData
                                                                                                    }
                                                                                                />
                                                                                            </td>
                                                                                            <td>
                                                                                                <InputSelect
                                                                                                    name={`analytics[${index}].change`}
                                                                                                    value="id"
                                                                                                    type="text"
                                                                                                    data={[
                                                                                                        {
                                                                                                            id: "increase",
                                                                                                            name: "increase",
                                                                                                        },
                                                                                                        {
                                                                                                            id: "decrease",
                                                                                                            name: "decrease",
                                                                                                        },
                                                                                                    ]}
                                                                                                    text="name"
                                                                                                />
                                                                                            </td>

                                                                                            <td>
                                                                                                <InputField
                                                                                                    name={`analytics[${index}].value`}
                                                                                                    type="text"
                                                                                                    placeholder="Enter Value"
                                                                                                />
                                                                                            </td>
                                                                                            <td>
                                                                                                <InputSelect
                                                                                                    name={`analytics[${index}].type`}
                                                                                                    value="id"
                                                                                                    type="text"
                                                                                                    data={[
                                                                                                        {
                                                                                                            id: "fixed",
                                                                                                            name: "fixed",
                                                                                                        },
                                                                                                        {
                                                                                                            id: "percentage",
                                                                                                            name: "percentage",
                                                                                                        },
                                                                                                    ]}
                                                                                                    text="name"
                                                                                                />
                                                                                            </td>

                                                                                            <td>
                                                                                                {index >=
                                                                                                    0 && (
                                                                                                    <Button
                                                                                                        variant="danger"
                                                                                                        className="i-size mt-5 mb-5"
                                                                                                        type="button"
                                                                                                        onClick={(
                                                                                                            e
                                                                                                        ) => {
                                                                                                            swal(
                                                                                                                {
                                                                                                                    title: "Are you sure you want to delete?",
                                                                                                                    icon: "warning",
                                                                                                                    buttons: true,
                                                                                                                    dangerMode: true,
                                                                                                                }
                                                                                                            ).then(
                                                                                                                (
                                                                                                                    willDelete
                                                                                                                ) => {
                                                                                                                    willDelete &&
                                                                                                                        arrayHelpers.remove(
                                                                                                                            index
                                                                                                                        );
                                                                                                                }
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        <FontAwesomeIcon
                                                                                                            icon={
                                                                                                                faTrashAlt
                                                                                                            }
                                                                                                            className="text-white me-0"
                                                                                                        />
                                                                                                    </Button>
                                                                                                )}
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                )
                                                                            ) : (
                                                                                <tr>
                                                                                    <td
                                                                                        className="text-center"
                                                                                        colSpan={
                                                                                            6
                                                                                        }
                                                                                    >
                                                                                        No
                                                                                        Data
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                    {localStorage.getItem(
                                                                        "moduleId"
                                                                    ) == 32 &&
                                                                        values
                                                                            .analytics
                                                                            .length >
                                                                            0 && (
                                                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 p-5 border-bottom-cus mb-5">
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        const newData =
                                                                                            tableData.map(
                                                                                                (
                                                                                                    entry
                                                                                                ) => {
                                                                                                    const modifiedEntry =
                                                                                                        {
                                                                                                            ...entry,
                                                                                                        };

                                                                                                    values.analytics.forEach(
                                                                                                        (
                                                                                                            item
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                modifiedEntry.hasOwnProperty(
                                                                                                                    item.columnName
                                                                                                                )
                                                                                                            ) {
                                                                                                                // Check if the entry has the column specified in the changes
                                                                                                                const originalValue =
                                                                                                                    parseFloat(
                                                                                                                        modifiedEntry[
                                                                                                                            item
                                                                                                                                .columnName
                                                                                                                        ]
                                                                                                                    );
                                                                                                                const changeValue =
                                                                                                                    parseFloat(
                                                                                                                        item.value
                                                                                                                    );

                                                                                                                // Check the type of change
                                                                                                                if (
                                                                                                                    item.change ===
                                                                                                                        "increase" &&
                                                                                                                    item.type ===
                                                                                                                        "fixed"
                                                                                                                ) {
                                                                                                                    modifiedEntry[
                                                                                                                        item.columnName
                                                                                                                    ] =
                                                                                                                        originalValue +
                                                                                                                        changeValue;
                                                                                                                } else if (
                                                                                                                    item.change ===
                                                                                                                        "decrease" &&
                                                                                                                    item.type ===
                                                                                                                        "fixed"
                                                                                                                ) {
                                                                                                                    modifiedEntry[
                                                                                                                        item.columnName
                                                                                                                    ] =
                                                                                                                        originalValue -
                                                                                                                        changeValue;
                                                                                                                } else if (
                                                                                                                    item.change ===
                                                                                                                        "increase" &&
                                                                                                                    item.type ===
                                                                                                                        "percentage"
                                                                                                                ) {
                                                                                                                    modifiedEntry[
                                                                                                                        item.columnName
                                                                                                                    ] =
                                                                                                                        originalValue +
                                                                                                                        originalValue *
                                                                                                                            (changeValue /
                                                                                                                                100);
                                                                                                                } else if (
                                                                                                                    item.change ===
                                                                                                                        "decrease" &&
                                                                                                                    item.type ===
                                                                                                                        "percentage"
                                                                                                                ) {
                                                                                                                    modifiedEntry[
                                                                                                                        item.columnName
                                                                                                                    ] =
                                                                                                                        originalValue -
                                                                                                                        originalValue *
                                                                                                                            (changeValue /
                                                                                                                                100);
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    );

                                                                                                    return modifiedEntry;
                                                                                                }
                                                                                            );

                                                                                        // Create Tabulator
                                                                                        var table =
                                                                                            new Tabulator(
                                                                                                "#previewDataTable",
                                                                                                {
                                                                                                    data:
                                                                                                        newData ??
                                                                                                        [],
                                                                                                    height: 600,
                                                                                                    //layout: "fitColumns",
                                                                                                    layout: "fitDataFill",
                                                                                                    layoutColumnsOnNewData: true,
                                                                                                    //resizableColumnFit: true,
                                                                                                    columns:
                                                                                                        tableColumns,
                                                                                                    responsiveLayout: false,
                                                                                                    groupBy:
                                                                                                        tableGroupBy.length >
                                                                                                        0
                                                                                                            ? tableGroupBy
                                                                                                            : "",
                                                                                                    columnCalcs:
                                                                                                        "both",
                                                                                                    movableColumns: true,

                                                                                                    groupHeaderDownload:
                                                                                                        function (
                                                                                                            value,
                                                                                                            count,
                                                                                                            data,
                                                                                                            group
                                                                                                        ) {
                                                                                                            return (
                                                                                                                value +
                                                                                                                " (" +
                                                                                                                count +
                                                                                                                " items)"
                                                                                                            );
                                                                                                        },
                                                                                                }
                                                                                            );
                                                                                        if (
                                                                                            table
                                                                                        ) {
                                                                                            const formatDate =
                                                                                                (
                                                                                                    date
                                                                                                ) => {
                                                                                                    // Get individual components
                                                                                                    const year =
                                                                                                        date.getFullYear();
                                                                                                    const month =
                                                                                                        String(
                                                                                                            date.getMonth() +
                                                                                                                1
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    const day =
                                                                                                        String(
                                                                                                            date.getDate()
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    let hours =
                                                                                                        date.getHours();
                                                                                                    const minutes =
                                                                                                        String(
                                                                                                            date.getMinutes()
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    const seconds =
                                                                                                        String(
                                                                                                            date.getSeconds()
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    const ampm =
                                                                                                        hours >=
                                                                                                        12
                                                                                                            ? "pm"
                                                                                                            : "am";

                                                                                                    // Convert to 12-hour format
                                                                                                    hours =
                                                                                                        hours %
                                                                                                        12;
                                                                                                    hours =
                                                                                                        hours
                                                                                                            ? hours
                                                                                                            : 12; // If hours is 0, set it to 12

                                                                                                    // Create the formatted date string
                                                                                                    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;

                                                                                                    return formattedDate;
                                                                                                };

                                                                                            const generateCleanPdf =
                                                                                                (
                                                                                                    reportTitle
                                                                                                ) => {
                                                                                                    const paramArray =
                                                                                                        filterParams;
                                                                                                    let rowCount =
                                                                                                        paramArray.length;
                                                                                                    //let topPos = rowCount * 5 + 20;
                                                                                                    let topPos =
                                                                                                        Math.abs(
                                                                                                            rowCount /
                                                                                                                2
                                                                                                        ) *
                                                                                                            5 +
                                                                                                        30;
                                                                                                    const doc =
                                                                                                        new jsPDF();

                                                                                                    table.download(
                                                                                                        "pdf",
                                                                                                        `${reportTitle}-${new Date().getTime()}.pdf`,

                                                                                                        {
                                                                                                            showHead:
                                                                                                                "firstPage",
                                                                                                            showFoot:
                                                                                                                "lastPage",
                                                                                                            jsPDF: {
                                                                                                                orientation:
                                                                                                                    values?.reportOrientation,
                                                                                                                unit: "mm",
                                                                                                                format: values?.reportPageSize,
                                                                                                            },

                                                                                                            autoTable:
                                                                                                                function (
                                                                                                                    doc
                                                                                                                ) {
                                                                                                                    doc.addFileToVFS(
                                                                                                                        "NotoSans-normal.ttf",
                                                                                                                        font
                                                                                                                    );
                                                                                                                    doc.addFont(
                                                                                                                        "NotoSans-normal.ttf",
                                                                                                                        "NotoSans",
                                                                                                                        "normal",
                                                                                                                        "Unicode"
                                                                                                                    );
                                                                                                                    doc.setFont(
                                                                                                                        "NotoSans",
                                                                                                                        "Unicodenormal"
                                                                                                                    );
                                                                                                                    return {
                                                                                                                        styles: {
                                                                                                                            font: "NotoSans",
                                                                                                                            fontStyle:
                                                                                                                                "Unicodenormal",
                                                                                                                        },
                                                                                                                        columnStyles:
                                                                                                                            {
                                                                                                                                //id: {fillColor: 255}
                                                                                                                            },
                                                                                                                        margin: {
                                                                                                                            top: topPos,
                                                                                                                        },
                                                                                                                        didDrawPage:
                                                                                                                            function (
                                                                                                                                data
                                                                                                                            ) {
                                                                                                                                if (
                                                                                                                                    data.pageNumber >
                                                                                                                                    0
                                                                                                                                ) {
                                                                                                                                    data.settings.margin.top = 10;
                                                                                                                                }
                                                                                                                            },
                                                                                                                        didParseCell:
                                                                                                                            function (
                                                                                                                                data
                                                                                                                            ) {
                                                                                                                                data.cell.styles.cellPadding = 1;
                                                                                                                            },

                                                                                                                        headStyles:
                                                                                                                            {
                                                                                                                                halign: "center",
                                                                                                                            },
                                                                                                                        footStyles:
                                                                                                                            {
                                                                                                                                halign: "left",
                                                                                                                            },
                                                                                                                        theme: "grid",
                                                                                                                        tableWidth:
                                                                                                                            "auto",
                                                                                                                        columnWidth:
                                                                                                                            "wrap",
                                                                                                                        showHead:
                                                                                                                            "everyPage",
                                                                                                                        tableLineColor: 200,
                                                                                                                        tableLineWidth: 0,
                                                                                                                        pageBreak:
                                                                                                                            "auto",
                                                                                                                        rowPageBreak:
                                                                                                                            "avoid",
                                                                                                                    };
                                                                                                                },

                                                                                                            documentProcessing:
                                                                                                                function (
                                                                                                                    doc
                                                                                                                ) {
                                                                                                                    // doc = new jsPDF();
                                                                                                                    const currentDate =
                                                                                                                        new Date();
                                                                                                                    const formattedDate =
                                                                                                                        formatDate(
                                                                                                                            currentDate
                                                                                                                        );

                                                                                                                    // Add parameters, page number, and date to the footer
                                                                                                                    const pageCount =
                                                                                                                        doc.internal.getNumberOfPages();

                                                                                                                    var splitTitle =
                                                                                                                        doc.splitTextToSize(
                                                                                                                            reportTitle,
                                                                                                                            180
                                                                                                                        );

                                                                                                                    for (
                                                                                                                        let i = 1;
                                                                                                                        i <=
                                                                                                                        pageCount;
                                                                                                                        i++
                                                                                                                    ) {
                                                                                                                        doc.setPage(
                                                                                                                            i
                                                                                                                        );
                                                                                                                        if (
                                                                                                                            i ==
                                                                                                                            1
                                                                                                                        ) {
                                                                                                                            doc.setFontSize(
                                                                                                                                16
                                                                                                                            );
                                                                                                                            doc.setFont(
                                                                                                                                "NotoSans",
                                                                                                                                "Unicodenormal"
                                                                                                                            );
                                                                                                                            doc.text(
                                                                                                                                splitTitle,
                                                                                                                                15,
                                                                                                                                10
                                                                                                                            );

                                                                                                                            doc.addImage(
                                                                                                                                PDFLOGO,
                                                                                                                                "png",
                                                                                                                                doc
                                                                                                                                    .internal
                                                                                                                                    .pageSize
                                                                                                                                    .width -
                                                                                                                                    35,
                                                                                                                                5,
                                                                                                                                14,
                                                                                                                                14
                                                                                                                            );

                                                                                                                            // Add parameters below the title

                                                                                                                            doc.setFontSize(
                                                                                                                                10
                                                                                                                            );
                                                                                                                            doc.setFont(
                                                                                                                                "NotoSans",
                                                                                                                                "Unicodenormal"
                                                                                                                            );

                                                                                                                            let paramHeight = 25;
                                                                                                                            let n = 1;

                                                                                                                            paramArray.forEach(
                                                                                                                                function (
                                                                                                                                    paramObject
                                                                                                                                ) {
                                                                                                                                    for (let key in paramObject) {
                                                                                                                                        if (
                                                                                                                                            paramObject.hasOwnProperty(
                                                                                                                                                key
                                                                                                                                            )
                                                                                                                                        ) {
                                                                                                                                            const value =
                                                                                                                                                paramObject[
                                                                                                                                                    key
                                                                                                                                                ];
                                                                                                                                            //doc.text(`${key}: ${value}`, 15, paramHeight);
                                                                                                                                            if (
                                                                                                                                                n %
                                                                                                                                                    2 ==
                                                                                                                                                0
                                                                                                                                            ) {
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "bold"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    `${key}: `,
                                                                                                                                                    (doc.internal.pageSize.getWidth() +
                                                                                                                                                        15) /
                                                                                                                                                        2,
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "normal"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    ` ${value}`,
                                                                                                                                                    (doc.internal.pageSize.getWidth() +
                                                                                                                                                        15) /
                                                                                                                                                        2 +
                                                                                                                                                        2 +
                                                                                                                                                        doc.getTextWidth(
                                                                                                                                                            `${key}: `
                                                                                                                                                        ),
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                paramHeight += 10;
                                                                                                                                            } else {
                                                                                                                                                //paramHeight=paramHeight-10;
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "bold"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    `${key}: `,
                                                                                                                                                    15,
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "normal"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    ` ${value}`,
                                                                                                                                                    15 +
                                                                                                                                                        2 +
                                                                                                                                                        doc.getTextWidth(
                                                                                                                                                            `${key}: `
                                                                                                                                                        ),
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                paramHeight += 5;
                                                                                                                                            }
                                                                                                                                            n++;
                                                                                                                                        }
                                                                                                                                        paramHeight =
                                                                                                                                            paramHeight -
                                                                                                                                            5;
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            );
                                                                                                                        }

                                                                                                                        doc.setFontSize(
                                                                                                                            8
                                                                                                                        );
                                                                                                                        doc.setFont(
                                                                                                                            "helvetica",
                                                                                                                            "bold"
                                                                                                                        );
                                                                                                                        // doc.setFont(
                                                                                                                        //     "NotoSans",
                                                                                                                        //     "Unicodenormal"
                                                                                                                        // );

                                                                                                                        var pageWidth =
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .width ||
                                                                                                                            doc.internal.pageSize.getWidth();

                                                                                                                        doc.text(
                                                                                                                            `Report Id: ${values.reportId}`,
                                                                                                                            pageWidth /
                                                                                                                                2,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .height -
                                                                                                                                10,
                                                                                                                            "center"
                                                                                                                        );

                                                                                                                        doc.text(
                                                                                                                            `Page ${i} of ${pageCount}`,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .width -
                                                                                                                                14,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .height -
                                                                                                                                10,
                                                                                                                            {
                                                                                                                                align: "right",
                                                                                                                            }
                                                                                                                        );

                                                                                                                        doc.text(
                                                                                                                            "Date: " +
                                                                                                                                formattedDate,
                                                                                                                            15,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .height -
                                                                                                                                10
                                                                                                                        );
                                                                                                                    }

                                                                                                                    return doc;
                                                                                                                },
                                                                                                        }
                                                                                                    );
                                                                                                };

                                                                                            if (
                                                                                                table
                                                                                            ) {
                                                                                                document
                                                                                                    .getElementById(
                                                                                                        "download-csv"
                                                                                                    )
                                                                                                    .addEventListener(
                                                                                                        "click",
                                                                                                        function (
                                                                                                            e
                                                                                                        ) {
                                                                                                            e.preventDefault();
                                                                                                            table.download(
                                                                                                                "csv",
                                                                                                                `${
                                                                                                                    values?.reportTitle
                                                                                                                }-${new Date().getTime()}.csv`,
                                                                                                                {
                                                                                                                    bom: true,
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    );

                                                                                                document
                                                                                                    .getElementById(
                                                                                                        "download-pdf"
                                                                                                    )
                                                                                                    .addEventListener(
                                                                                                        "click",
                                                                                                        (
                                                                                                            e
                                                                                                        ) => {
                                                                                                            e.preventDefault();
                                                                                                            generateCleanPdf(
                                                                                                                values?.reportTitle
                                                                                                            );
                                                                                                        }
                                                                                                    );

                                                                                                document
                                                                                                    .getElementById(
                                                                                                        "download-xlsx"
                                                                                                    )
                                                                                                    .addEventListener(
                                                                                                        "click",
                                                                                                        function (
                                                                                                            e
                                                                                                        ) {
                                                                                                            //table.download("xlsx", "data.xlsx", {sheetName:"DRB_DATA"});
                                                                                                            e.preventDefault();
                                                                                                            table.download(
                                                                                                                "xlsx",
                                                                                                                `${
                                                                                                                    values?.reportTitle
                                                                                                                }-${new Date().getTime()}.xlsx`,
                                                                                                                {
                                                                                                                    sheetName:
                                                                                                                        "tabledatabig",
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    );
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    variant="primary"
                                                                                    className="f-right mt-5 btn"
                                                                                    type="button"
                                                                                >
                                                                                    Apply
                                                                                </Button>
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    className="f-right mt-5 btn mr-5"
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        // Create Tabulator
                                                                                        setFieldValue(
                                                                                            "analytics",
                                                                                            []
                                                                                        );

                                                                                        var table =
                                                                                            new Tabulator(
                                                                                                "#previewDataTable",
                                                                                                {
                                                                                                    data:
                                                                                                        tableData ??
                                                                                                        [],
                                                                                                    height: 600,
                                                                                                    //layout: "fitColumns",
                                                                                                    layout: "fitDataFill",
                                                                                                    layoutColumnsOnNewData: true,
                                                                                                    //resizableColumnFit: true,
                                                                                                    columns:
                                                                                                        tableColumns,
                                                                                                    responsiveLayout: false,
                                                                                                    groupBy:
                                                                                                        tableGroupBy.length >
                                                                                                        0
                                                                                                            ? tableGroupBy
                                                                                                            : "",
                                                                                                    columnCalcs:
                                                                                                        "both",
                                                                                                    movableColumns: true,
                                                                                                    groupHeaderDownload:
                                                                                                        function (
                                                                                                            value,
                                                                                                            count,
                                                                                                            data,
                                                                                                            group
                                                                                                        ) {
                                                                                                            return (
                                                                                                                value +
                                                                                                                " (" +
                                                                                                                count +
                                                                                                                " items)"
                                                                                                            );
                                                                                                        },
                                                                                                }
                                                                                            );
                                                                                        if (
                                                                                            table
                                                                                        ) {
                                                                                            const formatDate =
                                                                                                (
                                                                                                    date
                                                                                                ) => {
                                                                                                    // Get individual components
                                                                                                    const year =
                                                                                                        date.getFullYear();
                                                                                                    const month =
                                                                                                        String(
                                                                                                            date.getMonth() +
                                                                                                                1
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    const day =
                                                                                                        String(
                                                                                                            date.getDate()
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    let hours =
                                                                                                        date.getHours();
                                                                                                    const minutes =
                                                                                                        String(
                                                                                                            date.getMinutes()
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    const seconds =
                                                                                                        String(
                                                                                                            date.getSeconds()
                                                                                                        ).padStart(
                                                                                                            2,
                                                                                                            "0"
                                                                                                        );
                                                                                                    const ampm =
                                                                                                        hours >=
                                                                                                        12
                                                                                                            ? "pm"
                                                                                                            : "am";

                                                                                                    // Convert to 12-hour format
                                                                                                    hours =
                                                                                                        hours %
                                                                                                        12;
                                                                                                    hours =
                                                                                                        hours
                                                                                                            ? hours
                                                                                                            : 12; // If hours is 0, set it to 12

                                                                                                    // Create the formatted date string
                                                                                                    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;

                                                                                                    return formattedDate;
                                                                                                };

                                                                                            const generateCleanPdf =
                                                                                                (
                                                                                                    reportTitle
                                                                                                ) => {
                                                                                                    const paramArray =
                                                                                                        filterParams;
                                                                                                    let rowCount =
                                                                                                        paramArray.length;
                                                                                                    //let topPos = rowCount * 5 + 20;
                                                                                                    let topPos =
                                                                                                        Math.abs(
                                                                                                            rowCount /
                                                                                                                2
                                                                                                        ) *
                                                                                                            5 +
                                                                                                        30;
                                                                                                    const doc =
                                                                                                        new jsPDF();

                                                                                                    table.download(
                                                                                                        "pdf",
                                                                                                        `${reportTitle}-${new Date().getTime()}.pdf`,

                                                                                                        {
                                                                                                            showHead:
                                                                                                                "firstPage",
                                                                                                            showFoot:
                                                                                                                "lastPage",
                                                                                                            jsPDF: {
                                                                                                                orientation:
                                                                                                                    values?.reportOrientation,
                                                                                                                unit: "mm",
                                                                                                                format: values?.reportPageSize,
                                                                                                            },

                                                                                                            autoTable:
                                                                                                                function (
                                                                                                                    doc
                                                                                                                ) {
                                                                                                                    doc.addFileToVFS(
                                                                                                                        "NotoSans-normal.ttf",
                                                                                                                        font
                                                                                                                    );
                                                                                                                    doc.addFont(
                                                                                                                        "NotoSans-normal.ttf",
                                                                                                                        "NotoSans",
                                                                                                                        "normal",
                                                                                                                        "Unicode"
                                                                                                                    );
                                                                                                                    doc.setFont(
                                                                                                                        "NotoSans",
                                                                                                                        "Unicodenormal"
                                                                                                                    );
                                                                                                                    return {
                                                                                                                        styles: {
                                                                                                                            font: "NotoSans",
                                                                                                                            fontStyle:
                                                                                                                                "Unicodenormal",
                                                                                                                        },
                                                                                                                        columnStyles:
                                                                                                                            {
                                                                                                                                //id: {fillColor: 255}
                                                                                                                            },
                                                                                                                        margin: {
                                                                                                                            top: topPos,
                                                                                                                        },
                                                                                                                        didDrawPage:
                                                                                                                            function (
                                                                                                                                data
                                                                                                                            ) {
                                                                                                                                if (
                                                                                                                                    data.pageNumber >
                                                                                                                                    0
                                                                                                                                ) {
                                                                                                                                    data.settings.margin.top = 10;
                                                                                                                                }
                                                                                                                            },
                                                                                                                        didParseCell:
                                                                                                                            function (
                                                                                                                                data
                                                                                                                            ) {
                                                                                                                                data.cell.styles.cellPadding = 1;
                                                                                                                            },

                                                                                                                        headStyles:
                                                                                                                            {
                                                                                                                                halign: "center",
                                                                                                                            },
                                                                                                                        footStyles:
                                                                                                                            {
                                                                                                                                halign: "left",
                                                                                                                            },
                                                                                                                        theme: "grid",
                                                                                                                        tableWidth:
                                                                                                                            "auto",
                                                                                                                        columnWidth:
                                                                                                                            "wrap",
                                                                                                                        showHead:
                                                                                                                            "everyPage",
                                                                                                                        tableLineColor: 200,
                                                                                                                        tableLineWidth: 0,
                                                                                                                        pageBreak:
                                                                                                                            "auto",
                                                                                                                        rowPageBreak:
                                                                                                                            "avoid",
                                                                                                                    };
                                                                                                                },

                                                                                                            documentProcessing:
                                                                                                                function (
                                                                                                                    doc
                                                                                                                ) {
                                                                                                                    // doc = new jsPDF();
                                                                                                                    const currentDate =
                                                                                                                        new Date();
                                                                                                                    const formattedDate =
                                                                                                                        formatDate(
                                                                                                                            currentDate
                                                                                                                        );

                                                                                                                    // Add parameters, page number, and date to the footer
                                                                                                                    const pageCount =
                                                                                                                        doc.internal.getNumberOfPages();

                                                                                                                    var splitTitle =
                                                                                                                        doc.splitTextToSize(
                                                                                                                            reportTitle,
                                                                                                                            180
                                                                                                                        );

                                                                                                                    for (
                                                                                                                        let i = 1;
                                                                                                                        i <=
                                                                                                                        pageCount;
                                                                                                                        i++
                                                                                                                    ) {
                                                                                                                        doc.setPage(
                                                                                                                            i
                                                                                                                        );
                                                                                                                        if (
                                                                                                                            i ==
                                                                                                                            1
                                                                                                                        ) {
                                                                                                                            doc.setFontSize(
                                                                                                                                16
                                                                                                                            );
                                                                                                                            doc.setFont(
                                                                                                                                "NotoSans",
                                                                                                                                "Unicodenormal"
                                                                                                                            );
                                                                                                                            doc.text(
                                                                                                                                splitTitle,
                                                                                                                                15,
                                                                                                                                10
                                                                                                                            );

                                                                                                                            doc.addImage(
                                                                                                                                PDFLOGO,
                                                                                                                                "png",
                                                                                                                                doc
                                                                                                                                    .internal
                                                                                                                                    .pageSize
                                                                                                                                    .width -
                                                                                                                                    35,
                                                                                                                                5,
                                                                                                                                14,
                                                                                                                                14
                                                                                                                            );

                                                                                                                            // Add parameters below the title

                                                                                                                            doc.setFontSize(
                                                                                                                                10
                                                                                                                            );
                                                                                                                            doc.setFont(
                                                                                                                                "NotoSans",
                                                                                                                                "Unicodenormal"
                                                                                                                            );

                                                                                                                            let paramHeight = 25;
                                                                                                                            let n = 1;

                                                                                                                            paramArray.forEach(
                                                                                                                                function (
                                                                                                                                    paramObject
                                                                                                                                ) {
                                                                                                                                    for (let key in paramObject) {
                                                                                                                                        if (
                                                                                                                                            paramObject.hasOwnProperty(
                                                                                                                                                key
                                                                                                                                            )
                                                                                                                                        ) {
                                                                                                                                            const value =
                                                                                                                                                paramObject[
                                                                                                                                                    key
                                                                                                                                                ];
                                                                                                                                            //doc.text(`${key}: ${value}`, 15, paramHeight);
                                                                                                                                            if (
                                                                                                                                                n %
                                                                                                                                                    2 ==
                                                                                                                                                0
                                                                                                                                            ) {
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "bold"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    `${key}: `,
                                                                                                                                                    (doc.internal.pageSize.getWidth() +
                                                                                                                                                        15) /
                                                                                                                                                        2,
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "normal"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    ` ${value}`,
                                                                                                                                                    (doc.internal.pageSize.getWidth() +
                                                                                                                                                        15) /
                                                                                                                                                        2 +
                                                                                                                                                        2 +
                                                                                                                                                        doc.getTextWidth(
                                                                                                                                                            `${key}: `
                                                                                                                                                        ),
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                paramHeight += 10;
                                                                                                                                            } else {
                                                                                                                                                //paramHeight=paramHeight-10;
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "bold"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    `${key}: `,
                                                                                                                                                    15,
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                // doc.setFont(
                                                                                                                                                //     "helvetica",
                                                                                                                                                //     "normal"
                                                                                                                                                // );
                                                                                                                                                doc.setFont(
                                                                                                                                                    "NotoSans",
                                                                                                                                                    "Unicodenormal"
                                                                                                                                                );
                                                                                                                                                doc.text(
                                                                                                                                                    ` ${value}`,
                                                                                                                                                    15 +
                                                                                                                                                        2 +
                                                                                                                                                        doc.getTextWidth(
                                                                                                                                                            `${key}: `
                                                                                                                                                        ),
                                                                                                                                                    paramHeight
                                                                                                                                                );
                                                                                                                                                paramHeight += 5;
                                                                                                                                            }
                                                                                                                                            n++;
                                                                                                                                        }
                                                                                                                                        paramHeight =
                                                                                                                                            paramHeight -
                                                                                                                                            5;
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            );
                                                                                                                        }

                                                                                                                        doc.setFontSize(
                                                                                                                            8
                                                                                                                        );
                                                                                                                        doc.setFont(
                                                                                                                            "helvetica",
                                                                                                                            "bold"
                                                                                                                        );
                                                                                                                        // doc.setFont(
                                                                                                                        //     "NotoSans",
                                                                                                                        //     "Unicodenormal"
                                                                                                                        // );

                                                                                                                        var pageWidth =
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .width ||
                                                                                                                            doc.internal.pageSize.getWidth();

                                                                                                                        doc.text(
                                                                                                                            `Report Id: ${values.reportId}`,
                                                                                                                            pageWidth /
                                                                                                                                2,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .height -
                                                                                                                                10,
                                                                                                                            "center"
                                                                                                                        );

                                                                                                                        doc.text(
                                                                                                                            `Page ${i} of ${pageCount}`,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .width -
                                                                                                                                14,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .height -
                                                                                                                                10,
                                                                                                                            {
                                                                                                                                align: "right",
                                                                                                                            }
                                                                                                                        );

                                                                                                                        doc.text(
                                                                                                                            "Date: " +
                                                                                                                                formattedDate,
                                                                                                                            15,
                                                                                                                            doc
                                                                                                                                .internal
                                                                                                                                .pageSize
                                                                                                                                .height -
                                                                                                                                10
                                                                                                                        );
                                                                                                                    }

                                                                                                                    return doc;
                                                                                                                },
                                                                                                        }
                                                                                                    );
                                                                                                };

                                                                                            if (
                                                                                                table
                                                                                            ) {
                                                                                                document
                                                                                                    .getElementById(
                                                                                                        "download-csv"
                                                                                                    )
                                                                                                    .addEventListener(
                                                                                                        "click",
                                                                                                        function (
                                                                                                            e
                                                                                                        ) {
                                                                                                            e.preventDefault();
                                                                                                            table.download(
                                                                                                                "csv",
                                                                                                                `${
                                                                                                                    values?.reportTitle
                                                                                                                }-${new Date().getTime()}.csv`,
                                                                                                                {
                                                                                                                    bom: true,
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    );

                                                                                                document
                                                                                                    .getElementById(
                                                                                                        "download-pdf"
                                                                                                    )
                                                                                                    .addEventListener(
                                                                                                        "click",
                                                                                                        (
                                                                                                            e
                                                                                                        ) => {
                                                                                                            e.preventDefault();
                                                                                                            generateCleanPdf(
                                                                                                                values?.reportTitle
                                                                                                            );
                                                                                                        }
                                                                                                    );

                                                                                                document
                                                                                                    .getElementById(
                                                                                                        "download-xlsx"
                                                                                                    )
                                                                                                    .addEventListener(
                                                                                                        "click",
                                                                                                        function (
                                                                                                            e
                                                                                                        ) {
                                                                                                            //table.download("xlsx", "data.xlsx", {sheetName:"DRB_DATA"});
                                                                                                            e.preventDefault();
                                                                                                            table.download(
                                                                                                                "xlsx",
                                                                                                                `${
                                                                                                                    values?.reportTitle
                                                                                                                }-${new Date().getTime()}.xlsx`,
                                                                                                                {
                                                                                                                    sheetName:
                                                                                                                        "tabledatabig",
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    );
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Reset
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </Col>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    </Col>
                                )}
                        </>

                        {/* datatable-area used during update report , be careful before change it */}
                        <div className="datatable-area mt-20">
                            {previewData &&
                                previewData.length > 0 &&
                                previewCloumnData.length > 0 &&
                                !loading && (
                                    <div
                                        className="m-10 text-black text-center btn-download"
                                        id="datatable-area"
                                    >
                                        <h5 className="float-start ml-10 report-id">
                                            <b>{`Report Id : ${values.reportId}`}</b>
                                        </h5>

                                        <h5 className="float-end">
                                            <button
                                                id="download-csv"
                                                className="btn-updown btn btn-danger mr-2 pad-btn"
                                            >
                                                Download CSV
                                            </button>
                                        </h5>
                                        <h5 className="float-end">
                                            <button
                                                id="download-pdf"
                                                className="btn-updown btn btn-warning mr-2 pad-btn"
                                            >
                                                Download PDF
                                            </button>
                                        </h5>
                                        <h5 className="float-end">
                                            <button
                                                id="download-xlsx"
                                                className="btn-updown btn btn-primary pad-btn"
                                            >
                                                Download XLSX
                                            </button>
                                        </h5>
                                    </div>
                                )}

                            {loader && <ProgressBar />}

                            <br />
                            <div className="datatable">
                                <div
                                    id="previewDataTable"
                                    className="m-20"
                                ></div>
                            </div>
                        </div>
                    </Row>
                </Form>
            </Card.Body>
        </>
    );
};

export default FilterPanel;
