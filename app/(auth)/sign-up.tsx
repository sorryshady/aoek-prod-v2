import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "@/components/gradient-background";
import { Image } from "react-native";
import { registerUser } from "@/api/register";
import {
  BloodGroup,
  ContactDetails,
  Department,
  Designation,
  District,
  Gender,
  PersonalDetails,
  ProfessionalDetails,
  ProfilePhoto,
  RegisterFormData,
  RegisterFormErrors,
  RegistrationStep,
  UserStatus,
} from "@/constants/types";
import { router } from "expo-router";
import {
  isValidDate,
  isValidPhoneNumber,
  isValidMobileNumber,
  isValidEmail,
} from "@/lib/utils";
import { ButtonText, Button, HStack, ButtonSpinner } from "@/components/ui";
import PersonalForm from "@/components/personal-form";
import ProfessionalForm from "@/components/professional-form";
import ContactForm from "@/components/contact-form";
import PhotoForm from "@/components/photo-form";
import SuccessAlert from "@/components/success-alert";
import TermsConditions from "@/components/terms-conditions";

const STAGES = ["Personal ", "Professional ", "Contact ", " Photo"];
const initialFormData: RegisterFormData = {
  name: "",
  dob: "",
  gender: null,
  bloodGroup: null,
  userStatus: null,
  retiredDepartment: null,
  department: null,
  designation: null,
  officeAddress: "",
  workDistrict: null,
  personalAddress: "",
  homeDistrict: null,
  email: "",
  phoneNumber: null,
  mobileNumber: "",
  photoUrl: null,
  photoId: null,
};

