import type { TodoModel } from "@/models/TodoModel";

interface TodoCardProps {
  todo: TodoModel;
  handleEdit: (todo: TodoModel) => void;
  handleDelete: () => void;
}

const TodoCard = ({ todo, handleEdit, handleDelete }: TodoCardProps) => {
  return (
    <div className="card mt-2">
      <div className="card-body">
        <h5 className="card-title">{todo.name}</h5>
        <p className="card-text">{todo.description}</p>
        <button
          className="btn btn-primary me-2"
          onClick={() => handleEdit(todo)}
        >
          Edit
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
