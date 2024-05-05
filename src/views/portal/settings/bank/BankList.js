import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@themesberg/react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ProgressBar from "react-topbar-progress-indicator";
import CrudAction from "../../../../components/button/CrudAction";
import { DefaultCard } from "../../../../components/card";
import { BasicTable } from "../../../../components/table";
import RowSerial from "../../../../helpers/rowSerial";
import { UrlBuilder } from "../../../../helpers/UrlBuilder";
import useListApi from "../../../../hooks/useListApi";
import { callApi, selectApi } from "../../../../reducers/apiSlice";
import { setDeleteModal } from "../../../../reducers/deleteModalSlice";
import { selectToastAlert } from "../../../../reducers/toastAlertSlice";
import { SharedData } from "helpers/SharedData";

const BankList = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const [size, setSize] = useState(10);

    const setPage = useRef(1);

    const [searchValue, setSearchValue] = useState("");

    const { type } = useSelector(selectToastAlert);
    const {
        DeletResponse = {
            data: {},
        },

    } = useSelector(selectApi);

    const [commonSearch, setCommonSearch] = useState({
        page: 1,
        size: 10,
        search: "",
        sortColumn: "",
        sortBy: "id,desc",
    });


    const cardProps = {
        title: "ব্যাংক তালিকা",
        headerSlot: () => (
            <Link to="/portal/settings/bank/add">
                <Button variant="link" className="f-right btn-sm btn-color">
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> ব্যাংক
                    যোগ করুন
                </Button>
            </Link>
        ),
    };

    const tableProps = {
        headers: [
            { id: "id", label: "সিরিয়াল." },
            { id: "bankName", label: "ব্যাংক নাম" },
            { id: "bankNameBn", label: "ব্যাংক নাম (বাংলা)" },
            // { id: "bankId", label: "ব্যাংক আইডি" },
            { id: "swiftcode", label: "সুইফট কোড" },
            { id: "Action", label: "প্রক্রিয়া" },
        ],
        perPage: [10, 25, 50, 100],
        config: {
            operationId: UrlBuilder.mpoDsheApi(
                `bank/list?${new URLSearchParams(
                    SharedData.cleanObject(commonSearch)
                )}`
            ),
            output: "BankList",
            storeName: "BankList",
        },
        meta: {},
        totalData: 0,
    };

    const onPageChange = (value) => {
        setCommonSearch({
            ...commonSearch,
            page: value,
        });
    };

    const onSizeChange = (value) => {
        setCommonSearch({
            ...commonSearch,
            size: value,
        });
    };

    const onSearchChange = (value) => {
        setCommonSearch({
            ...commonSearch,
            search: value,
        });
    };

    const onSearchByValue = (value) => {
        setCommonSearch({
            ...commonSearch,
            sortColumn: value,
        });
    };

    const { loading, data, meta } = useListApi(tableProps.config);

    tableProps.meta = meta;
    tableProps.totalData = data && data.length;

    const onDeleteClick = (data) => {
        dispatch(
            setDeleteModal({
                deleteApi: UrlBuilder.mpoDsheApi(`bank/delete/${data.id}`),
                method: "PUT",
                output: "DeletResponse",
                storeName: "DeleteResponse",
            })
        );
    };

    useEffect(() => {
        if (DeletResponse?.status === "success") {
            dispatch(
                callApi({
                    operationId: UrlBuilder.mpoDsheApi(
                        `bank/list?page=${setPage.current}&size=${size}`
                    ),
                    output: "BankList",
                    storeName: "BankList"
                })
            );
        }
    });
    return (
        <>
            <DefaultCard {...cardProps} className="mb-50">
                {loading && <ProgressBar />}

                <BasicTable
                    {...tableProps}
                    onSizeChange={(pageSize) => onSizeChange(pageSize)}
                    onSearchChange={(query) => onSearchChange(query)}
                    onPageChange={(pageNo) => onPageChange(pageNo)}
                    onSearch={(sval) => onSearchByValue(sval)}
                >
                    {data !== undefined &&
                        JSON.parse(JSON.stringify(data)).map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <span>{RowSerial(meta, index)}</span>
                                </td>
                                <td>
                                    <span className="text-center">
                                        {row.bankName}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-center">
                                        {row.bankNameBn}
                                    </span>
                                </td>
                                {/* <td>
                                    <span className="text-center">
                                        {row.BankId}
                                    </span>
                                </td> */}
                                <td>
                                    <span className="text-center">
                                        {row.swiftcode}
                                    </span>
                                </td>

                                <td>
                                    <CrudAction
                                        onEditClick={() =>
                                            history.push(
                                                `/portal/settings/bank/${row.id}/edit`
                                            )
                                        }
                                        onDeleteClick={() => onDeleteClick(row)}
                                    />
                                </td>
                            </tr>
                        ))}
                </BasicTable>
            </DefaultCard>
        </>
    );
};

export default BankList;
