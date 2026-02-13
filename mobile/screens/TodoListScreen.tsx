import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { useTodos } from '../context/TodoContext';

export const TodoListScreen = ({ navigation }) => {
  const { todos, text, setText, handleDelete, addTodo, toggleTodo } =
    useTodos();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          placeholder="Enter a new todo"
          style={styles.input}
          onChangeText={setText}
          value={text}
        />
        <Pressable style={styles.button} onPress={addTodo}>
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
              onPress={() =>
                navigation.navigate('TodoDetails', {
                  todo: item,
                })
              }
            >
              <Text style={styles.todoText}>{item.text}</Text>
            </Pressable>
            <Pressable onPress={() => toggleTodo(item)}>
              <Text style={styles.checkbox}>{item.done ? '✅' : '⬜️'}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },

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
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },

  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },

  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginVertical: 6,
  },

  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },

  checkbox: {
    fontSize: 18,
    marginRight: 10,
  },

  todoText: {
    fontSize: 18,
    flexShrink: 1,
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
  deleteText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
