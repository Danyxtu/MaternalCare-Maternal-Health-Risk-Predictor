import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getAlertsScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
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
        summaryScrollView: {
            marginTop: 10,
            marginBottom: 32,
        },
        summaryScrollContent: {
            paddingHorizontal: 20,
            gap: 12,
        },
        summaryCard: {
            width: 180, // Increased width to fit text in one line
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        summaryCardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        summaryCardTitle: {
            fontSize: 13,
            color: colors.tabIconDefault,
            fontWeight: '600',
            flex: 1,
            marginRight: 4,
        },
        iconContainer: {
            width: 32,
            height: 32,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        summaryCardValue: {
            fontSize: 24,
            fontWeight: '700',
        },
        sectionContainer: {
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        sectionIcon: {
            marginRight: 8,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
        },
        alertCard: {
            borderRadius: 12,
            borderLeftWidth: 4,
            padding: 16,
            marginBottom: 16,
        },
        alertCardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        alertCardTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        alertCardName: {
            fontSize: 18,
            fontWeight: '700',
            marginRight: 8,
        },
        badge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        badgeText: {
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        viewDetailsButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
        },
        viewDetailsText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '600',
        },
        vitalsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 16,
        },
        vitalItem: {
            width: '50%',
            marginBottom: 12,
        },
        vitalLabel: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 2,
        },
        vitalValue: {
            fontSize: 16,
            fontWeight: '600',
        },
        alertCardFooter: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        footerText: {
            fontSize: 12,
            fontWeight: '500',
        },
    });
};
