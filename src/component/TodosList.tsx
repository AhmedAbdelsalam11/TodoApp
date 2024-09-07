import { useQuery } from "@tanstack/react-query";
import axiosinstance from "../config/AxiosConfig";

const TodosList = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await axiosinstance.get("users/me?populate=todos", {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });
      return data;
    },
  });

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      {data.todos.map((todo) => (
        <div
          key={todo.id} // Ensure each element has a unique key
          className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
        >
          <p className="w-full font-semibold">
            {todo.title} {/* Assuming 'title' is a property of todo */}
          </p>
          <div className="flex items-center justify-end w-full space-x-3">
            <button className="w-full text-2xl text-white font-semibold bg-indigo-700 hover:bg-indigo-500 p-2">
              Edit
            </button>
            <button className="w-full text-2xl text-white font-semibold bg-red-700 hover:bg-red-500 p-2">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodosList;