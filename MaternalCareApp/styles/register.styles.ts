import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getRegisterScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        keyboardAvoidingView: {
            flex: 1,
        },
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 40,
            justifyContent: 'center',
        },
        headerContainer: {
            alignItems: 'center',
            marginBottom: 40,
        },
        logoBox: {
            backgroundColor: '#FB1554',
            width: 64,
            height: 64,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            shadowColor: '#FB1554',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        headerTitle: {
            fontSize: 26,
            fontWeight: '800',
            color: colors.text,
            marginBottom: 8,
        },
        headerSubtitle: {
            fontSize: 15,
            color: colors.tabIconDefault,
            textAlign: 'center',
        },
        formContainer: {
            marginBottom: 32,
        },
        inputWrapper: {
            marginBottom: 20,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
        },
        inputBox: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E2E8F0',
            borderRadius: 12,
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            height: 52,
        },
        inputIcon: {
            marginRight: 12,
        },
        textInput: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
        },
        eyeIcon: {
            padding: 4,
        },
        registerButton: {
            backgroundColor: '#E11D48',
            borderRadius: 12,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
            shadowColor: '#E11D48',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        registerButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
        },
        footerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'auto',
        },
        footerText: {
            color: colors.tabIconDefault,
            fontSize: 14,
        },
        loginText: {
            color: '#E11D48',
            fontSize: 14,
            fontWeight: '700',
        },
    });
};
