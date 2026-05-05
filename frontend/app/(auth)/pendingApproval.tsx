import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, AlertCircle, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

const PendingApprovalScreen = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Clock size={80} color="#10B981" />
        </View>

        <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          Account Pending
        </Text>
        
        <View style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: isDark ? '#374151' : '#E5E7EB' }]}>
          <View style={styles.infoRow}>
            <AlertCircle size={20} color="#10B981" style={{ marginRight: 12 }} />
            <Text style={[styles.description, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
              Your doctor account is currently being reviewed by our administrative team.
            </Text>
          </View>
          
          <Text style={[styles.subDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            We'll verify your credentials and notify you once your account has been approved. This usually takes 24-48 hours.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <ChevronLeft size={20} color="#10B981" />
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: isDark ? '#4B5563' : '#9CA3AF' }]}>
          MaternalCare • Medical Professional Portal
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  description: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  subDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default PendingApprovalScreen;
