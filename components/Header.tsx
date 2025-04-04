import { TouchableOpacity, StyleSheet, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { FontAwesome } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface HeaderProps {
  reloadGame: () => void;
  pauseGame: () => void;
  children: JSX.Element;
  isPaused: boolean;
}

export default function Header({
  children,
  reloadGame,
  pauseGame,
  isPaused,
}: HeaderProps): JSX.Element {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();

  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  // Auto-check for updates when component mounts
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (isAvailable) {
          setShowUpdatePrompt(true);
        }
      } catch (error) {
        console.error("Error checking for update:", error);
      }
    };

    checkForUpdates();
  }, []);

  // Handle update process
  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      Alert.alert(
        "Update Ready",
        "Restart The App To Update",
        [
          { 
            text: "Restart", 
            onPress: () => Updates.reloadAsync() 
          },
          { 
            text: "Do it Later",
            onPress: () => setShowUpdatePrompt(false),
            style: "cancel" 
          }
        ]
      );
    } catch (error) {
      Alert.alert("Failed", "An Unknown error occured");
      setShowUpdatePrompt(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Version Info */}
  

      {/* Update Prompt Modal */}
      {showUpdatePrompt && (
        <View style={styles.modalOverlay}>
          <View style={styles.updateModal}>
            <Text style={styles.modalTitle}>New Update Avaiable 🚀</Text>
            <Text style={styles.modalText}>
              Install the new version with improved features and bug fixes.

            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowUpdatePrompt(false)}
              >
                <Text style={styles.buttonText}>Mind It Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <TouchableOpacity onPress={reloadGame}>
        <MaterialIcons name="restart-alt" size={35} color={Colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={pauseGame}>
        <FontAwesome
          name={isPaused ? "play-circle" : "pause-circle"}
          size={35}
          color={Colors.primary}
        />
      </TouchableOpacity>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Colors.primary,
    borderWidth: 12 ,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 15,
    backgroundColor: Colors.background,
    position: "relative",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  updateModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});