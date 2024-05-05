import { useState } from "react";
import {
    faArrowUp,
    faArrowDown,
    faEdit,
    faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Row, Modal } from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setToastAlert } from "reducers/toastAlertSlice";
import { InputSelect } from "components/form";
import "./FormulaModal.css";
import { selectApi } from "reducers/apiSlice";

const ChartWiseModal = ({ values, setFieldValue, reportSectionType }) => {
    var values = JSON.parse(JSON.stringify(values));
    // const [selectedList, setSelectedList] =
    //     ReportSectionType[typeName] == typeName
    //         ? useState(values?.groupList)
    //         : useState(values?.filterList);

    const [selectedList, setSelectedList] = useState(
        values?.reportChart?.[`${reportSectionType}`]
    );

    // useEffect(() => {
    //     setSelectedList(values?.[`${reportSectionType}`]);
    // }, [reportSectionType]);

    //const [reportSectionType] = useState(ReportSectionType[typeName]);

    const [isAliasOpen, setIsAliasOpen] = useState(false);
    const [isFormulaOpen, setIsFormulaOpen] = useState(false);

    const [aliasValue, setAliasValue] = useState("");
    const [aliasIndex, setAliasindex] = useState(undefined);

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
                return `${item?.columnName}${`<${item?.datasetName}>`}`;
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

    const formulaAdd = (row) => {
        setIsFormulaOpen(true);
        setFormulaValue(row?.columnFormula);
    };
    const closeFormulaModal = () => {
        setIsFormulaOpen(false);
        setFormulaValue("");
    };

    const dispatch = useDispatch();

    const updateFormula = async (val) => {
        let newFields = { ...selectedList };
        newFields.columnFormula = val;

        await setFieldValue(`reportChart.${reportSectionType}`, newFields);

        await setSelectedList(newFields);

        dispatch(
            setToastAlert({
                type: "success",
                message: "Report Formula Change Successfully",
            })
        );
        setIsFormulaOpen(false);
        setFormulaValue("");
    };

    return (
        <>
            <Card.Body>
                <Row>
                    <div className="table-responsive">
                        <div className="row">
                            <>
                                <>
                                    <div className="divbg">
                                        <Row>
                                            <div className="col-lg-1 col-1 justify-content-center m-auto">
                                                <div className="">
                                                    <p className="p-bgcolor">
                                                        {" "}
                                                        <span>1</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-lg-11 col-11 p-0">
                                                <Row>
                                                    <div className="col-lg-5 col-12 my-auto">
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <h5 className="text-primary m-b-5 tx-14">
                                                                    {
                                                                        selectedList?.columnName
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        selectedList?.datasetName
                                                                    }
                                                                    )
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-12">
                                                        <Row>
                                                            <div className="float-end col-lg-6">
                                                                <InputSelect
                                                                    label="Column Aggregate Function"
                                                                    name={`reportChart.${reportSectionType}.columnAggregateFunction`}
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
                                                                    ]}
                                                                    onChange={async (
                                                                        e
                                                                    ) => {
                                                                        let newFields =
                                                                            {
                                                                                ...selectedList,
                                                                            };

                                                                        newFields.columnAggregateFunction =
                                                                            e.target.value;

                                                                        await setFieldValue(
                                                                            `reportChart.${reportSectionType}`,
                                                                            newFields
                                                                        );

                                                                        await setSelectedList(
                                                                            newFields
                                                                        );
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="float-end col-lg-2">
                                                                <button
                                                                    className={`top-20 d-block  ${
                                                                        selectedList?.columnFormula ==
                                                                            "" ||
                                                                        selectedList?.columnFormula ==
                                                                            null ||
                                                                        selectedList?.columnFormula ==
                                                                            undefined
                                                                            ? "bg-danger"
                                                                            : "bg-success"
                                                                    } btn text-white mr-5 p-5 m-5`}
                                                                    // variant="link"
                                                                    onClick={() =>
                                                                        formulaAdd(
                                                                            selectedList
                                                                        )
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faDatabase
                                                                        }
                                                                    />
                                                                    Formula
                                                                </button>
                                                            </div>
                                                        </Row>
                                                    </div>
                                                </Row>
                                            </div>
                                        </Row>
                                    </div>
                                </>
                            </>
                        </div>
                    </div>
                </Row>
            </Card.Body>

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
                        style={{ float: "left" }}
                        variant="secondary"
                        onClick={closeFormulaModal}
                    >
                        Close
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <label>Cloumn Formula</label>
                    {/* <span className="text-danger">*</span> */}

                    {/* <textarea
                        //type="textArea"
                        id="formulaText"
                        className="form-control mt-10"
                        value={formulaValue}
                        onChange={(e) => {
                            setFormulaValue(e.target.value);
                        }}
                    /> */}

                    <div className="text-area-container">
                        <textarea
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
                            updateFormula(formulaValue);
                        }}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChartWiseModal;
