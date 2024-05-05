import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function Tags({ title, value, name, setField, data, ...props }) {
  var defaultList = [];
  if (data !== undefined && data && data.length > 0) {
    data.map((item) => {
      if (item.isChecked == true) {
        defaultList.push(item);
      }
    });
  }

  const [inputValue, setInputValue] = React.useState("");

  const defaultProps = {
    options: data,
    inputValue: inputValue,
  };

  return (
    <Stack spacing={3}>
      {data && data.length > 0 && (
        <>
          <Autocomplete
            multiple={props.isMultiple}
            id="tags-standard"
            {...defaultProps}
            filterSelectedOptions
            defaultValue={defaultList?.length ? [...defaultList] : []}
            getOptionLabel={(option) => option[title]}
            isOptionEqualToValue={(option, newValue) => {
              return option[value] == newValue[value];
            }}
            key={"mrk" + (10000 + Math.random() * (1000000 - 10000))}
            inputValue={inputValue}
            onChange={(e, val) => {
              const prevData = JSON.parse(JSON.stringify(data));

              prevData.map((item) => {
                let flag = 0;
                if (val.length > 0) {
                  val.map((selectItem) => {
                    if (selectItem[value] == item[value]) {
                      flag = 1;
                      item.isChecked = true;
                    }
                  });
                  if (flag == 0) item.isChecked = false;
                } else if (val.length == 0) {
                  item.isChecked = false;
                }
              });

              setField(`${name}`, prevData || "");
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder={props.placeHolder}
              />
            )}
          />
        </>
      )}
    </Stack>
  );
}
