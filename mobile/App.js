import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Button,
} from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

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
        const fetchTodos = await fetch(API_URL);
        const todos = await fetchTodos.json();
        setTodos(todos);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        return error;
      }
    };

    getTodos();
  }, []);

  const onChangeText = text => {
    setText(text);
  };

  const onSubmit = async () => {
    try {
      const todoObject = { id: todos.length + 1, text, done: false };
      const todoPost = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(todoObject),
      });

      const newTodo = await todoPost.json();
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setText('');
    } catch (error) {
      console.log('error?', error);
    }
  };

  const handlePress = async item => {
    try {
      const done = !item.done;
      const todoPatch = await fetch(`${API_URL}/${item.id}`, {
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
      const todoPatch = await fetch(`${API_URL}/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ item }),
      });

      const { removedToDo } = await todoPatch.json();
      const filteredList = todos.filter(todo => todo.id !== removedToDo.id);
      setTodos(filteredList);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading todos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My todos</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="Enter a new todo"
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          />
          <Pressable style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Add Todo</Text>
          </Pressable>
        </View>
        <FlatList
          data={todos}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoRow}>
              <Pressable
                style={styles.todoContent}
                onPress={() => handlePress(item)}
              >
                <Text style={styles.todo}>
                  {item.done ? '✅' : '⬜️'} {item.text}
                </Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteText}>✕</Text>
              </Pressable>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  todo: { fontSize: 18, marginVertical: 5 },
  input: {
    flex: 1,
    height: 48,
    margin: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginVertical: 4,
  },
  todoContent: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  deleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
