import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getAlertDetailsScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        navHeader: {
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        backButtonText: {
            color: '#E11D48',
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 6,
        },
        scrollContainer: {
            padding: 20,
            paddingBottom: 40,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
        },
        patientName: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 6,
        },
        dateContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        dateText: {
            fontSize: 14,
            color: colors.tabIconDefault,
            lineHeight: 20,
        },
        mainBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
        },
        mainBadgeText: {
            fontSize: 12,
            fontWeight: '700',
            marginLeft: 6,
        },
        warningBanner: {
            backgroundColor: theme === 'dark' ? '#311212' : '#FFF1F2',
            borderLeftWidth: 4,
            borderLeftColor: '#E11D48',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
        },
        warningBannerHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        warningBannerTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme === 'dark' ? '#FECDD3' : '#9F1239',
        },
        warningBannerText: {
            fontSize: 14,
            color: theme === 'dark' ? '#FECDD3' : '#9F1239',
            lineHeight: 20,
        },
        vitalsScroll: {
            marginBottom: 24,
            marginHorizontal: -20,
        },
        vitalsScrollContent: {
            paddingHorizontal: 20,
            gap: 12,
        },
        vitalCard: {
            width: 130,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        vitalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        vitalIconBox: {
            width: 32,
            height: 32,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        vitalLabel: {
            fontSize: 13,
            color: colors.tabIconDefault,
            fontWeight: '500',
            flex: 1,
        },
        vitalValue: {
            fontSize: 24,
            fontWeight: '700',
            color: colors.text,
        },
        vitalUnit: {
            fontSize: 12,
            color: colors.tabIconDefault,
            marginTop: 2,
        },
        card: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 3,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 8,
        },
        cardSubtitle: {
            fontSize: 14,
            color: colors.tabIconDefault,
            marginBottom: 20,
            lineHeight: 20,
        },
        radarChartPlaceholder: {
            height: 250,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#1E293B' : '#F8FAFC',
            borderRadius: 8,
        },
        barChartPlaceholder: {
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#1E293B' : '#F8FAFC',
            borderRadius: 8,
        },
        predictionCard: {
            borderRadius: 12,
            borderLeftWidth: 4,
            padding: 16,
            marginBottom: 12,
        },
        predictionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        predictionTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        predictionFactor: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
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
        },
        predictionDescription: {
            fontSize: 14,
            color: theme === 'dark' ? '#CBD5E1' : '#475569',
            lineHeight: 20,
        },
        recommendationsCard: {
            backgroundColor: theme === 'dark' ? '#1E293B' : '#EFF6FF',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
        },
        recommendationsTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme === 'dark' ? '#93C5FD' : '#1E3A8A',
            marginBottom: 16,
        },
        bulletRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        bulletPoint: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#3B82F6',
            marginTop: 8,
            marginRight: 10,
        },
        recommendationText: {
            fontSize: 15,
            color: theme === 'dark' ? '#BFDBFE' : '#1E40AF',
            flex: 1,
            lineHeight: 22,
        },
    });
};
