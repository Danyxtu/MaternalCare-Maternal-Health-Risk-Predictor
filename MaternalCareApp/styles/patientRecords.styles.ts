import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getPatientRecordsScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            flex: 1,
        },
        listContent: {
            paddingBottom: 20,
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
        searchFilterContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 10,
            marginBottom: 24,
            gap: 12,
        },
        searchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 48,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            fontSize: 15,
            color: colors.text,
        },
        filterButton: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
        },
        extraFilterBox: {
            width: 48,
            height: 48,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#334155' : '#E2E8F0',
            borderRadius: 12,
            backgroundColor: colors.background,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: theme === 'dark' ? '#1E293B' : '#F8FAFC',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            marginHorizontal: 20,
        },
        tableHeaderText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.text,
        },
        tableRow: {
            flexDirection: 'row',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            marginHorizontal: 20,
            alignItems: 'flex-start',
        },
        cell: {
            justifyContent: 'center',
        },
        patientName: {
            fontSize: 15,
            fontWeight: '500',
            color: colors.text,
            lineHeight: 20,
        },
        cellText: {
            fontSize: 15,
            color: theme === 'dark' ? '#CBD5E1' : '#334155',
        },
        unitText: {
            fontSize: 12,
            color: colors.tabIconDefault,
            marginTop: 2,
        },
        colName: {
            flex: 2,
        },
        colAge: {
            flex: 0.8,
            justifyContent: 'flex-start',
            paddingTop: 2,
        },
        colBP: {
            flex: 1.2,
        },
        colSugar: {
            flex: 1,
        },
        bottomBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? colors.background : '#FAFAFA',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: theme === 'dark' ? '#334155' : '#F1F5F9',
        },
        bottomBarText: {
            fontSize: 14,
            color: colors.tabIconDefault,
        },
        bottomBarTextBold: {
            fontWeight: '600',
            color: colors.text,
        },
        newAssessmentButton: {
            backgroundColor: '#E11D48',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
        },
        newAssessmentButtonText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
        },
    });
};
