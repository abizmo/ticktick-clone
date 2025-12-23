import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {mockTasks, mockLists} from '../data/mockData';

function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getTasksForDate = (date: Date) => {
    return mockTasks.filter(task => {
      if (!task.dueDate) {
        return false;
      }
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getListName = (listId: string) => {
    const list = mockLists.find(l => l.id === listId);
    return list?.name || 'Unknown';
  };

  const getListColor = (listId: string) => {
    const list = mockLists.find(l => l.id === listId);
    return list?.color || '#007AFF';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const weekDates = getWeekDates();
  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.monthYear}>{formatMonthYear(selectedDate)}</Text>
      </View>

      <View style={styles.weekContainer}>
        {weekDates.map((date, index) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const tasksCount = getTasksForDate(date).length;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayButton, isSelected && styles.selectedDay]}
              onPress={() => setSelectedDate(date)}>
              <Text
                style={[styles.dayText, isSelected && styles.selectedDayText]}>
                {formatDate(date)}
              </Text>
              {tasksCount > 0 && (
                <View style={styles.taskIndicator}>
                  <Text style={styles.taskCount}>{tasksCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.tasksContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.tasksHeader}>
          Tasks for {formatDate(selectedDate)}
        </Text>

        {selectedDateTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No tasks for this date</Text>
          </View>
        ) : (
          selectedDateTasks.map(task => (
            <TouchableOpacity key={task.id} style={styles.taskItem}>
              <TouchableOpacity style={styles.checkbox}>
                <Icon
                  name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={task.completed ? '#34C759' : '#007AFF'}
                />
              </TouchableOpacity>

              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.completedTask,
                  ]}>
                  {task.title}
                </Text>
                {task.description && (
                  <Text style={styles.taskDescription}>{task.description}</Text>
                )}

                <View style={styles.taskMeta}>
                  <View style={styles.listBadge}>
                    <View
                      style={[
                        styles.listIndicator,
                        {backgroundColor: getListColor(task.listId)},
                      ]}
                    />
                    <Text style={styles.listName}>
                      {getListName(task.listId)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  monthYear: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  weekContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 2,
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedDayText: {
    color: 'white',
  },
  taskIndicator: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  taskCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  tasksContainer: {
    flex: 1,
    padding: 15,
  },
  tasksHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default CalendarScreen;
