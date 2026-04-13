import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

const DAYS_HEADER = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function AttendanceCalendar({
  markedDates = [],
  absentDates = [],
  selectedDate,
  onSelectDate,
  onMonthChange,
}) {
  const { colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  React.useEffect(() => {
    if (typeof onMonthChange !== 'function') return;
    onMonthChange(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  }, [currentMonth, onMonthChange]);

  const { days, monthLabel } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = (firstDay.getDay() + 6) % 7;
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
      const isAbsent = !isFuture && !isPresent && absentDates.includes(dateStr);
      const isWeekend = (() => {
        const dow = new Date(dateStr).getDay(); // 0=Sun, 6=Sat
        return dow === 0 || dow === 6;
      })();
      const isSelected =
        selectedDate &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === d;
      days.push({ type: 'day', key: dateStr, day: d, dateStr, isPresent, isAbsent, isFuture, isSelected, isToday, isWeekend });
    }
    const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return { days, monthLabel };
  }, [currentMonth, selectedDate, markedDates, absentDates]);

  const goPrev = () => {
    setCurrentMonth((m) => {
      const next = new Date(m.getFullYear(), m.getMonth() - 1, 1);
      onMonthChange?.(next.getFullYear(), next.getMonth() + 1);
      return next;
    });
  };
  const goNext = () => {
    setCurrentMonth((m) => {
      const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      onMonthChange?.(next.getFullYear(), next.getMonth() + 1);
      return next;
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {/* Month navigation */}
      <View style={styles.monthRow}>
        <Pressable onPress={goPrev} style={[styles.navBtn, { backgroundColor: colors.backgroundInput }]} hitSlop={8}>
          <Icon name="chevron-left" size={20} color={colors.primary} />
        </Pressable>
        <Text style={[styles.monthLabel, { color: colors.text }]}>{monthLabel}</Text>
        <Pressable onPress={goNext} style={[styles.navBtn, { backgroundColor: colors.backgroundInput }]} hitSlop={8}>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </Pressable>
      </View>

      {/* Day headers */}
      <View style={styles.weekRow}>
        {DAYS_HEADER.map((d, i) => (
          <Text
            key={d}
            style={[
              styles.weekDay,
              { color: i >= 5 ? colors.priorityMedium : colors.textSecondary },
            ]}
          >
            {d}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {days.map((item) => {
          if (item.type === 'pad') {
            return <View key={item.key} style={styles.cell} />;
          }

          // Determine circle fill
          let circleBg = 'transparent';
          let textColor = item.isFuture
            ? colors.placeholder
            : item.isWeekend
            ? colors.textSecondary
            : colors.text;
          let borderColor = 'transparent';

          if (item.isPresent) {
            circleBg = '#2E7D32';
            textColor = '#fff';
          } else if (item.isAbsent) {
            circleBg = '#C6282818';
            textColor = '#C62828';
            borderColor = '#C6282830';
          } else if (item.isToday) {
            borderColor = colors.primary;
            textColor = colors.primary;
          }

          if (item.isSelected && !item.isPresent) {
            circleBg = colors.primaryLight;
            textColor = colors.primary;
          }

          return (
            <Pressable
              key={item.key}
              onPress={() => onSelectDate?.(new Date(item.dateStr))}
              style={styles.cell}
            >
              <View
                style={[
                  styles.circle,
                  { backgroundColor: circleBg, borderColor, borderWidth: borderColor !== 'transparent' ? 1.5 : 0 },
                ]}
              >
                <Text style={[styles.dayText, { color: textColor, fontWeight: item.isToday || item.isPresent ? '700' : '500' }]}>
                  {item.day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendDot color="#2E7D32" label="Present" />
        <LegendDot color="#C62828" label="Absent" fill={false} />
        <LegendDot color={colors.primary} label="Today" fill={false} />
      </View>
    </View>
  );
}

function LegendDot({ color, label, fill = true }) {
  return (
    <View style={styles.legendItem}>
      <View style={[
        styles.legendDot,
        fill ? { backgroundColor: color } : { borderColor: color, borderWidth: 1.5, backgroundColor: 'transparent' },
      ]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDay: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
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
    paddingVertical: 2,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 13,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
});

export default AttendanceCalendar;
