import { View, Text, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

export default function AddUserSuccessScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="flex-1 justify-center items-center p-6">
      <View className="bg-surface border border-border rounded-3xl p-8 w-full items-center">
        <View className="bg-primary rounded-full p-4 mb-4">
          <Ionicons
            name="checkmark"
            size={40}
            color="#FFFFFF"
          />
        </View>

        <Text className="text-2xl font-bold text-foreground mb-2">
          User Added
        </Text>

        <Text className="text-sm text-muted text-center mb-6">
          The user account was successfully created.
        </Text>

        <Pressable
          onPress={() =>
            router.replace("/users/manage_users")
          }
          style={({ pressed }) => [
            { opacity: pressed ? 0.7 : 1 },
          ]}
          className="bg-primary rounded-xl py-3 px-6"
        >
          <Text className="text-white font-bold">
            Back to Manage Users
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}