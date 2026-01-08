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

import React, {useState, useMemo, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {mockTasks, mockLists} from '../../../data/mockData';
import type {Task} from '../types/focus.types';
import {AccessibleColors} from '../utils/colorContrast';

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
  // Subscribe to store state and actions - use separate selectors to prevent re-renders
  const selectedTask = useFocusStore(state => state.selectedTask);
  const currentSession = useFocusStore(state => state.currentSession);
  const selectTask = useFocusStore(state => state.selectTask);

  // Local state for modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animation values for press feedback
  const selectorScale = useRef(new Animated.Value(1)).current;

  /**
   * Get available tasks (incomplete only) with list information
   * Note: mockTasks and mockLists are static imports, so we don't need them as dependencies
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
  }, []); // Empty deps array is correct - mockTasks and mockLists are static

  /**
   * Get priority color for task
   * Memoized callback to prevent re-creating function on every render
   */
  const getPriorityColor = useCallback(
    (priority: 'low' | 'medium' | 'high'): string => {
      switch (priority) {
        case 'high':
          return AccessibleColors.error;
        case 'medium':
          return AccessibleColors.warning;
        case 'low':
          return AccessibleColors.success;
        default:
          return AccessibleColors.secondary;
      }
    },
    [],
  );

  /**
   * Get priority indicator symbol
   * Memoized callback to prevent re-creating function on every render
   */
  const getPriorityIndicator = useCallback(
    (priority: 'low' | 'medium' | 'high'): string => {
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
    },
    [],
  );

  /**
   * Create press animation for selector
   */
  const createSelectorPressAnimation = useCallback(() => {
    return {
      onPressIn: () => {
        Animated.spring(selectorScale, {
          toValue: 0.98,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
      },
      onPressOut: () => {
        Animated.spring(selectorScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
      },
    };
  }, [selectorScale]);

  /**
   * Handle task selection
   * Memoized callback to prevent re-creating function on every render
   */
  const handleTaskSelect = useCallback(
    (taskItem: TaskItem): void => {
      const taskName = taskItem.task?.title || 'No task';
      AccessibilityInfo.announceForAccessibility(`Selected task: ${taskName}`);

      selectTask(taskItem.task);
      setIsModalVisible(false);
    },
    [selectTask],
  );

  /**
   * Handle opening task selector
   * Memoized callback to prevent re-creating function on every render
   */
  const handleOpenSelector = useCallback((): void => {
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
  }, [currentSession]);

  /**
   * Get selected task display text
   * Memoized to prevent recalculation on every render
   * Use selectedTask?.id as dependency to avoid re-renders when object reference changes
   */
  const selectedTaskDisplay = useMemo((): string => {
    if (!selectedTask) {
      return 'No task selected';
    }
    return selectedTask.title;
  }, [selectedTask]);

  /**
   * Get selected task list name
   * Memoized to prevent recalculation on every render
   * Use selectedTask?.id as dependency to avoid re-renders when object reference changes
   */
  const selectedTaskListName = useMemo((): string | undefined => {
    if (!selectedTask) {
      return undefined;
    }
    if (!mockLists || !Array.isArray(mockLists)) {
      return undefined;
    }
    const foundList = mockLists.find(list => list.id === selectedTask.listId);
    return foundList?.name;
  }, [selectedTask]);

  /**
   * Render task item in the selection list
   * Memoized callback to prevent re-creating function on every render
   */
  const renderTaskItem = useCallback(
    ({item}: {item: TaskItem}): React.JSX.Element => {
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
    },
    [
      selectedTask?.id,
      handleTaskSelect,
      getPriorityColor,
      getPriorityIndicator,
    ],
  );

  /**
   * Key extractor for FlatList
   * Memoized callback to prevent re-creating function on every render
   */
  const keyExtractor = useCallback(
    (item: TaskItem) => item.task?.id ?? 'no-task',
    [],
  );

  /**
   * Handle modal close
   * Memoized callback to prevent re-creating function on every render
   */
  const handleModalClose = useCallback(() => setIsModalVisible(false), []);

  return (
    <View style={styles.container}>
      {/* Current Task Display */}
      <Animated.View style={{transform: [{scale: selectorScale}]}}>
        <TouchableOpacity
          style={styles.selector}
          onPress={handleOpenSelector}
          accessibilityLabel={`Currently selected task: ${selectedTaskDisplay}. Tap to change.`}
          accessibilityRole="button"
          accessibilityHint="Opens a list of tasks to choose from for your Focus session"
          {...createSelectorPressAnimation()}>
          <View style={styles.selectorContent}>
            <Text style={styles.selectorLabel}>Task</Text>
            <Text
              style={[
                styles.selectorValue,
                !selectedTask && styles.selectorPlaceholder,
              ]}
              numberOfLines={2}
              accessible={false}
              importantForAccessibility="no">
              {selectedTaskDisplay}
            </Text>
            {selectedTask && selectedTaskListName && (
              <Text
                style={styles.selectorMeta}
                accessible={false}
                importantForAccessibility="no">
                from {selectedTaskListName}
              </Text>
            )}
          </View>
          <Text
            style={styles.selectorArrow}
            accessible={false}
            importantForAccessibility="no">
            ›
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Task Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalClose}
        onShow={() =>
          AccessibilityInfo.announceForAccessibility(
            'Task selection opened. Choose a task or select no task.',
          )
        }>
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View
            style={styles.modalHeader}
            accessible={true}
            accessibilityRole="header">
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.cancelButton}
              accessibilityLabel="Cancel task selection"
              accessibilityRole="button"
              accessibilityHint="Closes the task selection without making changes">
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text
              style={styles.modalTitle}
              accessible={false}
              importantForAccessibility="no">
              Select Task
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Task List */}
          <FlatList
            data={availableTasks}
            renderItem={renderTaskItem}
            keyExtractor={keyExtractor}
            style={styles.taskList}
            contentContainerStyle={styles.taskListContent}
            showsVerticalScrollIndicator={true}
            accessible={true}
            accessibilityLabel={`List of ${availableTasks.length} available tasks. Swipe to browse.`}
            accessibilityRole="list"
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
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
    color: AccessibleColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  selectorValue: {
    fontSize: 16,
    fontWeight: '500',
    color: AccessibleColors.primaryText,
  },
  selectorPlaceholder: {
    color: AccessibleColors.secondary,
    fontStyle: 'italic',
  },
  selectorMeta: {
    fontSize: 14,
    color: AccessibleColors.secondary,
    marginTop: 2,
  },
  selectorArrow: {
    fontSize: 20,
    color: AccessibleColors.border,
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
    color: AccessibleColors.primary,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AccessibleColors.primaryText,
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
    borderColor: AccessibleColors.primary,
    backgroundColor: '#F0F8FF',
  },
  noTaskContainer: {
    flex: 1,
  },
  noTaskText: {
    fontSize: 16,
    fontWeight: '500',
    color: AccessibleColors.primaryText,
    marginBottom: 4,
  },
  noTaskSubtext: {
    fontSize: 14,
    color: AccessibleColors.secondary,
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
    color: AccessibleColors.primaryText,
    flex: 1,
    marginRight: 8,
  },
  selectedTaskTitle: {
    color: AccessibleColors.primary,
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
    color: AccessibleColors.primary,
    fontWeight: '500',
    marginRight: 12,
  },
  dueDate: {
    fontSize: 12,
    color: AccessibleColors.secondary,
  },
  taskDescription: {
    fontSize: 14,
    color: AccessibleColors.secondary,
    lineHeight: 20,
  },
  checkmark: {
    marginLeft: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AccessibleColors.primary,
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
