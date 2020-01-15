import React, {ChangeEvent} from 'react';
import {
  compose,
  bindActionCreators,
  AnyAction,
  Dispatch,
} from 'redux';
import { IMatch } from '../../Interfaces';
import {
  getIn,
  Record,
  List,
} from 'immutable';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {
  AddTodoAction,
  DeleteTodoAction,
  CompletedTodoAction,
  AddSubTodoAction,
  ITodo,
  ISubTodo,
  TodoFactory,
  IUser,
  EditTodoAction,
} from '../../actions/default';
import {
  makeSelectTodosForUser,
  makeSelectUser,
  makeSelectSelectedTodoForUser,
} from '../../selectors/default';
import { createStructuredSelector } from 'reselect';
import TodoCard from '../../components/TodoCard';
import {Formik, Field, FormikHelpers, ErrorMessage, FormikState, withFormik} from 'formik';
import pick from 'lodash/pick';

interface ITodoComponentProps {
  match: IMatch,
}

interface ITodoProps extends ITodoComponentProps {
  addTodo: (userId: number, todo: Record<ITodo>) => void;
  editTodo: (todoId: number, todo: Record<ITodo>) => void;
  addTodoSubTodo: (todo: Record<ITodo>) => void;
  deleteTodo: (todoId: number) => void;
  completedTodo: (todo: Record<ITodo>, complete: boolean) => void;
  addSubTodo: (todoId: number, subTodo: Record<ISubTodo>) => void;
  userId: number;
  todoId: number;
  todosForUser: List<Record<ITodo>>;
  subTodoForTodo: List<Record<ISubTodo>>;
  user?: Record<IUser>;
  selectedTodo?: Record<ITodo>;
}

const addTodo = (userId: number, todo: Record<ITodo>) => new AddTodoAction({ userId, todo });
const editTodo = (todoId: number, todo: Record<ITodo>) => new EditTodoAction({ todoId, todo });
const deleteTodo = (todo: Record<ITodo>) => new DeleteTodoAction({ todo });
const completedTodo = (todo: Record<ITodo>, complete: boolean) => new CompletedTodoAction({ todo, complete });
const addSubTodo = (todoId: number, subTodo: Record<ISubTodo>) => new AddSubTodoAction({ todoId, subTodo });

interface Values extends Partial<ITodo> {
}

