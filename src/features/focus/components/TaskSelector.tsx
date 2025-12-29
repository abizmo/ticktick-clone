/**
 * TaskSelector Component
 *
 * Allows users to select a task to associate with their Focus session.
 * Displays the currently selected task and provides a modal to choose from
 * available incomplete tasks.
 *
 * Features:
 * - Display currently selected task or "No task selected"
 * - Modal with list of incomplete tasks from mockData
 * - Task filtering (only incomplete tasks)
 * - Task details: name, list name, priority indicator
 * - "No task" option for unassociated sessions
 * - Prevents task changes during active sessions (optional)
 * - Full accessibility support
 *
 * @module TaskSelector
 */

import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {mockTasks, mockLists} from '../../../data/mockData';
import type {Task} from '../types/focus.types';

/**
 * Task item for the selection list
 */
interface TaskItem {
  task: Task | null;
  listName?: string;
}

/**
 * TaskSelector Component
 *
 * Renders task selection interface with modal for choosing tasks.
 * Integrates with focus store for task management.
 *
 * @returns React.JSX.Element
 */
const TaskSelector: React.FC = (): React.JSX.Element => {
  // Subscribe to store state and actions
  const selectedTask = useFocusStore(state => state.selectedTask);
  const currentSession = useFocusStore(state => state.currentSession);
  const selectTask = useFocusStore(state => state.selectTask);

  // Local state for modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * Get available tasks (incomplete only) with list information
   */
  const availableTasks = useMemo((): TaskItem[] => {
    // Defensive check for mockData availability
    if (!mockTasks || !Array.isArray(mockTasks)) {
      console.warn('[TaskSelector] mockTasks is not available');
      return [{task: null, listName: undefined}];
    }

    if (!mockLists || !Array.isArray(mockLists)) {
      console.warn('[TaskSelector] mockLists is not available');
      return [{task: null, listName: undefined}];
    }

    // Filter incomplete tasks
    const incompleteTasks = mockTasks.filter(task => !task.completed);

    // Map tasks with list names
    const taskItems: TaskItem[] = incompleteTasks.map(task => {
      const foundList = mockLists.find(list => list.id === task.listId);
      return {
        task,
        listName: foundList?.name ?? 'Unknown List',
      };
    });

    // Add "No task" option at the beginning
    return [{task: null, listName: undefined}, ...taskItems];
  }, [mockTasks, mockLists]);

  /**
   * Get priority color for task
   */
  const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
    switch (priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  /**
   * Get priority indicator symbol
   */
  const getPriorityIndicator = (
    priority: 'low' | 'medium' | 'high',
  ): string => {
    switch (priority) {
      case 'high':
        return '!!!';
      case 'medium':
        return '!!';
      case 'low':
        return '!';
      default:
        return '!'; // Consistent default with getPriorityColor
    }
  };

  /**
   * Handle task selection
   */
  const handleTaskSelect = (taskItem: TaskItem): void => {
    selectTask(taskItem.task);
    setIsModalVisible(false);
  };

  /**
   * Handle opening task selector
   */
  const handleOpenSelector = (): void => {
    // Check if session is active and prevent changes
    if (currentSession) {
      Alert.alert(
        'Session Active',
        'You cannot change the task while a Focus session is active. Please stop the current session first.',
        [{text: 'OK', style: 'default'}],
      );
      return;
    }

    setIsModalVisible(true);
  };

  /**
   * Get selected task display text
   */
  const getSelectedTaskDisplay = (): string => {
    if (!selectedTask) {
      return 'No task selected';
    }
    return selectedTask.title;
  };

  /**
   * Get selected task list name
   */
  const getSelectedTaskListName = (): string | undefined => {
    if (!selectedTask) {
      return undefined;
    }
    if (!mockLists || !Array.isArray(mockLists)) {
      return undefined;
    }
    const foundList = mockLists.find(list => list.id === selectedTask.listId);
    return foundList?.name;
  };

  /**
   * Render task item in the selection list
   */
  const renderTaskItem = ({item}: {item: TaskItem}): React.JSX.Element => {
    const isSelected = item.task?.id === selectedTask?.id;
    const isNoTask = item.task === null;

    return (
      <TouchableOpacity
        style={[styles.taskItem, isSelected && styles.selectedTaskItem]}
        onPress={() => handleTaskSelect(item)}
        accessibilityLabel={
          isNoTask
            ? 'No task selected'
            : `Select task: ${item.task?.title} from ${item.listName}`
        }
        accessibilityRole="button"
        accessibilityState={{selected: isSelected}}>
        {isNoTask ? (
          <View style={styles.noTaskContainer}>
            <Text style={styles.noTaskText}>No task</Text>
            <Text style={styles.noTaskSubtext}>
              Focus without a specific task
            </Text>
          </View>
        ) : (
          <View style={styles.taskContent}>
            <View style={styles.taskHeader}>
              <Text
                style={[
                  styles.taskTitle,
                  isSelected && styles.selectedTaskTitle,
                ]}
                numberOfLines={2}>
                {item.task?.title}
              </Text>
              <View
                style={[
                  styles.priorityIndicator,
                  {backgroundColor: getPriorityColor(item.task!.priority)},
                ]}>
                <Text style={styles.priorityText}>
                  {getPriorityIndicator(item.task!.priority)}
                </Text>
              </View>
            </View>

            <View style={styles.taskMeta}>
              <Text style={styles.listName}>{item.listName}</Text>
              {item.task?.dueDate && (
                <Text style={styles.dueDate}>
                  Due: {item.task.dueDate.toLocaleDateString()}
                </Text>
              )}
            </View>

            {item.task?.description && (
              <Text style={styles.taskDescription} numberOfLines={2}>
                {item.task.description}
              </Text>
            )}
          </View>
        )}

        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Current Task Display */}
      <TouchableOpacity
        style={styles.selector}
        onPress={handleOpenSelector}
        accessibilityLabel={`Currently selected task: ${getSelectedTaskDisplay()}. Tap to change.`}
        accessibilityRole="button"
        accessibilityHint="Opens a list of tasks to choose from for your Focus session">
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLabel}>Task</Text>
          <Text
            style={[
              styles.selectorValue,
              !selectedTask && styles.selectorPlaceholder,
            ]}
            numberOfLines={2}>
            {getSelectedTaskDisplay()}
          </Text>
          {selectedTask && getSelectedTaskListName() && (
            <Text style={styles.selectorMeta}>
              from {getSelectedTaskListName()}
            </Text>
          )}
        </View>
        <Text style={styles.selectorArrow}>›</Text>
      </TouchableOpacity>

      {/* Task Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
              accessibilityLabel="Cancel task selection"
              accessibilityRole="button">
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Task</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Task List */}
          <FlatList
            data={availableTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.task?.id ?? 'no-task'}
            style={styles.taskList}
            contentContainerStyle={styles.taskListContent}
            showsVerticalScrollIndicator={true}
            accessibilityLabel="List of available tasks"
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  selector: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectorContent: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  selectorValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  selectorPlaceholder: {
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  selectorMeta: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  selectorArrow: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerSpacer: {
    width: 60,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectedTaskItem: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  noTaskContainer: {
    flex: 1,
  },
  noTaskText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  noTaskSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  selectedTaskTitle: {
    color: '#007AFF',
  },
  priorityIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listName: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 12,
  },
  dueDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  checkmark: {
    marginLeft: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default React.memo(TaskSelector);
