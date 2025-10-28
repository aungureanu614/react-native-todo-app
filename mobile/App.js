import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Pressable,
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
  }, [todos]);

  const handlePress = async item => {
    const done = item.done ? false : true;
    const todoPatch = await fetch(`${API_URL}/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ done }),
    });

    await todoPatch.json();
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
        <FlatList
          data={todos}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePress(item)}>
              <Text style={styles.todo}>
                {item.done ? '✅' : '⬜️'} {item.text}
              </Text>
            </Pressable>
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
});
