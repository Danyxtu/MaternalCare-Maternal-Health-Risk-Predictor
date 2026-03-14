import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getNewAssessmentScreenStyles = (theme: Theme) => {
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
            paddingBottom: 40,
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            height: 80, // Fixed height for alignment
            backgroundColor: colors.background,
        },
        headerTextContainer: {
            flex: 1,
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 2,
        },
        headerSubtitle: {
            fontSize: 13,
            color: colors.tabIconDefault,
        },
        headerIcon: {
            padding: 8,
            marginRight: 8,
            marginLeft: -8,
        },
        card: {
            marginTop: 10,
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 20,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
            marginBottom: 24,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 8,
        },
        sectionIcon: {
            marginRight: 8,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
        },
        divider: {
            height: 1,
            backgroundColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            marginVertical: 24,
        },
        inputContainer: {
            marginBottom: 16,
        },
        labelRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        labelIcon: {
            marginRight: 6,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
        },
        requiredAsterisk: {
            color: '#E11D48',
        },
        textInput: {
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.background,
        },
        helperText: {
            fontSize: 12,
            color: colors.tabIconDefault,
            marginTop: 6,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
            marginHorizontal: 20,
        },
        primaryButton: {
            flex: 2,
            backgroundColor: '#E11D48',
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
        },
        primaryButtonText: {
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: '600',
        },
        secondaryButton: {
            flex: 1,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
        },
        secondaryButtonText: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '500',
        },
    });
};
