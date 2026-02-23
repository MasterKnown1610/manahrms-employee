import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function NewApplicationForm({
  leaveType,
  onLeaveTypePress,
  startDate,
  endDate,
  onStartDatePress,
  onEndDatePress,
  reason,
  onReasonChange,
  onAttachmentPress,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="description" size={18} color={colors.primary} />
        <Text style={styles.sectionTitle}>New Application</Text>
      </View>

      <Pressable onPress={onLeaveTypePress} style={styles.field}>
        <Text style={styles.label}>LEAVE TYPE</Text>
        <View style={styles.inputRow}>
          <Text style={[styles.inputText, !leaveType && styles.placeholder]}>
            {leaveType || 'Select Leave Type'}
          </Text>
          <Icon name="keyboard-arrow-down" size={22} color={colors.textSecondary} />
        </View>
      </Pressable>

      <View style={styles.row}>
        <Pressable onPress={onStartDatePress} style={[styles.field, styles.half]}>
          <Text style={styles.label}>START DATE</Text>
          <View style={styles.inputRow}>
            <Text style={[styles.inputText, !startDate && styles.placeholder]}>
              {startDate || 'mm/dd/yyyy'}
            </Text>
            <Icon name="event" size={20} color={colors.textSecondary} />
          </View>
        </Pressable>
        <Pressable onPress={onEndDatePress} style={[styles.field, styles.half]}>
          <Text style={styles.label}>END DATE</Text>
          <View style={styles.inputRow}>
            <Text style={[styles.inputText, !endDate && styles.placeholder]}>
              {endDate || 'mm/dd/yyyy'}
            </Text>
            <Icon name="event" size={20} color={colors.textSecondary} />
          </View>
        </Pressable>
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

      <Pressable onPress={onAttachmentPress} style={styles.attachmentBox}>
        <Text style={styles.label}>ATTACHMENT (OPTIONAL)</Text>
        <View style={styles.attachmentInner}>
          <Icon name="add-circle-outline" size={48} color={colors.placeholder} />
          <Text style={styles.attachmentHint}>PDF, JPG or PNG upto 5MB</Text>
        </View>
      </Pressable>
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
