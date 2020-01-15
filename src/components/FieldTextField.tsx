
import * as React from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
} from '@material-ui/core';
import {
  WrappedFieldProps,
} from 'redux-form';
import { FormControlProps } from '@material-ui/core/FormControl';
import { TextFieldProps } from '@material-ui/core/TextField';
import uuid from 'uuid/v1';

export interface IFieldTextFieldComponentProps {
  FormControlProps?: FormControlProps;
  TextFieldProps?: TextFieldProps;
  id?: string;
}

interface IFieldTextFieldProps extends IFieldTextFieldComponentProps {
}

type FieldTextFieldProps = IFieldTextFieldProps & WrappedFieldProps;

const FieldTextField: React.FC<FieldTextFieldProps> = (props) => {
  const {
    input,
    meta: {
      error,
      touched,
      warning,
    } = {
      error: undefined,
      touched: undefined,
      warning: undefined,
    },
    id = uuid(),
    TextFieldProps = {},
    FormControlProps = {},
  } = props;

  return (
      <FormControl error={touched && (error != null)} {...FormControlProps} aria-describedby={id}>
        <TextField
            {...input}
            {...TextFieldProps}
        />
        <FormHelperText id={id}>{touched && (error || warning)}</FormHelperText>
      </FormControl>
  );
};

export default FieldTextField;
