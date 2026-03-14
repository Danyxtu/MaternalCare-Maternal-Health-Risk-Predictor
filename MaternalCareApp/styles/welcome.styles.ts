import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getWelcomeScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'space-between',
            paddingTop: 60,
            paddingBottom: 40,
        },
        graphicContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        illustrationPlaceholder: {
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#FFF1F2',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#FB1554',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 5,
        },
        textContainer: {
            alignItems: 'center',
            marginBottom: 48,
        },
        title: {
            fontSize: 28,
            fontWeight: '800',
            color: colors.text,
            marginBottom: 16,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: colors.tabIconDefault,
            textAlign: 'center',
            lineHeight: 24,
            paddingHorizontal: 16,
        },
        actionContainer: {
            width: '100%',
        },
        primaryButton: {
            backgroundColor: '#E11D48',
            borderRadius: 12,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            shadowColor: '#E11D48',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '700',
        },
        loginRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginTextPrompt: {
            fontSize: 15,
            color: colors.tabIconDefault,
        },
        loginTextLink: {
            fontSize: 15,
            fontWeight: '700',
            color: '#E11D48',
        },
    });
};
