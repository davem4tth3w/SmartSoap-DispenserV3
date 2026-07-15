import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function AddUserSuccessScreen() {
  const router = useRouter();

  const { fullName, email } = useLocalSearchParams<{
    fullName?: string;
    email?: string;
  }>();

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

        {/* User name */}
        <Text className="text-xl font-semibold text-foreground mb-1">
          {fullName}
        </Text>

        {/* Email */}
        <Text className="text-sm text-muted mb-4">
          {email}
        </Text>

        <Text className="text-sm text-muted text-center mb-6">
          The user account was successfully created.
        </Text>

        <Pressable
          onPress={() =>
          router.dismissTo("/users/manage_users")
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