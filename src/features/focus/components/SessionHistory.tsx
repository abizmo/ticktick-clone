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

import React, {useMemo, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusStore} from '../store/focusStore';
import {formatDuration} from '../utils/timeFormatter';
import {mockTasks, mockLists} from '../../../data/mockData';
import type {FocusSession} from '../types/focus.types';
import {AccessibleColors} from '../utils/colorContrast';

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
  // Subscribe to store state - use separate selectors to avoid re-render loops
  const sessions = useFocusStore(state => state.sessions);
  const todayStats = useFocusStore(state => state.todayStats);

  /**
   * Filter and enhance today's sessions with task information
   *
   * Fixed Issue #16: Timezone-aware date filtering
   * - Use local timezone for "today" calculation
   * - Compare dates in local timezone, not UTC
   * - Handle DST transitions correctly
   */
  const todaySessions = useMemo((): SessionItem[] => {
    // Get today's date in local timezone
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Filter sessions that started today (in local timezone)
    const todaySessionsFiltered = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      const sessionLocalDate = new Date(
        sessionDate.getFullYear(),
        sessionDate.getMonth(),
        sessionDate.getDate(),
      );
      return sessionLocalDate.getTime() === today.getTime();
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
  }, [sessions]);

  /**
   * Get status icon for session
   * Memoized callback to prevent re-creating function on every render
   */
  const getStatusIcon = useCallback((status: string): string => {
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
  }, []);

  /**
   * Get status color for session
   * Memoized callback to prevent re-creating function on every render
   */
  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'completed':
        return AccessibleColors.success;
      case 'interrupted':
        return AccessibleColors.warning;
      case 'active':
        return AccessibleColors.primary;
      default:
        return AccessibleColors.secondary;
    }
  }, []);

  /**
   * Format session time (start time)
   * Memoized callback to prevent re-creating function on every render
   */
  const formatSessionTime = useCallback((date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  /**
   * Format session duration
   * Memoized callback to prevent re-creating function on every render
   */
  const formatSessionDuration = useCallback(
    (durationSeconds: number): string => {
      return formatDuration(durationSeconds);
    },
    [],
  );

  /**
   * Render individual session item
   * Memoized callback to prevent re-creating function on every render
   */
  const renderSessionItem = useCallback(
    ({item}: {item: SessionItem}): React.JSX.Element => {
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
    },
    [getStatusColor, getStatusIcon, formatSessionTime, formatSessionDuration],
  );

  /**
   * Render empty state
   * Memoized to prevent re-creating component on every render
   */
  const emptyStateComponent = useMemo(
    (): React.JSX.Element => (
      <View
        style={styles.emptyState}
        accessible={true}
        accessibilityLabel="No Focus sessions completed today. Start your first Focus session to see your progress here."
        accessibilityRole="text">
        <Text
          style={styles.emptyIcon}
          accessible={false}
          importantForAccessibility="no">
          🍅
        </Text>
        <Text
          style={styles.emptyTitle}
          accessible={false}
          importantForAccessibility="no">
          No sessions today
        </Text>
        <Text
          style={styles.emptySubtitle}
          accessible={false}
          importantForAccessibility="no">
          Start your first Focus session to see your progress here
        </Text>
      </View>
    ),
    [],
  );

  /**
   * Render daily summary as list header
   * Memoized to prevent re-creating component on every render
   */
  const listHeaderComponent = useMemo((): React.JSX.Element | null => {
    if (todaySessions.length === 0) {
      return null;
    }

    const summaryAccessibilityLabel = `Today's summary: ${
      todayStats.totalMinutes
    } minutes, ${todayStats.pomodorosCompleted} pomodoros, ${
      todayStats.sessionsCompleted
    } completed sessions${
      todayStats.sessionsInterrupted > 0
        ? `, ${todayStats.sessionsInterrupted} interrupted sessions`
        : ''
    }`;

    return (
      <View
        style={styles.dailySummary}
        accessible={true}
        accessibilityLabel={summaryAccessibilityLabel}>
        <Text
          style={styles.summaryTitle}
          accessible={false}
          importantForAccessibility="no">
          Today's Summary
        </Text>
        <View style={styles.summaryStats} accessible={false}>
          <View style={styles.statItem} accessible={false}>
            <Text
              style={styles.statNumber}
              accessible={false}
              importantForAccessibility="no">
              {todayStats.totalMinutes}
            </Text>
            <Text
              style={styles.statLabel}
              accessible={false}
              importantForAccessibility="no">
              minutes
            </Text>
          </View>
          <View style={styles.statItem} accessible={false}>
            <Text
              style={styles.statNumber}
              accessible={false}
              importantForAccessibility="no">
              {todayStats.pomodorosCompleted}
            </Text>
            <Text
              style={styles.statLabel}
              accessible={false}
              importantForAccessibility="no">
              pomodoros
            </Text>
          </View>
          <View style={styles.statItem} accessible={false}>
            <Text
              style={styles.statNumber}
              accessible={false}
              importantForAccessibility="no">
              {todayStats.sessionsCompleted}
            </Text>
            <Text
              style={styles.statLabel}
              accessible={false}
              importantForAccessibility="no">
              completed
            </Text>
          </View>
          {todayStats.sessionsInterrupted > 0 && (
            <View style={styles.statItem} accessible={false}>
              <Text
                style={[styles.statNumber, styles.interruptedNumber]}
                accessible={false}
                importantForAccessibility="no">
                {todayStats.sessionsInterrupted}
              </Text>
              <Text
                style={styles.statLabel}
                accessible={false}
                importantForAccessibility="no">
                interrupted
              </Text>
            </View>
          )}
        </View>
        <Text
          style={styles.sectionTitle}
          accessible={false}
          importantForAccessibility="no">
          Today's Sessions
        </Text>
      </View>
    );
  }, [
    todaySessions.length,
    todayStats.totalMinutes,
    todayStats.pomodorosCompleted,
    todayStats.sessionsCompleted,
    todayStats.sessionsInterrupted,
  ]);

  return (
    <View style={styles.container}>
      {listHeaderComponent}
      {todaySessions.length === 0 ? (
        emptyStateComponent
      ) : (
        <View style={styles.contentContainer}>
          {todaySessions.map(item => (
            <View key={item.id}>{renderSessionItem({item})}</View>
          ))}
        </View>
      )}
    </View>
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
    color: AccessibleColors.primaryText,
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
    color: AccessibleColors.primary,
  },
  interruptedNumber: {
    color: AccessibleColors.warning,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: AccessibleColors.secondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AccessibleColors.primaryText,
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
    color: AccessibleColors.primaryText,
  },
  sessionDuration: {
    fontSize: 14,
    color: AccessibleColors.secondary,
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
    color: AccessibleColors.primaryText,
    lineHeight: 20,
  },
  listName: {
    fontSize: 12,
    color: AccessibleColors.primary,
    marginTop: 2,
  },
  noTaskText: {
    fontSize: 14,
    color: AccessibleColors.secondary,
    fontStyle: 'italic',
  },
  pomodoroInfo: {
    alignSelf: 'flex-start',
  },
  pomodoroText: {
    fontSize: 12,
    fontWeight: '500',
    color: AccessibleColors.success,
    backgroundColor: '#22C55E20',
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
    color: AccessibleColors.primaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: AccessibleColors.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default React.memo(SessionHistory);
