import styles from "./TodoContent.module.css";
import { Button, Divider, Checkbox, Modal } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  deleteMultipleTodos,
  deleteSingleTodo,
  fetchTodos,
  selectTodosData,
} from "../../../features/todo/todoSlice";
import { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { TodoList } from "./TodoList/TodoList";

const { confirm } = Modal;

export const TodoContent: React.FC = () => {
  const { status, error, todoArray: todos } = useAppSelector(selectTodosData);

  const [checkedItemList, setCheckedItemList] = useState<CheckboxValueType[]>(
    []
  );
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isIndeterminated, setIsIndeterminated] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleChange = (e: CheckboxChangeEvent, itemId: string) => {
    if (e.target.checked) {
      setCheckedItemList([...checkedItemList, itemId]);
    } else {
      setCheckedItemList(checkedItemList.filter((item) => item !== itemId));
    }
  };

  const handleMultipleDeletion = () => {
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      onOk() {
        dispatch(deleteMultipleTodos(checkedItemList)).then(() => {
          setCheckedItemList([]);
          setIsIndeterminated(true);
        });
      },
    });
  };

  const handleAllCheckChange = (e: CheckboxChangeEvent) => {
    setCheckedItemList(e.target.checked ? todos.map((todo) => todo.id) : []);
    setIsIndeterminated(false);
    setIsAllChecked(e.target.checked);
  };

  const handleCheckBoxChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedItemList(checkedValues);
    setIsIndeterminated(
      !!checkedValues.length && checkedValues.length < todos.length
    );
    setIsAllChecked(checkedValues.length === todos.length);
  };

  const deleteTodo = (itemId: string) => {
    if (itemId) {
      confirm({
        title: "Are you sure?",
        icon: <ExclamationCircleOutlined />,
        okType: "danger",
        onOk() {
          dispatch(deleteSingleTodo(itemId));
        },
      });
    }
  };

  if (status === "loading") return <h1 className="loading">Loading....</h1>;

  if (error) return <h2>{`Error: ${error}`}</h2>;

  return (
    <section className="todoContent">
      <div className={styles.todoList}>
        <Divider orientation="left">List</Divider>
        <Checkbox
          indeterminate={isIndeterminated}
          checked={isAllChecked}
          onChange={handleAllCheckChange}
        >
          Check all
        </Checkbox>
        <TodoList
          todos={todos}
          checkedItemList={checkedItemList}
          handleCheckBoxChange={handleCheckBoxChange}
          handleChange={handleChange}
          deleteTodo={deleteTodo}
        />
        {checkedItemList.length > 0 ? (
          <Button
            loading={status === "fetching"}
            type="primary"
            danger
            onClick={handleMultipleDeletion}
            className={styles.delete_btn}
          >
            Delete
          </Button>
        ) : (
          <Button
            type="primary"
            danger
            disabled
            className={styles.delete_btn_disabled}
          >
            Delete
          </Button>
        )}
      </div>
    </section>
  );
};