const SignUp = () => {
  const width = Dimensions.get("window").width;
  const isTablet = width > 768;
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [showTerms, setShowTerms] = useState(true);

  const validateStage = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    switch (currentStage) {
      case 0:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!isValidDate(formData.dob))
          newErrors.dob = "Please enter a valid date of birth";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.bloodGroup)
          newErrors.bloodGroup = "Blood group is required";
        break;
      case 1:
        if (!formData.userStatus)
          newErrors.userStatus = "User status is required";
        if (formData.userStatus === "RETIRED" && !formData.retiredDepartment) {
          newErrors.retiredDepartment = "Retired department is required";
        } else if (formData.userStatus === "WORKING") {
          if (!formData.department)
            newErrors.department = "Department is required";
          if (!formData.designation)
            newErrors.designation = "Designation is required";
          if (!formData.workDistrict)
            newErrors.workDistrict = "Work district is required";
        }
        break;
      case 2:
        if (!formData.personalAddress.trim())
          newErrors.personalAddress = "Personal address is required";
        if (!formData.homeDistrict)
          newErrors.homeDistrict = "Home district is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!isValidEmail(formData.email))
          newErrors.email = "Please enter a valid email";
        if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber))
          newErrors.phoneNumber = "Please enter a valid phone number";
        if (!formData.mobileNumber.trim())
          newErrors.mobileNumber = "Mobile number is required";
        if (!isValidMobileNumber(formData.mobileNumber))
          newErrors.mobileNumber = "Please enter a valid mobile number";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStage()) {
      setCurrentStage((prev) => Math.min(prev + 1, STAGES.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStage((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStage()) {
      Alert.alert("Error", "Please fix the errors before submitting");
      return;
    }
    formData.dob = formData.dob.replace(/-/g, "/");
    formData.phoneNumber = formData.phoneNumber || undefined;
    formData.photoUrl = formData.photoUrl || undefined;
    formData.photoId = formData.photoId || undefined;
    setIsLoading(true);
    const response = await registerUser(formData);
    setIsLoading(false);
    if (response.error) {
      setError(response.error);
    } else {
      setFormData(initialFormData);
      setCurrentStage(0);
      setSuccess(response.message);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    }
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    // Continue to registration form
  };

  const handleDeclineTerms = () => {
    router.back(); // or router.push('/sign-in');
  };

  const renderStageIndicators = () => (
    <HStack className="justify-between mb-6">
      {STAGES.map((stage, index) => (
        <View key={stage} className="flex-1 items-center">
          <View
            className={`${isTablet ? "w-10 h-10" : "w-8 h-8"} rounded-full items-center justify-center ${
              index === currentStage
                ? "bg-blue-500"
                : index < currentStage
                  ? "bg-green-500"
                  : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-white font-psemibold ${
                isTablet ? "text-lg" : "text-sm"
              }`}
            >
              {index + 1}
            </Text>
          </View>
          <Text
            className={` mt-1 font-pregular ${
              isTablet ? "text-base" : "text-sm"
            }`}
          >
            {stage}
          </Text>
        </View>
      ))}
    </HStack>
  );

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 0:
        return (
          <PersonalForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            isTablet={isTablet}
          />
        );
      case 1:
        return (
          <ProfessionalForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            isTablet={isTablet}
          />
        );
      case 2:
        return (
          <ContactForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            isTablet={isTablet}
          />
        );
      case 3:
        return (
          <PhotoForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            isTablet={isTablet}
          />
        );
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        {showTerms ? (
          <TermsConditions
            onAccept={handleAcceptTerms}
            onDecline={handleDeclineTerms}
            isTablet={isTablet}
          />
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 47 : 0}
            className="flex-1"
            style={{ position: "relative" }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 px-4 items-center justify-center mt-10">
                <View
                  className={`w-full ${isTablet ? "max-w-[500px]" : "max-w-[400px]"}`}
                >
                  <View className="bg-white rounded-2xl w-full gap-5 relative my-6">
                    <Image
                      source={images.background}
                      className="w-full h-full absolute opacity-10"
                      resizeMode="cover"
                    />
                    <View className="p-6">
                      <Text
                        className={`text-black text-center font-psemibold ${
                          isTablet ? "text-4xl" : "text-2xl"
                        } mb-6`}
                      >
                        Register
                      </Text>
                      {success ? (
                        <View className="flex-1 items-center justify-center">
                          <SuccessAlert message={success} isTablet={isTablet} />
                        </View>
                      ) : (
                        <>
                          {renderStageIndicators()}
                          {renderCurrentStage()}
                          <View className="mt-6 flex-row">
                            {currentStage > 0 && (
                              <Button
                                variant="outline"
                                onPress={handlePrevious}
                                className="flex-1 mx-2 rounded-md"
                                size={isTablet ? "xl" : "md"}
                              >
                                <ButtonText className="font-psemibold">
                                  Previous
                                </ButtonText>
                              </Button>
                            )}

                            {currentStage < STAGES.length - 1 ? (
                              <Button
                                action="primary"
                                onPress={handleNext}
                                className="flex-1 mx-2 rounded-md"
                                size={isTablet ? "xl" : "md"}
                              >
                                <ButtonText className="font-psemibold">
                                  Next
                                </ButtonText>
                              </Button>
                            ) : (
                              <Button
                                action="primary"
                                onPress={handleSubmit}
                                isDisabled={isLoading}
                                className="flex-1 mx-2 rounded-md"
                                size={isTablet ? "xl" : "md"}
                              >
                                <ButtonText className="font-psemibold">
                                  {isLoading ? "Submitting..." : "Submit"}
                                </ButtonText>
                                {isLoading && <ButtonSpinner color="#fff" />}
                              </Button>
                            )}
                          </View>
                        </>
                      )}
                      <HStack
                        space="sm"
                        className="justify-center items-center mt-6"
                      >
                        <Text className="font-pregular">
                          Already have an account?
                        </Text>
                        <Button
                          variant="link"
                          onPress={() => router.push("/sign-in")}
                          size={isTablet ? "lg" : "md"}
                        >
                          <ButtonText className="text-blue-500 font-psemibold">
                            Sign in
                          </ButtonText>
                        </Button>
                      </HStack>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </GradientBackground>
    </SafeAreaView>
  );
};

export default SignUp;
