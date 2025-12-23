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
import {focusTasks, mockLists} from '../data/mockData';

function FocusScreen() {
  const getListName = (listId: string) => {
    const list = mockLists.find(l => l.id === listId);
    return list?.name || 'Unknown';
  };

  const getListColor = (listId: string) => {
    const list = mockLists.find(l => l.id === listId);
    return list?.color || '#007AFF';
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return '';
    }
    const today = new Date();
    const taskDate = new Date(date);

    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(taskDate);
  };

  const renderFocusTask = ({item}: any) => (
    <TouchableOpacity style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <TouchableOpacity style={styles.checkbox}>
          <Icon name="ellipse-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.taskDescription}>{item.description}</Text>
          )}
        </View>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.listBadge}>
          <View
            style={[
              styles.listIndicator,
              {backgroundColor: getListColor(item.listId)},
            ]}
          />
          <Text style={styles.listName}>{getListName(item.listId)}</Text>
        </View>

        {item.dueDate && (
          <View style={styles.dueDateContainer}>
            <Icon name="calendar-outline" size={12} color="#666" />
            <Text style={styles.dueDate}>{formatDate(item.dueDate)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Focus</Text>
        <Text style={styles.headerSubtitle}>
          {focusTasks.length} important tasks
        </Text>
      </View>

      {focusTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="flash-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySubtitle}>
            No high priority or due soon tasks
          </Text>
        </View>
      ) : (
        <FlatList
          data={focusTasks}
          keyExtractor={item => item.id}
          renderItem={renderFocusTask}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    padding: 15,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 15,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  listName: {
    fontSize: 12,
    color: '#666',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FocusScreen;
