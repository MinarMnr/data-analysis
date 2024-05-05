import {
    faPencilAlt,
    faPlus,
    faTrashAlt,
    faInfoCircle,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    Col,
    Form as Form1,
    Modal,
    Row,
} from "@themesberg/react-bootstrap";

import { ErrorMessage, Field, FieldArray } from "formik/dist/index";
import { UrlBuilder } from "helpers/UrlBuilder";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { DefaultCard } from "../../../components/card";
import { InputField } from "../../../components/form";
import DefaultModal from "../../../components/modal/default/DefaultModal";
import {
    callApi,
    callApiWithoutLoading,
    clearState,
    selectApi,
} from "../../../reducers/apiSlice";
import { setToastAlert } from "reducers/toastAlertSlice";
import Cookies from "js-cookie";
import ProgressBar from "react-topbar-progress-indicator";
import "./DataSetRelationForm.scss";

const DataSetRelationForm = ({
    setFieldValue,
    data = [],
    values,
    mode = "add",
    errors,
    props,
}) => {
    //var values = JSON.parse(JSON.stringify(values));

    const [show, setShow] = useState(false);
    const validList = useRef([]);
    const dispatch = useDispatch();
    const [leftId, setLeftId] = useState();
    const [rightId, setRightId] = useState();
    const [status, setStatus] = useState(false);

    const [aliasValue, setAliasValue] = useState("");
    const [aliasItem, setAliasItem] = useState(undefined);
    const [filterValue, setFilterValue] = useState("");

    const [selectedList, setSelectedList] = useState(data);

    const [leftList, setLeftList] = useState([]);
    const [rightList, setRightList] = useState([]);

    const [createDatasetModal, setCreateDatasetModal] = useState(false);
    const [editDatasetModal, setEditDatasetModal] = useState(false);

    const [datasetName, setDatasetName] = useState(false);
    const [datasetAliasName, setDatasetAliasName] = useState(false);
    const [rawSql, setRawSql] = useState(false);
    const [dataSetId, setDataSetId] = useState("");

    const [suggestions, setSuggestions] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const [searchValue, setSearchValue] = useState("");
    const [loader, setLoader] = useState(false);

    const searchDatasetByName = (searchTerm) => {
        // Split search term into words
        // const searchWords = searchTerm.trim().split(/\s+/);
        // Only perform search if there are at least 3 words
        // if (searchWords.length < 3) {
        //     return;
        // }

        var res = data.filter(
            (item) =>
                item.datasetName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.datasetAlias
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        res.length == 0 ? setSelectedList([]) : setSelectedList(res);

        // // Perform search based on datasetName containing all words in the search term
        // var res = selectedList.filter((item) => {
        //     const datasetName = item.datasetName.toLowerCase();
        //     return searchWords.every((word) =>
        //         datasetName.includes(word.toLowerCase())
        //     );
        // });
    };

    const closeModal = () => {
        setCreateDatasetModal(false);
        setEditDatasetModal(false);
        setDatasetName("");
        setDatasetAliasName("");
        setRawSql("");
        setFilterValue("");
        setDataSetId("");
    };

    const {
        leftColumnList = {
            data: {},
        },
        rightColumnList = {
            data: {},
        },
        operatorList = {
            data: {},
        },
        details = {
            data: [],
        },
    } = useSelector(selectApi);

    const joiningTypeList = [
        {
            id: "LEFT",
            name: "LEFT",
        },
        {
            id: "RIGHT",
            name: "RIGHT",
        },
        // {
        //     id: "OUTER",
        //     name: "OUTER",
        // },
        {
            id: "INNER",
            name: "INNER",
        },
    ];

    useEffect(() => {
        setSelectedList(data);
    }, [data]);

    useEffect(async () => {
        if (
            mode == "edit" &&
            values.datasetRelationList &&
            values.datasetRelationList.length > 0
        ) {
            let res = [...values.datasetRelationList];

            res.map(async (item, index) => {
                await setLeftColumnListEditMode(
                    index,
                    item?.reportDatasetIdLeft
                );
                await setRightColumnListEditMode(
                    index,
                    item?.reportDatasetIdRight
                );
            });
        }
    }, [values.datasetRelationList]);

    useEffect(() => {
        let res = [];

        res =
            selectedList?.length > 0 &&
            selectedList.map((item, index) => {
                return item?.saved
                    ? {
                          reportDatasetId: item?.reportDatasetId,

                          datasetName: item?.datasetName,
                      }
                    : null;
            });

        validList.current = res?.length > 0 && res.filter((n) => n);
        dispatch(
            clearState({
                output: "columns",
            })
        );

        // dispatch(
        //     clearState({
        //         output: "columnsFiltered",
        //     })
        // );
        if (validList.current.length > 0) {
            dispatch(
                callApiWithoutLoading({
                    operationId:
                        validList.current.length > 0
                            ? UrlBuilder.report(
                                  `database/column-details?filterByDataTypes=false&appModuleId=${localStorage.getItem(
                                      "moduleId"
                                  )}`
                              )
                            : null,
                    output: "columns",
                    parameters: {
                        method: "POST",
                        body: JSON.stringify(validList.current),
                        header: {
                            "Content-Type": "application/json",
                        },
                    },
                })
            );
            // dispatch(
            //     callApi({
            //         operationId:
            //             validList.current.length > 0
            //                 ? UrlBuilder.report(
            //                       `database/column-details?filterByDataTypes=true`
            //                   )
            //                 : null,
            //         output: "columnsFiltered",
            //         parameters: {
            //             method: "POST",
            //             body: JSON.stringify(validList.current),
            //             header: {
            //                 "Content-Type": "application/json",
            //             },
            //         },
            //     })
            // );
        }
    }, [selectedList]);

    useEffect(() => {
        dispatch(
            callApiWithoutLoading({
                operationId: UrlBuilder.report(`comparison-operators/list`),
                output: "operatorList",
            })
        );
    }, []);

    let checkList = async (datasetName, status, index) => {
        let newFields = [...selectedList];

        if (status == false) {
            swal({
                title: `Do you want to update dataset? It will affect your below column values`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (Update) => {
                if (Update) {
                    if (status) {
                        validList.current.push(datasetName);
                        //values?.datasetList.push(item);
                        //newFields[index].saved = true;
                    } else {
                        let deleteItem = validList.current.indexOf(datasetName);
                        validList.current.splice(deleteItem, 1);
                    }

                    var modifiedSelectedList = newFields.map((item, i) => ({
                        ...item,
                        saved: i == index ? status : item.saved,
                    }));

                    var resRelationList = [];
                    const modifiedrelationList =
                        values.datasetRelationList.reduce((modifiedItem, u) => {
                            const check = modifiedSelectedList.find(
                                (a) =>
                                    a.saved == true &&
                                    a.id == u.reportDatasetIdLeft
                            );

                            const check1 = modifiedSelectedList.find(
                                (a) =>
                                    a.saved == true &&
                                    a.id == u.reportDatasetIdRight
                            );

                            if (check && check1) {
                                resRelationList.push(u);
                            }
                            return resRelationList;
                        }, []);

                    await setFieldValue(
                        `datasetRelationList`,
                        modifiedrelationList
                    );

                    var resGroup = [];
                    const modifiedgroupList = values.groupList.reduce(
                        (modifiedItem, u) => {
                            const account = modifiedSelectedList.find(
                                (a) => a.saved == true && a.id === u.datasetId
                            );

                            if (account) {
                                resGroup.push(u);
                            }
                            return resGroup;
                        },
                        []
                    );

                    var resFilter = [];
                    const modifiedfilterList = values.filterList.reduce(
                        (modifiedItem, u) => {
                            const account = modifiedSelectedList.find(
                                (a) => a.saved == true && a.id === u.datasetId
                            );

                            if (account) {
                                resFilter.push(u);
                            }
                            return resFilter;
                        },
                        []
                    );

                    var resColumn = [];
                    const modifiedcolumnList = values.columnList.reduce(
                        (modifiedItem, u) => {
                            const account = modifiedSelectedList.find(
                                (a) => a.saved == true && a.id === u.datasetId
                            );

                            if (account) {
                                resColumn.push(u);
                            }
                            return resColumn;
                        },
                        []
                    );

                    var resValue = [];
                    const modifiedvalueList = values.valueList.reduce(
                        (modifiedItem, u) => {
                            const account = modifiedSelectedList.find(
                                (a) => a.saved == true && a.id === u.datasetId
                            );

                            if (account) {
                                resValue.push(u);
                            }
                            return resValue;
                        },
                        []
                    );

                    var resPivot = [];
                    const modifiedpivotList = values.pivotList.reduce(
                        (modifiedItem, u) => {
                            const account = modifiedSelectedList.find(
                                (a) => a.saved == true && a.id === u.datasetId
                            );

                            if (account) {
                                resPivot.push(u);
                            }
                            return resPivot;
                        },
                        []
                    );

                    // const resChartValue = modifiedSelectedList.find(
                    //     (a) =>
                    //         a.saved == true &&
                    //         a.id == values?.reportChart?.valueList?.datasetId
                    // );

                    // await setFieldValue(
                    //     `reportChart.valueList`,
                    //     resChartValue ? values?.reportChart?.valueList : {}
                    // );

                    // var resChartValue = [];
                    // var resChartValueList = [values?.reportChart?.valueList];
                    // if (
                    //     values?.reportChart?.valueList &&
                    //     resChartValueList.length > 0
                    // ) {
                    //     const modifiedChartValueList = resChartValueList.reduce(
                    //         (modifiedItem, u) => {
                    //             const account = modifiedSelectedList.find(
                    //                 (a) =>
                    //                     a.saved == true && a.id === u.datasetId
                    //             );

                    //             if (account) {
                    //                 resChartValue.push(u);
                    //             }
                    //             return resChartValue;
                    //         },
                    //         []
                    //     );

                    //     await setFieldValue(
                    //         `reportChart.valueList`,
                    //         modifiedChartValueList.length > 0
                    //             ? modifiedChartValueList
                    //             : {}
                    //     );
                    // }

                    const resChartData = modifiedSelectedList.find(
                        (a) =>
                            a.saved == true &&
                            a.id == values?.reportChart?.dataList?.datasetId
                    );

                    await setFieldValue(
                        `reportChart.dataList`,
                        resChartData ? values?.reportChart?.dataList : []
                    );

                    // var resChartData = [];
                    // var resChartDataList = [values?.reportChart?.dataList];

                    // if (
                    //     values?.reportChart?.dataList &&
                    //     resChartDataList.length > 0
                    // ) {
                    //     const modifiedChartDataList = resChartDataList.reduce(
                    //         (modifiedItem, u) => {
                    //             const account = modifiedSelectedList.find(
                    //                 (a) =>
                    //                     a.saved == true && a.id === u.datasetId
                    //             );

                    //             if (account) {
                    //                 resChartData.push(u);
                    //             }
                    //             return resChartData;
                    //         },
                    //         []
                    //     );
                    //     await setFieldValue(
                    //         `reportChart.dataList`,
                    //         modifiedChartDataList.length > 0
                    //             ? modifiedChartDataList
                    //             : {}
                    //     );
                    // }

                    await setFieldValue(`groupList`, modifiedgroupList);
                    await setFieldValue(`filterList`, modifiedfilterList);
                    await setFieldValue(`columnList`, modifiedcolumnList);
                    await setFieldValue(`valueList`, modifiedvalueList);
                    await setFieldValue(`pivotList`, modifiedpivotList);

                    setSelectedList(modifiedSelectedList);

                    await setFieldValue(`datasetList`, modifiedSelectedList);
                }
            });
        } else {
            if (status) {
                validList.current.push(datasetName);
                //values?.datasetList.push(item);
                //newFields[index].saved = true;
            } else {
                let deleteItem = validList.current.indexOf(datasetName);
                validList.current.splice(deleteItem, 1);
            }

            var modifiedSelectedList = newFields.map((item, i) => ({
                ...item,
                saved: i == index ? status : item.saved,
            }));

            var resGroup = [];
            const modifiedgroupList = values.groupList.reduce(
                (modifiedItem, u) => {
                    const account = modifiedSelectedList.find(
                        (a) => a.saved == true && a.id === u.datasetId
                    );

                    if (account) {
                        resGroup.push(u);
                    }
                    return resGroup;
                },
                []
            );

            var resFilter = [];
            const modifiedfilterList = values.filterList.reduce(
                (modifiedItem, u) => {
                    const account = modifiedSelectedList.find(
                        (a) => a.saved == true && a.id === u.datasetId
                    );

                    if (account) {
                        resFilter.push(u);
                    }
                    return resFilter;
                },
                []
            );

            var resColumn = [];
            const modifiedcolumnList = values.columnList.reduce(
                (modifiedItem, u) => {
                    const account = modifiedSelectedList.find(
                        (a) => a.saved == true && a.id === u.datasetId
                    );

                    if (account) {
                        resColumn.push(u);
                    }
                    return resColumn;
                },
                []
            );

            var resValue = [];
            const modifiedvalueList = values.valueList.reduce(
                (modifiedItem, u) => {
                    const account = modifiedSelectedList.find(
                        (a) => a.saved == true && a.id === u.datasetId
                    );

                    if (account) {
                        resValue.push(u);
                    }
                    return resValue;
                },
                []
            );

            var resPivot = [];
            const modifiedpivotList = values.pivotList.reduce(
                (modifiedItem, u) => {
                    const account = modifiedSelectedList.find(
                        (a) => a.saved == true && a.id === u.datasetId
                    );

                    if (account) {
                        resPivot.push(u);
                    }
                    return resPivot;
                },
                []
            );

            // var resChartValue = [];
            // var resChartValueList = [values?.reportChart?.valueList];
            // if (
            //     values?.reportChart?.valueList &&
            //     resChartValueList.length > 0
            // ) {
            //     const modifiedChartValueList = resChartValueList.reduce(
            //         (modifiedItem, u) => {
            //             const account = modifiedSelectedList.find(
            //                 (a) => a.saved == true && a.id === u.datasetId
            //             );

            //             if (account) {
            //                 resChartValue.push(u);
            //             }
            //             return resChartValue;
            //         },
            //         []
            //     );
            //     await setFieldValue(
            //         `reportChart.valueList`,
            //         modifiedChartValueList.length > 0
            //             ? modifiedChartValueList
            //             : {}
            //     );
            // }

            // var resChartData = [];
            // var resChartDataList = [values?.reportChart?.dataList];

            // if (values?.reportChart?.dataList && resChartDataList.length > 0) {
            //     const modifiedChartDataList = resChartDataList.reduce(
            //         (modifiedItem, u) => {
            //             const account = modifiedSelectedList.find(
            //                 (a) => a.saved == true && a.id === u.datasetId
            //             );

            //             if (account) {
            //                 resChartData.push(u);
            //             }
            //             return resChartData;
            //         },
            //         []
            //     );
            //     await setFieldValue(
            //         `reportChart.dataList`,
            //         modifiedChartDataList.length > 0
            //             ? modifiedChartDataList
            //             : {}
            //     );
            // }

            await setFieldValue(`groupList`, modifiedgroupList);
            await setFieldValue(`filterList`, modifiedfilterList);
            await setFieldValue(`columnList`, modifiedcolumnList);
            await setFieldValue(`valueList`, modifiedvalueList);
            await setFieldValue(`pivotList`, modifiedpivotList);

            setSelectedList(modifiedSelectedList);

            await setFieldValue(`datasetList`, modifiedSelectedList);
        }
    };

    var headers = {
        Authorization: "Bearer " + Cookies.get("access_token"),
        "Content-Type": "application/json",
    };

    const updateAliasName = async (
        val,
        filterVal,
        indexItem,
        datasetID,
        tableName
    ) => {
        var selectedDatasetAliasCheck = false;
        const seenAliases = new Set();

        let newFields = [...selectedList];

        var modifiedSelectedList = newFields.map((item, i) => ({
            ...item,
            datasetAlias: i == indexItem ? val : item.datasetAlias,
            datasetFilter: i == indexItem ? filterVal : item.datasetFilter,
        }));

        for (const dataset of modifiedSelectedList) {
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
            const element = document.getElementById("datasetDuplicate");
            if (!element) return;
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        }

        await setFieldValue(`datasetList`, modifiedSelectedList);

        setSelectedList(modifiedSelectedList);

        var updateDataset = await fetch(
            UrlBuilder.report(`dataset/update/${datasetID}`),
            {
                headers,
                method: "PUT",
                body: JSON.stringify({
                    datasetName: tableName,
                    datasetAlias: val,
                    isRawSql: false,
                    reportId: values?.reportId,
                    datasetFilter: filterVal,
                    appModuleId: localStorage.getItem("moduleId"),
                }),
            }
        );

        if (updateDataset?.status == 200) {
            updateDataset
                .json()
                .then((response) => {
                    dispatch(
                        setToastAlert({
                            type: "success",
                            message: "Dataset edited Successfully",
                        })
                    );
                    // setTimeout(() => {
                    //     window.location.reload(true);
                    // }, 1000);
                })
                .then((response) => {
                    if (mode == "edit") {
                        dispatch(
                            callApi({
                                operationId: UrlBuilder.report(
                                    `report/${
                                        values?.reportId
                                    }?appModuleId=${localStorage.getItem(
                                        "moduleId"
                                    )}`
                                ),
                                output: "editDetails",
                            })
                        );
                    }
                });

            setAliasValue("");
            setFilterValue("");
            setAliasItem(undefined);
            setShow(false);
            setDataSetId("");
        } else {
            dispatch(
                setToastAlert({
                    type: "error",
                    message: "Dataset not updated!",
                })
            );
        }

        // dispatch(
        //     setToastAlert({
        //         type: "success",
        //         message: "Dataset edited Successfully",
        //     })
        // );
        // setAliasValue("");
        // setFilterValue("");
        // setAliasItem(undefined);
        // setShow(false);

        // if (!validList.current.includes(item?.datasetName)) {
        //     dispatch(
        //         setToastAlert({
        //             type: "warn",
        //             message: "Dataset not selected",
        //         })
        //     );
        // } else {
        //     let x = { ...item };
        //     x.datasetAlias = val;

        //     const newState = values?.datasetList.map((item, i) =>
        //         item?.id == x.id ? { ...x } : item
        //     );

        //     await setFieldValue(`datasetList`, newState);
        // }

        // return;

        //newFields[itemId].datasetAlias = val;

        return;
    };

    const createNewDataSet = async (tableName, tableAliasName, tableRawSql) => {
        var selectedDatasetAliasCheck = false;
        const seenAliases = new Set();

        for (const dataset of values.datasetList) {
            const { datasetAlias } = dataset;

            if (seenAliases.has(tableAliasName)) {
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
            const element = document.getElementById("datasetDuplicate");
            if (!element) return;
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        } else if (tableName && tableAliasName && tableRawSql) {
            setLoader(true);
            var createDataset = await fetch(UrlBuilder.report(`dataset/save`), {
                headers,
                method: "POST",
                body: JSON.stringify({
                    datasetName: tableName,
                    datasetAlias: tableAliasName,
                    rawSql: tableRawSql,
                    isRawSql: true,
                    reportId: values?.reportId,
                    appModuleId: localStorage.getItem("moduleId"),
                }),
            });

            if (createDataset?.status == 200) {
                setLoader(false);
                createDataset
                    .json()
                    .then((response) => {
                        dispatch(
                            setToastAlert({
                                type: "success",
                                message: "Dataset Created Successfully",
                            })
                        );
                        // setTimeout(() => {
                        //     window.location.reload(true);
                        // }, 1000);
                    })
                    .then((response) => {
                        //comment out for testing purpouse
                        if (mode == "edit") {
                            dispatch(
                                callApiWithoutLoading({
                                    operationId: UrlBuilder.report(
                                        `report/${
                                            values?.reportId
                                        }?appModuleId=${localStorage.getItem(
                                            "moduleId"
                                        )}`
                                    ),
                                    output: "editDetails",
                                })
                            );
                        } else {
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
                        }
                    });

                setCreateDatasetModal(false);
                setEditDatasetModal(false);
                setDatasetName("");
                setDatasetAliasName("");
                setRawSql("");
                setDataSetId("");
            } else {
                setLoader(false);
                dispatch(
                    setToastAlert({
                        type: "error",
                        message: "Dataset not created! Please check Raw Sql",
                    })
                );
                // setCreateDatasetModal(false);
                // setEditDatasetModal(false);
                // setDatasetName("");
                // setDatasetAliasName("");
                // setRawSql("");
                // setDataSetId("");
            }
        } else {
            dispatch(
                setToastAlert({
                    type: "warn",
                    message:
                        "Dataset Name or Alias Name or Raw sql is Required",
                })
            );
        }
    };

    const editDataSet = async (
        tableName,
        tableAliasName,
        tableRawSql,
        datasetID
    ) => {
        var selectedDatasetAliasCheck = false;
        const seenAliases = new Set();
        for (const dataset of values.datasetList) {
            const { datasetAlias, id } = dataset;
            if (id != datasetID)
                if (seenAliases.has(tableAliasName)) {
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
            const element = document.getElementById("datasetDuplicate");
            if (!element) return;
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        } else if (tableName && tableAliasName && tableRawSql) {
            setLoader(true);
            var updateDataset = await fetch(
                UrlBuilder.report(`dataset/update/${datasetID}`),
                {
                    headers,
                    method: "PUT",
                    body: JSON.stringify({
                        datasetName: tableName,
                        datasetAlias: tableAliasName,
                        rawSql: tableRawSql,
                        isRawSql: true,
                        reportId: values?.reportId,
                        appModuleId: localStorage.getItem("moduleId"),
                    }),
                }
            );

            if (updateDataset?.status == 200) {
                setLoader(false);
                updateDataset
                    .json()
                    .then((response) => {
                        dispatch(
                            setToastAlert({
                                type: "success",
                                message: "Dataset updated Successfully",
                            })
                        );
                        // setTimeout(() => {
                        //     window.location.reload(true);
                        // }, 1000);
                    })
                    .then((response) => {
                        if (mode == "edit") {
                            dispatch(
                                callApiWithoutLoading({
                                    operationId: UrlBuilder.report(
                                        `report/${
                                            values?.reportId
                                        }?appModuleId=${localStorage.getItem(
                                            "moduleId"
                                        )}`
                                    ),
                                    output: "editDetails",
                                })
                            );
                        } else {
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
                        }
                    });

                setCreateDatasetModal(false);
                setEditDatasetModal(false);
                setDatasetName("");
                setDatasetAliasName("");
                setRawSql("");
                setDataSetId("");
            } else {
                setLoader(false);
                dispatch(
                    setToastAlert({
                        type: "error",
                        message: "Dataset not updated! Please check Raw Sql",
                    })
                );
            }
        } else {
            dispatch(
                setToastAlert({
                    type: "warn",
                    message:
                        "Dataset Name or Alias Name or Raw sql is Required",
                })
            );
        }
    };

    const setLeftColumnListEditMode = async (index, prm) => {
        if (prm > 0) {
            var resLeft = await fetch(
                UrlBuilder.report(
                    `database/columns-by-report-dataset-id/${prm}`
                ),
                {
                    headers,
                }
            );

            if (resLeft?.status == 200) {
                resLeft.json().then((response) => {
                    //values.leftColumnSetList[index] = response?.data;
                    leftList[index] = response?.data;
                    setFieldValue("leftColumnSetList", leftList);
                });
            }
        }
    };

    const setRightColumnListEditMode = async (index, prm) => {
        if (prm > 0) {
            var resRight = await fetch(
                UrlBuilder.report(
                    `database/columns-by-report-dataset-id/${prm}`
                ),
                {
                    headers,
                }
            );
            if (resRight?.status == 200) {
                resRight.json().then((response) => {
                    // values.rightColumnSetList[index] = response?.data;
                    rightList[index] = response?.data;
                    setFieldValue("rightColumnSetList", rightList);
                });
            }
        }
    };

    const setLeftColumnList = async (index, prm) => {
        dispatch(
            callApiWithoutLoading({
                operationId: UrlBuilder.report(
                    `database/columns-by-report-dataset-id/${prm}`
                ),
                output: "leftColumnList",
            })
        );
        setLeftId(index);
        //setStatus(true);
    };

    if (leftColumnList && leftColumnList.status == "success") {
        values.leftColumnSetList[leftId] = leftColumnList?.data;
        //setStatus(false);
    }

    useEffect(() => {
        let leftCheckList = [];
        leftCheckList = values.leftColumnSetList.filter(
            (item) => item != undefined
        );
        values.leftColumnSetList = leftCheckList;
    }, [values.leftColumnSetList]);

    const setRightColumnList = (index, prm) => {
        dispatch(
            callApiWithoutLoading({
                operationId: UrlBuilder.report(
                    `database/columns-by-report-dataset-id/${prm}`
                ),
                output: "rightColumnList",
            })
        );
        setRightId(index);
        //setStatus(true);
    };

    if (rightColumnList && rightColumnList.status == "success") {
        values.rightColumnSetList[rightId] = rightColumnList?.data;
        //setStatus(false);
    }

    useEffect(() => {
        let rightCheckList = [];
        rightCheckList = values.rightColumnSetList.filter(
            (item) => item != undefined
        );
        values.rightColumnSetList = rightCheckList;
    }, [values.rightColumnSetList]);

    const setFilterSuggestion = async (datasetId) => {
        setFilterData([]);
        var res = await fetch(
            UrlBuilder.report(`database/columns-by-dataset-id/${datasetId}`),
            {
                headers,
            }
        );
        if (res?.status == 200) {
            res.json().then((response) => {
                setFilterData(response?.data);
            });
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFilterValue(value);

        // Check if the last character is a whitespace
        const isWhitespace = /\s$/.test(value);

        // Check if there are at least two words
        const words = value.split(" ");
        if (isWhitespace) {
            setSuggestions([]);
        } else {
            const listValues = filterData?.map((item) => {
                return `${`<<${aliasValue}>>`}${item?.columnName}`;
                return `${item?.columnName}${`<${item?.datasetName}>`}`;

                return `${item?.columnName}`;
            });

            const filteredSuggestions = listValues.filter(
                (item) =>
                    item
                        .toLowerCase()
                        .includes(words[words.length - 1].toLowerCase())
                //.startsWith(words[words.length - 1].toLowerCase())
            );

            setSuggestions(filteredSuggestions);
        }
    };

    const handleSelectValue = (value) => {
        // let parseSelectedValues = value.split("<<") ?? [];

        // if (parseSelectedValues?.length > 0) {
        //     value = "<<" + parseSelectedValues[1] + parseSelectedValues[0];
        // }
        setFilterValue((prevValue) => {
            // Remove the last word and add the selected suggestion

            if (prevValue.length > 0) {
                const words = prevValue.split(" ");
                words.pop();
                return words.join(" ") + " " + value;
            } else {
                return value;
            }
        });
        setSuggestions([]);
    };

    return (
        <>
            {loader && <ProgressBar />}
            <div className="row">
                <div className="col-xl-12 p-0">
                    <div className="row">
                        <div className="col-12">
                            {/* <DefaultCard
                                className="mb-50"
                                {...dataSetCardProps}
                            > */}
                            <div className="row align-items-center ">
                                <div>
                                    {/* <div className="shadow shadowmodify mb-4 card border-0"> */}
                                    <div className="contentBox-modified border-style-all-acc">
                                        <div className="section-header-custom btn-tab-round">
                                            <h5 className="m-4 text-white">
                                                Dataset Selection
                                            </h5>
                                        </div>

                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 p-5 border-bottom-cus pb-41">
                                            <Button
                                                variant="primary"
                                                className="f-right btn-add fl-btn-add"
                                                type="button"
                                                onClick={() => {
                                                    setCreateDatasetModal(true);
                                                }}
                                            >
                                                <span className="icon-add">
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                        className="me-0"
                                                    />
                                                </span>
                                                <span>Add New Dataset</span>
                                            </Button>
                                            <div className="search-field">
                                                <input
                                                    type="text"
                                                    placeholder="search here"
                                                    className="f-right btn-add placeholders"
                                                    value={searchValue}
                                                    onChange={(e) => {
                                                        setSearchValue(
                                                            e.target.value
                                                        );
                                                        e.target.value.length >
                                                            1 &&
                                                            searchDatasetByName(
                                                                searchValue
                                                            );
                                                        if (
                                                            e.target.value
                                                                .length == 0
                                                        ) {
                                                            setSearchValue("");
                                                            setSelectedList(
                                                                data
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="danger"
                                                    className="btn btn-danger p-5 f-right mr-5 rounded-pill ms-1"
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchValue("");
                                                        setSelectedList(data);
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faSearch}
                                                        className="me-0"
                                                    />

                                                    <span>Reset</span>
                                                </Button>
                                            </div>

                                            {/* <Button
                                                variant="primary"
                                                className="btn btn-primary p-5 f-right mr-5"
                                                type="button"
                                                onClick={() => {
                                                    searchDatasetByName(
                                                        searchValue
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSearch}
                                                    className="me-0"
                                                />

                                                <span>Search</span>
                                            </Button> */}
                                        </div>

                                        <div className="contentBoxBody mt-0"></div>
                                        <div className="card-body">
                                            <div className="scroll-auto">
                                                <Form1
                                                    className="border"
                                                    id="datasetDuplicate"
                                                >
                                                    {selectedList &&
                                                    selectedList.length > 0 ? (
                                                        selectedList.map(
                                                            (item, index) => {
                                                                return (
                                                                    <div
                                                                        role="group"
                                                                        aria-labelledby="radio-group"
                                                                        className="ml-2 pt-5 pb-5 bg-odd"
                                                                    >
                                                                        <Field
                                                                            name={`${item.datasetName}`}
                                                                            type="checkbox"
                                                                            checked={
                                                                                item.saved
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                checkList(
                                                                                    e
                                                                                        .target
                                                                                        .name,
                                                                                    e
                                                                                        .target
                                                                                        .checked,
                                                                                    index
                                                                                );
                                                                            }}
                                                                        />

                                                                        {item.datasetName +
                                                                            " " +
                                                                            `(${item.datasetAlias})`}

                                                                        <span className="edit-span">
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faPencilAlt
                                                                                }
                                                                                className="me-2"
                                                                                style={{
                                                                                    float: "right",
                                                                                    position:
                                                                                        "relative",
                                                                                }}
                                                                                onClick={() => {
                                                                                    if (
                                                                                        item?.saved
                                                                                    ) {
                                                                                        if (
                                                                                            !item?.isRawSql
                                                                                        ) {
                                                                                            setFilterSuggestion(
                                                                                                item?.id
                                                                                            );
                                                                                            setShow(
                                                                                                true
                                                                                            );
                                                                                            setAliasValue(
                                                                                                item?.datasetAlias
                                                                                            );
                                                                                            setFilterValue(
                                                                                                item?.datasetFilter
                                                                                            );
                                                                                            setAliasItem(
                                                                                                index
                                                                                            );
                                                                                            setDataSetId(
                                                                                                item?.id
                                                                                            );
                                                                                            setDatasetName(
                                                                                                item?.datasetName
                                                                                            );
                                                                                        } else {
                                                                                            setEditDatasetModal(
                                                                                                true
                                                                                            );
                                                                                            setDatasetName(
                                                                                                item?.datasetName
                                                                                            );
                                                                                            setDatasetAliasName(
                                                                                                item?.datasetAlias
                                                                                            );

                                                                                            setRawSql(
                                                                                                item?.rawSql
                                                                                            );
                                                                                            setDataSetId(
                                                                                                item?.id
                                                                                            );
                                                                                        }
                                                                                    } else {
                                                                                        dispatch(
                                                                                            setToastAlert(
                                                                                                {
                                                                                                    type: "warn",
                                                                                                    message:
                                                                                                        "Dataset not selected",
                                                                                                }
                                                                                            )
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                color: "red",
                                                            }}
                                                        >
                                                            DATASET NOT FOUND
                                                        </div>
                                                    )}

                                                    <DefaultModal
                                                        show={show}
                                                        title="Edit Dataset"
                                                        salModal={true}
                                                        onClose={() => {
                                                            setShow(false);
                                                        }}
                                                        children={
                                                            <>
                                                                <Col>
                                                                    <label>
                                                                        Dataset
                                                                        Alias
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control mt-10"
                                                                        value={
                                                                            aliasValue
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            setAliasValue(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        }}
                                                                    />
                                                                </Col>

                                                                <label className="mt-20">
                                                                    Dataset
                                                                    Filter
                                                                </label>
                                                                <textarea
                                                                    rows={10}
                                                                    id="textarea"
                                                                    className="form-control mt-0"
                                                                    value={
                                                                        filterValue
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    placeholder="Type dataset filter here..."
                                                                />
                                                                {suggestions.length >
                                                                    0 && (
                                                                    <div
                                                                        className="suggestions-container"
                                                                        style={{
                                                                            position:
                                                                                "relative",
                                                                        }}
                                                                    >
                                                                        <ul>
                                                                            {suggestions.map(
                                                                                (
                                                                                    suggestion,
                                                                                    index
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleSelectValue(
                                                                                                suggestion
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            suggestion
                                                                                        }
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                <Row>
                                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-10 font-arial mt-30 border-top pt-10">
                                                                        <button
                                                                            className="btn btn-primary"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                updateAliasName(
                                                                                    aliasValue,
                                                                                    filterValue,
                                                                                    aliasItem,
                                                                                    dataSetId,
                                                                                    datasetName
                                                                                );
                                                                            }}
                                                                        >
                                                                            Update
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-danger"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setShow(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </Row>
                                                            </>
                                                        }
                                                    />
                                                </Form1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="contentBoxBody mt-30"></div>

                                    <div className="card-body">
                                        <div>
                                            <Row>
                                                <FieldArray
                                                    name="datasetRelationList"
                                                    render={(arrayHelpers) => (
                                                        <>
                                                            <div className="contentBox-modified border-style-all-acc">
                                                                <div className="section-header-custom btn-tab-round">
                                                                    <h5 className="m-4 text-white">
                                                                        Data Set
                                                                        Realtion
                                                                    </h5>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 p-5 border-bottom-cus mb-5">
                                                                        <Button
                                                                            onClick={(
                                                                                count
                                                                            ) => {
                                                                                if (
                                                                                    validList
                                                                                        .current
                                                                                        .length <
                                                                                    2
                                                                                ) {
                                                                                    dispatch(
                                                                                        setToastAlert(
                                                                                            {
                                                                                                type: "error",
                                                                                                message:
                                                                                                    "Please choose multiple dataset for adding relation",
                                                                                            }
                                                                                        )
                                                                                    );
                                                                                    const element =
                                                                                        document.getElementById(
                                                                                            "datasetDuplicate"
                                                                                        );
                                                                                    if (
                                                                                        !element
                                                                                    )
                                                                                        return;
                                                                                    element.scrollIntoView(
                                                                                        {
                                                                                            behavior:
                                                                                                "smooth",
                                                                                            block: "center",
                                                                                        }
                                                                                    );
                                                                                    return;
                                                                                }

                                                                                arrayHelpers.push(
                                                                                    {
                                                                                        datasetColumnNameLeft:
                                                                                            "",
                                                                                        datasetColumnNameRight:
                                                                                            "",
                                                                                        datasetJoinOperator:
                                                                                            "",
                                                                                        datasetJoinType:
                                                                                            "",
                                                                                        reportDatasetIdLeft: 0,
                                                                                        reportDatasetIdRight: 0,
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
                                                                                    <th>
                                                                                        #
                                                                                    </th>
                                                                                    <th className="wd-300">
                                                                                        Left
                                                                                        Data
                                                                                        Set
                                                                                    </th>
                                                                                    <th className="wd-300">
                                                                                        left
                                                                                        Column
                                                                                    </th>

                                                                                    <th className="wd-100">
                                                                                        Operator
                                                                                    </th>
                                                                                    <th className="wd-100">
                                                                                        Joining
                                                                                        Type
                                                                                    </th>
                                                                                    <th className="wd-300">
                                                                                        Right
                                                                                        Data
                                                                                        Set
                                                                                    </th>
                                                                                    <th className="wd-300">
                                                                                        Right
                                                                                        Column
                                                                                    </th>
                                                                                    <th
                                                                                        style={{
                                                                                            width: "30px",
                                                                                        }}
                                                                                    >
                                                                                        {/* প্রক্রিয়া */}
                                                                                        Remove
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {values.datasetRelationList &&
                                                                                values
                                                                                    .datasetRelationList
                                                                                    .length >
                                                                                    0 ? (
                                                                                    values.datasetRelationList.map(
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
                                                                                                    <>
                                                                                                        <Field
                                                                                                            as="select"
                                                                                                            type="select"
                                                                                                            className="form-select"
                                                                                                            name={`datasetRelationList[${index}].reportDatasetIdLeft`}
                                                                                                            label="type"
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                setFieldValue(
                                                                                                                    `datasetRelationList[${index}].reportDatasetIdLeft`,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value
                                                                                                                );

                                                                                                                setLeftColumnList(
                                                                                                                    index,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value
                                                                                                                );
                                                                                                            }}
                                                                                                        >
                                                                                                            <option value="0">
                                                                                                                Select
                                                                                                                Data
                                                                                                                Set
                                                                                                            </option>
                                                                                                            {values.datasetList.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) => {
                                                                                                                    return (
                                                                                                                        item.saved && (
                                                                                                                            <option
                                                                                                                                value={
                                                                                                                                    item.reportDatasetId
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    item.datasetName
                                                                                                                                }
                                                                                                                            </option>
                                                                                                                        )
                                                                                                                    );
                                                                                                                }
                                                                                                            )}
                                                                                                        </Field>
                                                                                                        <ErrorMessage
                                                                                                            name={`datasetRelationList[${index}].reportDatasetIdLeft`}
                                                                                                        >
                                                                                                            {() => (
                                                                                                                <small className="text-danger mt-3 mb-0">
                                                                                                                    Required
                                                                                                                </small>
                                                                                                            )}
                                                                                                        </ErrorMessage>
                                                                                                    </>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <Field
                                                                                                        as="select"
                                                                                                        type="select"
                                                                                                        className="form-select"
                                                                                                        name={`datasetRelationList[${index}].datasetColumnNameLeft`}
                                                                                                        label="type"
                                                                                                        onChange={(
                                                                                                            e
                                                                                                        ) => {
                                                                                                            setFieldValue(
                                                                                                                `datasetRelationList[${index}].datasetColumnNameLeft`,
                                                                                                                e
                                                                                                                    .target
                                                                                                                    .value
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        <option
                                                                                                            value=""
                                                                                                            className="form-control"
                                                                                                        >
                                                                                                            Select
                                                                                                            Column
                                                                                                            Set
                                                                                                        </option>
                                                                                                        {values.leftColumnSetList &&
                                                                                                            values
                                                                                                                .leftColumnSetList[
                                                                                                                index
                                                                                                            ]
                                                                                                                ?.length >
                                                                                                                0 &&
                                                                                                            values.leftColumnSetList[
                                                                                                                index
                                                                                                            ].map(
                                                                                                                (
                                                                                                                    itm
                                                                                                                ) => {
                                                                                                                    return (
                                                                                                                        <option
                                                                                                                            value={
                                                                                                                                itm.columnName
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {
                                                                                                                                itm.columnName
                                                                                                                            }
                                                                                                                        </option>
                                                                                                                    );
                                                                                                                }
                                                                                                            )}
                                                                                                    </Field>
                                                                                                    <ErrorMessage
                                                                                                        name={`datasetRelationList[${index}].datasetColumnNameLeft`}
                                                                                                    >
                                                                                                        {() => (
                                                                                                            <small className="text-danger mt-3 mb-0">
                                                                                                                Required
                                                                                                            </small>
                                                                                                        )}
                                                                                                    </ErrorMessage>
                                                                                                </td>

                                                                                                <td>
                                                                                                    <>
                                                                                                        <Field
                                                                                                            as="select"
                                                                                                            type="select"
                                                                                                            className="form-select"
                                                                                                            name={`datasetRelationList[${index}].datasetJoinOperator`}
                                                                                                            label="type"
                                                                                                        >
                                                                                                            <option value="">
                                                                                                                Select
                                                                                                                Operator
                                                                                                            </option>
                                                                                                            {operatorList &&
                                                                                                                operatorList?.data &&
                                                                                                                operatorList
                                                                                                                    .data
                                                                                                                    ?.length >
                                                                                                                    0 &&
                                                                                                                operatorList.data.map(
                                                                                                                    (
                                                                                                                        item
                                                                                                                    ) => {
                                                                                                                        return (
                                                                                                                            <option
                                                                                                                                value={
                                                                                                                                    item.symbol
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    item.name
                                                                                                                                }
                                                                                                                            </option>
                                                                                                                        );
                                                                                                                    }
                                                                                                                )}
                                                                                                        </Field>
                                                                                                        <ErrorMessage
                                                                                                            name={`datasetRelationList[${index}].datasetJoinOperator`}
                                                                                                        >
                                                                                                            {() => (
                                                                                                                <small className="text-danger mt-3 mb-0">
                                                                                                                    Required
                                                                                                                </small>
                                                                                                            )}
                                                                                                        </ErrorMessage>
                                                                                                    </>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <>
                                                                                                        <Field
                                                                                                            as="select"
                                                                                                            type="select"
                                                                                                            className="form-select"
                                                                                                            name={`datasetRelationList[${index}].datasetJoinType`}
                                                                                                            label="type"
                                                                                                        >
                                                                                                            <option value="">
                                                                                                                Select
                                                                                                                Joining
                                                                                                                Type
                                                                                                            </option>
                                                                                                            {joiningTypeList &&
                                                                                                                joiningTypeList?.length >
                                                                                                                    0 &&
                                                                                                                joiningTypeList.map(
                                                                                                                    (
                                                                                                                        item
                                                                                                                    ) => {
                                                                                                                        return (
                                                                                                                            <option
                                                                                                                                value={
                                                                                                                                    item.id
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    item.name
                                                                                                                                }
                                                                                                                            </option>
                                                                                                                        );
                                                                                                                    }
                                                                                                                )}
                                                                                                        </Field>
                                                                                                        <ErrorMessage
                                                                                                            name={`datasetRelationList[${index}].datasetJoinType`}
                                                                                                        >
                                                                                                            {() => (
                                                                                                                <small className="text-danger mt-3 mb-0">
                                                                                                                    Required
                                                                                                                </small>
                                                                                                            )}
                                                                                                        </ErrorMessage>
                                                                                                    </>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <>
                                                                                                        <Field
                                                                                                            as="select"
                                                                                                            type="select"
                                                                                                            className="form-select"
                                                                                                            name={`datasetRelationList[${index}].reportDatasetIdRight`}
                                                                                                            label="type"
                                                                                                            onChange={(
                                                                                                                e
                                                                                                            ) => {
                                                                                                                setFieldValue(
                                                                                                                    `datasetRelationList[${index}].reportDatasetIdRight`,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value
                                                                                                                );
                                                                                                                setRightColumnList(
                                                                                                                    index,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value
                                                                                                                );
                                                                                                            }}
                                                                                                        >
                                                                                                            <option value="0">
                                                                                                                Select
                                                                                                                Data
                                                                                                                Set
                                                                                                            </option>

                                                                                                            {values.datasetList.map(
                                                                                                                (
                                                                                                                    item
                                                                                                                ) => {
                                                                                                                    return (
                                                                                                                        item.saved && (
                                                                                                                            <option
                                                                                                                                value={
                                                                                                                                    item.reportDatasetId
                                                                                                                                }
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    item.datasetName
                                                                                                                                }
                                                                                                                            </option>
                                                                                                                        )
                                                                                                                    );
                                                                                                                }
                                                                                                            )}
                                                                                                        </Field>
                                                                                                        <ErrorMessage
                                                                                                            name={`datasetRelationList[${index}].reportDatasetIdRight`}
                                                                                                        >
                                                                                                            {() => (
                                                                                                                <small className="text-danger mt-3 mb-0">
                                                                                                                    Required
                                                                                                                </small>
                                                                                                            )}
                                                                                                        </ErrorMessage>
                                                                                                    </>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <Field
                                                                                                        as="select"
                                                                                                        type="select"
                                                                                                        className="form-select"
                                                                                                        name={`datasetRelationList[${index}].datasetColumnNameRight`}
                                                                                                        label="type"
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Select
                                                                                                            Column
                                                                                                            Set
                                                                                                        </option>
                                                                                                        {values.rightColumnSetList &&
                                                                                                            values
                                                                                                                .rightColumnSetList[
                                                                                                                index
                                                                                                            ]
                                                                                                                ?.length >
                                                                                                                0 &&
                                                                                                            values.rightColumnSetList[
                                                                                                                index
                                                                                                            ].map(
                                                                                                                (
                                                                                                                    itm
                                                                                                                ) => {
                                                                                                                    return (
                                                                                                                        <option
                                                                                                                            value={
                                                                                                                                itm.columnName
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {
                                                                                                                                itm.columnName
                                                                                                                            }
                                                                                                                        </option>
                                                                                                                    );
                                                                                                                }
                                                                                                            )}
                                                                                                    </Field>
                                                                                                    <ErrorMessage
                                                                                                        name={`datasetRelationList[${index}].datasetColumnNameRight`}
                                                                                                    >
                                                                                                        {() => (
                                                                                                            <small className="text-danger mt-3 mb-0">
                                                                                                                Required
                                                                                                            </small>
                                                                                                        )}
                                                                                                    </ErrorMessage>
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
                                                                                                                        let value =
                                                                                                                            JSON.parse(
                                                                                                                                JSON.stringify(
                                                                                                                                    values
                                                                                                                                )
                                                                                                                            );
                                                                                                                        willDelete &&
                                                                                                                            (arrayHelpers.remove(
                                                                                                                                index
                                                                                                                            ),
                                                                                                                            delete value
                                                                                                                                .datasetRelationList[
                                                                                                                                index
                                                                                                                            ],
                                                                                                                            setStatus(
                                                                                                                                true
                                                                                                                            ));
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
                                                                                                8
                                                                                            }
                                                                                        >
                                                                                            No
                                                                                            Data
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </Col>
                                                            </div>
                                                        </>
                                                    )}
                                                />
                                                {/*  )} */}
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* </DefaultCard> */}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={createDatasetModal}
                onHide={closeModal}
                centered
                size="xl"
                fullscreen="xl-down"
                style={{ background: "#80808066" }}
            >
                <Modal.Header>
                    <Modal.Title>Add New DataSet</Modal.Title>
                    <Button
                        style={{ position: "absolute", top: 0, right: 0 }}
                        variant="secondary"
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </Modal.Header>
                <Modal.Body className="modal-inner ">
                    <label>
                        Dataset Name <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control mt-0"
                        placeHolder="Enter Dataset Name"
                        onChange={(e) => {
                            setDatasetName(e.target.value);
                        }}
                    />

                    <label className="mt-20">
                        Dataset Alias Name{" "}
                        <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control mt-0"
                        placeHolder="Enter Dataset Alias Name"
                        onChange={(e) => {
                            setDatasetAliasName(e.target.value);
                        }}
                    />

                    <label className="mt-20">
                        Raw SQL <span className="text-danger">*</span>
                        <a href="#" title="Only SELECT query will execute">
                            {" "}
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </a>
                    </label>
                    <textarea
                        rows="10"
                        className="form-control mt-0"
                        placeHolder="Only SELECT query will execute"
                        onChange={(e) => {
                            setRawSql(e.target.value);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant="gray"
                        onClick={() => {
                            createNewDataSet(
                                datasetName,
                                datasetAliasName,
                                rawSql
                            );
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={editDatasetModal}
                onHide={closeModal}
                centered
                size="md"
                fullscreen="sm-down"
                style={{ background: "#80808066" }}
            >
                <Modal.Header>
                    <Modal.Title>Edit DataSet</Modal.Title>
                    <Button
                        style={{ position: "absolute", top: 0, right: 0 }}
                        variant="secondary"
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <label>
                        Dataset Name <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control mt-10"
                        value={datasetName}
                        onChange={(e) => {
                            setDatasetName(e.target.value);
                        }}
                    />

                    <label>
                        Dataset Alias Name{" "}
                        <span className="text-danger">*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control mt-10"
                        value={datasetAliasName}
                        onChange={(e) => {
                            setDatasetAliasName(e.target.value);
                        }}
                    />

                    <label>
                        Raw SQL <span className="text-danger">*</span>
                        <a href="#" title="Only SELECT query will execute">
                            {" "}
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </a>
                    </label>
                    <textarea
                        rows={10}
                        className="form-control mt-10"
                        value={rawSql}
                        onChange={(e) => {
                            setRawSql(e.target.value);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant="gray"
                        onClick={() => {
                            editDataSet(
                                datasetName,
                                datasetAliasName,
                                rawSql,
                                dataSetId
                            );
                        }}
                    >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DataSetRelationForm;
