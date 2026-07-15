import { auth } from "../../../lib/firebase-config";
import { getDoc, deleteDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  View,
  Alert,
} from "react-native";

import LottieView from "lottie-react-native";

import { db } from "../../../lib/firebase-config";

export default function DeleteUserFormScreen() {

const router = useRouter();
const {
  userId,
  fullName,
  email,
  role,
  employeeId,
} = useLocalSearchParams<{
  userId?: string;
  fullName?: string;
  email?: string;
  role?: string;
  employeeId?: string;
}>();

const [loading, setLoading] = useState(false);

const handleDelete = async () => {
  setLoading(true);

    try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        Alert.alert("Error", "Not authenticated.");
        return;
    }

    const userSnap = await getDoc(
        doc(db, "users", currentUser.uid)
    );

    if (!userSnap.exists() || userSnap.data().role !== "admin") {
        Alert.alert("Error", "Unauthorized action.");
        return;
    }

    if (!userId || typeof userId !== "string") {
        Alert.alert("Error", "Invalid user.");
        return;
    }

    await deleteDoc(doc(db, "users", userId));

    router.replace({
        pathname: "/users/delete/delete_user_success",
        params: {
        fullName,
        email,
        },
    });
    } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to delete user.");
    } finally {
    setLoading(false);
    }
};

return (
  <>
    <Stack.Screen options={{ title: "Delete User" }} />

    <ScrollView style={styles.container}>

        <View style={styles.header}>
            <View style={styles.headerTop}>
                <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
                >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#FFFFFF"
                />
                </Pressable>

                <Text style={styles.title}>
                Delete User
                </Text>
            </View>
        </View>

      <View style={styles.warningBox}>
        <Ionicons
            name="warning-outline"
            size={22}
            color="#FACC15"
        />

        <Text style={styles.warningText}>
            This action permanently deletes this user from the system.
            This action cannot be undone.
        </Text>
     </View>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>

      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>
          {fullName || "No name"}
        </Text>
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>

      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>
          {email || "No email"}
        </Text>
      </View>

      {/* Role */}
      <Text style={styles.label}>Role</Text>

      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>
          {role}
        </Text>
      </View>

      {/* Employee ID */}
      <Text style={styles.label}>Employee ID</Text>

      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>
          {employeeId || "N/A"}
        </Text>
      </View>

      
        {/* Submit Button */}
        <Pressable
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleDelete}
            disabled={loading}
            >
            <Text style={styles.buttonText}>
                {loading ? "Deleting..." : "Delete User"}
            </Text>
        </Pressable>

    </ScrollView>

    {loading && (
      <View style={styles.loadingOverlay}>
        <LottieView
          source={require("../../../assets/Trail loading.json")}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />

        <Text style={styles.loadingText}>
          Deleting...
        </Text>
      </View>
    )}
  </>
);

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B1220",
        padding: 20,
    },

    header: {
    marginBottom: 10,
    },

    headerTop: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    },

    backButton: {
    marginRight: 16,
    },

    title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    },

    label: {
        color: "#FFFFFF",
        marginBottom: 8,
        marginTop: 10,
        fontWeight: "600",
    },

    readOnlyBox: {
        backgroundColor: "#111827",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#334155",
    },

    readOnlyText: {
        color: "#E5E7EB",
        fontSize: 16,
        fontWeight: "500",
    },

    warningBox: {
        flexDirection: "row",
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "#FACC15",
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        alignItems: "flex-start",
    },

    warningText: {
        color: "#E5E7EB",
        marginLeft: 10,
        flex: 1,
        lineHeight: 20,
    },

    button: {
        backgroundColor: "#B91C1C",
        marginTop: 28,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },

    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        color: "#FFFFFF",
        marginTop: 12,
        fontSize: 16,
        fontWeight: "600",
    },
});