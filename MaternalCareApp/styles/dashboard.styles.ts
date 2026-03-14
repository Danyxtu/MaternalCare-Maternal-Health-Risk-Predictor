import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getDashboardScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme === 'dark' ? colors.background : '#FAFAFA',
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
            fontSize: 22, // Adjusted for consistency
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
        statsScrollView: {
            marginTop: 10,
            marginBottom: 20,
        },
        statsScrollContent: {
            paddingHorizontal: 20,
            gap: 12,
        },
        statCard: {
            width: 180, // Increased width to fit text in one line
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 12, // Reduced padding slightly to help with height
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        statCardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center', // Changed from flex-start to center
            marginBottom: 4, // Reduced margin
        },
        statCardTitle: {
            fontSize: 13,
            color: colors.tabIconDefault,
            fontWeight: '600',
            flex: 1, // Allow title to take available space
            marginRight: 4,
        },
        iconContainer: {
            width: 32, // Reduced from 36
            height: 32, // Reduced from 36
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        statCardValue: {
            fontSize: 24, // Reduced slightly from 28 to save height
            fontWeight: '700',
        },
        statCardSubtitle: {
            fontSize: 11, // Reduced slightly from 12
            color: colors.tabIconDefault,
            marginTop: 2,
        },
        cardContainer: {
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 3,
        },
        cardHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 0,
        },
        viewAllText: {
            color: '#F43F5E',
            fontSize: 14,
            fontWeight: '500',
        },
        pieChartPlaceholder: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            marginBottom: 20,
        },
        fakePieCircle: {
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: theme === 'dark' ? '#1E293B' : '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
        },
        legendContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 16,
        },
        lineLegendContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 16,
        },
        legendItem: {
            alignItems: 'center',
        },
        legendLabelRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        legendColorBox: {
            width: 10,
            height: 10,
            marginRight: 6,
            borderRadius: 2,
        },
        legendText: {
            fontSize: 12,
            fontWeight: '600',
        },
        legendValue: {
            fontSize: 14,
            fontWeight: '700',
        },
        lineLegendMarker: {
            marginRight: 4,
            fontSize: 12,
            fontWeight: 'bold',
        },
        lineChartPlaceholder: {
            height: 180,
            backgroundColor: theme === 'dark' ? '#1E293B' : '#F8FAFC',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
        },
        tableHeader: {
            flexDirection: 'row',
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            marginBottom: 8,
        },
        tableHeaderText: {
            fontSize: 13,
            color: colors.tabIconDefault,
            fontWeight: '500',
        },
        tableRow: {
            flexDirection: 'row',
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#0F172A' : '#F8FAFC',
        },
        tableRowText: {
            fontSize: 14,
            color: theme === 'dark' ? '#CBD5E1' : '#334155',
        },
        patientNameText: {
            fontWeight: '500',
            color: colors.text,
        },
        colPatient: {
            flex: 2,
        },
        colAge: {
            flex: 1,
        },
        colBP: {
            flex: 1,
        },
    });
};
