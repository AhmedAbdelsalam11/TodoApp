import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import { ChangeEvent, FormEvent, useState } from "react";
import useCustomQuery from "../hooks/UseAuthenticatedQuery";
import axiosInstance from "../config/AxiosConfig";
import TodoSkeleton from "./ui/TodoSkeleton";


const TodosList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [queryVersion, setQueryVersion] = useState(1);

  const [isRemoveTodo, setIsRemoveTodo] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({ id: 0, title: "", description: "" });
  const [todoToAdd, setTodoToAdd] = useState({ title: "", description: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  

  const { isLoading, data } = useCustomQuery({
    queryKey: ["todoList", `${queryVersion}`],
    url: "users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // ** Handlers
  const onCloseEditModal = () => {
    setTodoToEdit({ id: 0, title: "", description: "" });
    setIsOpenEditModal(false);
  };

  const onOpenEditModal = (todo: ITodo) => {
    setIsOpenEditModal(true);
    setTodoToEdit(todo);
  };

  const onCloseAddModal = () => {
    setTodoToAdd({ title: "", description: "" });
    setIsAddModalOpen(false);
  };

  const onOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTodoToEdit({ ...todoToEdit, [name]: value });
  };

  const onChangeAddHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTodoToAdd({ ...todoToAdd, [name]: value });
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    setIsUpdating(true);
    e.preventDefault();
    const { title, description } = todoToEdit;

    try {
      const { status } = await axiosInstance.put(`/todos/${todoToEdit.id}`, {
        data: { title, description },
      }, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 200) {
        onCloseEditModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitAddHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description } = todoToAdd;

    try {
      const { status } = await axiosInstance.post(`/todos`, {
        data: { title, description, user: [userData.user.id] },
      }, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 200) {
        onCloseAddModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onCloseRemoveModal = () => {
    setTodoToEdit({ id: 0, title: "", description: "" });
    setIsRemoveTodo(false);
  };

  const onOpenRemoveModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsRemoveTodo(true);
  };

  const onRemoveTodo = async () => {
    setIsRemoveTodo(true);

    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 200) {
        onCloseRemoveModal();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };


  

  if (isLoading) {
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex w-fit mx-auto my-10 gap-x-2">
        <Button variant="default" size={"sm"} onClick={onOpenAddModal}>
          Post new todo
        </Button>
    
      </div>
      {data?.todos?.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">
              {todo.id} - {todo.title}
            </p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button variant={"default"} size={"sm"} onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"} onClick={() => onOpenRemoveModal(todo)}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No Todos Yet</h3>
      )}

      {/* Edit Todo Modal */}
      <Modal isOpen={isOpenEditModal} closeModal={onCloseEditModal} title="Edit this todo">
        <form className="space-y-3" onSubmit={onSubmitHandler}>
          <Input name="title" value={todoToEdit.title} onChange={onChangeHandler} />
          <Textarea name="description" value={todoToEdit.description} onChange={onChangeHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating}>
              Update
            </Button>
            <Button variant={"cancel"} type="button" onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Todo Modal */}
      <Modal isOpen={isAddModalOpen} closeModal={onCloseAddModal} title="Add New Todo">
        <form className="space-y-3" onSubmit={onSubmitAddHandler}>
          <Input name="title" value={todoToAdd.title} onChange={onChangeAddHandler} />
          <Textarea name="description" value={todoToAdd.description} onChange={onChangeAddHandler} />
          <div className="flex items-center space-x-3 mt-4">
            <Button className="bg-indigo-700 hover:bg-indigo-800" isLoading={isUpdating}>
              Add
            </Button>
            <Button variant={"cancel"} type="button" onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Todo Modal */}
      <Modal
        isOpen={isRemoveTodo}
        closeModal={onCloseRemoveModal}
        title="Are you sure you want to remove this todo from your store?"
        description="Deleting this todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3 mt-4">
          <Button variant="danger" onClick={onRemoveTodo}>
            Yes, remove
          </Button>
          <Button variant={"cancel"} type="button" onClick={onCloseRemoveModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodosList;