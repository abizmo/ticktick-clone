/**
 * SessionHistory Component
 *
 * Displays a list of today's Focus sessions with details including:
 * - Session time, duration, and status
 * - Associated task name (if any)
 * - Total minutes for the day
 * - Different icons for completed vs interrupted sessions
 * - Empty state for no sessions
 *
 * Features:
 * - Vertical scrollable list of today's sessions
 * - Formatted time display (HH:MM)
 * - Formatted duration (e.g., "25m", "1h 30m")
 * - Status indicators with appropriate colors
 * - Total daily minutes summary
 * - Empty state with helpful message
 * - Full accessibility support
 *
 * @module SessionHistory
 */

import React, {useMemo} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {formatDuration} from '../utils/timeFormatter';
import {mockTasks, mockLists} from '../../../data/mockData';
import type {FocusSession} from '../types/focus.types';

/**
 * Enhanced session item with task and list information
 */
interface SessionItem extends FocusSession {
  taskName?: string;
  listName?: string;
}

/**
 * SessionHistory Component
 *
 * Renders a list of today's Focus sessions with comprehensive details
 * and statistics.
 *
 * @returns React.JSX.Element
 */
const SessionHistory: React.FC = (): React.JSX.Element => {
  // Subscribe to store state
  const sessions = useFocusStore(state => state.sessions);
  const todayStats = useFocusStore(state => state.todayStats);

  /**
   * Filter and enhance today's sessions with task information
   */
  const todaySessions = useMemo((): SessionItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessionsFiltered = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    // Enhance sessions with task and list information
    return todaySessionsFiltered.map(session => {
      let taskName: string | undefined;
      let listName: string | undefined;

      if (session.taskId) {
        const foundTask = mockTasks.find(task => task.id === session.taskId);
        if (foundTask) {
          taskName = foundTask.title;
          const foundList = mockLists.find(
            list => list.id === foundTask.listId,
          );
          listName = foundList?.name;
        }
      }

      return {
        ...session,
        taskName,
        listName,
      };
    });
  }, [sessions, mockTasks, mockLists]);

  /**
   * Get status icon for session
   */
  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'interrupted':
        return '⏹️';
      case 'active':
        return '▶️';
      default:
        return '❓';
    }
  };

  /**
   * Get status color for session
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'interrupted':
        return '#FF9500';
      case 'active':
        return '#007AFF';
      default:
        return '#8E8E93';
    }
  };

  /**
   * Format session time (start time)
   */
  const formatSessionTime = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  /**
   * Format session duration
   */
  const formatSessionDuration = (durationSeconds: number): string => {
    return formatDuration(durationSeconds);
  };

  /**
   * Render individual session item
   */
  const renderSessionItem = ({
    item,
  }: {
    item: SessionItem;
  }): React.JSX.Element => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <View
        style={styles.sessionItem}
        accessibilityLabel={`Session from ${formatSessionTime(
          new Date(item.startTime),
        )}, duration ${formatSessionDuration(item.durationSeconds)}, status ${
          item.status
        }`}
        accessibilityRole="text">
        {/* Session Header */}
        <View style={styles.sessionHeader}>
          <View style={styles.timeContainer}>
            <Text style={styles.sessionTime}>
              {formatSessionTime(new Date(item.startTime))}
            </Text>
            <Text style={styles.sessionDuration}>
              {formatSessionDuration(item.durationSeconds)}
            </Text>
          </View>

          <View
            style={[
              styles.statusContainer,
              {backgroundColor: `${statusColor}20`},
            ]}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <Text style={[styles.statusText, {color: statusColor}]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Session Details */}
        <View style={styles.sessionDetails}>
          {/* Task Information */}
          {item.taskName ? (
            <View style={styles.taskInfo}>
              <Text style={styles.taskName} numberOfLines={2}>
                {item.taskName}
              </Text>
              {item.listName && (
                <Text style={styles.listName}>from {item.listName}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.noTaskText}>No task selected</Text>
          )}

          {/* Pomodoros Completed */}
          {item.pomodorosCompleted > 0 && (
            <View style={styles.pomodoroInfo}>
              <Text style={styles.pomodoroText}>
                {item.pomodorosCompleted}{' '}
                {item.pomodorosCompleted === 1 ? 'pomodoro' : 'pomodoros'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = (): React.JSX.Element => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🍅</Text>
      <Text style={styles.emptyTitle}>No sessions today</Text>
      <Text style={styles.emptySubtitle}>
        Start your first Focus session to see your progress here
      </Text>
    </View>
  );

  /**
   * Render daily summary as list header
   */
  const renderListHeader = (): React.JSX.Element | null => {
    if (todaySessions.length === 0) {
      return null;
    }

    return (
      <View style={styles.dailySummary}>
        <Text style={styles.summaryTitle}>Today's Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayStats.totalMinutes}</Text>
            <Text style={styles.statLabel}>minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {todayStats.pomodorosCompleted}
            </Text>
            <Text style={styles.statLabel}>pomodoros</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {todayStats.sessionsCompleted}
            </Text>
            <Text style={styles.statLabel}>completed</Text>
          </View>
          {todayStats.sessionsInterrupted > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.interruptedNumber]}>
                {todayStats.sessionsInterrupted}
              </Text>
              <Text style={styles.statLabel}>interrupted</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionTitle}>Today's Sessions</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={todaySessions}
      renderItem={renderSessionItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={renderListHeader}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      accessibilityLabel="List of today's Focus sessions"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dailySummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  interruptedNumber: {
    color: '#FF9500',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  sessionItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flex: 1,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sessionDetails: {
    gap: 8,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 20,
  },
  listName: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  noTaskText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  pomodoroInfo: {
    alignSelf: 'flex-start',
  },
  pomodoroText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#34C759',
    backgroundColor: '#34C75920',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default React.memo(SessionHistory);
