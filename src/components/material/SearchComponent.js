import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { callApi, selectApi } from "../../reducers/apiSlice";
import { useField } from "formik/dist/index";

export default function ComboBox({
  operationId,
  storeName,
  title,
  value,
  onChange,
  name,
  setField,
  allValue,
  ...props
}) {
  const dispatch = useDispatch();
  const [field] = useField(props);
  const { [storeName]: items = { data: {} } } = useSelector(selectApi);

  React.useEffect(() => {
    if (operationId) {
      dispatch(
        callApi({
          operationId: operationId,
          output: storeName,
          storeName: storeName || "select",
        })
      );
    }
  }, [dispatch, operationId]);
  var optionList = [];
  if (items.data !== undefined && items.data.length > 0) {
    optionList = items.data;
  }
  const defaultProps = {
    options: optionList,
    //getOptionLabel: (option) => option[`${title}`]
  };
  const [inputValue, setInputValue] = React.useState("");

  const myOption = optionList.filter((item) => {
    return item.id === allValue[`${name}`];
  });

  return (
    <>
      {optionList.length > 0 && (
        <Autocomplete
          {...defaultProps}
          value={myOption[0] ?? ""}
          getOptionLabel={(option) => option[`${title}`] || ""}
          inputValue={inputValue}
          onChange={(e, value) =>
            setField(`${name}`, (value && value.id) || "")
          }
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="combo-box-demo"
          renderInput={(params) => (
            <TextField {...field} onChange={onChange} {...params} />
          )}
        />
      )}
    </>
  );
}
