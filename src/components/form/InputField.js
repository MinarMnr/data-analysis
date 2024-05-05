import { useField } from "formik/dist/index";

const InputField = ({ label, required, isDisabled = false, ...props }) => {
  const [field, meta, onChangeEvent] = useField(props);
  const onChangeFile = (val) => {
    onChangeEvent(val);
  };
  return (
    <>
      {label !== undefined && (
        <label className="form-label">
          {label}{" "}
          {required && (
            <abbr style={{ color: "red" }} className="req">
              *
            </abbr>
          )}
        </label>
      )}
      <input
        onChange={(e) => {
          if (onChangeEvent !== undefined) {
            onChangeFile(e.target.files[0]);
          }
        }}
        {...field}
        {...props}
        className={`form-control ${meta.touched && meta.error ? "is-invalid" : ""
          }`}
        disabled={isDisabled}
      />
      <div className="invalid-feedback">{meta.error}</div>
    </>
  );
};

export default InputField;
