import { Form } from "@themesberg/react-bootstrap";
import { useField } from "formik/dist/index";
import { useEffect } from "react";
import AdvancedForm from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { callApi, clearState, selectApi } from "../../reducers/apiSlice";
const InputSelectApi = ({
  label,
  required,
  operationId,
  storeName,
  value,
  text,
  onChange,
  isDisabled = false,
  ...props
}) => {
  const dispatch = useDispatch();
  const [field, meta] = useField(props);
  const { [storeName]: items = { data: {} } } = useSelector(selectApi);

  useEffect(() => {
    if (operationId) {
      dispatch(
        clearState({
          output: storeName,
          storeName: storeName,
        })
      );
      dispatch(
        callApi({
          operationId: operationId,
          output: storeName,
          storeName: storeName || "select",
        })
      );
    }
  }, [dispatch, operationId, storeName]);

  if (onChange !== undefined) {
    return (
      <>
        <Form.Group>
          {" "}
          {label !== undefined && (
            <Form.Label>
              {" "}
              {label}{" "}
              {required && (
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
              )}
            </Form.Label>
          )}
          <Form.Select
            {...field}
            onChange={onChange}
            className={`form-control ${
              meta.touched && meta.error ? "is-invalid" : ""
            }`}
            disabled={isDisabled}
          >
            <option value={""} key="">
              {" "}
              নির্বাচন করুন
            </option>{" "}
            {items.data !== undefined &&
              items.data.length > 0 &&
              items.data.map((item, key) => {
                return (
                  <option value={item[value]} key={key}>
                    {" "}
                    {item[text]}
                  </option>
                );
              })}
          </Form.Select>
          <div className="invalid-feedback"> {meta.error}</div>
        </Form.Group>
      </>
    );
  } else {
    return (
      <>
        <Form.Group>
          {label !== undefined && (
            <Form.Label>
              {label}
              {required && (
                <abbr style={{ color: "red" }} className="req">
                  *
                </abbr>
              )}
            </Form.Label>
          )}
          <Form.Select
            {...field}
            className={`form-control ${
              meta.touched && meta.error ? "is-invalid" : ""
            }`}
            // onChange={onChange}
            disabled={isDisabled}
          >
            {" "}
            <option value="null">নির্বাচন করুন</option>
            {items.data !== undefined &&
              items.data?.length > 0 &&
              items.data.map((item, key) => {
                return (
                  <option value={item[value]} key={key}>
                    {item[text]}
                  </option>
                );
              })}
          </Form.Select>
          <div className="invalid-feedback">{meta.error}</div>
        </Form.Group>
      </>
    );
  }
  return (
    <>
      <AdvancedForm.Label>
        {label}{" "}
        {required && (
          <abbr style={{ color: "red" }} className="req">
            *
          </abbr>
        )}
      </AdvancedForm.Label>
      <AdvancedForm.Select onChange={onChange} style={{ marginBottom: "25px" }}>
        <option value="null">নির্বাচন করুন {label}</option>
        {items.data !== undefined &&
          items.data.length > 0 &&
          items.data.map((item, key) => {
            return (
              <option value={item[value]} key={key}>
                {item[text]}
              </option>
            );
          })}
      </AdvancedForm.Select>
    </>
  );
};
export default InputSelectApi;