const Todo: React.FC<ITodoProps> = (props) => {
  const {
    addTodo,
    userId,
    editTodo,
    todosForUser,
    user,
    selectedTodo,
  } = props;

  console.log('rerendering Todo');
  if (user == null) {
    return (
      <Grid
        container={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
        >
          <Typography
            variant='h5'
          >
            INVALID USER
          </Typography>
        </Grid>
      </Grid>
    );
  }

  const defaultValues = {
    title: '',
    value1: '',
    value2: '',
    value3: '',
    value4: '',
  }
  console.log(selectedTodo !== undefined && selectedTodo.toJS());
  console.log(Object.assign({}, defaultValues));
  // change initialValues when selectedTodo changed.
  console.log(selectedTodo != null);
  const initialValues = selectedTodo != null
    ? Object.assign({}, defaultValues, pick(selectedTodo.toJS(), [
      'title',
      'value1',
      'value2',
      'value3',
      'value4',
    ]))
    : defaultValues;

  console.log(initialValues);
  // for submit action - creates new todo with values given
  const onSubmit = (values: Values, formikHelpers: FormikHelpers<Values>) => {
    if (selectedTodo != null) {
      editTodo(
        selectedTodo.get('id'),
        TodoFactory(selectedTodo.merge(values)),
      )
    } else {

      addTodo(
        userId,
        TodoFactory(values),
      )
    }
    formikHelpers.resetForm();
  };

  const validate = (values: Values) => {
    console.debug('validate', { // tslint:disable-line
      values,
    })
  };
  return (<Formik
    initialValues={initialValues}
    enableReinitialize={true}
    validateOnChange={true}
    validate={validate}
    onSubmit={(values, forkmikHelpers) => {
      onSubmit(values, forkmikHelpers);
    }}
    render={({ handleSubmit, handleChange, handleBlur, values, errors, resetForm, setTouched, validateForm }) => {
      console.log("render TODO");
      console.log(values);
      const onInputChange = (e: any) => {
        if(selectedTodo) {
          editTodo(selectedTodo.get('id'), selectedTodo.set(e.target.name, e.target.value));
        }
        handleChange(e);
      };
      return (<Grid
        container={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
        >
          <Typography
            variant='h5'
          >
            TODOS FOR {user.get('name')}
          </Typography>
        </Grid>
        <Grid
          container={true}
          item={true}
          direction='column'
          wrap='nowrap'
        >
          <Grid
            item={true}
            container={true}
            alignItems='center'
          >
            <Grid
              item={true}
              container={true}
            >
              <Grid
                item={true}
              >
                <Field
                    name='title'
                >
                  {({
                      field, // { name, value, onChange, onBlur }
                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => {
                    console.log(field);
                    return (
                     <TextField {...field} onChange={onInputChange} value={field.value} placeholder="title"/>
                    );
                  }}
                </Field>
                <ErrorMessage
                  name='title'
                />
              </Grid>
              <Grid
                item={true}
              >
                <Field
                    name='value1'
                >
                  {({
                      field, // { name, value, onChange, onBlur }
                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => (<TextField {...field} onChange={onInputChange} value={field.value} placeholder="value1"/>
                  )}
                </Field>
                <ErrorMessage
                  name='value1'
                />
              </Grid>
              <Grid
                item={true}
              >
                <Field
                  name='value2'
                >
                  {({
                      field, // { name, value, onChange, onBlur }
                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => (<TextField {...field} onChange={onInputChange} value={field.value} placeholder="value2"/>
                  )}
                </Field>
                <ErrorMessage
                  name='value2'
                />
              </Grid>
              <Grid
                item={true}
              >
                <Field
                    name='value3'
                >
                  {({
                      field, // { name, value, onChange, onBlur }
                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => (<TextField {...field} onChange={onInputChange} value={field.value} placeholder="value3"/>
                  )}
                </Field>
                <ErrorMessage
                  name='value3'
                />
              </Grid>
              <Grid
                item={true}
              >
                <Field
                    name='value4'
                >
                  {({
                      field, // { name, value, onChange, onBlur }
                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => (<TextField {...field} onChange={onInputChange} value={field.value} placeholder="value4"/>
                  )}
                </Field>
                <ErrorMessage
                  name='value4'
                />
              </Grid>
            </Grid>
            <Grid
              item={true}
            >
              <Button
                variant='outlined'
                onClick={
                  () => {
                    handleSubmit()
                  }
                }
              >
                Input Todo
              </Button>
            </Grid>
            <Grid
              item={true}
            >
              <Button
                variant='outlined'
                onClick={
                  () => {
                    resetForm()
                  }
                }
              >
                Reset
              </Button>
            </Grid>

          </Grid>
          <Grid
            container={true}
            item={true}
          >
            {
              todosForUser.map((todo, index) => {
                return <TodoCard todo={todo} key={index} />
              })
            }
          </Grid>
        </Grid>
      </Grid>);
    }}
  />
  );
}

const mapStateToProps = (state: any, props: ITodoComponentProps) => {
  const {
    match,
  } = props;
  const userId = parseInt(getIn(match, ['params', 'userId'], -1), 10); // from path / router
  return {
    userId,
    ...createStructuredSelector({
      selectedTodo: makeSelectSelectedTodoForUser(userId),
      todosForUser: makeSelectTodosForUser(userId),
      user: makeSelectUser(userId),
    })(state)
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({ addTodo, deleteTodo, editTodo, completedTodo, addSubTodo }, dispatch)
  };
};


export default compose<React.ComponentClass<ITodoComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps),
)(Todo);