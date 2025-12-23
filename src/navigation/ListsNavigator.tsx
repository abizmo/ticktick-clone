import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import TaskListScreen from '../screens/TaskListScreen';
import {mockLists} from '../data/mockData';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}: any) => {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>My Lists</Text>
      </View>

      {mockLists.map(list => (
        <TouchableOpacity
          key={list.id}
          style={styles.drawerItem}
          onPress={() =>
            navigation.navigate('TaskList', {
              listId: list.id,
              listName: list.name,
            })
          }>
          <View style={styles.drawerItemContent}>
            <View style={styles.iconContainer}>
              <Icon name={list.icon} size={20} color={list.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.listName}>{list.name}</Text>
              <Text style={styles.taskCount}>{list.taskCount} tasks</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addListButton}>
        <Icon name="add-circle-outline" size={20} color="#007AFF" />
        <Text style={styles.addListText}>Add New List</Text>
      </TouchableOpacity>
    </View>
  );
};

function ListsNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Drawer.Screen
        name="TaskList"
        component={TaskListScreen}
        initialParams={{listId: '1', listName: 'Inbox'}}
        options={({route}: any) => ({
          title: route.params?.listName || 'Inbox',
        })}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    marginBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerItem: {
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 8,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  taskCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  addListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  addListText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007AFF',
  },
});

export default ListsNavigator;
