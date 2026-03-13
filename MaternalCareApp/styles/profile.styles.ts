import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getProfileScreenStyles = (theme: Theme) => {
    const colors = Colors[theme];
    const isDark = theme === 'dark';

    return StyleSheet.create({
        safeArea: { 
            flex: 1, 
            backgroundColor: isDark ? colors.background : '#FAFAFA' 
        },
        navHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            height: 80, // Fixed height for alignment
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#334155' : '#F1F5F9',
        },
        backButton: { 
            padding: 8,
            marginRight: 8,
            marginLeft: -8,
        },
        navTitleContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        navTitle: { 
            fontSize: 22, 
            fontWeight: '700', 
            color: colors.text 
        },
        editButton: { 
            padding: 8,
            marginRight: -8,
        },
        scrollContainer: { 
            padding: 20, 
            paddingBottom: 40 
        },
        profileHeader: {
            alignItems: 'center',
            marginBottom: 32,
            marginTop: 10,
        },
        avatarContainer: {
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        avatarFallback: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#FFE4E6', 
            borderWidth: 4,
            borderColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: { 
            fontSize: 36, 
            fontWeight: '700', 
            color: '#E11D48' 
        },
        userName: { 
            fontSize: 24, 
            fontWeight: '700', 
            color: colors.text, 
            marginBottom: 4 
        },
        userRole: { 
            fontSize: 16, 
            color: colors.tabIconDefault, 
            fontWeight: '500' 
        },
        card: {
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        cardTitle: { 
            fontSize: 16, 
            fontWeight: '700', 
            color: colors.text, 
            marginBottom: 20 
        },
        infoRow: { 
            flexDirection: 'row', 
            alignItems: 'center' 
        },
        iconBox: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        infoTextContainer: { 
            flex: 1 
        },
        infoLabel: { 
            fontSize: 13, 
            color: colors.tabIconDefault, 
            marginBottom: 2 
        },
        infoValue: { 
            fontSize: 16, 
            fontWeight: '500', 
            color: colors.text 
        },
        divider: { 
            height: 1, 
            backgroundColor: isDark ? '#334155' : '#F1F5F9', 
            marginVertical: 16 
        },
    });
};
