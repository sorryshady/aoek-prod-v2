import {
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  SelectDragIndicatorWrapper,
  SelectBackdrop,
  Select,
  SelectInput,
  SelectPortal,
  SelectTrigger,
  SelectContent,
  SelectDragIndicator,
  SelectItem,
  VStack,
  Textarea,
  TextareaInput,
  Spinner,
} from "@/components/ui";
import { useGlobalContext } from "@/context/global-provider";
import { router } from "expo-router";
import { getToken } from "@/lib/handle-session-tokens";
import GradientBackground from "@/components/gradient-background";
import ProfileImagePicker from "@/components/profile-image-picker";
import ShowRequestStatus from "@/components/show-request-status";
import { hideUserRequest } from "@/api/user";
import { changeTypeToText } from "@/lib/utils";
import { District } from "@/constants/types";
import ErrorAlert from "@/components/error-alert";
import ChangePasswordModal from "@/components/change-password-modal";
import SubmitRequestModal from "@/components/submit-request-modal";

const Profile = () => {
  const { user, logout, refetchData, latestRequest, isLoading } =
    useGlobalContext();
  const [error, setError] = useState<string | null>(null);
  const [logginOut, setLogginOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    personalAddress: "",
    phoneNumber: "",
    mobileNumber: "",
    homeDistrict: "",
  });

  useEffect(() => {
    if (user) {
      if (
        !user.dob ||
        !user.email ||
        !user.mobileNumber ||
        !user.gender ||
        !user.bloodGroup ||
        !user.personalAddress ||
        (user.userStatus === "WORKING" && !user.workDistrict) ||
        (user.userStatus === "RETIRED" && !user.retiredDepartment)
      ) {
        router.push("/complete-account");
      }
      setFormData({
        personalAddress: user.personalAddress || "",
        phoneNumber: user.phoneNumber || "",
        mobileNumber: user.mobileNumber || "",
        homeDistrict: user.homeDistrict || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    const hasChanges =
      formData.personalAddress !== user?.personalAddress ||
      formData.homeDistrict !== user?.homeDistrict ||
      formData.phoneNumber !== user?.phoneNumber ||
      formData.mobileNumber !== user?.mobileNumber;

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const token = await getToken({ key: "session" });
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            membershipId: user?.membershipId,
            personalAddress: formData.personalAddress,
            homeDistrict: formData.homeDistrict,
            phoneNumber: formData.phoneNumber,
            mobileNumber: formData.mobileNumber,
          }),
        },
      );
      const data = await response.json();
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (response.ok) {
        await refetchData();
        setIsEditing(false);
      } else {
        setError("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchData();
    } finally {
      setRefreshing(false);
    }
  }, [refetchData]);

  const openPasswordModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => {
      setPasswordModalVisible(true);
    }, 500);
  }, []);

  const openRequestModal = useCallback(() => {
    if (latestRequest?.status === "PENDING") return;
    setModalVisible(false);
    setTimeout(() => {
      setRequestModalVisible(true);
    }, 500);
  }, [latestRequest]);

  const handleImageSelected = async (uri: string) => {
    if (uri) {
      onRefresh();
    }
  };

  if (isLoading && !user) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <View className="flex-1 justify-center items-center">
            <Spinner color="white" size="large" />
            <Text className="text-white text-2xl mt-4">
              Loading, please wait...
            </Text>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }
  if (logginOut) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <View className="flex-1 justify-center items-center">
            <Spinner color="white" size="large" />
            <Text className="text-white text-2xl mt-4">
              Logging out, please wait...
            </Text>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <ScrollView
          className="flex-1 px-4 pt-6 pb-0"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.OS === "ios" ? 90 : 0,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5386A4"
              colors={["#5386A4"]}
            />
          }
        >
          <View className="flex-1 my-[3rem]">
            <Text className="text-2xl font-pbold mb-3 text-white text-center">
              Your Profile
            </Text>

            {/* Profile Header */}
            <ProfileImagePicker
              currentPhotoUrl={user?.photoUrl || null}
              onImageSelected={handleImageSelected}
              name={user?.name || ""}
              createdAt={
                user?.createdAt ? new Date(user.createdAt).toISOString() : ""
              }
            />

            {latestRequest && latestRequest.showAgain && (
              <ShowRequestStatus
                latestRequest={latestRequest}
                hideUserRequest={hideUserRequest}
              />
            )}

            {/* Actions */}
            <View className="mb-5">
              <Button
                className="bg-[#5386A4] w-full px-4"
                onPress={() => setModalVisible(true)}
              >
                <ButtonText>Actions</ButtonText>
              </Button>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View className="flex-1 justify-end bg-black/50">
                  <View className="bg-white rounded-t-3xl p-6">
                    <Text className="text-xl font-pbold text-center mb-6">
                      Actions
                    </Text>
                    <View className="gap-4">
                      <Button
                        className="bg-[#5386A4] w-full px-4"
                        onPress={openPasswordModal}
                      >
                        <ButtonText>Change Password</ButtonText>
                      </Button>
                      {user?.userStatus === "WORKING" && (
                        <Button
                          action={
                            latestRequest?.status === "PENDING"
                              ? "secondary"
                              : "primary"
                          }
                          isDisabled={latestRequest?.status === "PENDING"}
                          className={`w-full px-4 ${latestRequest?.status !== "PENDING" ? "bg-[#5386A4]" : ""}`}
                          onPress={openRequestModal}
                        >
                          <ButtonText>
                            {latestRequest?.status === "PENDING"
                              ? "Pending Request"
                              : "Submit Request"}
                          </ButtonText>
                        </Button>
                      )}
                      <Button
                        onPress={() => setModalVisible(false)}
                        action="secondary"
                      >
                        <ButtonText>Cancel</ButtonText>
                      </Button>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            {/* Personal Info Section */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-pbold text-white">
                  Personal Info
                </Text>
              </View>

              <View className="bg-gray-50 rounded-xl p-4 space-y-4">
                <InfoRow
                  label="Date of Birth"
                  value={new Date(user?.dob!).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                />
                <InfoRow
                  label="Gender"
                  value={changeTypeToText(user?.gender || "")}
                />
                <InfoRow
                  label="Blood Group"
                  value={changeTypeToText(user?.bloodGroup || "")}
                />
                <InfoRow
                  label="User Role"
                  value={changeTypeToText(user?.userRole || "")}
                />
                <InfoRow
                  label="Membership ID"
                  value={user?.membershipId?.toString() || "N/A"}
                />
              </View>
            </View>
            {/* Work Info Section */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-pbold text-white">
                  Employment Information
                </Text>
              </View>

              <View className="bg-gray-50 rounded-xl p-4 space-y-4">
                <InfoRow
                  label="Status"
                  value={changeTypeToText(user?.userStatus || "")}
                />
                {user?.userStatus === "WORKING" ? (
                  <>
                    <InfoRow label="Department" value={user?.department} />
                    <InfoRow
                      label="Designation"
                      value={changeTypeToText(user?.designation || "")}
                    />
                    <InfoRow
                      label="Work District"
                      value={changeTypeToText(user?.workDistrict || "")}
                    />
                    <InfoRow
                      label="Office Address"
                      value={user?.officeAddress}
                    />
                  </>
                ) : (
                  <InfoRow
                    label="Retired Department"
                    value={user?.retiredDepartment}
                  />
                )}
              </View>
            </View>
            {/* Other Information */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-pbold text-white">
                  Other Information
                </Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4 space-y-4">
                <InfoRow
                  label="Committee Member"
                  value={changeTypeToText(user?.committeeType || "")}
                />
                <InfoRow
                  label="State Position"
                  value={changeTypeToText(user?.positionState || "")}
                />
                <InfoRow
                  label="District Position"
                  value={changeTypeToText(user?.positionDistrict || "")}
                />
              </View>
            </View>
            {/* Permanent Address Section */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-pbold text-white">
                  Permanent Address
                </Text>
                {!isEditing && (
                  <Button
                    variant="link"
                    className="mr-2"
                    onPress={() => {
                      if (isEditing) {
                        handleSave();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    <ButtonText className="text-[#FACE30] text-lg">
                      Edit
                    </ButtonText>
                  </Button>
                )}
              </View>
              <View className="bg-gray-50 rounded-xl p-4 space-y-4">
                {isEditing ? (
                  <VStack space="md">
                    <FormControl>
                      <FormControlLabel>
                        <FormControlLabelText>
                          Permanent Address
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Textarea>
                        <TextareaInput
                          placeholder="Enter your address"
                          value={formData.personalAddress}
                          onChangeText={(text) =>
                            setFormData((prev) => ({
                              ...prev,
                              personalAddress: text,
                            }))
                          }
                        />
                      </Textarea>
                    </FormControl>
                    <FormControl>
                      <FormControlLabel>
                        <FormControlLabelText>
                          Home District
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Select
                        selectedValue={
                          formData.homeDistrict
                            ? changeTypeToText(formData.homeDistrict)
                            : ""
                        }
                        onValueChange={(value) => {
                          setFormData({
                            ...formData,
                            homeDistrict: value as District,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectInput placeholder="Select district" />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            <SelectDragIndicatorWrapper>
                              <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {Object.values(District).map((district) => (
                              <SelectItem
                                key={district}
                                label={changeTypeToText(district)}
                                value={district}
                              />
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </VStack>
                ) : (
                  <>
                    <InfoRow
                      label="Permanent Address"
                      value={user?.personalAddress}
                    />
                    <InfoRow
                      label="Home District"
                      value={changeTypeToText(user?.homeDistrict || "")}
                    />
                  </>
                )}
              </View>
            </View>
            {/* Contact Information Section */}
            <View className="mb-6">
              <Text className="text-lg font-pbold text-white mb-4">
                Contact Information
              </Text>
              <View className="bg-gray-50 rounded-xl p-4 space-y-4">
                <InfoRow label="Email" value={user?.email} />
                {isEditing ? (
                  <VStack space="md">
                    <FormControl>
                      <FormControlLabel>
                        <FormControlLabelText>
                          Phone Number
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          keyboardType="phone-pad"
                          placeholder="Enter phone number"
                          value={formData.phoneNumber}
                          onChangeText={(text) =>
                            setFormData((prev) => ({
                              ...prev,
                              phoneNumber: text,
                            }))
                          }
                        />
                      </Input>
                    </FormControl>
                    <FormControl>
                      <FormControlLabel>
                        <FormControlLabelText>
                          Mobile Number
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          keyboardType="phone-pad"
                          placeholder="Enter mobile number"
                          value={formData.mobileNumber}
                          onChangeText={(text) =>
                            setFormData((prev) => ({
                              ...prev,
                              mobileNumber: text,
                            }))
                          }
                        />
                      </Input>
                    </FormControl>
                  </VStack>
                ) : (
                  <>
                    <InfoRow label="Phone Number" value={user?.phoneNumber} />
                    <InfoRow label="Mobile Number" value={user?.mobileNumber} />
                  </>
                )}
              </View>
            </View>

            {isEditing && (
              <View className="mb-6 gap-5">
                {error && <ErrorAlert error={error} />}
                <Button onPress={handleSave} className="bg-[#5386A4] w-full">
                  <ButtonText>
                    {saving ? "Saving..." : "Save Changes"}
                  </ButtonText>
                </Button>
                <Button
                  action="secondary"
                  onPress={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                  className="bg-gray-200 w-full"
                >
                  <ButtonText className="text-gray-700 font-pmedium">
                    Cancel
                  </ButtonText>
                </Button>
              </View>
            )}
            <Button
              onPress={() => {
                setLogginOut(true);
                logout();
              }}
              action="negative"
            >
              <ButtonText>Logout</ButtonText>
            </Button>
          </View>
        </ScrollView>
        {passwordModalVisible && (
          <ChangePasswordModal
            visible={passwordModalVisible}
            onClose={() => setPasswordModalVisible(false)}
          />
        )}
        {user && user.userStatus === "WORKING" && (
          <SubmitRequestModal
            visible={requestModalVisible}
            onClose={() => setRequestModalVisible(false)}
          />
        )}
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Profile;

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <View className="flex-1 gap-1 my-1">
    <Text className="text-gray-500 text-sm font-pmedium">{label}</Text>
    <Text className="font-pmedium text-wrap">{value || "N/A"}</Text>
  </View>
);
