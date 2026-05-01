import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from "react-native";
import { Colors } from "#/constants/theme";

export type RiskLevel = "low" | "medium" | "high";

export interface PatientSummaryItem {
  id: string;
  name: string;
  age: number;
  bp?: string;
  risk: RiskLevel;
}

interface RiskPatientsModalProps {
  visible: boolean;
  onClose: () => void;
  riskLabel: string;
  riskColor: string;
  patients: PatientSummaryItem[];
  theme: "light" | "dark";
  onSelectPatient: (patientId: string) => void;
}

const RiskPatientsModal: React.FC<RiskPatientsModalProps> = ({
  visible,
  onClose,
  riskLabel,
  riskColor,
  patients,
  theme,
  onSelectPatient,
}) => {
  const colors = Colors[theme];
  const borderColor = theme === "dark" ? "#1F2937" : "#E2E8F0";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, borderColor },
          ]}
        >
          <View style={styles.sheetHeader}>
            <View style={styles.titleRow}>
              <View style={[styles.colorDot, { backgroundColor: riskColor }]} />
              <Text style={[styles.title, { color: colors.text }]}>
                {riskLabel || "Patients"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text
                style={[styles.closeText, { color: colors.tabIconDefault }]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            {patients.length} patient{patients.length === 1 ? "" : "s"} in this
            category
          </Text>

          {patients.length === 0 ? (
            <View style={styles.emptyState}>
              <Text
                style={[styles.emptyText, { color: colors.tabIconDefault }]}
              >
                No patients found.
              </Text>
            </View>
          ) : (
            <FlatList
              data={patients}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.patientRow,
                    {
                      borderColor,
                    },
                  ]}
                  onPress={() => onSelectPatient(item.id)}
                >
                  <View style={styles.patientInfo}>
                    <Text style={[styles.patientName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.patientMeta,
                        { color: colors.tabIconDefault },
                      ]}
                    >
                      Age {item.age}
                      {item.bp ? ` · BP ${item.bp}` : ""}
                    </Text>
                  </View>
                  <Text style={[styles.viewLink, { color: riskColor }]}>
                    View
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  patientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  patientInfo: {
    flex: 1,
    marginRight: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
  },
  patientMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  viewLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default RiskPatientsModal;
