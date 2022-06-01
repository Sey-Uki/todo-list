import styles from "./TodoList.module.css";
import { List, Checkbox } from "antd";
import { ReactComponent as DeleteIcon } from "../../../../img/delete.svg";
import { ReactComponent as NodataIcon } from "../../../../img/nodata.svg";
import { ITodo } from "../../../../features/todo/todoSlice";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

interface IProps {
  todos: ITodo[];
  checkedItemList: CheckboxValueType[];
  handleCheckBoxChange: (checkedValues: CheckboxValueType[]) => void;
  handleChange: (e: CheckboxChangeEvent, itemId: string) => void;
  deleteTodo: (itemId: string) => void;
}

export const TodoList: React.FC<IProps> = ({
  todos,
  checkedItemList,
  handleCheckBoxChange,
  handleChange,
  deleteTodo,
}) => {
  return (
    <div className="todoList">
      <List bordered>
        <Checkbox.Group
          value={checkedItemList}
          onChange={handleCheckBoxChange}
          className={styles.checkBox}
        >
          {todos.length > 0 ? (
            todos.map((item: any) => {
              return (
                <List.Item className={styles.li_item} key={item.id}>
                  <label>
                    <Checkbox
                      className={styles.check}
                      onChange={(e) => handleChange(e, item.id)}
                      value={item.id}
                    />
                    {item.title}
                  </label>
                  <button
                    className={styles.delete_img}
                    onClick={() => deleteTodo(item.id)}
                  >
                    <DeleteIcon />
                  </button>
                </List.Item>
              );
            })
          ) : (
            <div className={styles.nodata}>
              <NodataIcon />
              No data
            </div>
          )}
        </Checkbox.Group>
      </List>
    </div>
  );
};
