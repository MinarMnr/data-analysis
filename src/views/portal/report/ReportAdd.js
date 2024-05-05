import { Card } from "@themesberg/react-bootstrap";
import { Formik } from "formik/dist/index";
import { ScrollToFieldError } from "helpers/ScrollToFieldError";
import { UrlBuilder } from "helpers/UrlBuilder";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-topbar-progress-indicator";
import { callApi, clearState, selectApi } from "../../../reducers/apiSlice";
import { Report } from "./Report";
import ReportForm from "./ReportForm";
import { setToastAlert } from "reducers/toastAlertSlice";

const ReportAdd = (props) => {
    /**
     * useDispatch: dispatch actions
     */
    const dispatch = useDispatch();
    const history = useHistory();

    /**
     * Get loading indicator and data from 'selectApi' state
     */
    const {
        loading,
        report_save,
        details = {
            data: {},
        },
    } = useSelector(selectApi);

    /**
     * Get data through api call by dispatching 'callApi'.
     */

    useEffect(() => {
        if (report_save?.status == "success") {
            dispatch(
                clearState({
                    output: "report_save",
                })
            );

            dispatch(
                callApi({
                    operationId: UrlBuilder.report(
                        `menu-group/list?appModuleId=${localStorage.getItem(
                            "moduleId"
                        )}`
                    ),
                    output: "menuList",
                    storeName: "menuList",
                })
            );

            history.push(
                `/portal/report/updateReport/${report_save?.data?.reportId}`
            );
        }
    }, [report_save?.status]);

    return (
        <Card border="blue">
            <Card.Body>
                {loading && <ProgressBar />}
                <Formik
                    initialValues={Report}
                    enableReinitialize={true}
                    validationSchema={Report.validation()}
                    onSubmit={(data, { resetForm }) => {
                        var selectedDatasetAliasCheck = false;
                        const seenAliases = new Set();

                        for (const dataset of data.datasetList) {
                            const { datasetAlias } = dataset;

                            if (seenAliases.has(datasetAlias)) {
                                selectedDatasetAliasCheck = true;
                            } else {
                                // If not seen before, add it to the set
                                seenAliases.add(datasetAlias);
                            }
                        }

                        if (selectedDatasetAliasCheck) {
                            dispatch(
                                setToastAlert({
                                    type: "error",
                                    message:
                                        "Duplicate Dataset alias name. Please change dataset alias name.",
                                })
                            );
                            const element =
                                document.getElementById("datasetDuplicate");
                            if (!element) return;
                            element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                            return;
                        }

                        var selecetedDatasetList = [];
                        var selecetedRelationDatasetList = [];
                        data.datasetList.filter((item) => {
                            if (item.saved) {
                                //return item.id;
                                selecetedDatasetList.push(item.id);
                                selecetedRelationDatasetList.push(
                                    item.reportDatasetId
                                );
                            }
                        });

                        var selectedDatasetrelationList = [];
                        data.datasetRelationList.filter((item) => {
                            selectedDatasetrelationList.push(
                                parseInt(item.reportDatasetIdLeft)
                            );
                            selectedDatasetrelationList.push(
                                parseInt(item.reportDatasetIdRight)
                            );
                        });

                        function checkDuplicateColumnAlias(data) {
                            const aliasSet = new Set();

                            for (let item of data) {
                                if (aliasSet.has(item.columnAlias)) {
                                    return true;
                                } else {
                                    aliasSet.add(item.columnAlias);
                                }
                            }

                            return false;
                        }

                        const hasDuplicatesColumnAlias =
                            checkDuplicateColumnAlias(data.columnList);

                        if (hasDuplicatesColumnAlias) {
                            dispatch(
                                setToastAlert({
                                    type: "error",
                                    message:
                                        "Duplicates Column alias found at Cloumns. Please remove duplicate Column alias name.",
                                })
                            );
                            const element = document.getElementById(
                                "duplicateColumnAlias"
                            );
                            if (!element) return;
                            element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                            return;
                        }

                        function checkForDuplicates(data) {
                            const seen = new Set();
                            for (const item of data) {
                                const key = `${item.datasetColumnNameLeft}-${item.datasetColumnNameRight}-${item.reportDatasetIdLeft}-${item.reportDatasetIdRight}`;
                                if (seen.has(key)) {
                                    return true; // Duplicates found
                                }
                                seen.add(key);
                            }
                            return false; // No duplicates found
                        }

                        const hasDuplicates = checkForDuplicates(
                            data.datasetRelationList
                        );

                        if (hasDuplicates) {
                            dispatch(
                                setToastAlert({
                                    type: "error",
                                    message:
                                        "Left and Right dataset and column values are same for multiple rows. Please remove duplicate row.",
                                })
                            );
                            const element =
                                document.getElementById("datasetDuplicate");
                            if (!element) return;
                            element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                            return;
                        }

                        function checkValuesAreSame(data) {
                            for (const item of data) {
                                if (
                                    item.reportDatasetIdLeft ==
                                        item.reportDatasetIdRight &&
                                    item.datasetColumnNameLeft ==
                                        item.datasetColumnNameRight
                                ) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        const hasSameValues = checkValuesAreSame(
                            data.datasetRelationList
                        );
                        if (hasSameValues) {
                            dispatch(
                                setToastAlert({
                                    type: "error",
                                    message:
                                        "Left and Right dataset and column values can not be same for relation.",
                                })
                            );
                            const element = document.getElementById(
                                "dataSetRelationError"
                            );
                            if (!element) return;
                            element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                            return;
                        }

                        if (
                            selecetedRelationDatasetList.length > 1 &&
                            !selecetedRelationDatasetList.every((value) =>
                                [
                                    ...new Set(selectedDatasetrelationList),
                                ].includes(value)
                            )
                        ) {
                            dispatch(
                                setToastAlert({
                                    type: "error",
                                    message:
                                        "All selected dataset should be in the dataset relation list",
                                })
                            );
                            const element = document.getElementById(
                                "dataSetRelationError"
                            );
                            if (!element) return;
                            element.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                            });
                        } else {
                            dispatch(
                                callApi({
                                    operationId:
                                        UrlBuilder.report("report/save"),
                                    output: "report_save",
                                    parameters: {
                                        method: "POST",
                                        body: Report.toString(data),
                                        header: {
                                            "Content-Type": "application/json",
                                        },
                                    },
                                })
                            );
                        }
                    }}
                >
                    {(props) => {
                        return (
                            <>
                                <ScrollToFieldError />
                                <ReportForm {...props} mode="add" />
                            </>
                        );
                    }}
                </Formik>
            </Card.Body>
        </Card>
    );
};

export default ReportAdd;
