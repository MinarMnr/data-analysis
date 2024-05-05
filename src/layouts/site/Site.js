import React, { useEffect } from "react";
import {
  selectToastAlert,
  setToastAlert,
} from "../../reducers/toastAlertSlice";
import {
  selectDeleteModal,
  setDeleteModal,
} from "../../reducers/deleteModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { DeleteModal, ToastAlert } from "../../components/notification";
import { setErrorMessage } from "../../reducers/errorMessageSlice";

import "./Site.scss";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";

const Site = () => {
  const dispatch = useDispatch();

  const { type } = useSelector(selectToastAlert);
  const { deleteApi } = useSelector(selectDeleteModal);

  useEffect(() => {
    dispatch(
      setToastAlert({
        type: "",
        message: "",
      })
    );

    dispatch(
      setDeleteModal({
        title: "",
        message: "",
      })
    );
  }, [type, deleteApi]);

  useEffect(() => {
    dispatch(
      setErrorMessage({
        errors: "",
      })
    );
  });

  return (
    <>
      <Header />
      <Content />
      {/*<Footer/>*/}
      {/*code goes here*/}
      <ToastAlert />
      <DeleteModal />
    </>
  );
};

export default Site;
