import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { callApi, clearState, selectApi } from "../../../../reducers/apiSlice";
import { Link, useHistory } from "react-router-dom";
import { Formik } from "formik/dist/index";
import { Button, Card } from "@themesberg/react-bootstrap";
import { DefaultCard } from "../../../../components/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-topbar-progress-indicator";
import { UrlBuilder } from "../../../../helpers/UrlBuilder";
import BankForm from "./BankForm";
import { Bank } from "./Bank";
import { AuthUser } from "../../../../helpers/AuthUser";

const BankAdd = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { loading, bank_save = {
        data: {}
    }} = useSelector(selectApi);

    const cardProps = {
        title: " নতুন ব্যাংক যোগ করুন",
        headerSlot: () => (
            <>
                <Link to="/portal/settings/bank">
                    <Button
                        variant="link"
                        className="f-right btn-sm p-5 btn-color"
                    >
                        <FontAwesomeIcon icon={faList} className="me-2" />
                        দেখুন ব্যাংক তালিকা
                    </Button>
                </Link>
            </>
        ),
    };

    React.useEffect(() => {
        if (bank_save?.status === "success") {
            history.push("/portal/settings/bank")
            dispatch(
                clearState({
                    output: "bank_save",
                })
            );
        }
    })

    return (
        <DefaultCard className="mb-50" {...cardProps}>
            <Card border="white" className="table-wrapper table-responsive">
                <Card.Body>
                    {loading && <ProgressBar />}
                    <Formik
                        initialValues={Bank}
                        validationSchema={Bank.validation()}
                        onSubmit={(values, { resetForm }) => {
                            values.instituteId = parseInt(
                                AuthUser.getUserInstituteID()
                            );

                            dispatch(
                                callApi({
                                    operationId:
                                        UrlBuilder.mpoDsheApi("bank/save"),
                                    output: "bank_save",
                                    parameters: {
                                        method: "POST",
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
                            return <BankForm {...props} />;
                        }}
                    </Formik>
                </Card.Body>
            </Card>
        </DefaultCard>
    );
};

export default BankAdd;
