import { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      console.log(import.meta.env.VITE_API_URL)
      console.log('Fetching todos from /api/todos...');
      const res = await axios.get(import.meta.env.VITE_API_URL);
      setTodos(res.data);
      console.log('Todos fetched:', res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err.response?.status, err.message);
      setError('Failed to fetch todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Todo cannot be empty');
      return;
    }
    setLoading(true);
    try {
      console.log('Adding todo:', text);
      const res = await axios.post(import.meta.env.VITE_API_URL, { text });
      setTodos([res.data, ...todos]);
      setText('');
      console.log('Todo added:', res.data);
      setError(null);
    } catch (err) {
      console.error('Error adding todo:', err.response?.status, err.message);
      setError('Failed to add todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    try {
      console.log(`Toggling todo: ${id}`);
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/${id}`);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      console.log('Todo toggled:', res.data);
      setError(null);
    } catch (err) {
      console.error('Error toggling todo:', err.response?.status, err.message);
      setError('Failed to toggle todo. Please try again.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      console.log(`Deleting todo: ${id}`);
      await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      console.log(`Todo deleted: ${id}`);
      setError(null);
    } catch (err) {
      console.error('Error deleting todo:', err.response?.status, err.message);
      setError('Failed to delete todo. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Todo App</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          Add
        </button>
      </form>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
          >
            <span
              onClick={() => toggleTodo(todo._id)}
              className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-4">No todos yet!</p>
      )}
    </div>
  );
};

export default TodoList;