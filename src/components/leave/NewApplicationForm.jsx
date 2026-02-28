import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import DatePickerField from '../DatePickerField';
import { colors, spacing, borderRadius } from '../../theme/theme';

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
        <Text style={styles.sectionTitle}>New Application</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>LEAVE TYPE</Text>
        <Pressable onPress={handleLeaveTypePress} style={styles.inputRow}>
          <Text style={[styles.inputText, !leaveType && styles.placeholder]}>
            {leaveType || 'Select Leave Type'}
          </Text>
          <Icon name="keyboard-arrow-down" size={22} color={colors.textSecondary} />
        </Pressable>
        {dropdownOpen && leaveTypes.length > 0 && (
          <View style={styles.dropdown}>
            {leaveTypes.map((item, index) => {
              const label = getLeaveTypeLabel(item);
              const isLast = index === leaveTypes.length - 1;
              return (
                <Pressable
                  key={item?.id ?? index}
                  style={[
                    styles.dropdownOption,
                    leaveType === label && styles.dropdownOptionActive,
                    isLast && styles.dropdownOptionLast,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.dropdownOptionText, leaveType === label && styles.dropdownOptionTextActive]}>
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
        <Text style={styles.label}>REASON FOR LEAVE</Text>
        <TextInput
          style={styles.textArea}
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
    color: colors.text,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
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
  dropdown: {
    marginTop: spacing.xs,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownOptionActive: {
    backgroundColor: colors.primaryLight ?? `${colors.primary}15`,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 15,
    color: colors.text,
  },
  dropdownOptionTextActive: {
    fontWeight: '600',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  textArea: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    minHeight: 88,
  },
  attachmentBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
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
    color: colors.placeholder,
    marginTop: spacing.sm,
  },
});

export default NewApplicationForm;
