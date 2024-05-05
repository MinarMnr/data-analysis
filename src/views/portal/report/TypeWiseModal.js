import { useEffect, useState } from "react";
import {
    faArrowUp,
    faArrowDown,
    faEdit,
    faDatabase,
    faPlus,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Row, Modal, Col } from "@themesberg/react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { setToastAlert } from "reducers/toastAlertSlice";
import { selectApi } from "reducers/apiSlice";
import "./FormulaModal.css";
import { UrlBuilder } from "helpers/UrlBuilder";
import InputSelectApi from "components/form/InputSelectApi";
import ErrorMessage from "components/text/ErrorMessage";
import { Field, FieldArray } from "formik/dist/index";
import SearchComboBox from "components/form/SearchComboBox";
import CustomInputComboBox from "components/form/CustomInputComboBox";
import { InputField, InputSelect } from "components/form";
import swal from "sweetalert";
import store from "reducers/store";

//import ReportSectionType from "constants/ReportSectionType";

const TypeWiseModal = ({
    values,
    setFieldValue,
    reportSectionType,
    formType,
}) => {
    var values = JSON.parse(JSON.stringify(values));
    // const [selectedList, setSelectedList] =
    //     ReportSectionType[typeName] == typeName
    //         ? useState(values?.groupList)
    //         : useState(values?.filterList);

    const [selectedList, setSelectedList] = useState(
        values?.[`${reportSectionType}`]
    );

    const [datasetList, setDatasetList] = useState(values?.datasetList);

    useEffect(() => {
        if (formType == "edit") {
            let savedDatasetList = values?.datasetList.filter(
                (item) => item.saved
            );
            setDatasetList(savedDatasetList);
        }
    }, [values?.reportId, formType]);

    // useEffect(() => {
    //     setSelectedList(values?.[`${reportSectionType}`]);
    // }, [reportSectionType]);

    //const [reportSectionType] = useState(ReportSectionType[typeName]);

    const [isAliasOpen, setIsAliasOpen] = useState(false);
    const [aliasValue, setAliasValue] = useState("");
    const [aliasIndex, setAliasindex] = useState(undefined);
    const [titleValue, setTitleValue] = useState("");

    const [isFormulaOpen, setIsFormulaOpen] = useState(false);
    const [formulaValue, setFormulaValue] = useState("");
    const [formulaIndex, setFormulaindex] = useState(undefined);

    const [suggestions, setSuggestions] = useState([]);

    const {
        columns = {
            data: [],
        },
    } = useSelector(selectApi);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFormulaValue(value);

        // Check if the last character is a whitespace
        const isWhitespace = /\s$/.test(value);

        // Check if there are at least two words
        const words = value.split(" ");
        if (isWhitespace) {
            setSuggestions([]);
        } else {
            // Set the suggestions based on your list (replace the list with your own values)
            //const listValues = columns?.data.map((a) => a.columnName);

            const listValues = columns?.data?.map((item) => {
                // return `${item?.columnName}${`<${
                //     item?.datasetAlias ? item?.datasetAlias : item?.datasetName
                // }>`}`;

                return `${`<<${
                    item?.datasetAlias ? item?.datasetAlias : item?.datasetName
                }>>`}${item?.columnName}`;
            });

            const filteredSuggestions =
                listValues &&
                listValues.length > 0 &&
                listValues.filter(
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
        setFormulaValue((prevValue) => {
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

    const formulaAdd = (row, index) => {
        setIsFormulaOpen(true);
        setFormulaValue(row?.columnFormula);
        setFormulaindex(index);
    };
    const closeFormulaModal = () => {
        setIsFormulaOpen(false);
        setFormulaValue("");
        setFormulaindex(undefined);
    };

    const [isPivotFormulaOpen, setIsPivotFormulaOpen] = useState(false);
    const [pivotFormulaValue, setPivotFormulaValue] = useState("");
    const [pivotFormulaIndex, setPivotFormulaIndex] = useState(undefined);
    const [pivotFormulaMainIndex, setPivotFormulaMainIndex] =
        useState(undefined);

    const [suggestionsPivot, setSuggestionsPivot] = useState([]);

    const pivotFormulaAdd = (row, rowIndex, mainIndex) => {
        setIsPivotFormulaOpen(true);
        setPivotFormulaValue(row?.columnFormula);
        setPivotFormulaIndex(rowIndex);
        setPivotFormulaMainIndex(mainIndex);
    };

    const closePivotFormulaModal = () => {
        setIsPivotFormulaOpen(false);
        setPivotFormulaValue("");
        setPivotFormulaIndex(undefined);
        setPivotFormulaMainIndex(undefined);
    };

    const handlePivotInputChange = (e) => {
        const value = e.target.value;
        setPivotFormulaValue(value);

        // Check if the last character is a whitespace
        const isWhitespace = /\s$/.test(value);

        // Check if there are at least two words
        const words = value.split(" ");
        if (isWhitespace) {
            setSuggestionsPivot([]);
        } else {
            // Set the suggestions based on your list (replace the list with your own values)
            //const listValues = columns?.data.map((a) => a.columnName);

            const listValues = columns?.data?.map((item) => {
                // return `${item?.columnName}${`<${
                //     item?.datasetAlias ? item?.datasetAlias : item?.datasetName
                // }>`}`;

                return `${`<<${
                    item?.datasetAlias ? item?.datasetAlias : item?.datasetName
                }>>`}${item?.columnName}`;
            });
            var filterValue = [];

            if (
                values &&
                values.pivotList &&
                values?.pivotList?.[pivotFormulaMainIndex] &&
                values?.pivotList?.[pivotFormulaMainIndex]
                    ?.columnFilterValues &&
                values?.pivotList?.[pivotFormulaMainIndex]?.columnFilterValues
                    .length > 0 &&
                listValues &&
                listValues.length > 0
            ) {
                filterValue = values.pivotList?.[
                    pivotFormulaMainIndex
                ]?.columnFilterValues.map((item) => {
                    return `${`<<${item?.name}>>`}FILTER_VALUE`;
                });
            } else {
                filterValue = store
                    .getState()
                    .api[`columnFilterValues${pivotFormulaMainIndex}`].data.map(
                        (item) => {
                            return `${`<<${item?.name}>>`}FILTER_VALUE`;
                        }
                    );
            }

            const filterValueSuggestionsPivot = filterValue.filter((item) =>
                item
                    .toLowerCase()
                    .includes(words[words.length - 1].toLowerCase())
            );

            const filteredSuggestionsPivot =
                listValues &&
                listValues.length > 0 &&
                listValues.filter(
                    (item) =>
                        item
                            .toLowerCase()
                            .includes(words[words.length - 1].toLowerCase())
                    //.startsWith(words[words.length - 1].toLowerCase())
                );

            //setSuggestionsPivot(filteredSuggestionsPivot);

            setSuggestionsPivot(
                filteredSuggestionsPivot.concat(filterValueSuggestionsPivot)
            );
        }
    };

    const handleSelectPivotValue = (value) => {
        // let parseSelectedValues = value.split("<<") ?? [];

        // if (parseSelectedValues?.length > 0) {
        //     value = "<<" + parseSelectedValues[1] + parseSelectedValues[0];
        // }
        setPivotFormulaValue((prevValue) => {
            // Remove the last word and add the selected suggestion

            if (prevValue.length > 0) {
                const words = prevValue.split(" ");
                words.pop();
                return words.join(" ") + " " + value;
            } else {
                return value;
            }
        });
        setSuggestionsPivot([]);
    };

    const updatePivotFormula = async (val, itemIndex, mainIndex) => {
        // let newFields = [...values];
        // newFields[index].columnFormula = val;
        await setFieldValue(
            `${reportSectionType}[${mainIndex}].pivotValueList[${itemIndex}].columnFormula`,
            val
        );

        // setSelectedList(newFields);
        dispatch(
            setToastAlert({
                type: "success",
                message: "Column Formula Change Successfully",
            })
        );

        setIsPivotFormulaOpen(false);
        setPivotFormulaValue("");
        setPivotFormulaIndex(undefined);
        setPivotFormulaMainIndex(undefined);
        // setIsFormulaOpen(false);
        // setFormulaValue("");
        // setFormulaindex(undefined);
    };

    const aliasNameChange = (row, index) => {
        setIsAliasOpen(true);
        setAliasValue(row?.columnAlias);
        setTitleValue(row?.columnTitle);
        setAliasindex(index);
    };
    const closeModal = () => {
        setIsAliasOpen(false);
        setAliasValue("");
        setTitleValue("");
        setAliasindex(undefined);
    };

    const dispatch = useDispatch();

    const updateFormula = async (val, index) => {
        let newFields = [...selectedList];
        newFields[index].columnFormula = val;

        await setFieldValue(`${reportSectionType}`, newFields);

        setSelectedList(newFields);

        dispatch(
            setToastAlert({
                type: "success",
                message: "Column Formula Change Successfully",
            })
        );
        setIsFormulaOpen(false);
        setFormulaValue("");
        setFormulaindex(undefined);
    };

    const updateAliasName = async (aliasVal, titleVal, index) => {
        let newFields = [...selectedList];
        newFields[index].columnAlias = aliasVal;
        newFields[index].columnTitle = titleVal;

        await setFieldValue(`${reportSectionType}`, newFields);

        setSelectedList(newFields);

        dispatch(
            setToastAlert({
                type: "success",
                message: "Column Alias/Title Name Change Successfully",
            })
        );
        setAliasValue("");
        setTitleValue("");
        setAliasindex(undefined);
        setIsAliasOpen(false);
    };

    // const removeInstitute = (row, index) => {
    //     let newFields = [...selectedList];
    //     // var newTableData = [...tableData];

    //     // const newState = newTableData.map((obj, i) =>
    //     //     i == index ? { ...obj, ...obj.wasChosen, wasChosen: 0 } : obj
    //     // );
    //     // setTableData(newState);

    //     newFields.splice(index, 1);

    //     setSelectedList(newFields);

    //     setFieldValue("groupList", newFields);
    //     dispatch(
    //         setToastAlert({
    //             type: "warn",
    //             message: "Column Removed Successfully",
    //         })
    //     );
    // };

    const arraymove = (arr, fromIndex, toIndex) => {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);

        // values?.groupList.map((obj, i) => {
        //     obj["orderIndex"] = i + 1;
        // });
        setSelectedList([...values?.[`${reportSectionType}`]]);
        //onModalChange(values?.groupList);

        setFieldValue(`${reportSectionType}`, arr);
    };

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        const reorder = (list, startIndex, endIndex) => {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        };

        const items = reorder(
            selectedList,
            result.source.index,
            result.destination.index
        );

        setSelectedList([...items]);

        // items.map((obj, i) => {
        //     obj["orderIndex"] = i + 1;
        // });

        setFieldValue(`${reportSectionType}`, items);
    }

    const getListStyle = (isDraggingOver) => ({
        background: isDraggingOver && "#eaedf2",
        padding: "15px",
    });
    const getItemStyle = (isDragging, draggableStyle) => ({
        ...draggableStyle,
        userSelect: "none",
        position: "static",
        padding: "15px",
        //margin: "5px",
        background: isDragging ? "#b2dfdb94" : "white",
        border: "1px solid #eaedf2",
    });

    return (
        <>
            {/* <Card.Body>
                <Row>
                    <div className="table-responsive">
                        <div className=""> */}
            {selectedList?.length > 0 && (
                <>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" direction="vertical">
                            {(provided, snapshot) => (
                                <div
                                    className="dragable-all"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(
                                        snapshot.isDraggingOver
                                    )}
                                >
                                    {selectedList.map((row, index) => (
                                        <Draggable
                                            key={row?.label}
                                            //draggableId={`${row?.columnAlias} (${row?.datasetName})`}
                                            draggableId={
                                                row?.datasetName +
                                                row?.columnName
                                            }
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    //className="dragable-all2"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps
                                                            .style
                                                    )}
                                                >
                                                    <>
                                                        <div className="divbg">
                                                            <Row className="bg-al">
                                                                <div className="col-lg-1 col-1 p-0  justify-content-center m-auto">
                                                                    <p className="p-bgcolor">
                                                                        {" "}
                                                                        <span>
                                                                            {index +
                                                                                1}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <div className="col-lg-11 col-11 p-0">
                                                                    <Row>
                                                                        <div className="col-lg-5 col-12 my-auto">
                                                                            <div className="row">
                                                                                <div className="col-lg-12">
                                                                                    <h5 className="text-primary m-b-5 tx-14 text-break">
                                                                                        {
                                                                                            row?.columnAlias
                                                                                        }{" "}
                                                                                        (
                                                                                        {
                                                                                            row?.datasetName
                                                                                        }

                                                                                        )
                                                                                    </h5>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-lg-6 col-12">
                                                                            <Row>
                                                                                {reportSectionType !=
                                                                                "groupList" ? (
                                                                                    <>
                                                                                        <div className="float-end col-lg-6">
                                                                                            <InputSelect
                                                                                                label="Column Aggregate Function"
                                                                                                name={`${reportSectionType}[${index}].columnAggregateFunction`}
                                                                                                type="text"
                                                                                                value="id"
                                                                                                text="name"
                                                                                                data={[
                                                                                                    {
                                                                                                        id: "SUM",
                                                                                                        name: "SUM",
                                                                                                    },
                                                                                                    {
                                                                                                        id: "MIN",
                                                                                                        name: "MIN",
                                                                                                    },
                                                                                                    {
                                                                                                        id: "MAX",
                                                                                                        name: "MAX",
                                                                                                    },
                                                                                                    {
                                                                                                        id: "AVG",
                                                                                                        name: "AVG",
                                                                                                    },
                                                                                                    {
                                                                                                        id: "COUNT",
                                                                                                        name: "COUNT",
                                                                                                    },
                                                                                                    {
                                                                                                        id: "DISTINCT_COUNT",
                                                                                                        name: "DISTINCT COUNT",
                                                                                                    },
                                                                                                ]}
                                                                                                onChange={async (
                                                                                                    e
                                                                                                ) => {
                                                                                                    let newFields =
                                                                                                        [
                                                                                                            ...selectedList,
                                                                                                        ];

                                                                                                    newFields[
                                                                                                        index
                                                                                                    ].columnAggregateFunction =
                                                                                                        e.target.value;

                                                                                                    await setFieldValue(
                                                                                                        `${reportSectionType}`,
                                                                                                        newFields
                                                                                                    );

                                                                                                    setSelectedList(
                                                                                                        newFields
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="float-end text-center col-lg-3 top24 btn-modal-inline">
                                                                                            <button
                                                                                                className="top-20 d-block bg-primary btn text-white mr-5 p-5 m-5 w-sp"
                                                                                                // variant="link"
                                                                                                onClick={() =>
                                                                                                    aliasNameChange(
                                                                                                        row,
                                                                                                        index
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    className="mr-2"
                                                                                                    icon={
                                                                                                        faEdit
                                                                                                    }
                                                                                                />
                                                                                                Cloumn
                                                                                                Alias
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="float-end text-center col-lg-2 top24 btn-modal-inline1">
                                                                                            <button
                                                                                                className={`top-20 ri7al d-block w-sp  ${
                                                                                                    row?.columnFormula ==
                                                                                                        "" ||
                                                                                                    row?.columnFormula ==
                                                                                                        null ||
                                                                                                    row?.columnFormula ==
                                                                                                        undefined
                                                                                                        ? "bg-danger"
                                                                                                        : "bg-success"
                                                                                                } btn text-white mr-5 p-5 m-5`}
                                                                                                // variant="link"
                                                                                                onClick={() =>
                                                                                                    formulaAdd(
                                                                                                        row,
                                                                                                        index
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    className="mr-2"
                                                                                                    icon={
                                                                                                        faDatabase
                                                                                                    }
                                                                                                />
                                                                                                Formula
                                                                                            </button>
                                                                                        </div>
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="float-end text-center col-lg-11"></div>
                                                                                )}
                                                                                <div
                                                                                    className={`float-end text-center col-lg-1 d-flex btn-modal-inline2 
                                                                                                    ${
                                                                                                        reportSectionType !=
                                                                                                            "groupList" &&
                                                                                                        "top24"
                                                                                                    }`}
                                                                                >
                                                                                    {index !=
                                                                                        0 && (
                                                                                        <button
                                                                                            className="d-block bg-success btn text-white btn-arr"
                                                                                            // variant="link"
                                                                                            onClick={() =>
                                                                                                arraymove(
                                                                                                    values?.[
                                                                                                        `${reportSectionType}`
                                                                                                    ],
                                                                                                    index,
                                                                                                    index -
                                                                                                        1
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                icon={
                                                                                                    faArrowUp
                                                                                                }
                                                                                            />
                                                                                        </button>
                                                                                    )}

                                                                                    {/* <button
                                                                                                        className="d-block bg-danger btn text-white mr-5 p-5 m-5"
                                                                                                        // variant="link"
                                                                                                        onClick={() =>
                                                                                                            removeInstitute(
                                                                                                                row,
                                                                                                                index
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        <FontAwesomeIcon
                                                                                                            icon={
                                                                                                                faTrashAlt
                                                                                                            }
                                                                                                        />
                                                                                                    </button> */}

                                                                                    {index !=
                                                                                        selectedList?.length -
                                                                                            1 && (
                                                                                        <button
                                                                                            className="d-block bg-warning  btn text-white btn-arr"
                                                                                            // variant="link"
                                                                                            onClick={() =>
                                                                                                arraymove(
                                                                                                    values?.[
                                                                                                        `${reportSectionType}`
                                                                                                    ],
                                                                                                    index,
                                                                                                    index +
                                                                                                        1
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                icon={
                                                                                                    faArrowDown
                                                                                                }
                                                                                            />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </Row>
                                                                        </div>
                                                                    </Row>
                                                                </div>
                                                                {/* {reportSectionType ==
                                                                                    "groupList" ? (
                                                                                        <div className="col-lg-5">
                                                                                            <InputSelect
                                                                                                label="Parent Column Name"
                                                                                                name={`${reportSectionType}[${index}].parentColumnName`}
                                                                                                type="text"
                                                                                                value="label"
                                                                                                text="label"
                                                                                                data={
                                                                                                    selectedList
                                                                                                }
                                                                                                onChange={async (
                                                                                                    e
                                                                                                ) => {
                                                                                                    let newFields =
                                                                                                        [
                                                                                                            ...selectedList,
                                                                                                        ];

                                                                                                    newFields[
                                                                                                        index
                                                                                                    ].parentColumnName =
                                                                                                        e.target.value;

                                                                                                    await setFieldValue(
                                                                                                        `${reportSectionType}`,
                                                                                                        newFields
                                                                                                    );

                                                                                                    await setSelectedList(
                                                                                                        newFields
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    ) : null} */}

                                                                {reportSectionType ==
                                                                "columnList" ? (
                                                                    <>
                                                                        <div className="col-lg-4 mt-14 pb-6 bg-white">
                                                                            <InputField
                                                                                label="Merged Column Header"
                                                                                name={`${reportSectionType}[${index}].mergedColumnName`}
                                                                                type="text"
                                                                                placeholder="Merged Column Header"
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-4 mt-14 pb-6 bg-white">
                                                                            <InputSelect
                                                                                label="Column Grand Calculation Type"
                                                                                name={`${reportSectionType}[${index}].columnGrandCalcType`}
                                                                                type="text"
                                                                                value="id"
                                                                                text="name"
                                                                                data={[
                                                                                    {
                                                                                        id: "sum",
                                                                                        name: "SUM",
                                                                                    },
                                                                                    {
                                                                                        id: "min",
                                                                                        name: "MIN",
                                                                                    },
                                                                                    {
                                                                                        id: "max",
                                                                                        name: "MAX",
                                                                                    },
                                                                                    {
                                                                                        id: "avg",
                                                                                        name: "AVG",
                                                                                    },
                                                                                    {
                                                                                        id: "count",
                                                                                        name: "COUNT",
                                                                                    },
                                                                                    {
                                                                                        id: "concat",
                                                                                        name: "CONCAT",
                                                                                    },
                                                                                    {
                                                                                        id: "unique",
                                                                                        name: "UNIQUE",
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </div>

                                                                        <div className="col-lg-4 mt-14 pb-6 bg-white">
                                                                            <InputSelect
                                                                                label="Column Precision"
                                                                                name={`${reportSectionType}[${index}].columnPrecision`}
                                                                                type="text"
                                                                                value="id"
                                                                                text="name"
                                                                                data={[
                                                                                    {
                                                                                        id: 0,
                                                                                        name: 0,
                                                                                    },
                                                                                    {
                                                                                        id: 1,
                                                                                        name: 1,
                                                                                    },
                                                                                    {
                                                                                        id: 2,
                                                                                        name: 2,
                                                                                    },
                                                                                    {
                                                                                        id: 3,
                                                                                        name: 3,
                                                                                    },
                                                                                    {
                                                                                        id: 4,
                                                                                        name: 4,
                                                                                    },
                                                                                    {
                                                                                        id: 5,
                                                                                        name: 5,
                                                                                    },
                                                                                    {
                                                                                        id: 6,
                                                                                        name: 6,
                                                                                    },
                                                                                    {
                                                                                        id: 7,
                                                                                        name: 7,
                                                                                    },
                                                                                    {
                                                                                        id: 8,
                                                                                        name: 8,
                                                                                    },
                                                                                    {
                                                                                        id: 9,
                                                                                        name: 9,
                                                                                    },
                                                                                    {
                                                                                        id: 10,
                                                                                        name: 10,
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </div>

                                                                        <div className="col-lg-4 mt-14 pb-6 bg-white">
                                                                            <InputSelect
                                                                                label="Column Order Type"
                                                                                name={`${reportSectionType}[${index}].columnOrderType`}
                                                                                type="text"
                                                                                value="id"
                                                                                text="name"
                                                                                data={[
                                                                                    {
                                                                                        id: "ASC",
                                                                                        name: "ASCENDING",
                                                                                    },
                                                                                    {
                                                                                        id: "DESC",
                                                                                        name: "DESCENDING",
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </div>

                                                                        <div className="col-lg-2">
                                                                            <label className="form-label p-10">
                                                                                visible?
                                                                                <Field
                                                                                    className="mb-10"
                                                                                    type="checkbox"
                                                                                    name={`${reportSectionType}[${index}].isVisible`}
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        setFieldValue(
                                                                                            `${reportSectionType}[${index}].isVisible`,
                                                                                            e
                                                                                                .target
                                                                                                .checked
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </label>
                                                                            {/* <InputSelect
                                                                                                    label="Is visible?"
                                                                                                    name={`${reportSectionType}[${index}].isVisible`}
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
                                                                    </>
                                                                ) : null}

                                                                {reportSectionType ==
                                                                "filterList" ? (
                                                                    <>
                                                                        <div className="col-lg-4 mt-14 pb-6 bg-white">
                                                                            <InputSelectApi
                                                                                label="Control Type"
                                                                                name={`${reportSectionType}[${index}].controlType`}
                                                                                operationId={UrlBuilder.report(
                                                                                    `control-type/list`
                                                                                )}
                                                                                storeName="controlType"
                                                                                value="id"
                                                                                text="name"
                                                                                type="text"
                                                                                required={
                                                                                    true
                                                                                }
                                                                            />
                                                                            <ErrorMessage
                                                                                fieldName={`${reportSectionType}[${index}].controlType`}
                                                                            />
                                                                        </div>

                                                                        <div className="col-lg-4 bg-white mt-14">
                                                                            <InputSelect
                                                                                label="Is Required?"
                                                                                name={`${reportSectionType}[${index}].isRequired`}
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
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-4 bg-white mt-14">
                                                                            <InputSelect
                                                                                label="Is Multiple select?"
                                                                                name={`${reportSectionType}[${index}].isMultiSelect`}
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
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-4 bg-white mt-14">
                                                                            <InputSelect
                                                                                label="Column Order Type"
                                                                                name={`${reportSectionType}[${index}].columnOrderType`}
                                                                                type="text"
                                                                                value="id"
                                                                                text="name"
                                                                                data={[
                                                                                    {
                                                                                        id: "ASC",
                                                                                        name: "ASCENDING",
                                                                                    },
                                                                                    {
                                                                                        id: "DESC",
                                                                                        name: "DESCENDING",
                                                                                    },
                                                                                ]}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                ) : null}

                                                                {/* {reportSectionType ==
                                                                                        "filterList" &&
                                                                                    values
                                                                                        ?.filterList[
                                                                                        index
                                                                                    ]
                                                                                        .controlType ==
                                                                                        5 ? (
                                                                                        <>
                                                                                            <div className="col-lg-3">
                                                                                                <InputSelectApi
                                                                                                    label="From Date"
                                                                                                    name={`${reportSectionType}[${index}].controlTypeDateFrom`}
                                                                                                    operationId={UrlBuilder.report(
                                                                                                        `control-type/date-range-option/list`
                                                                                                    )}
                                                                                                    storeName="controlTypeDateFrom"
                                                                                                    value="name"
                                                                                                    text="name"
                                                                                                    type="text"
                                                                                                />
                                                                                                <ErrorMessage
                                                                                                    fieldName={`${reportSectionType}[${index}].controlTypeDateFrom`}
                                                                                                />
                                                                                            </div>

                                                                                            <div className="col-lg-3">
                                                                                                <InputSelectApi
                                                                                                    label="To Date"
                                                                                                    name={`${reportSectionType}[${index}].controlTypeDateTo`}
                                                                                                    operationId={UrlBuilder.report(
                                                                                                        `control-type/date-range-option/list`
                                                                                                    )}
                                                                                                    storeName="controlTypeDateTo"
                                                                                                    value="name"
                                                                                                    text="name"
                                                                                                    type="text"
                                                                                                />
                                                                                                <ErrorMessage
                                                                                                    fieldName={`${reportSectionType}[${index}].controlTypeDateTo`}
                                                                                                />
                                                                                            </div>
                                                                                        </>
                                                                                    ) : null} */}

                                                                {reportSectionType ==
                                                                    "filterList" &&
                                                                values
                                                                    ?.filterList[
                                                                    index
                                                                ].controlType ==
                                                                    1 ? (
                                                                    <>
                                                                        <div className="col-lg-4">
                                                                            <InputSelect
                                                                                label="Control Type Text Field"
                                                                                name={`${reportSectionType}[${index}].columnText`}
                                                                                type="text"
                                                                                value="columnName"
                                                                                text="columnName"
                                                                                otherText="datasetName"
                                                                                data={
                                                                                    columns.data
                                                                                }
                                                                            />

                                                                            <ErrorMessage
                                                                                fieldName={`${reportSectionType}[${index}].columnText`}
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <InputSelect
                                                                                label="Dependent Column"
                                                                                name={`${reportSectionType}[${index}].parentColumnName`}
                                                                                type="text"
                                                                                value="columnName"
                                                                                text="columnName"
                                                                                otherText="datasetName"
                                                                                data={
                                                                                    columns.data
                                                                                }
                                                                            />

                                                                            <ErrorMessage
                                                                                fieldName={`${reportSectionType}[${index}].parentColumnName`}
                                                                            />
                                                                        </div>
                                                                    </>
                                                                ) : null}

                                                                {reportSectionType ==
                                                                "pivotList" ? (
                                                                    <>
                                                                        <div className="col-lg-4">
                                                                            <InputSelect
                                                                                label="Coulmn Text Field"
                                                                                name={`${reportSectionType}[${index}].columnText`}
                                                                                type="text"
                                                                                value="columnName"
                                                                                text="columnName"
                                                                                otherText="datasetName"
                                                                                data={
                                                                                    columns.data
                                                                                }
                                                                                onChange={async (
                                                                                    e
                                                                                ) => {
                                                                                    await setFieldValue(
                                                                                        `${reportSectionType}[${index}].columnText`,
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }}
                                                                            />

                                                                            <ErrorMessage
                                                                                fieldName={`${reportSectionType}[${index}].columnText`}
                                                                            />
                                                                        </div>

                                                                        <div className="col-lg-4">
                                                                            <InputSelect
                                                                                label="Coulmn Grand Calc Type"
                                                                                name={`${reportSectionType}[${index}].columnGrandCalcType`}
                                                                                type="text"
                                                                                value="id"
                                                                                text="name"
                                                                                data={[
                                                                                    {
                                                                                        id: "sum",
                                                                                        name: "SUM",
                                                                                    },
                                                                                    {
                                                                                        id: "min",
                                                                                        name: "MIN",
                                                                                    },
                                                                                    {
                                                                                        id: "max",
                                                                                        name: "MAX",
                                                                                    },
                                                                                    {
                                                                                        id: "avg",
                                                                                        name: "AVG",
                                                                                    },
                                                                                    {
                                                                                        id: "count",
                                                                                        name: "COUNT",
                                                                                    },
                                                                                    {
                                                                                        id: "concat",
                                                                                        name: "CONCAT",
                                                                                    },
                                                                                    {
                                                                                        id: "unique",
                                                                                        name: "UNIQUE",
                                                                                    },
                                                                                ]}
                                                                                onChange={async (
                                                                                    e
                                                                                ) => {
                                                                                    await setFieldValue(
                                                                                        `${reportSectionType}[${index}].columnGrandCalcType`,
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label class="form-label">
                                                                                Filter
                                                                                Values
                                                                            </label>
                                                                            <SearchComboBox
                                                                                title="name"
                                                                                name={`${reportSectionType}[${index}].columnFilterValues`}
                                                                                setField={
                                                                                    setFieldValue
                                                                                }
                                                                                storeName={`columnFilterValues${index}`}
                                                                                isMultiple={
                                                                                    true
                                                                                }
                                                                                formType={
                                                                                    formType
                                                                                }
                                                                                operationId={UrlBuilder.report(
                                                                                    `filter/dropdown-options?datasetName=${
                                                                                        row.datasetName
                                                                                    }&columnName=${
                                                                                        row.columnName
                                                                                    }${
                                                                                        values
                                                                                            .pivotList[
                                                                                            index
                                                                                        ]
                                                                                            .columnText
                                                                                            ? `&columnText=${values.pivotList[index].columnText}`
                                                                                            : ""
                                                                                    }&isMultiple=${false}&appModuleId=${localStorage.getItem(
                                                                                        "moduleId"
                                                                                    )}
                                                                                    `
                                                                                )}
                                                                                allValue={
                                                                                    values
                                                                                        .pivotList?.[
                                                                                        index
                                                                                    ]
                                                                                        ?.columnFilterValues
                                                                                }
                                                                                placeHolder="Filter Values"
                                                                                selectType="object"
                                                                            ></SearchComboBox>
                                                                        </div>
                                                                        <div className="contentBoxBody mt-20"></div>

                                                                        <div className="row">
                                                                            <div className="col-xl-12 p-10">
                                                                                <div className="card-body">
                                                                                    <div>
                                                                                        <Row>
                                                                                            <FieldArray
                                                                                                name={`${reportSectionType}[${index}].pivotValueList`}
                                                                                                render={(
                                                                                                    arrayHelpers
                                                                                                ) => (
                                                                                                    <>
                                                                                                        <div className="contentBox-modified border-style-all-acc">
                                                                                                            <div className="section-header-custom btn-tab-round">
                                                                                                                <h5 className="m-4 text-white">
                                                                                                                    Pivot
                                                                                                                    Values
                                                                                                                </h5>
                                                                                                            </div>
                                                                                                            <div className="row">
                                                                                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 p-5 border-bottom-cus mb-5">
                                                                                                                    <Button
                                                                                                                        onClick={(
                                                                                                                            count
                                                                                                                        ) => {
                                                                                                                            arrayHelpers.push(
                                                                                                                                {
                                                                                                                                    datasetId: 0,
                                                                                                                                    columnName:
                                                                                                                                        "",
                                                                                                                                    columnAlias:
                                                                                                                                        "",
                                                                                                                                    columnFormula:
                                                                                                                                        "",
                                                                                                                                    columnText:
                                                                                                                                        "",
                                                                                                                                    columnAggregateFunction:
                                                                                                                                        "",
                                                                                                                                    columnGrandCalcType:
                                                                                                                                        "",
                                                                                                                                    columnPrecision:
                                                                                                                                        "",
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
                                                                                                                md={
                                                                                                                    12
                                                                                                                }
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
                                                                                                                                    Dataset
                                                                                                                                    Name
                                                                                                                                    *
                                                                                                                                </th>
                                                                                                                                <th className="wd-300">
                                                                                                                                    Column
                                                                                                                                    Name *
                                                                                                                                </th>

                                                                                                                                <th className="wd-300">
                                                                                                                                    Column
                                                                                                                                    Alias
                                                                                                                                </th>
                                                                                                                                <th className="wd-100">
                                                                                                                                    Column
                                                                                                                                    Formula
                                                                                                                                </th>
                                                                                                                                <th className="wd-100">
                                                                                                                                    Column
                                                                                                                                    AggregateFunction
                                                                                                                                    *
                                                                                                                                </th>
                                                                                                                                <th className="wd-100">
                                                                                                                                    Column
                                                                                                                                    Grand
                                                                                                                                    Calc
                                                                                                                                    Type
                                                                                                                                    *
                                                                                                                                </th>
                                                                                                                                <th className="wd-100">
                                                                                                                                    Column
                                                                                                                                    Precision
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
                                                                                                                            {values.pivotList &&
                                                                                                                            values
                                                                                                                                .pivotList[
                                                                                                                                index
                                                                                                                            ]
                                                                                                                                .pivotValueList
                                                                                                                                .length >
                                                                                                                                0 ? (
                                                                                                                                values.pivotList[
                                                                                                                                    index
                                                                                                                                ].pivotValueList.map(
                                                                                                                                    (
                                                                                                                                        item,
                                                                                                                                        itemIndex
                                                                                                                                    ) => (
                                                                                                                                        <tr
                                                                                                                                            key={
                                                                                                                                                item +
                                                                                                                                                index
                                                                                                                                            }
                                                                                                                                        >
                                                                                                                                            <td>
                                                                                                                                                {itemIndex +
                                                                                                                                                    1}
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                <InputSelect
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].datasetId`}
                                                                                                                                                    type="text"
                                                                                                                                                    value="id"
                                                                                                                                                    text="datasetName"
                                                                                                                                                    data={
                                                                                                                                                        datasetList
                                                                                                                                                    }
                                                                                                                                                />
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                <InputSelectApi
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnName`}
                                                                                                                                                    operationId={
                                                                                                                                                        (values
                                                                                                                                                            .pivotList[
                                                                                                                                                            index
                                                                                                                                                        ]
                                                                                                                                                            .pivotValueList[
                                                                                                                                                            itemIndex
                                                                                                                                                        ]
                                                                                                                                                            .datasetId !=
                                                                                                                                                            null ||
                                                                                                                                                            values
                                                                                                                                                                .pivotList[
                                                                                                                                                                index
                                                                                                                                                            ]
                                                                                                                                                                .pivotValueList[
                                                                                                                                                                itemIndex
                                                                                                                                                            ]
                                                                                                                                                                .datasetId !=
                                                                                                                                                                0) &&
                                                                                                                                                        UrlBuilder.report(
                                                                                                                                                            `database/columns-by-dataset-id/${values.pivotList[index].pivotValueList[itemIndex].datasetId}`
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                    storeName={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnName`}
                                                                                                                                                    value="columnName"
                                                                                                                                                    text="columnName"
                                                                                                                                                    type="text"
                                                                                                                                                    onChange={(
                                                                                                                                                        e
                                                                                                                                                    ) => {
                                                                                                                                                        setFieldValue(
                                                                                                                                                            `${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnName`,
                                                                                                                                                            e
                                                                                                                                                                .target
                                                                                                                                                                .value
                                                                                                                                                        );
                                                                                                                                                    }}
                                                                                                                                                />
                                                                                                                                                {/* <InputField
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnName`}
                                                                                                                                                    type="text"
                                                                                                                                                    placeholder="Enter Column Name"
                                                                                                                                                /> */}
                                                                                                                                            </td>

                                                                                                                                            <td>
                                                                                                                                                <InputField
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnAlias`}
                                                                                                                                                    type="text"
                                                                                                                                                    placeholder="Enter Column Alias"
                                                                                                                                                />
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                {/* <InputField
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnFormula`}
                                                                                                                                                    type="text"
                                                                                                                                                    placeholder="Enter Column columnFormula"
                                                                                                                                                /> */}

                                                                                                                                                <button
                                                                                                                                                    className={`top-20 ri7al d-block w-sp  ${
                                                                                                                                                        item?.columnFormula ==
                                                                                                                                                            "" ||
                                                                                                                                                        item?.columnFormula ==
                                                                                                                                                            null ||
                                                                                                                                                        item?.columnFormula ==
                                                                                                                                                            undefined
                                                                                                                                                            ? "bg-danger"
                                                                                                                                                            : "bg-success"
                                                                                                                                                    } btn text-white mr-5 p-5 m-5`}
                                                                                                                                                    // variant="link"
                                                                                                                                                    onClick={() =>
                                                                                                                                                        pivotFormulaAdd(
                                                                                                                                                            item,
                                                                                                                                                            itemIndex,
                                                                                                                                                            index
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                >
                                                                                                                                                    <FontAwesomeIcon
                                                                                                                                                        className="mr-2"
                                                                                                                                                        icon={
                                                                                                                                                            faDatabase
                                                                                                                                                        }
                                                                                                                                                    />
                                                                                                                                                    Formula
                                                                                                                                                </button>
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                <InputSelect
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnAggregateFunction`}
                                                                                                                                                    type="text"
                                                                                                                                                    value="id"
                                                                                                                                                    text="name"
                                                                                                                                                    data={[
                                                                                                                                                        {
                                                                                                                                                            id: "SUM",
                                                                                                                                                            name: "SUM",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "MIN",
                                                                                                                                                            name: "MIN",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "MAX",
                                                                                                                                                            name: "MAX",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "AVG",
                                                                                                                                                            name: "AVG",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "COUNT",
                                                                                                                                                            name: "COUNT",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "DISTINCT_COUNT",
                                                                                                                                                            name: "DISTINCT COUNT",
                                                                                                                                                        },
                                                                                                                                                    ]}
                                                                                                                                                    onChange={async (
                                                                                                                                                        e
                                                                                                                                                    ) => {
                                                                                                                                                        await setFieldValue(
                                                                                                                                                            `${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnAggregateFunction`,
                                                                                                                                                            e
                                                                                                                                                                .target
                                                                                                                                                                .value
                                                                                                                                                        );
                                                                                                                                                    }}
                                                                                                                                                />
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                <InputSelect
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnGrandCalcType`}
                                                                                                                                                    type="text"
                                                                                                                                                    value="id"
                                                                                                                                                    text="name"
                                                                                                                                                    data={[
                                                                                                                                                        {
                                                                                                                                                            id: "SUM",
                                                                                                                                                            name: "SUM",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "MIN",
                                                                                                                                                            name: "MIN",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "MAX",
                                                                                                                                                            name: "MAX",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "AVG",
                                                                                                                                                            name: "AVG",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "COUNT",
                                                                                                                                                            name: "COUNT",
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: "DISTINCT_COUNT",
                                                                                                                                                            name: "DISTINCT COUNT",
                                                                                                                                                        },
                                                                                                                                                    ]}
                                                                                                                                                    onChange={async (
                                                                                                                                                        e
                                                                                                                                                    ) => {
                                                                                                                                                        await setFieldValue(
                                                                                                                                                            `${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnGrandCalcType`,
                                                                                                                                                            e
                                                                                                                                                                .target
                                                                                                                                                                .value
                                                                                                                                                        );
                                                                                                                                                    }}
                                                                                                                                                />
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                <InputSelect
                                                                                                                                                    name={`${reportSectionType}[${index}].pivotValueList[${itemIndex}].columnPrecision`}
                                                                                                                                                    type="text"
                                                                                                                                                    value="id"
                                                                                                                                                    text="name"
                                                                                                                                                    data={[
                                                                                                                                                        {
                                                                                                                                                            id: 0,
                                                                                                                                                            name: 0,
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: 1,
                                                                                                                                                            name: 1,
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: 2,
                                                                                                                                                            name: 2,
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: 3,
                                                                                                                                                            name: 3,
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: 4,
                                                                                                                                                            name: 4,
                                                                                                                                                        },
                                                                                                                                                        {
                                                                                                                                                            id: 5,
                                                                                                                                                            name: 5,
                                                                                                                                                        },
                                                                                                                                                    ]}
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
                                                                                                                                                                    let value =
                                                                                                                                                                        JSON.parse(
                                                                                                                                                                            JSON.stringify(
                                                                                                                                                                                values
                                                                                                                                                                            )
                                                                                                                                                                        );

                                                                                                                                                                    willDelete &&
                                                                                                                                                                        (arrayHelpers.remove(
                                                                                                                                                                            itemIndex
                                                                                                                                                                        ),
                                                                                                                                                                        delete value
                                                                                                                                                                            .pivotList[
                                                                                                                                                                            index
                                                                                                                                                                        ]
                                                                                                                                                                            .pivotValueList[
                                                                                                                                                                            itemIndex
                                                                                                                                                                        ]);
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
                                                                                                                                            9
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
                                                                    </>
                                                                ) : null}
                                                            </Row>
                                                        </div>
                                                    </>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </>
            )}

            <Modal
                show={isAliasOpen}
                onHide={closeModal}
                centered
                size="md"
                fullscreen="sm-down"
                style={{ background: "#80808066" }}
            >
                <Modal.Header>
                    <Modal.Title>Edit Cloumn Alias Name</Modal.Title>
                    <Button
                        style={{ position: "absolute", right: 0, top: 0 }}
                        variant="secondary"
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </Modal.Header>
                <Modal.Body className="modal-inner">
                    <label>Actual Cloumn Name</label>
                    <input
                        type="text"
                        className="form-control mt-0"
                        value={selectedList[aliasIndex]?.columnName}
                        disabled
                    />
                    <label className="mt-20">Cloumn Alias Name</label>
                    {/* <span className="text-danger">*</span> */}

                    <input
                        type="text"
                        className="form-control mt-0"
                        value={aliasValue}
                        onChange={(e) => {
                            setAliasValue(e.target.value);
                        }}
                    />
                    {reportSectionType != "pivotList" && (
                        <>
                            <label className="mt-20">Actual Title Name</label>
                            <input
                                type="text"
                                className="form-control mt-0"
                                value={selectedList[aliasIndex]?.columnTitle}
                                disabled
                            />
                            <label className="mt-20">Updated Title Name</label>
                            {/* <span className="text-danger">*</span> */}

                            <input
                                type="text"
                                className="form-control mt-0"
                                value={titleValue}
                                onChange={(e) => {
                                    setTitleValue(e.target.value);
                                }}
                            />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="mt-20">
                    <Button
                        type="submit"
                        variant="gray"
                        onClick={() => {
                            updateAliasName(aliasValue, titleValue, aliasIndex);
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={isFormulaOpen}
                onHide={closeFormulaModal}
                centered
                size="xl"
                fullscreen="xxl-down"
                style={{ background: "#80808066" }}
            >
                <Modal.Header>
                    <Modal.Title>Edit Formula</Modal.Title>
                    <Button
                        style={{ position: "absolute", right: 0, top: 0 }}
                        variant="secondary"
                        onClick={closeFormulaModal}
                    >
                        Close
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {/* <label>Cloumn Formula</label>
                    <span className="text-danger">*</span>

                    <textarea
                        //type="textArea"
                        id="formulaText"
                        className="form-control mt-10"
                        value={formulaValue}
                        onChange={(e) => {
                            setFormulaValue(e.target.value);
                        }}
                    /> */}

                    <div className="text-area-container m-0responsive">
                        <textarea
                            rows={10}
                            id="textarea"
                            value={formulaValue}
                            onChange={handleInputChange}
                            placeholder="Type formula here..."
                        />
                        {suggestions.length > 0 && (
                            <div className="suggestions-container">
                                <ul>
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() =>
                                                handleSelectValue(suggestion)
                                            }
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant="gray"
                        onClick={() => {
                            updateFormula(formulaValue, formulaIndex);
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={isPivotFormulaOpen}
                onHide={closePivotFormulaModal}
                centered
                size="xl"
                fullscreen="xxl-down"
                style={{ background: "#80808066" }}
            >
                <Modal.Header>
                    <Modal.Title>Edit Formula</Modal.Title>
                    <Button
                        style={{ position: "absolute", right: 0, top: 0 }}
                        variant="secondary"
                        onClick={closePivotFormulaModal}
                    >
                        Close
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-area-container">
                        <textarea
                            rows={10}
                            id="textarea"
                            value={pivotFormulaValue}
                            onChange={handlePivotInputChange}
                            placeholder="Type formula here..."
                        />
                        {suggestionsPivot.length > 0 && (
                            <div className="suggestions-container">
                                <ul>
                                    {suggestionsPivot.map(
                                        (suggestion, index) => (
                                            <li
                                                key={index}
                                                onClick={() =>
                                                    handleSelectPivotValue(
                                                        suggestion
                                                    )
                                                }
                                            >
                                                {suggestion}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="submit"
                        variant="gray"
                        onClick={() => {
                            updatePivotFormula(
                                pivotFormulaValue,
                                pivotFormulaIndex,
                                pivotFormulaMainIndex
                            );
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TypeWiseModal;
