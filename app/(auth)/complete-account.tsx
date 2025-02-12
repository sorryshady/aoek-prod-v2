import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/global-provider";
import { Redirect, router } from "expo-router";
import {
  CompleteUser,
  RegisterFormData,
  RegisterFormErrors,
} from "@/constants/types";
import {
  isValidDate,
  isValidEmail,
  isValidMobileNumber,
  isValidPhoneNumber,
} from "@/lib/utils";
import { Button, ButtonSpinner, ButtonText, HStack } from "@/components/ui";
import PersonalForm from "@/components/personal-form";
import ProfessionalForm from "@/components/professional-form";
import ContactForm from "@/components/contact-form";
import PhotoForm from "@/components/photo-form";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "@/components/gradient-background";
import { images } from "@/constants";
import SuccessAlert from "@/components/success-alert";
import { completeAccount } from "@/api/complete-account";

function determineStartingStep(user: CompleteUser): number {
  // Check personal info
  if (!user.name || !user.gender || !user.dob || !user.bloodGroup) {
    return 0;
  }
  // Check professional info
  if (!user.designation || !user.department || !user.workDistrict) {
    return 1;
  }
  // Check contact info
  if (!user.email || !user.mobileNumber || !user.personalAddress) {
    return 2;
  }
  // Check photo
  if (!user.photoUrl) {
    return 3;
  }
  return 0; // Fallback
}
const STAGES = ["Personal ", "Professional ", "Contact ", " Photo"];
const CompleteAccount = () => {
  const width = Dimensions.get("window").width;
  const isTablet = width > 768;
  const { user, refetchData, isLoading: contextLoading } = useGlobalContext();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [formData, setFormData] = useState<RegisterFormData>({
    name: user?.name || "",
    dob: user?.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "",
    gender: user?.gender || null,
    bloodGroup: user?.bloodGroup || null,
    userStatus: user?.userStatus || null,
    retiredDepartment: user?.retiredDepartment || null,
    department: user?.department || null,
    designation: user?.designation || null,
    officeAddress: user?.officeAddress || "",
    workDistrict: user?.workDistrict || null,
    personalAddress: user?.personalAddress || "",
    homeDistrict: user?.homeDistrict || null,
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    phoneNumber: user?.phoneNumber || "",
    photoId: user?.photoId || null,
    photoUrl: user?.photoUrl || null,
  });

  if (!user && !contextLoading) {
    return <Redirect href="/sign-in" />;
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dob: user.dob ? new Date(user.dob).toLocaleDateString("en-GB") : "",
        gender: user.gender || null,
        bloodGroup: user.bloodGroup || null,
        userStatus: user.userStatus || null,
        retiredDepartment: user.retiredDepartment || null,
        department: user.department || null,
        designation: user.designation || null,
        officeAddress: user.officeAddress || "",
        workDistrict: user.workDistrict || null,
        personalAddress: user.personalAddress || "",
        homeDistrict: user.homeDistrict || null,
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        phoneNumber: user.phoneNumber || "",
        photoId: user.photoId || null,
        photoUrl: user.photoUrl || null,
      });
    }
  }, [user]);

  const [currentStage, setCurrentStage] = useState<number>(() =>
    user ? determineStartingStep(user) : 0,
  );

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
    const response = await completeAccount(formData);
    setIsLoading(false);
    if (response.error) {
      setError(response.error);
    } else {
      setSuccess("Account updated successfully");
      await refetchData();
      router.push("/profile");
    }
  };

  const handleNext = () => {
    if (validateStage()) {
      setCurrentStage((prev) => Math.min(prev + 1, STAGES.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStage((prev) => Math.max(prev - 1, 0));
  };

  const renderStageIndicators = () => (
    <HStack className="justify-between mb-6">
      {STAGES.map((stage, index) => (
        <View key={stage} className="flex-1 items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              index === currentStage
                ? "bg-blue-500"
                : index < currentStage
                  ? "bg-green-500"
                  : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-psemibold">{index + 1}</Text>
          </View>
          <Text className="text-xs mt-1 font-pregular">{stage}</Text>
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
          />
        );
      case 1:
        return (
          <ProfessionalForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <ContactForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 3:
        return (
          <PhotoForm
            formData={formData}
            setFormData={setFormData}
            error={error}
          />
        );
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
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
            <View className="flex-1 px-4 items-center mt-10">
              <View className="w-full max-w-[400px]">
                <View className="bg-white rounded-2xl w-full gap-5 relative my-6">
                  <Image
                    source={images.background}
                    className="w-full h-full absolute opacity-10"
                    resizeMode="cover"
                  />
                  <View className="p-6">
                    <Text className="text-black text-center font-psemibold text-2xl mb-6">
                      Complete your account
                    </Text>
                    {success ? (
                      <View className="flex-1 items-center justify-center">
                        <SuccessAlert message={success} />
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
                            >
                              <ButtonText className="font-psemibold">
                                {isLoading ? "Updating..." : "Update"}
                              </ButtonText>
                              {isLoading && <ButtonSpinner color="#fff" />}
                            </Button>
                          )}
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default CompleteAccount;
