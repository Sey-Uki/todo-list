import { AddForm } from './AddForm/AddForm';
import { TodoContent } from './TodoContent/TodoContent';

export const TodoView = () => {
  return (
    <div className="todos">
      <AddForm />
      <TodoContent />
    </div>
  )
}