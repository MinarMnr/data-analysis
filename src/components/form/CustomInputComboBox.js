import React from "react";
import { Form } from "@themesberg/react-bootstrap";
import { fieldToTextField } from "formik-material-ui";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import uuid from "react-uuid";
//import { filter } from "core-js/core/array";

const CustomInputComboBox = ({
  label,
  data = [],
  value = "id",
  text = "label",
  subTextSubject,
  subTextTitle,
  result = "id",
  isMultiple = false,
  defaultValue = undefined,
  onChange,
  required = false,
  placeHolderShow = false,
  objectType = false,
  formType = "add",
  ...props
}) => {
  let source = data?.map((item) => {
    if (subTextSubject !== undefined && item[subTextSubject] !== null) {
      return {
        columnName: item[value],
        label: `${item[text]} ${
          subTextTitle !== undefined
            ? `(${subTextTitle} : ${item[subTextSubject]})`
            : `(${item[subTextSubject]})`
        }`,
        datasetName: item[subTextSubject],
        columnAlias: item["columnAlias"],
        columnAggregateFunction: item["columnAggregateFunction"],
        datasetId: item["datasetId"],
        columnTitle: item["columnTitle"],
        isVisible: true, // show checkbox true by default for the newly added column
        pivotValueList: [],
      };
    } else {
      return {
        columnName: item[value],
        label: item[text],
        datasetName: item[subTextSubject],
        columnAlias: item["columnAlias"],
        datasetId: item["datasetId"],
        columnTitle: item["columnTitle"],
        isVisible: true,
        pivotValueList: [],
      };
    }
  });

  //const [editvalue, setEditvalue] = React.useState([...defaultValue, source]);

  const {
    form: { setTouched, setFieldValue },
  } = props;

  const { error, helperText, ...field } = fieldToTextField(props);

  const { name } = field;

  const handleOnChange = (value) => {
    if (isMultiple) {
      if (value.length > 0) {
        if (!objectType) {
          setFieldValue(
            name,
            value.map((item) => item[result])
          );
        } else {
          setFieldValue(
            name,
            value.map((item) => item)
          );
        }
      } else {
        setFieldValue(name, []);
      }
    } else {
      // if (value) {
      //   setFieldValue(name, value[result]);
      // }
      // if (value !== null) {
      //   setFieldValue(name, value);
      // } else {
      //   setFieldValue(name, null);
      // }

      if (value !== null) {
        if (!objectType) {
          setFieldValue(name, [value]);
        } else {
          setFieldValue(name, [value]);
        }
      } else {
        setFieldValue(name, []);
      }
    }

    if (onChange !== undefined) {
      onChange(value);
    }
  };

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 500,
  });

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
        <Autocomplete
          //id={name}
          multiple={isMultiple}
          filterOptions={filterOptions}
          //disableClearable
          id="free-solo-demo"
          options={source}
          {...props}
          getOptionLabel={(option) => {
            if (!isMultiple && option.length > 0) {
              //for single value ... will not work for others
              return `${option[0]?.columnAlias ?? option[0]?.columnName} (${
                option[0]?.datasetName
              })`;
            } else {
              return `${
                option?.columnAlias
                  ? `${option?.columnAlias} (${option?.datasetName})`
                  : option[0]?.label ?? ""
              }`;
            }
          }}
          onChange={(_, value) => handleOnChange(value)}
          isOptionEqualToValue={(option, value) => {
            return formType == "add"
              ? option?.label == value?.label
              : isMultiple
              ? `${value?.columnAlias ?? value?.columnName} (${
                  value?.datasetName
                })` == option?.label
              : `${value[0]?.columnAlias ?? value[0]?.columnName} (${
                  value[0]?.datasetName
                })` == option?.label;
          }}
          value={defaultValue}
          renderInput={(params) => (
            <TextField
              //{...field}
              name={props.name}
              {...params}
              className="form-control"
              placeholder={
                !placeHolderShow && (label ? ` Select ${label} ` : "Select")
              }
            />
          )}
          //multiple={isMultiple}
        />
      </Form.Group>
    </>
  );
};

export default CustomInputComboBox;
