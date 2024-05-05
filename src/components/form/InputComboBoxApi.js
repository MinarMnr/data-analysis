import React, { useEffect } from "react";
import { Form, Button } from "@themesberg/react-bootstrap";
import { fieldToTextField } from "formik-material-ui";
import { Autocomplete, TextField } from "@mui/material";
import { callApi, selectApi, clearState } from "reducers/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import camelToTitle from "mixins/CasingConversion";

const InputComboBoxApi = ({
  required = false,
  label,
  operationId,
  storeName,
  value = "id",
  text = "label",
  subText,
  subTextSubject,
  subTextTitle,
  readOnly,
  result = "id",
  isMultiple = false,
  defaultValue,
  editMode = false,
  onChange,
  ...props
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [source, setSource] = React.useState([]);

  const { [storeName]: items = { data: [] } } = useSelector(selectApi);

  useEffect(() => {
    if (operationId) {
      // console.log(" here", storeName)
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
  }, [dispatch, operationId]);

  // console.log("storeName",storeName)

  useEffect(() => {
    var lab = "";
    if (items?.data !== undefined && items?.data.length > 0) {
      let sourceData = items?.data?.map((item) => {
        // {
        //   subText !== undefined && item[subText] !== null
        //     ? (lab = `${camelToTitle(item[text])}  (CRVS : ${item[subText]} ) `)
        //     : (lab = camelToTitle(item[text]));
        // }
        // {
        //   subTextSubject !== undefined && item[subTextSubject] !== null
        //     ? (lab = `${camelToTitle(item[text])}  (Code : ${
        //         item[subTextSubject]
        //       } ) `)
        //     : (lab = camelToTitle(item[text]));
        // }

        // return {
        //   id: item[value],
        //   label: lab,
        //   original: item,
        // };

        return {
          id: item[value],
          label:
            subTextTitle !== undefined
              ? `(${subTextTitle} : ${item[subTextSubject]})`
              : `${item[subTextSubject]}`,
          original: item,
        };
      });
      setSource(sourceData);
    } else {
      let sourceData = [];
      setSource(sourceData);
    }
  }, [items?.data?.length ?? ""]);

  const {
    form: { setFieldValue },
  } = props;

  const { error, helperText, ...field } = fieldToTextField(props);
  const { name } = field;

  const getSelectedValues = () => {
    // console.log("defaultValue",defaultValue, storeName, result)
    let filteredValues = source.filter((item) => {
      return Array.isArray(defaultValue)
        ? defaultValue.includes(item[result])
        : defaultValue == item[result];
    });
    if (isMultiple) {
      filteredValues = filteredValues.length ? filteredValues : [];
    } else {
      filteredValues = filteredValues.length ? filteredValues[0] : null;
    }

    return filteredValues;
  };
  const handleClearClick = (e) => {
    // setState({
    //    input: ''
    // })
  };

  const handleOnChange = (value) => {
    //  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", value)
    if (isMultiple) {
      if (value?.length) {
        setFieldValue(
          name,
          value?.map((item) => item[result])
        );
      }
    } else {
      if (value !== null) {
        setFieldValue(name, value[result]);
      } else {
        //console.log(value)
        setFieldValue(name, "");
      }
    }
    if (onChange !== undefined) {
      // console.log(value)
      if (value !== null) {
        onChange(value);
      }
    }
  };

  return (
    <>
      <Form.Group>
        {label !== undefined && (
          <Form.Label style={{ marginBottom: "13px" }}>
            {label}
            {required && (
              <sup style={{ color: "red" }} className="req">
                *
              </sup>
            )}
          </Form.Label>
        )}
        {source.length > 0 && defaultValue !== undefined ? (
          <>
            {editMode && defaultValue !== undefined ? (
              <Autocomplete
                id={name}
                options={source}
                // options={[...value, ...source]}
                {...props}
                size="small"
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, current) =>
                  option.id == current.id
                }
                onChange={(_, value) => handleOnChange(value)}
                value={getSelectedValues()}
                renderInput={(params) => (
                  <TextField
                    {...field}
                    {...params}
                    className="form-control"
                    InputProps={{ ...params.InputProps, readOnly }}
                    placeholder={label ? ` Select ${label} ` : "Select"} // if no label then undefiend will show so use label
                  />
                )}
                multiple={isMultiple}
                open={open}
                onOpen={() => !readOnly && setOpen(true)}
                onClose={() => setOpen(false)}
                disableClearable={readOnly}
                // rightAvatar={
                //   <Button
                //     onClick={handleClearClick()}
                //     label="Clear"
                //     primary={true} />
                // }
                renderOption={(props, option) => {
                  return (
                    <li
                      {...props}
                      key={option.id}
                      style={{ fontSize: "1.2rem", color: "black" }}
                    >
                      {option.label}
                    </li>
                  );
                }}
              />
            ) : (
              <Autocomplete
                id={name}
                options={source}
                // options={[...value, ...source]}
                {...props}
                size="small"
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, current) =>
                  option.id == current.id
                }
                onChange={(_, value) => handleOnChange(value)}
                defaultValue={isMultiple ? [] : null}
                renderInput={(params) => (
                  <TextField
                    {...field}
                    {...params}
                    className="form-control"
                    InputProps={{
                      ...params.InputProps,
                      readOnly,
                      style: { fontSize: "1rem" },
                    }}
                    placeholder={label ? ` Select ${label} ` : "Select"}
                  />
                )}
                multiple={isMultiple}
                open={open}
                onOpen={() => !readOnly && setOpen(true)}
                onClose={() => setOpen(false)}
                disableClearable={readOnly}
                renderOption={(props, option) => {
                  return (
                    <li
                      {...props}
                      key={option.id}
                      style={{ fontSize: "1.2rem", color: "black" }}
                    >
                      {option.label}
                    </li>
                  );
                }}
              />
            )}
          </>
        ) : (
          <Autocomplete
            id={name}
            options={[]}
            {...props}
            size="small"
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option, current) => option.id == current.id}
            onChange={(_, value) => {
              handleOnChange(value);
            }}
            value={getSelectedValues()}
            renderInput={(params) => (
              <TextField
                {...field}
                {...params}
                className="form-control"
                InputProps={{ ...params.InputProps, readOnly }}
                placeholder={label ? ` Select ${label} ` : "Select"}
              />
            )}
            multiple={isMultiple}
            open={open}
            onOpen={() => !readOnly && setOpen(true)}
            onClose={() => setOpen(false)}
            disableClearable={readOnly}
            renderOption={(props, option) => {
              return (
                <li
                  {...props}
                  key={option.id}
                  style={{ fontSize: "1.2rem", color: "black" }}
                >
                  {option.label}
                </li>
              );
            }}
          />
        )}
      </Form.Group>
    </>
  );
};

export default InputComboBoxApi;
