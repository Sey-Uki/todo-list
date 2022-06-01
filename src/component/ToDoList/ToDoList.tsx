import styles from './ToDoList.module.css';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { AddForm } from './AddForm/AddForm';
import { ListComponent } from './List/List';
import { Form, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TODOS_URL } from '../../utils/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTodo, deleteTodos, fetchTodos, selectTodos } from '../../features/todo/todoSlice';

export interface TodoItem {
  id: string;
  title: string;
}

const { confirm } = Modal;


export const ToDoList = () => {
  const [checkedItemList, setCheckedItemList] = useState<string[]>([]);
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  const [form] = Form.useForm();


  const handleSubmit = ({ title }: { title: string }) => {
    const newTodo = { title }

    dispatch(addTodo(newTodo)).then(() => {
      form.resetFields();
    })
  }

  const handleChange = (e: CheckboxChangeEvent, itemId: string) => {
    if (e.target.checked) {
      setCheckedItemList([...checkedItemList, itemId])
    } else {
      setCheckedItemList(checkedItemList.filter((item) => item !== itemId))
    }
  }

  const deleteMultipleTodos = () => {
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk() {
        checkedItemList.map((id) => {
          dispatch(deleteTodos(id));
        })

        setTodoList(todos.filter((item) => item.id !== checkedItemList.find((checkId) => checkId === item.id)))
        setCheckedItemList([])
        setIndeterminate(true);
      },
    });
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedItemList(e.target.checked ? todos.map((todo) => todo.id) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleCheckBoxChange = (checkedValues: any) => {
    setCheckedItemList(checkedValues);
    setIndeterminate(!!checkedValues.length && checkedValues.length < todos.length);
    setCheckAll(checkedValues.length === todos.length);
  };

  return (
    <div className={styles.todo}>
      <AddForm
        form={form}
        handleSubmit={handleSubmit}
      />
      <ListComponent
        indeterminate={indeterminate}
        checkAll={checkAll}
        handleChange={handleChange}
        handleCheckBoxChange={handleCheckBoxChange}
        deleteMultipleTodos={deleteMultipleTodos}
        checkedItemList={checkedItemList}
        onCheckAllChange={onCheckAllChange}
      />
    </div>
  )
}