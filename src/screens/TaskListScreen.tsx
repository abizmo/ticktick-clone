import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {mockTasks, Task} from '../data/mockData';

interface TaskListScreenProps {
  route: {
    params: {
      listId: string;
      listName: string;
    };
  };
}

const TaskItem = ({task}: {task: Task}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#007AFF';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <TouchableOpacity style={styles.taskItem}>
      <TouchableOpacity style={styles.checkbox}>
        <Icon
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={task.completed ? '#34C759' : '#007AFF'}
        />
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.completed && styles.completedTask]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={styles.taskDescription}>{task.description}</Text>
        )}
        
        <View style={styles.taskMeta}>
          {task.dueDate && (
            <View style={styles.metaItem}>
              <Icon name="calendar-outline" size={12} color="#666" />
              <Text style={styles.metaText}>{formatDate(task.dueDate)}</Text>
            </View>
          )}
          
          <View style={[styles.priorityBadge, {backgroundColor: getPriorityColor(task.priority)}]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function TaskListScreen({route}: TaskListScreenProps) {
  const {listId, listName} = route.params;
  
  const filteredTasks = mockTasks.filter(task => task.listId === listId);
  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{listName}</Text>
        <Text style={styles.headerSubtitle}>
          {pendingTasks.length} pending, {completedTasks.length} completed
        </Text>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TaskItem task={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton}>
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 10,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 15,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TaskListScreen;