import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getDrawerContentStyles = (theme: Theme) => {
    const colors = Colors[theme];
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
            width: '100%',
        },
        container: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            height: 80, // Fixed height for alignment
            backgroundColor: colors.background,
        },
        logoRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        logoIconContainer: {
            backgroundColor: '#FB1554',
            width: 40, // Reduced to 40 to match toggle icon total size (24+8+8)
            height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        logoTextContainer: {
            justifyContent: 'center',
        },
        brandName: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
        },
        brandSubtitle: {
            fontSize: 12,
            color: colors.tabIconDefault,
            marginTop: 2,
        },
        collapseButton: {
            padding: 8,
            marginRight: -8,
        },
        divider: {
            height: 1,
            backgroundColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            marginBottom: 16,
        },
        subDivider: {
            height: 1,
            backgroundColor: theme === 'dark' ? '#334155' : '#F1F5F9',
            marginVertical: 16,
            marginHorizontal: 12,
        },
        navContainer: {
            flexGrow: 1,
            paddingHorizontal: 16,
        },
        navGroup: {
            marginBottom: 8,
        },
        drawerItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginBottom: 4,
        },
        iconWrapper: {
            marginRight: 16,
            width: 24,
            alignItems: 'center',
        },
        drawerItemText: {
            fontSize: 16,
        },
        bottomSection: {
            paddingTop: 16,
            paddingBottom: 32,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: theme === 'dark' ? '#334155' : '#F1F5F9',
        },
        helpCard: {
            backgroundColor: theme === 'dark' ? '#311212' : '#FFF1F2',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
        },
        helpCardTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme === 'dark' ? '#FECDD3' : '#881337',
            marginBottom: 4,
        },
        helpCardLink: {
            fontSize: 13,
            color: '#E11D48',
        },
        logoutButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
        },
        logoutText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#E11D48',
        },
    });
};
