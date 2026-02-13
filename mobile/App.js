import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TodoListScreen } from './screens/TodoListScreen';
import TodoDetailsScreen from './screens/TodoDetailsScreen';
import { TodoProvider, useTodos } from './context/TodoContext';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { loading } = useTodos();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading todos...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Todos" options={{ title: 'Todos' }}>
          {props => <TodoListScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen
          name="TodoDetails"
          component={TodoDetailsScreen}
          initialParams={{}}
          options={{ title: 'Todo Details' }}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </SafeAreaProvider>
  );
}
