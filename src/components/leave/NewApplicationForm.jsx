import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import DatePickerField from '../DatePickerField';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function getLeaveTypeLabel(item) {
  if (item == null) return '';
  return typeof item === 'object' ? (item?.name ?? item?.label ?? item?.type ?? '') : String(item);
}

function NewApplicationForm({
  leaveType,
  leaveTypes = [],
  onLeaveTypeSelect,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minEndDate,
  reason,
  onReasonChange,
  onAttachmentPress,
}) {
  const { colors } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLeaveTypePress = () => setDropdownOpen((v) => !v);
  const handleSelect = (item) => {
    onLeaveTypeSelect?.(item);
    setDropdownOpen(false);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="description" size={18} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>New Application</Text>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>LEAVE TYPE</Text>
        <Pressable onPress={handleLeaveTypePress} style={[styles.inputRow, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
          <Text style={[styles.inputText, { color: colors.text }, !leaveType && { color: colors.placeholder }]}>
            {leaveType || 'Select Leave Type'}
          </Text>
          <Icon name="keyboard-arrow-down" size={22} color={colors.textSecondary} />
        </Pressable>
        {dropdownOpen && leaveTypes.length > 0 && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundInput, borderColor: colors.border }]}>
            {leaveTypes.map((item, index) => {
              const label = getLeaveTypeLabel(item);
              const isLast = index === leaveTypes.length - 1;
              return (
                <Pressable
                  key={item?.id ?? index}
                  style={[
                    styles.dropdownOption,
                    { borderBottomColor: colors.border },
                    leaveType === label && { backgroundColor: colors.primaryLight ?? `${colors.primary}15` },
                    isLast && styles.dropdownOptionLast,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.dropdownOptionText, { color: colors.text }, leaveType === label && { fontWeight: '600', color: colors.primary }]}>
                    {label}
                  </Text>
                  {leaveType === label && <Icon name="check" size={20} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.row}>
        <DatePickerField
          label="START DATE"
          value={startDate}
          onChange={onStartDateChange}
          placeholder="mm/dd/yyyy"
          minimumDate={new Date()}
          containerStyle={styles.half}
        />
        <DatePickerField
          label="END DATE"
          value={endDate}
          onChange={onEndDateChange}
          placeholder="mm/dd/yyyy"
          minimumDate={minEndDate}
          containerStyle={styles.half}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>REASON FOR LEAVE</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.backgroundInput, borderColor: colors.border, color: colors.text }]}
          value={reason}
          onChangeText={onReasonChange}
          placeholder="Briefly explain your reason..."
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  field: {
    marginBottom: spacing.md,
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
  dropdown: {
    marginTop: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  textArea: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    padding: spacing.md,
    fontSize: 15,
    minHeight: 88,
  },
  attachmentBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
  },
  attachmentInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  attachmentHint: {
    fontSize: 12,
    marginTop: spacing.sm,
  },
});

export default NewApplicationForm;
