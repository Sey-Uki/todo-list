import styles from './ToDoList.module.css';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { AddForm } from './AddForm/AddForm';
import { ListComponent } from './List/List';
import { Form, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export interface TodoItem {
  id: number;
  title: string;
}
const { confirm } = Modal;

export const ToDoList = () => {
  const [checkedItemList, setCheckedItemList] = useState<number[]>([]);
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  const [form] = Form.useForm();

  useEffect(() => {
    fetch('https://616205fa374925001763153b.mockapi.io/api/todo')
      .then((res) => res.json())
      .then((data) => data.length > 0 && setTodoList(data))
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleSubmit = ({ title }: { title: string }) => {
    console.log(title)
    const newTodo = {
      id: todoList.length > 0 ? +todoList[todoList.length - 1].id + 1 : 1,
      title,
    }

    fetch('https://616205fa374925001763153b.mockapi.io/api/todo',
      {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(() => {
        setTodoList([...todoList, newTodo])
        form.resetFields();
      })
  }

  const handleChange = (e: CheckboxChangeEvent, itemId: number) => {
    if (e.target.checked) {
      setCheckedItemList([...checkedItemList, itemId])
    } else {
      setCheckedItemList(checkedItemList.filter((item) => item !== itemId))
    }
  }


  const deleteTodo = (itemId: number) => {

    if (itemId) {
      confirm({
        title: 'Are you sure?',
        icon: <ExclamationCircleOutlined />,
        okType: 'danger',
        onOk() {
          fetch(`https://616205fa374925001763153b.mockapi.io/api/todo/${itemId}`,
            {
              method: "DELETE"
            }).then(() => {
              setTodoList(todoList.filter(item => item.id !== itemId));
            })
        },
      });
    }
  }

  const deleteMultipleTodos = () => {
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk() {
        checkedItemList.map((id) => {
          fetch(`https://616205fa374925001763153b.mockapi.io/api/todo/${id}`,
            {
              method: "DELETE"
            })
        })

        setTodoList(todoList.filter((item) => item.id !== checkedItemList.find((checkId) => checkId === item.id)))
        setCheckedItemList([])
        setIndeterminate(true);
      },
    });
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedItemList(e.target.checked ? todoList.map((todo) => todo.id) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleCheckBoxChange = (checkedValues: any) => {
    setCheckedItemList(checkedValues);
    setIndeterminate(!!checkedValues.length && checkedValues.length < todoList.length);
    setCheckAll(checkedValues.length === todoList.length);
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
        todoList={todoList}
        handleChange={handleChange}
        deleteTodo={deleteTodo}
        handleCheckBoxChange={handleCheckBoxChange}
        deleteMultipleTodos={deleteMultipleTodos}
        checkedItemList={checkedItemList}
        onCheckAllChange={onCheckAllChange}
      />
    </div>
  )
}