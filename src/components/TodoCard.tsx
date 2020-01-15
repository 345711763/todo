import React from 'react';
import {
  compose,
  AnyAction,
  Dispatch,
} from 'redux';
import {
  makeStyles,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {
  Record,
  List,
} from 'immutable';
import {
  ITodo,
  CompletedTodoAction,
  AddSubTodoAction,
  SubTodoFactory,
  ISubTodo,
  DeleteTodoAction,
  CompleteSubTodoAction,
  SelectTodoAction,
} from '../actions/default';
import {
  Checkbox,
  Typography,
  Button,
  Grid,
} from '@material-ui/core';
import {
  connect,
} from 'react-redux';
import {
  createStructuredSelector,
} from 'reselect';
import {
  makeSelectSubTodosForTodo, makeSelectSelectedTodoId,
} from '../selectors/default';
import classnames from 'classnames';
import { reduxForm, Field, Form } from 'redux-form/immutable';
import { InjectedFormProps } from 'redux-form';
import TextField from "@material-ui/core/TextField";

interface ITodoCardComponentProps {
  todo: Record<ITodo>;
}

interface ITodoCardProps extends ITodoCardComponentProps {
  dispatch: Dispatch<AnyAction>;
  todoId: number;
  complete: boolean;
  subtodos: List<Record<ISubTodo>>;
  selectedTodoId: number;
}

const useStyles = makeStyles({
  card: {
    margin: 4,
    maxWidth: 345,
  },
  cardSelected: {
    backgroundColor: 'lightgrey',
  },
  completed: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  subtodoContainer: {
    paddingLeft: '1em',
  }
});

interface Values extends Partial<ISubTodo> {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> ;
}

const renderField = (field: any) => {
  console.log(field.input);
  return (<TextField {...field.input} placeholder="title"/>);
}
const formatTitle = (todo: Record<ITodo>) => {
  let title = todo.get('title');
  if (todo.get('value1') !== '') {
    title = title + ' ' + todo.get('value1') + ';';
  }
  if (todo.get('value2') !== '') {
    title = title + todo.get('value2') + ';';
  }
  if (todo.get('value3') !== '') {
    title = title + todo.get('value3') + ';';
  }
  if (todo.get('value4') !== '') {
    title = title + todo.get('value4') + ';';
  }
  return title;
};
const TodoCard: React.FC<ITodoCardProps & InjectedFormProps> = (props) => {
  const classes = useStyles();
  const {
    todo,
    todoId,
    complete,
    subtodos,
    dispatch,
    selectedTodoId,
    reset,
    handleSubmit,
  } = props;
  // (values: Record<Values>) but handleSubmit is typed wrong
  const onSubmit = (values: any) => {
    dispatch(new AddSubTodoAction({
      todoId,
      subTodo: SubTodoFactory(values)
    }));
    reset()
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent
            classes={{
              root: classnames({[classes.cardSelected]: selectedTodoId === todoId})
            }}
            onClick={() => {
              dispatch(new SelectTodoAction({todoId}))
            }}
          >
            <Grid
              container={true}
            >
              <Grid
                container={true}
                item={true}
                alignItems='center'
                wrap='nowrap'
              >
                <Checkbox
                  checked={complete}
                  value={complete}
                  onChange={() => {
                    dispatch(new CompletedTodoAction({ todo, complete }))
                  }}
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  classes={{
                    root: complete ? classes.completed : '',
                  }}
                >
                  {formatTitle(todo)}
                </Typography>
              </Grid>
              <Grid
                container={true}
                item={true}
                direction='column'
                classes={{
                  item: classes.subtodoContainer,
                }}
              >
                {
                  subtodos.map((subtodo) => {
                    const subtodoId = subtodo.get('id');
                    const subComplete = subtodo.get('complete');
                    return <Grid
                      key={subtodoId}
                      container={true}
                      item={true}
                      alignItems='center'
                      wrap='nowrap'
                    >
                      <Checkbox
                        checked={subComplete}
                        value={subComplete}
                        onChange={() => {
                          dispatch(new CompleteSubTodoAction({ subtodo, complete: subComplete }))
                        }}
                        inputProps={{
                          'aria-label': 'primary checkbox',
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        classes={{
                          root: subComplete ? classes.completed : '',
                        }}
                      >
                        {subtodo.get('title')}
                      </Typography>
                    </Grid>
                  })
                }
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            //@ts-ignore
            onClick={() => {
              dispatch(new DeleteTodoAction({ todo }));
            }}
          >
            Delete
          </Button>
          <Field
            name='title'
            component={renderField}
          />
          <Button
            size="small"
            color="primary"
            type="submit"
          >
            {"Add SubTodo"}
          </Button>
        </CardActions>
      </Card>
    </Form>
  );
}

const mapStateToProps = (state: any, ownProps: ITodoCardComponentProps) => {
  console.log("mapStateToProps");
  const {
    todo
  } = ownProps;
  const todoId = todo.get('id');
  const complete = todo.get('complete');
  const form = `form_${todoId}`;
  console.log(form);
  console.log(ownProps);
  const result = createStructuredSelector({
    selectedTodoId: makeSelectSelectedTodoId(),
    subtodos: makeSelectSubTodosForTodo(todoId),
  })(state);
  return {
    form,
    todoId,
    complete,
    ...result
  }
};
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    dispatch,
  };
};

export default compose<React.ComponentClass<ITodoCardComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
      destroyOnUnmount: true,
    }),
)(TodoCard);