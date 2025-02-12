import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { EyeOffIcon } from "lucide-react-native";
import { InputField, InputIcon, InputSlot } from "./ui/input";
import { Input } from "./ui";
import { EyeIcon } from "lucide-react-native";

const PasswordEntry = ({
  value,
  setValue,
  placeholder,
  showPasswordStrength,
  isTablet,
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  showPasswordStrength: boolean;
  isTablet: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  useEffect(() => {
    if (showPasswordStrength) {
      setChecks({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value),
      });
    }
  }, [value, showPasswordStrength]);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  return (
    <View>
      <Input className="text-center" size={isTablet ? "xl" : "md"}>
        <InputField
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          className="font-pregular"
        />
        <InputSlot className="pr-3" onPress={handleState}>
          <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
        </InputSlot>
      </Input>
      {showPasswordStrength && (
        <View className="mt-2 gap-1">
          <Text
            className={` font-pmedium text-gray-500 ${isTablet ? "text-lg" : "text-sm"}`}
          >
            Password must contain:
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Text
              className={`font-pmedium ${checks.length ? "text-green-600" : "text-red-500"} ${isTablet ? "text-lg" : "text-xs"}`}
            >
              • At least 8 characters
            </Text>
            <Text
              className={`font-pmedium ${checks.uppercase ? "text-green-600" : "text-red-500"} ${isTablet ? "text-lg" : "text-xs"}`}
            >
              • One uppercase letter
            </Text>
            <Text
              className={`font-pmedium ${checks.lowercase ? "text-green-600" : "text-red-500"} ${isTablet ? "text-lg" : "text-xs"}`}
            >
              • One lowercase letter
            </Text>
            <Text
              className={`font-pmedium ${checks.number ? "text-green-600" : "text-red-500"} ${isTablet ? "text-lg" : "text-xs"}`}
            >
              • One number
            </Text>
            <Text
              className={`font-pmedium ${checks.special ? "text-green-600" : "text-red-500"} ${isTablet ? "text-lg" : "text-xs"}`}
            >
              • One special character
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default PasswordEntry;
