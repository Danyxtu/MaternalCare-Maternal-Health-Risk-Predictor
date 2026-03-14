import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getLoginScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
        },
        headerContainer: {
            alignItems: 'center',
            marginBottom: 40,
        },
        logoBox: {
            backgroundColor: '#FB1554',
            width: 80,
            height: 80,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#FB1554',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        brandName: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 24,
        },
        welcomeText: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 8,
        },
        subtitleText: {
            fontSize: 15,
            color: colors.tabIconDefault,
            textAlign: 'center',
        },
        formContainer: {
            marginBottom: 24,
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
        forgotPasswordButton: {
            alignSelf: 'flex-end',
            marginBottom: 24,
        },
        forgotPasswordText: {
            color: '#E11D48',
            fontSize: 14,
            fontWeight: '600',
        },
        loginButton: {
            backgroundColor: '#E11D48',
            borderRadius: 12,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#E11D48',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        loginButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
        },
        footerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
        },
        footerText: {
            color: colors.tabIconDefault,
            fontSize: 14,
        },
        signUpText: {
            color: '#E11D48',
            fontSize: 14,
            fontWeight: '700',
        },
    });
};
