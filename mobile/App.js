import { ActivityIndicator, Text, View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import Constants from 'expo-constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TodoListScreen } from './screens/TodoListScreen';
import TodoDetailsScreen from './screens/TodoDetailsScreen';

const Stack = createNativeStackNavigator();

const debuggerHost =
  Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
const backendHost = debuggerHost?.split(':').shift();
const API_URL = `http://${backendHost}:3000/api/todos`;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');

  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTodos(data);
      } finally {
        setLoading(false);
      }
    };
    getTodos();
  }, []);

  const handlePress = async item => {
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

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === item.id ? { ...todo, done } : todo))
      );
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
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const onSubmit = async () => {
    const todoObject = { id: todos.length + 1, text, done: false };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(todoObject),
    });

    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);
    setText('');
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

  const updateTodoText = useCallback((id, nextText, done) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text: nextText } : t))
    );
    saveUpdate({ id, text: nextText, done });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading todos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Todos" options={{ title: 'Todos' }}>
            {props => (
              <TodoListScreen
                {...props}
                todos={todos}
                text={text}
                setText={setText}
                onSubmit={onSubmit}
                handleDelete={handleDelete}
                handlePress={handlePress}
                onSave={updateTodoText}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="TodoDetails"
            component={TodoDetailsScreen}
            initialParams={{}}
            options={{ title: 'Todo Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
