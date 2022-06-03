import styles from "./AddForm.module.css";
import { Button, Input, Form } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addTodo, selectTodosData } from "../../../features/todo/todoSlice";

export const AddForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { status } = useAppSelector(selectTodosData);

  const handleSubmit = ({ title }: { title: string }) => {
    const newTodo = { title };

    dispatch(addTodo(newTodo)).then(() => {
      form.resetFields();
    });
  };

  return (
    <>
      <div className={styles.main__img}></div>
      <div className={styles.header_wrapper}>
        <h1 className={styles.title}>To Do</h1>
      </div>
      <div className={styles.form_wrapper}>
        <Form
          form={form}
          onFinish={handleSubmit}
          className={styles.add}
          initialValues={{ title: "" }}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Add to do" className={styles.add_input} />
          </Form.Item>
          <Form.Item>
            <Button
              loading={status === "fetching"}
              type="primary"
              htmlType="submit"
              className={styles.add_btn}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
