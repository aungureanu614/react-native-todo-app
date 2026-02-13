import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useTodos } from '../context/TodoContext';

export default function TodoDetailsScreen({ route, navigation }) {
  const { todo } = route.params;
  const { updateTodoText } = useTodos();

  const [draftText, setDraftText] = useState(todo?.text ?? '');

  useEffect(() => {
    navigation.setOptions({ title: `Todo #${todo.id}` });
  }, [navigation, todo.id]);

  const handleSave = () => {
    const next = draftText.trim();
    if (!next) {
      Alert.alert('Validation', 'Todo text is required');
      return;
    }
    updateTodoText(todo.id, next, todo.done);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit todo</Text>
      <TextInput
        style={styles.input}
        value={draftText}
        onChangeText={setDraftText}
        placeholder="Update todo text"
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
