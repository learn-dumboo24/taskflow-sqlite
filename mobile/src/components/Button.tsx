import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'ghost';
  style?: ViewStyle;
}

export default function Button({ title, onPress, loading = false, disabled = false, variant = 'primary', style }: ButtonProps) {
  const bg = variant === 'danger' ? '#ef4444' : variant === 'ghost' ? 'transparent' : '#3b82f6';
  const textColor = variant === 'ghost' ? '#3b82f6' : '#fff';

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg, opacity: disabled || loading ? 0.6 : 1 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={textColor} size="small" />
        : <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 15, fontWeight: '600' },
});
