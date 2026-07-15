import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";

import { db } from "@/lib/firebase-config";

import {
  collection,
  getDocs,
} from "firebase/firestore";
  
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

export default function ManageUsersScreen() {
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  const defaultUsers = allUsers.filter(
    (u) =>
      u.defaultAdmin === true ||
      u.defaultMaintenance === true ||
      u.defaultMaintenance === "true"
  );

  const normalUsers = allUsers.filter(
    (u) =>
      !(
        u.defaultAdmin === true ||
        u.defaultMaintenance === true ||
        u.defaultMaintenance === "true"
      )
  );

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));

      const users = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setAllUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );
  

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
              Manage Users
            </Text>

            <Text className="text-sm text-muted">
              Add and manage system users
            </Text>
          </View>
        </View>

        {/* Manage Users */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
        
          {/* Default Users */}
          {defaultUsers.length > 0 && (
            <View className="mb-4">
              <Text className="text-xs font-bold text-muted mb-2">
                Default Accounts
              </Text>

              {defaultUsers.map((u: any) => (
                <View
                  key={u.id}
                  className="flex-row justify-between items-center py-3 border-b border-border opacity-80"
                >
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {u.fullName} (Default)
                    </Text>

                    <Text className="text-xs text-muted">
                      {u.email}
                    </Text>
                  </View>

                  <View className="bg-primary px-2 py-1 rounded-lg">
                    <Text className="text-white text-xs font-bold capitalize">
                      {u.role}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Normal Users */}
          {normalUsers.map((u: any) => (
            <View
              key={u.id}
              className="flex-row justify-between items-center py-3 border-b border-border"
            >
              <View className="flex-1">

                <Text className="text-xs font-bold text-muted mb-2">
                  Added Accounts
                </Text>
                <Text className="text-sm font-semibold text-foreground">
                  {u.fullName}
                </Text>

                <Text className="text-xs text-muted">
                  {u.email}
                </Text>
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() =>
                    Alert.alert("Edit", `Edit user: ${u.fullName}`)
                  }
                  className="bg-primary bg-opacity-30 rounded-lg px-2 py-1 border border-primary border-opacity-50"
                >
                  <Text className="text-xs font-bold text-white">
                    Edit
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/users/delete/delete_user_form",
                      params: {
                        userId: u.id,
                        fullName: u.fullName,
                        email: u.email,
                        role: u.role,
                        employeeId: u.employeeId ?? "",
                      },
                    })
                  }
                  className="bg-error bg-opacity-30 rounded-lg px-2 py-1 border border-error border-opacity-50"
                >
                  <Text className="text-xs font-bold text-white">
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Add User Button */}
      <Pressable
        onPress={() => router.push("/users/add/add_user" as any)}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: pressed ? "#0847A3" : "#4aa7ff",
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Text style={styles.fabIcon}>＋</Text>

        <Text style={styles.fabText}>
          Add User
        </Text>
      </Pressable>

      
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // Android shadow
    elevation: 8,
  },

  fabIcon: {
    color: "#ffffff",
    fontSize: 22,
    lineHeight: 24,
    marginRight: 8,
  },

  fabText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});