import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoContext = createContext(null);
const debuggerHost =
  Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
const backendHost = debuggerHost?.split(':').shift();
const API_URL = `http://${backendHost}:3000/api/todos`;

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');

  useEffect(() => {
    const getTodos = async () => {
      try {
        const stored = await AsyncStorage.getItem('@todos');
        if (stored) {
          const parsedStored = JSON.parse(stored);
          setTodos(parsedStored);
        }
        const res = await fetch(API_URL);
        const serverData = await res.json();
        setTodos(serverData);
        await AsyncStorage.setItem('@todos', JSON.stringify(serverData));
      } catch (error) {
        console.error('Failed to load todos:', error);
        const stored = await AsyncStorage.getItem('@todos');
        if (stored) {
          setTodos(JSON.parse(stored));
        }
      } finally {
        setLoading(false);
      }
    };
    getTodos();
  }, []);

  const toggleTodo = async item => {
    try {
      const done = !item.done;
      await fetch(`${API_URL}/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ done }),
      });

      const updatedTodos = todos.map(todo =>
        todo.id === item.id ? { ...todo, done } : todo
      );
      setTodos(updatedTodos);

      await AsyncStorage.setItem('@todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async item => {
    try {
      await fetch(`${API_URL}/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ item }),
      });

      const filteredList = todos.filter(todo => todo.id !== item.id);
      setTodos(filteredList);
      await AsyncStorage.setItem('@todos', JSON.stringify(filteredList));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) {
      console.log('Cannot add empty todo');
      return;
    }

    const todoObject = { id: Date.now(), text, done: false };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(todoObject),
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newTodo = await res.json();
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      await AsyncStorage.setItem('@todos', JSON.stringify(updatedTodos));
      setText('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const saveUpdate = async item => {
    try {
      await fetch(`${API_URL}/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(item),
      });
    } catch (error) {
      console.error('Failed to save updated todo:', error);
    }
  };

  const updateTodoText = useCallback(
    async (id, nextText, done) => {
      const updatedTodos = todos.map(t =>
        t.id === id ? { ...t, text: nextText } : t
      );
      setTodos(updatedTodos);

      await AsyncStorage.setItem('@todos', JSON.stringify(updatedTodos));

      saveUpdate({ id, text: nextText, done });
    },
    [todos]
  );

  const value = {
    todos,
    loading,
    text,
    setText,
    addTodo,
    toggleTodo,
    handleDelete,
    updateTodoText,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) return 'Oops there was a problem with context';
  return context;
};
