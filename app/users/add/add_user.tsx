import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import LottieView from "lottie-react-native";

import { ScreenContainer } from "@/components/screen-container";

import { auth, db } from "@/lib/firebase-config";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

export default function AddUserScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [newUserData, setNewUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "maintenance" as "admin" | "maintenance",
    employeeId: "",
  });

  const handleAddUser = async () => {
    if (!newUserData.email || !newUserData.password) {
      Alert.alert("Error", "Missing fields");
      return;
    }

    const currentAdmin = auth.currentUser;

    if (!currentAdmin) {
      Alert.alert("Error", "Admin session not found");
      return;
    }

    try {
      setLoading(true);

      const cred = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.password
      );

      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        fullName: newUserData.fullName,
        email: newUserData.email,
        role: newUserData.role,
        employeeId: newUserData.employeeId || null,
      });

      await auth.updateCurrentUser(currentAdmin);

      router.replace("/users/add/success" as any);
    } catch (error) {
      console.error(error);

      Alert.alert("Error", "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="mr-4"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </Pressable>

          <View className="flex-1 p-4">
            <Text className="text-3xl font-bold text-foreground">
              Add User
            </Text>

            <Text className="text-sm text-muted">
              Create a new system user
            </Text>
          </View>
        </View>

        <View className="bg-surface rounded-2xl p-4 border border-border">
          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Full Name
            </Text>

            <TextInput
              className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
              placeholder="John Doe"
              placeholderTextColor="#CBD5E1"
              value={newUserData.fullName}
              onChangeText={(text) =>
                setNewUserData({
                  ...newUserData,
                  fullName: text,
                })
              }
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Email
            </Text>

            <TextInput
              className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
              placeholder="user@school.com"
              placeholderTextColor="#CBD5E1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={newUserData.email}
              onChangeText={(text) =>
                setNewUserData({
                  ...newUserData,
                  email: text,
                })
              }
            />
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Password
            </Text>

            <TextInput
              className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#CBD5E1"
              secureTextEntry
              value={newUserData.password}
              onChangeText={(text) =>
                setNewUserData({
                  ...newUserData,
                  password: text,
                })
              }
            />
          </View>

          {/* Role */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Role
            </Text>

            <View className="flex-row gap-2">
              {(["admin", "maintenance"] as const).map(
                (role) => (
                  <Pressable
                    key={role}
                    onPress={() =>
                      setNewUserData({
                        ...newUserData,
                        role,
                      })
                    }
                    style={{
                      backgroundColor:
                        newUserData.role === role
                          ? "#0A5BA8"
                          : "rgba(10, 91, 168, 0.2)",
                      borderColor:
                        newUserData.role === role
                          ? "#0A5BA8"
                          : "#2D5A8C",
                    }}
                    className="flex-1 py-2 rounded-lg border items-center"
                  >
                    <Text
                      className={`font-semibold ${
                        newUserData.role === role
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() +
                        role.slice(1)}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>

          {/* Employee ID */}
          {newUserData.role === "maintenance" && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">
                Employee ID
              </Text>

              <TextInput
                className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                placeholder="EMP001"
                placeholderTextColor="#CBD5E1"
                value={newUserData.employeeId}
                onChangeText={(text) =>
                  setNewUserData({
                    ...newUserData,
                    employeeId: text,
                  })
                }
              />
            </View>
          )}

          {/* Add User Button */}
          <Pressable
            onPress={handleAddUser}
            disabled={loading}
            style={({ pressed }) => [
              { opacity: pressed || loading ? 0.7 : 1 },
            ]}
            className="bg-primary rounded-xl py-3 items-center"
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Adding User..." : "Add User"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require("../../../assets/Trail loading.json")}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />

          <Text style={styles.loadingText}>
            Adding User...
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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