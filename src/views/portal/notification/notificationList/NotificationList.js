import { DefaultCard } from "components/card";
import { BasicTable } from "components/table";
import RowSerial from "helpers/rowSerial";
import { UrlBuilder } from "helpers/UrlBuilder";
import useListApi from "hooks/useListApi";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-topbar-progress-indicator";
import { callApi, selectApi } from "reducers/apiSlice";
import { selectToastAlert } from "reducers/toastAlertSlice";
import { AuthUser } from "../../../../../src/helpers/AuthUser";

const NotificationList = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const [size, setSize] = useState(10);

    const setPage = useRef(1);

    const [searchValue, setSearchValue] = useState("");

    const { type } = useSelector(selectToastAlert);
    const [check, setCheck] = useState(0);
    const [view, setView] = useState("NOT VIEWED");

    const cardProps = {
        title: "Notification List",
        // headerSlot: () => (
        //     <Link to="/portal/settings/circular/add">
        //         <Button variant="link" className="f-right btn-sm btn-color">
        //             <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New
        //             Circular
        //         </Button>
        //     </Link>
        // ),
    };

    const tableProps = {
        headers: [
            { id: "id", label: "SL." },
            { id: "actionName", label: "Name" },
            { id: "notificationEventMessage", label: "Notification Message" },
            { id: "notificationEventMessageBn", label: " Date & Time" },
            { id: "read", label: "Viewed" },
        ],
        perPage: [10, 25, 50, 100],
        config: {
            operationId: UrlBuilder.notificationClientApi(
                `notification-event/notifications/${AuthUser.getUserId()}?page=${
                    setPage.current
                }&size=${size}&appModuleId=24`
            ),
            output: "NotificationList",
            storeName: "NotificationList",
        },
        meta: {},
        totalData: 0,
    };

    const onPageChange = (pageNo) => {
        dispatch(
            callApi({
                operationId: UrlBuilder.notificationClientApi(
                    `notification-event/notifications/${AuthUser.getUserId()}?page=${
                        setPage.current
                    }&size=${size}&appModuleId=24`
                ),

                output: "NotificationList",
            })
        );
    };

    /**
     * Change the page size on table and update the state.
     * Fetch data by dispatching callApi.
     */
    const onSizeChange = (pageSize) => {
        setSize(pageSize);
        dispatch(
            callApi({
                operationId: UrlBuilder.notificationClientApi(
                    `notification-event/notifications/${AuthUser.getUserId()}?page=${
                        setPage.current
                    }&size=${size}&appModuleId=24`
                ),

                output: "NotificationList",
            })
        );
    };

    // const onSearchByValue = (val) => {
    //     setSearchValue(val);
    //     setPage.current = 1;
    //     dispatch(
    //         callApi({
    //             operationId:
    //                 val === ""
    //                     ? UrlBuilder.notificationClientApi(
    //                           `circular/list?page=${
    //                               setPage.current
    //                           }&size=${size}&instituteId=${AuthUser.getUserInstituteID()}`
    //                       )
    //                     : UrlBuilder.notificationClientApi(
    //                           `circular/list?page=${
    //                               setPage.current
    //                           }&size=${size}&search=${val}&instituteId=${AuthUser.getUserInstituteID()}`
    //                       ),
    //             output: "NotificationList",
    //         })
    //     );
    // };

    const { loading, data, meta } = useListApi(tableProps.config);

    tableProps.meta = meta;
    tableProps.totalData = data && data.length;
    const { notificationUpdate } = useSelector(selectApi);

    if (notificationUpdate && notificationUpdate.status == "success") {
        location.reload();
    }

    return (
        <>
            <DefaultCard {...cardProps} className="mb-50">
                {loading && <ProgressBar />}

                <BasicTable
                    {...tableProps}
                    onSizeChange={(pageSize) => onSizeChange(pageSize)}
                    onPageChange={(pageNo) => {
                        setPage.current = pageNo;
                        onPageChange(pageNo);
                    }}
                    searchOption={false}
                    //onSearch={(searchVal) => onSearchByValue(searchVal)}
                >
                    {data !== undefined &&
                        JSON.parse(JSON.stringify(data)).map((row, index) => (
                            <tr
                                style={{ cursor: "pointer" }}
                                key={index}
                                onClick={() => {
                                    if (row.read == false) {
                                        setCheck(row.id);
                                        setView("Viewed");
                                        dispatch(
                                            callApi({
                                                operationId:
                                                    UrlBuilder.notificationClientApi(
                                                        `notification-event/update/${
                                                            row.id
                                                        }?kcUserId=${AuthUser.getUserId()}&notificationEventForId=${
                                                            row
                                                                .notificationEventFor
                                                                .id
                                                        }&appModuleId=24`
                                                    ),
                                                output: "notificationUpdate",
                                                storeName: "notificationUpdate",
                                                parameters: {
                                                    method: "PUT",
                                                    header: {
                                                        "Content-type":
                                                            "application/json",
                                                    },
                                                },
                                            })
                                        );
                                    }
                                }}
                            >
                                <td>
                                    <span>{RowSerial(meta, index)}</span>
                                </td>
                                <td>
                                    <span className="text-center">
                                        {row.actionName &&
                                            row.actionName.replace(/_/g, " ")}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-center">
                                        {row.notificationEventMessage}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-center">
                                        {/* {row.notificationEventMessageBn} */}
                                        {row.createdAt}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        style={
                                            row.id == check || row.read == true
                                                ? { color: "green" }
                                                : {}
                                        }
                                    >
                                        {row.read ? "Viewed" : "Not Viewed"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                </BasicTable>
            </DefaultCard>
        </>
    );
};

export default NotificationList;
