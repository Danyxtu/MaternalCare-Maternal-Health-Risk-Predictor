import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { QrCode, X, CheckCircle2, AlertCircle, Camera as CameraIcon, Keyboard } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { post } from '#/src/api/api';

const { width } = Dimensions.get('window');

interface AccessCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (patientId: string) => void;
}

const AccessCodeModal: React.FC<AccessCodeModalProps> = ({ visible, onClose, onSuccess }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';

  const [mode, setMode] = useState<'scan' | 'input'>('scan');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible && mode === 'scan' && !permission?.granted) {
      requestPermission();
    }
  }, [visible, mode, permission]);

  const handleVerify = async (manualCode?: string) => {
    const codeToVerify = manualCode || code;
    if (codeToVerify.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: any = await post('/patients/verify-code', { code: codeToVerify });
      onSuccess(response.data.data.patientId.toString());
      setCode('');
      setMode('scan');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid or expired access code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (data && data.length === 6 && !isLoading) {
      handleVerify(data);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#11181C' }]}>Patient Access Code</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={isDark ? '#9CA3AF' : '#64748B'} size={24} />
            </TouchableOpacity>
          </View>

          {/* Segmented Toggle */}
          <View style={[styles.toggleContainer, { backgroundColor: isDark ? '#111827' : '#F1F5F9' }]}>
            <TouchableOpacity 
              style={[styles.toggleButton, mode === 'scan' && [styles.activeToggle, { backgroundColor: isDark ? '#374151' : '#FFFFFF' }]]}
              onPress={() => setMode('scan')}
            >
              <CameraIcon color={mode === 'scan' ? '#10B981' : '#64748B'} size={18} style={{ marginRight: 8 }} />
              <Text style={[styles.toggleText, { color: mode === 'scan' ? (isDark ? '#F9FAFB' : '#111827') : '#64748B' }]}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, mode === 'input' && [styles.activeToggle, { backgroundColor: isDark ? '#374151' : '#FFFFFF' }]]}
              onPress={() => setMode('input')}
            >
              <Keyboard color={mode === 'input' ? '#10B981' : '#64748B'} size={18} style={{ marginRight: 8 }} />
              <Text style={[styles.toggleText, { color: mode === 'input' ? (isDark ? '#F9FAFB' : '#111827') : '#64748B' }]}>Enter Code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {mode === 'scan' ? (
              <View style={styles.cameraWrapper}>
                {!permission ? (
                  <ActivityIndicator size="large" color="#10B981" />
                ) : !permission.granted ? (
                  <View style={styles.permissionContainer}>
                    <Text style={[styles.permissionText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                      Camera permission is required to scan QR codes.
                    </Text>
                    <TouchableOpacity 
                      onPress={requestPermission}
                      style={styles.permissionButton}
                    >
                      <Text style={styles.permissionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.cameraBorder}>
                    <CameraView
                      style={styles.camera}
                      onBarcodeScanned={handleBarCodeScanned}
                      barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                      }}
                    />
                    <View style={styles.scanOverlay}>
                      <View style={styles.scanFrame} />
                    </View>
                  </View>
                )}
                <Text style={[styles.instructionText, { color: '#64748B' }]}>
                  Align the patient's QR code within the frame to scan automatically.
                </Text>
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                <Text style={[styles.instructionText, { color: '#64748B', marginBottom: 20 }]}>
                  Enter the 6-digit access code provided by the patient.
                </Text>
                
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#111827' : '#F9FAFB',
                      color: isDark ? '#F9FAFB' : '#111827',
                      borderColor: error ? '#EF4444' : (isDark ? '#374151' : '#E5E7EB')
                    }
                  ]}
                  placeholder="000000"
                  placeholderTextColor={isDark ? '#4B5563' : '#9CA3AF'}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={(text) => {
                    setCode(text);
                    setError(null);
                  }}
                />
                
                {error && (
                  <View style={styles.errorContainer}>
                    <AlertCircle color="#EF4444" size={14} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.verifyButton, { opacity: isLoading ? 0.7 : 1 }]}
                  onPress={() => handleVerify()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <CheckCircle2 color="#FFFFFF" size={20} style={{ marginRight: 8 }} />
                      <Text style={styles.verifyButtonText}>Verify & Access</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 16,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  body: {
    width: '100%',
    alignItems: 'center',
  },
  cameraWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  cameraBorder: {
    width: 280,
    height: 280,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 20,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 64,
    borderRadius: 18,
    borderWidth: 1.5,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  verifyButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#10B981',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 30,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default AccessCodeModal;
