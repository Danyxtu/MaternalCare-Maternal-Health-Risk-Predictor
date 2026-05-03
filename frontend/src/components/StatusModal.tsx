import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Animated,
} from "react-native";
import { CheckCircle2, XCircle, X } from "lucide-react-native";

interface StatusModalProps {
  visible: boolean;
  status: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  status,
  title,
  message,
  onClose,
  actionLabel = "OK",
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";

  const isSuccess = status === "success";
  const iconColor = isSuccess ? "#10B981" : "#EF4444";
  const bgColor = isDark ? "#1E293B" : "#FFFFFF";
  const textColor = isDark ? "#F8FAFC" : "#1E293B";
  const subTextColor = isDark ? "#94A3B8" : "#64748B";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <X color={subTextColor} size={20} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}>
              {isSuccess ? (
                <CheckCircle2 color={iconColor} size={48} />
              ) : (
                <XCircle color={iconColor} size={48} />
              )}
            </View>

            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            <Text style={[styles.message, { color: subTextColor }]}>{message}</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: iconColor }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{actionLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
    zIndex: 1,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 28,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StatusModal;
