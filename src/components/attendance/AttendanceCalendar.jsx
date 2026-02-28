import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

const DAYS_HEADER = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

function AttendanceCalendar({
  markedDates = [], // array of date strings 'YYYY-MM-DD' — present (green)
  absentDates = [], // array of date strings 'YYYY-MM-DD' — absent (red)
  selectedDate,
  onSelectDate,
  onMonthChange, // (year: number, month: number) => void, month 1-based
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  React.useEffect(() => {
    if (typeof onMonthChange !== 'function') return;
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth() + 1; // 1-based for API
    onMonthChange(y, m);
  }, [currentMonth, onMonthChange]);

  const { days, monthLabel } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = lastDay.getDate();
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const days = [];
    for (let i = 0; i < startPadding; i++) {
      days.push({ type: 'pad', key: `pad-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isFuture = dateStr > todayStr;
      const isPresent = markedDates.includes(dateStr);
      const isAbsent = !isFuture && (absentDates.includes(dateStr) || (isToday && !isPresent));
      const isSelected =
        selectedDate &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === d;
      days.push({
        type: 'day',
        key: dateStr,
        day: d,
        dateStr,
        isPresent,
        isAbsent,
        isFuture,
        isSelected,
      });
    }
    const monthLabel = currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    return { days, monthLabel };
  }, [currentMonth, selectedDate, markedDates, absentDates]);

  const goPrev = () => {
    setCurrentMonth((m) => {
      const next = new Date(m.getFullYear(), m.getMonth() - 1, 1);
      if (typeof onMonthChange === 'function') {
        onMonthChange(next.getFullYear(), next.getMonth() + 1);
      }
      return next;
    });
  };
  const goNext = () => {
    setCurrentMonth((m) => {
      const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      if (typeof onMonthChange === 'function') {
        onMonthChange(next.getFullYear(), next.getMonth() + 1);
      }
      return next;
    });
  };

  const handleDayPress = (item) => {
    if (item.type !== 'day') return;
    onSelectDate?.(new Date(item.dateStr));
  };

  return (
    <View style={styles.card}>
      <View style={styles.monthRow}>
        <Pressable onPress={goPrev} style={styles.arrow} hitSlop={8}>
          <Icon name="chevron-left" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable onPress={goNext} style={styles.arrow} hitSlop={8}>
          <Icon name="chevron-right" size={24} color={colors.primary} />
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {DAYS_HEADER.map((d) => (
          <Text key={d} style={styles.weekDay}>{d}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((item) => {
          if (item.type === 'pad') {
            return <View key={item.key} style={styles.cell} />;
          }
          return (
            <Pressable
              key={item.key}
              onPress={() => handleDayPress(item)}
              style={[
                styles.cell,
                styles.cellDay,
                item.isSelected && styles.cellSelected,
              ]}
            >
              <Text
                style={[
                  styles.cellDayText,
                  item.isSelected && styles.cellDayTextSelected,
                  item.isPresent && styles.cellDayTextPresent,
                  item.isAbsent && styles.cellDayTextAbsent,
                  item.isFuture && styles.cellDayTextFuture,
                ]}
              >
                {item.day}
              </Text>
              {(item.isPresent || item.isAbsent || item.isFuture) && (
                <View
                  style={[
                    styles.dot,
                    item.isSelected && styles.dotSelected,
                    item.isPresent && styles.dotGreen,
                    item.isAbsent && styles.dotRed,
                    item.isFuture && styles.dotFuture,
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  arrow: {
    padding: spacing.xs,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDay: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellDay: {
    paddingVertical: 4,
  },
  cellSelected: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
  },
  cellDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  cellDayTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  cellDayTextPresent: {
    color: colors.success,
  },
  cellDayTextAbsent: {
    color: colors.error,
  },
  cellDayTextFuture: {
    color: colors.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  dotGreen: {
    backgroundColor: colors.success,
  },
  dotRed: {
    backgroundColor: colors.error,
  },
  dotFuture: {
    backgroundColor: colors.textSecondary,
  },
  dotSelected: {
    backgroundColor: colors.primary,
  },
});

export default AttendanceCalendar;
