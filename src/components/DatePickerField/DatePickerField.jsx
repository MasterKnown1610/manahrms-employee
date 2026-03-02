import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

export function parseDateStr(mmDdYyyy) {
  if (!mmDdYyyy) return null;
  const parts = mmDdYyyy.split('/');
  if (parts.length !== 3) return null;
  const [month, day, year] = parts.map(Number);
  return new Date(year, month - 1, day);
}

function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'mm/dd/yyyy',
  minimumDate,
  maximumDate,
  containerStyle,
}) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState(() =>
    value ? parseDateStr(value) : minimumDate ?? new Date()
  );

  const openPicker = () => {
    const initial = value ? parseDateStr(value) : minimumDate ?? new Date();
    setTempDate(initial);
    setVisible(true);
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setVisible(false);
    if (event.type === 'set') {
      const date = selectedDate ?? tempDate;
      setTempDate(date);
      onChange(formatDate(date));
    }
  };

  const handleConfirm = () => {
    onChange(formatDate(tempDate));
    setVisible(false);
  };

  const handleCancel = () => setVisible(false);

  const pickerElement = (
    <DateTimePicker
      value={tempDate}
      mode="date"
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      onChange={handleChange}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );

  return (
    <View style={[styles.field, containerStyle]}>
      {label ? <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text> : null}
      <Pressable onPress={openPicker} style={[styles.inputRow, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
        <Text style={[styles.inputText, { color: colors.text }, !value && { color: colors.placeholder }]}>
          {value || placeholder}
        </Text>
        <Icon name="event" size={20} color={colors.textSecondary} />
      </Pressable>

      {visible ? (
        Platform.OS === 'ios' ? (
          <Modal transparent animationType="slide">
            <Pressable style={styles.overlay} onPress={handleCancel}>
              <Pressable style={[styles.container, { backgroundColor: colors.background }]} onPress={(e) => e.stopPropagation()}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                  <Pressable onPress={handleCancel}>
                    <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                  </Pressable>
                  <Text style={[styles.titleText, { color: colors.text }]}>{label || 'Select Date'}</Text>
                  <Pressable onPress={handleConfirm}>
                    <Text style={[styles.doneText, { color: colors.primary }]}>Done</Text>
                  </Pressable>
                </View>
                {pickerElement}
              </Pressable>
            </Pressable>
          </Modal>
        ) : (
          <>{pickerElement}</>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputText: {
    fontSize: 15,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DatePickerField;
