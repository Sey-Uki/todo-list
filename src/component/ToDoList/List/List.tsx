import styles from './List.module.css';
import { List, Button, Divider, Checkbox, Modal } from 'antd';
import {ReactComponent  as DeleteI} from '../../../img/delete.svg';
import {ReactComponent  as NodataI} from '../../../img/nodata.svg';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { deleteTodos, fetchTodos, selectTodos, TodosState } from '../../../features/todo/todoSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface IListProps {
  indeterminate: boolean,
  checkAll: boolean,
  handleChange: any,
  handleCheckBoxChange: any,
  deleteMultipleTodos: any,
  checkedItemList: string[],
  onCheckAllChange: any
}

const { confirm } = Modal;


export const ListComponent = (prop: IListProps) => {

  const todos = useAppSelector(selectTodos);
  const { status, error } = useSelector((state: TodosState) => state)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [])
  
  const deleteTodo = (itemId: string) => {
    if (itemId) {
      confirm({
        title: 'Are you sure?',
        icon: <ExclamationCircleOutlined />,
        okType: 'danger',
        onOk() {
          dispatch(deleteTodos(itemId));
        },
      });
    }
  }


  const CheckboxGroup = Checkbox.Group;
  return (
    <>

    {status === "loading" && <h1>Loading....</h1>}
    {error && `Error: ${error}`}
      <div className={styles.list}>
        <Divider orientation="left">List</Divider>
        <Checkbox indeterminate={prop.indeterminate} checked={prop.checkAll} onChange={prop.onCheckAllChange}>
          Check all
        </Checkbox>
        <List
          bordered
        >
          <CheckboxGroup value={prop.checkedItemList} onChange={prop.handleCheckBoxChange} className={styles.checkBox}>
            {todos.length > 0 ?
              todos.map((item) => {
                return (<List.Item className={styles.li_item} key={item.id} >
                  <label>
                    <Checkbox className={styles.check} onChange={(e) => prop.handleChange(e, item.id)} value={item.id} />{item.title}
                  </label>
                  <div className={styles.delete_img} onClick={() => { deleteTodo(item.id) }}>
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