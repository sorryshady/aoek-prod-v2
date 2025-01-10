import { ButtonText, Button, VStack, Text } from '../ui'

interface ContactAdminProps {
  message?: string;
  onBack: () => void;
}

export default function ContactAdmin({
  message = "Please contact the administrator to set up your account.",
  onBack
}: ContactAdminProps) {
  return (
    <VStack space="md" className="items-center">
      <Text className="text-center font-pmedium text-gray-700">
        {message}
      </Text>
      <Button
        size="lg"
        variant="outline"
        onPress={onBack}
        className="rounded-md"
      >
        <ButtonText className="font-psemibold">Go Back</ButtonText>
      </Button>
    </VStack>
  );
}
