import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

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
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable onPress={openPicker} style={styles.inputRow}>
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Icon name="event" size={20} color={colors.textSecondary} />
      </Pressable>

      {visible ? (
        Platform.OS === 'ios' ? (
          <Modal transparent animationType="slide">
            <Pressable style={styles.overlay} onPress={handleCancel}>
              <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
                <View style={styles.header}>
                  <Pressable onPress={handleCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <Text style={styles.titleText}>{label || 'Select Date'}</Text>
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
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: colors.placeholder,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background ?? '#fff',
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
    borderBottomColor: colors.border ?? '#eee',
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary ?? '#666',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text ?? '#000',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DatePickerField;
