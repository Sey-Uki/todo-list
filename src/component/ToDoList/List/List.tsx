import styles from './List.module.css';
import { List, Button, Divider, Checkbox } from 'antd';
import { TodoItem } from '../ToDoList';
import {ReactComponent  as DeleteI} from '../../../img/delete.svg';
import {ReactComponent  as NodataI} from '../../../img/nodata.svg';

interface IListProps {
  indeterminate: boolean,
  checkAll: boolean,
  todoList: TodoItem[],
  handleChange: any,
  deleteTodo: any,
  handleCheckBoxChange: any,
  deleteMultipleTodos: any,
  checkedItemList: number[],
  onCheckAllChange: any
}


export const ListComponent = (prop: IListProps) => {
  const CheckboxGroup = Checkbox.Group;
  return (
    <>
      <div className={styles.list}>
        <Divider orientation="left">List</Divider>
        <Checkbox indeterminate={prop.indeterminate} checked={prop.checkAll} onChange={prop.onCheckAllChange}>
          Check all
        </Checkbox>
        <List
          bordered
        >
          <CheckboxGroup value={prop.checkedItemList} onChange={prop.handleCheckBoxChange} className={styles.checkBox}>
            {prop.todoList.length > 0 ?
              prop.todoList.map((item) => {
                return (<List.Item className={styles.li_item} key={item.id} >
                  <label>
                    <Checkbox className={styles.check} onChange={(e) => prop.handleChange(e, item.id)} value={item.id} />{item.title}
                  </label>
                  <div className={styles.delete_img} onClick={() => { prop.deleteTodo(item.id) }}>
                    <DeleteI />
                  </div>
                </List.Item>)
              }) : <div className={styles.nodata}>
                <NodataI />
                No data
                </div>
            }
          </CheckboxGroup>
        </List>
        <Button type="primary" danger onClick={prop.deleteMultipleTodos} className={styles.delete_btn}>Delete</Button>
      </div>
    </>
  )
}