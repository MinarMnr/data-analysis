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
import {
  callApi,
  callApiWithoutLoading,
  clearState,
  selectApi,
} from "reducers/apiSlice";
import { UrlBuilder } from "helpers/UrlBuilder";
import InputSelectApi from "components/form/InputSelectApi";
import ErrorMessage from "components/text/ErrorMessage";
import { Field, FieldArray } from "formik/dist/index";
import SearchComboBox from "components/form/SearchComboBox";
import CustomInputComboBox from "components/form/CustomInputComboBox";
import { InputField, InputSelect } from "components/form";
import swal from "sweetalert";
import store from "reducers/store";
import Cookies from "js-cookie";

//import ReportSectionType from "constants/ReportSectionType";

const ReorderMenuModal = ({ modalStatus }) => {
  const dispatch = useDispatch();
  const {
    rootMenuList = {
      data: {},
    },
  } = useSelector(selectApi);

  useEffect(() => {
    dispatch(
      callApiWithoutLoading({
        operationId: UrlBuilder.report(
          `menu-group/root-list?appModuleId=${localStorage.getItem("moduleId")}`
        ),
        output: "rootMenuList",
      })
    );
  }, []);

  const [reorderList, setReorderList] = useState([]);

  useEffect(() => {
    setReorderList(rootMenuList?.data);
  }, [rootMenuList]);

  console.log("sadrecord", reorderList);

  const updateOrderList = async (list) => {
    var res = await fetch(
      UrlBuilder.report(`menu-group/bulk-update`),

      {
        method: "PUT",
        body: JSON.stringify(list),

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("access_token"),
        },
      }
    );

    if (res?.status == 200) {
      dispatch(
        setToastAlert({
          type: "success",
          message: "Menu List reorder successful",
        })
      );
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
      return modalStatus();
    }
  };

  const arraymove = (arr, fromIndex, toIndex) => {
    var res = [...arr];
    var element = res[fromIndex];
    console.log(element, "sadrecord", res, fromIndex, toIndex);

    res.splice(fromIndex, 1);
    res.splice(toIndex, 0, element);

    console.log("sadrecord1", res);

    setReorderList([...res]);

    //setSelectedList([...values?.[`${reportSectionType}`]]);
    //onModalChange(values?.groupList);

    //setFieldValue(`${reportSectionType}`, arr);
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
      reorderList,
      result.source.index,
      result.destination.index
    );

    setReorderList([...items]);

    //setFieldValue(`${reportSectionType}`, items);
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
      {reorderList && reorderList?.length > 0 && (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="vertical">
              {(provided, snapshot) => (
                <div
                  className="dragable-all"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {reorderList.map((row, index) => (
                    <Draggable
                      key={`${row?.reportMenuGroupId}`}
                      //draggableId={`${row?.columnAlias} (${row?.datasetName})`}
                      draggableId={`${row?.reportMenuGroupId}`}
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
                            provided.draggableProps.style
                          )}
                        >
                          <>
                            <div className="divbg">
                              <Row className="bg-al">
                                <div className="col-lg-1 col-1 p-0  justify-content-center m-auto">
                                  <p className="p-bgcolor">
                                    {" "}
                                    <span>{index + 1}</span>
                                  </p>
                                </div>
                                <div className="col-lg-11 col-11 p-0">
                                  <Row>
                                    <div className="col-lg-5 col-12 my-auto">
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <h5 className="text-primary m-b-5 tx-14">
                                            {row?.reportMenuGroupTitle}
                                          </h5>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-lg-6 col-12">
                                      <Row>
                                        <div
                                          className={`float-end text-center col-lg-1 d-flex `}
                                        >
                                          {index != 0 && (
                                            <button
                                              className="d-block bg-success btn text-white btn-arr"
                                              onClick={() =>
                                                arraymove(
                                                  reorderList,
                                                  index,
                                                  index - 1
                                                )
                                              }
                                            >
                                              <FontAwesomeIcon
                                                icon={faArrowUp}
                                              />
                                            </button>
                                          )}

                                          {index != reorderList?.length - 1 && (
                                            <button
                                              className="d-block bg-warning  btn text-white btn-arr"
                                              // variant="link"
                                              onClick={() =>
                                                arraymove(
                                                  reorderList,
                                                  index,
                                                  index + 1
                                                )
                                              }
                                            >
                                              <FontAwesomeIcon
                                                icon={faArrowDown}
                                              />
                                            </button>
                                          )}
                                        </div>
                                      </Row>
                                    </div>
                                  </Row>
                                </div>
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

          <Button
            className="float-end"
            type="submit"
            variant="gray"
            onClick={() => {
              updateOrderList(reorderList);
            }}
          >
            Reorder
          </Button>
        </>
      )}
    </>
  );
};

export default ReorderMenuModal;
