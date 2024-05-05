import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from "@themesberg/react-bootstrap";
import { Formik } from "formik/dist/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ProgressBar from "react-topbar-progress-indicator";
import { DefaultCard } from "../../../../components/card";
import { UrlBuilder } from "../../../../helpers/UrlBuilder";
import { callApi, clearState, selectApi } from "../../../../reducers/apiSlice";
import { Bank } from "./Bank";
import BankForm from "./BankForm";

//import './Country.scss'

const BankEdit = (props) => {
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
        details = {
            data: {},
        },
        bank_update = {},
    } = useSelector(selectApi);

    /**
     * Get data through api call by dispatching 'callApi'.
     */

    useEffect(() => {
        if (
            bank_update !== undefined &&
            Object.keys(bank_update).length > 0
        ) {
            dispatch(
                clearState({
                    output: "bank_update",
                })
            );
            history.push("/portal/settings/bank");
        }
    }, [bank_update]);


    useEffect(() => {
        dispatch(
            callApi({
                operationId: UrlBuilder.mpoDsheApi(
                    `bank/find/${props.match.params.id}`
                ),
                output: "details",
                storeName: "bankDetails",
            })
        );
    }, [dispatch, props.match.params.id]);



    /**
     * cardProps must need to pass into DefaultCard component.
     * headerSlot: this is a placeholder for action buttons on card header.
     *
     * @type {{headerSlot: (function(): *), title: string}}
     */
    const cardProps = {
        title: "ব্যাংক তথ্য আপডেট করুন",
        headerSlot: () => (
            <>
                <Link to="/portal/settings/bank">
                    <Button
                        variant="link"
                        className="f-right btn-sm p-5 btn-color"
                    >
                        <FontAwesomeIcon icon={faList} className="me-2" />
                        ব্যাংক তালিকা দেখুন
                    </Button>
                </Link>
            </>
        ),
    };

    return (
        <DefaultCard className="mb-50" {...cardProps}>
            <Card border="white" className="table-wrapper table-responsive">
                <Card.Body>
                    {loading && <ProgressBar />}
                    <Formik
                        initialValues={Bank.fromJson(details.data)}
                        enableReinitialize={true}
                        validationSchema={Bank.validation()}
                        onSubmit={(values) => {
                            /**
                             * Save data through POST api by dispatching 'callApi'.
                             */
                            dispatch(
                                callApi({
                                    operationId:
                                        UrlBuilder.mpoDsheApi("bank/update"),
                                    output: "bank_update",
                                    parameters: {
                                        method: "PUT",
                                        body: Bank.toString(values),
                                        header: {
                                            "Content-Type": "application/json",
                                        },
                                    }, 
                                })
                            );
                        }}
                    >
                        {(props) => {
                            return <BankForm {...props} from="edit" />;
                        }}
                    </Formik>
                </Card.Body>
            </Card>
        </DefaultCard>
    );
};

export default BankEdit;
