import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type Theme = 'light' | 'dark';

export const getSettingsScreenStyles = (theme: Theme) => {
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
            height: 80, 
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
        scrollContainer: { 
            padding: 20, 
            paddingBottom: 40 
        },
        section: { 
            marginBottom: 24 
        },
        sectionTitle: { 
            fontSize: 14, 
            fontWeight: '600', 
            color: colors.tabIconDefault, 
            marginBottom: 12, 
            marginLeft: 4, 
            textTransform: 'uppercase', 
            letterSpacing: 0.5 
        },
        card: {
            backgroundColor: colors.background,
            borderRadius: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        settingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        iconBox: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        destructiveIconBox: { 
            backgroundColor: '#FFF1F2' 
        },
        settingTextContainer: { 
            flex: 1, 
            paddingRight: 16 
        },
        settingTitle: { 
            fontSize: 16, 
            fontWeight: '500', 
            color: colors.text 
        },
        destructiveText: { 
            color: '#E11D48', 
            fontWeight: '600' 
        },
        settingSubtitle: { 
            fontSize: 13, 
            color: colors.tabIconDefault, 
            marginTop: 2 
        },
        divider: { 
            height: 1, 
            backgroundColor: isDark ? '#334155' : '#F1F5F9', 
            marginHorizontal: 16 
        },
        versionText: { 
            textAlign: 'center', 
            color: colors.tabIconDefault, 
            fontSize: 13, 
            marginTop: 20 
        },
    });
};
