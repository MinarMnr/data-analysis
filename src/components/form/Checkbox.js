import { useField } from "formik/dist/index";
import { useState } from "react";

const Checkbox = ({ label, ...props }) => {
  const [field] = useField(props);
  const [status, setStatus] = useState("False");

  return (
    <label>
      <input checked={field.value} {...field} type="checkbox" />
      {label}
    </label>
  );
};

export default Checkbox;
