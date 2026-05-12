import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const theme = useTheme();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = email.trim().length > 0 && password.length >= 8;
  const isDisabled = isSubmitting;

  const handleSignIn = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const { error } = await signIn.email({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setErrorMessage(error.message ?? 'Credenciales incorrectas. Intenta de nuevo.');
      setIsSubmitting(false);
      return;
    }

    router.replace('/');
  };

  const handleDemoLogin = async (demoEmail: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const { error } = await signIn.email({
      email: demoEmail,
      password: 'Password123!',
    });

    if (error) {
      setErrorMessage(error.message ?? 'Credenciales incorrectas. Intenta de nuevo.');
      setIsSubmitting(false);
      return;
    }

    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.sidebar }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.layout}>
          {/* Left — Branding */}
          <View style={styles.brandingSide}>
            <View style={styles.brandingContent}>
              <Text style={styles.brandTitle}>L'ORÉAL</Text>
              <Text style={styles.brandSubtitle}>CLIENTELING</Text>
              <View style={[styles.brandDivider, { backgroundColor: theme.sidebarAccent }]} />
              <Text style={styles.brandTagline}>
                Experiencias de belleza personalizadas
              </Text>
            </View>
          </View>

          {/* Right — Login Form */}
          <View style={[styles.formSide, { backgroundColor: theme.background }]}>
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: theme.text }]}>Iniciar sesión</Text>
                <Text style={[styles.formSubtitle, { color: theme.textSecondary }]}>
                  Ingresa tus credenciales para continuar
                </Text>
              </View>

              {/* Error */}
              {errorMessage ? (
                <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
                  <Icon name="alert-circle" size={18} color={theme.danger} />
                  <Text style={[styles.errorText, { color: theme.danger }]}>{errorMessage}</Text>
                </View>
              ) : null}

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Correo electrónico</Text>
                <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                  <Icon name="mail" size={18} color={theme.textTertiary} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="nombre@loreal.com"
                    placeholderTextColor={theme.textTertiary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Contraseña</Text>
                <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                  <Icon name="lock-closed" size={18} color={theme.textTertiary} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Min. 8 caracteres"
                    placeholderTextColor={theme.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="go"
                    onSubmitEditing={handleSignIn}
                    editable={!isSubmitting}
                  />
                  <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                    <Icon
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={theme.textTertiary}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Submit */}
              <Pressable
                style={[
                  styles.submitButton,
                  { backgroundColor: theme.accent },
                  (!isFormValid || isSubmitting) && styles.submitButtonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitText}>Iniciar sesión</Text>
                )}
              </Pressable>

              {/* Demo quick-login */}
              <View style={styles.demoDivider}>
                <View style={[styles.demoDividerLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.demoDividerText, { color: theme.textTertiary }]}>
                  Acceso rápido demo
                </Text>
                <View style={[styles.demoDividerLine, { backgroundColor: theme.border }]} />
              </View>

              <View style={styles.demoGrid}>
                {([
                  { label: 'BA · Lancôme', sub: 'v.rojas@loreal.mx', email: 'v.rojas@loreal.mx' },
                  { label: 'BA · YSL', sub: 'i.guzman@loreal.mx', email: 'i.guzman@loreal.mx' },
                  { label: 'BA · Lancôme', sub: 's.castillo@loreal.mx', email: 's.castillo@loreal.mx' },
                  { label: 'BA · YSL', sub: 'm.salazar@loreal.mx', email: 'm.salazar@loreal.mx' },
                ] as const).map((account) => (
                  <Pressable
                    key={account.email}
                    style={[styles.demoButton, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}
                    onPress={() => handleDemoLogin(account.email)}
                    disabled={isDisabled}
                  >
                    <Text style={[styles.demoButtonLabel, { color: theme.text }]}>{account.label}</Text>
                    <Text style={[styles.demoButtonEmail, { color: theme.textTertiary }]}>{account.sub}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  // Branding (left)
  brandingSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  brandingContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 8,
  },
  brandSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 12,
    opacity: 0.7,
  },
  brandDivider: {
    width: 48,
    height: 2,
    marginVertical: Spacing.lg,
    borderRadius: 1,
  },
  brandTagline: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  // Form (right)
  formSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
    borderTopLeftRadius: Radius.xl,
    borderBottomLeftRadius: Radius.xl,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    gap: Spacing.xl,
  },
  formHeader: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  formTitle: {
    ...Typography.title1,
  },
  formSubtitle: {
    ...Typography.subhead,
  },
  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  errorText: {
    ...Typography.footnote,
    fontWeight: '500',
    flex: 1,
  },
  // Fields
  fieldGroup: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.footnote,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    ...Typography.body,
    height: '100%',
  },
  // Submit
  submitButton: {
    height: 52,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    ...Typography.headline,
  },
  // Demo quick-login
  demoDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  demoDividerLine: {
    flex: 1,
    height: 1,
  },
  demoDividerText: {
    ...Typography.caption1,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  demoButton: {
    width: '48%' as unknown as number,
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  demoButtonLabel: {
    ...Typography.footnote,
    fontWeight: '600',
  },
  demoButtonEmail: {
    ...Typography.caption2,
    marginTop: 2,
  },
});
