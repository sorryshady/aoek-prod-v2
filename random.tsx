// import React, { useState } from "react";
// import {
//   Alert,
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import {
//   Button,
//   ButtonText,
//   ButtonSpinner,
//   FormControl,
//   FormControlLabel,
//   FormControlLabelText,
//   FormControlError,
//   FormControlErrorText,
//   Input,
//   InputField,
//   Textarea,
//   TextareaInput,
//   Select,
//   SelectTrigger,
//   SelectInput,
//   SelectPortal,
//   SelectBackdrop,
//   SelectContent,
//   SelectDragIndicatorWrapper,
//   SelectDragIndicator,
//   SelectItem,
//   HStack,
//   VStack,
// } from "@/components/ui";

// type FormData = {
//   // Stage 1: Personal Details
//   name: string;
//   gender: string;
//   bloodGroup: string;
//   email: string;
//   // Stage 2: Contact
//   address: string;
//   phoneNumber: string;
//   // Stage 3: Other
//   additionalInfo: string;
// };

// type FormErrors = {
//   [K in keyof FormData]?: string;
// };

// const STAGES = [
//   "Personal Details",
//   "Contact Information",
//   "Additional Information",
// ];
// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// export default function Index() {
//   const [currentStage, setCurrentStage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     gender: "",
//     bloodGroup: "",
//     email: "",
//     address: "",
//     phoneNumber: "",
//     additionalInfo: "",
//   });
//   const [errors, setErrors] = useState<FormErrors>({});

//   const validateStage = (): boolean => {
//     const newErrors: FormErrors = {};

//     switch (currentStage) {
//       case 0: // Personal Details
//         if (!formData.name.trim()) newErrors.name = "Name is required";
//         if (!formData.gender) newErrors.gender = "Gender is required";
//         if (!formData.bloodGroup)
//           newErrors.bloodGroup = "Blood group is required";
//         if (!formData.email.trim()) {
//           newErrors.email = "Email is required";
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//           newErrors.email = "Please enter a valid email";
//         }
//         break;
//       case 1: // Contact
//         if (!formData.address.trim()) newErrors.address = "Address is required";
//         if (!formData.phoneNumber.trim()) {
//           newErrors.phoneNumber = "Phone number is required";
//         } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
//           newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
//         }
//         break;
//       case 2: // Additional Info
//         if (!formData.additionalInfo.trim()) {
//           newErrors.additionalInfo = "Additional information is required";
//         }
//         break;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStage()) {
//       setCurrentStage((prev) => Math.min(prev + 1, STAGES.length - 1));
//     }
//   };

//   const handlePrevious = () => {
//     setCurrentStage((prev) => Math.max(prev - 1, 0));
//   };

//   const handleSubmit = async () => {
//     if (!validateStage()) {
//       Alert.alert("Error", "Please fix the errors before submitting");
//       return;
//     }

//     setLoading(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Form submitted:", formData);
//       Alert.alert("Success", "Registration completed successfully!");
//       // Reset form
//       setFormData({
//         name: "",
//         gender: "",
//         bloodGroup: "",
//         email: "",
//         address: "",
//         phoneNumber: "",
//         additionalInfo: "",
//       });
//       setCurrentStage(0);
//     } catch (error) {
//       Alert.alert("Error", "Failed to submit form. Please try again.");
//       console.error("Form submission error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStageIndicators = () => (
//     <HStack className="justify-between mb-6">
//       {STAGES.map((stage, index) => (
//         <View key={stage} className="flex-1 items-center">
//           <View
//             className={`w-8 h-8 rounded-full items-center justify-center ${
//               index === currentStage
//                 ? "bg-blue-500"
//                 : index < currentStage
//                   ? "bg-green-500"
//                   : "bg-gray-300"
//             }`}
//           >
//             <Text className="text-white">{index + 1}</Text>
//           </View>
//           <Text className="text-xs mt-1">{stage}</Text>
//         </View>
//       ))}
//     </HStack>
//   );

//   const renderCurrentStage = () => {
//     switch (currentStage) {
//       case 0:
//         return (
//           <VStack className="gap-4">
//             <FormControl isInvalid={!!errors.name}>
//               <FormControlLabel>
//                 <FormControlLabelText>Name</FormControlLabelText>
//               </FormControlLabel>
//               <Input>
//                 <InputField
//                   value={formData.name}
//                   onChangeText={(value) => {
//                     setFormData({ ...formData, name: value });
//                     if (errors.name) setErrors({ ...errors, name: undefined });
//                   }}
//                   placeholder="Enter your name"
//                 />
//               </Input>
//               {errors.name && (
//                 <FormControlError>
//                   <FormControlErrorText>{errors.name}</FormControlErrorText>
//                 </FormControlError>
//               )}
//             </FormControl>

//             <FormControl isInvalid={!!errors.gender}>
//               <FormControlLabel>
//                 <FormControlLabelText>Gender</FormControlLabelText>
//               </FormControlLabel>
//               <Select
//                 selectedValue={formData.gender}
//                 onValueChange={(value) => {
//                   setFormData({ ...formData, gender: value });
//                   if (errors.gender)
//                     setErrors({ ...errors, gender: undefined });
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectInput placeholder="Select gender" />
//                 </SelectTrigger>
//                 <SelectPortal>
//                   <SelectBackdrop />
//                   <SelectContent>
//                     <SelectDragIndicatorWrapper>
//                       <SelectDragIndicator />
//                     </SelectDragIndicatorWrapper>
//                     <SelectItem label="Male" value="male" />
//                     <SelectItem label="Female" value="female" />
//                     <SelectItem label="Other" value="other" />
//                   </SelectContent>
//                 </SelectPortal>
//               </Select>
//               {errors.gender && (
//                 <FormControlError>
//                   <FormControlErrorText>{errors.gender}</FormControlErrorText>
//                 </FormControlError>
//               )}
//             </FormControl>

//             <FormControl isInvalid={!!errors.bloodGroup}>
//               <FormControlLabel>
//                 <FormControlLabelText>Blood Group</FormControlLabelText>
//               </FormControlLabel>
//               <Select
//                 selectedValue={formData.bloodGroup}
//                 onValueChange={(value) => {
//                   setFormData({ ...formData, bloodGroup: value });
//                   if (errors.bloodGroup)
//                     setErrors({ ...errors, bloodGroup: undefined });
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectInput placeholder="Select blood group" />
//                 </SelectTrigger>
//                 <SelectPortal>
//                   <SelectBackdrop />
//                   <SelectContent>
//                     <SelectDragIndicatorWrapper>
//                       <SelectDragIndicator />
//                     </SelectDragIndicatorWrapper>
//                     {BLOOD_GROUPS.map((group) => (
//                       <SelectItem
//                         key={group}
//                         label={group}
//                         value={group.toLowerCase()}
//                       />
//                     ))}
//                   </SelectContent>
//                 </SelectPortal>
//               </Select>
//               {errors.bloodGroup && (
//                 <FormControlError>
//                   <FormControlErrorText>
//                     {errors.bloodGroup}
//                   </FormControlErrorText>
//                 </FormControlError>
//               )}
//             </FormControl>

//             <FormControl isInvalid={!!errors.email}>
//               <FormControlLabel>
//                 <FormControlLabelText>Email</FormControlLabelText>
//               </FormControlLabel>
//               <Input>
//                 <InputField
//                   value={formData.email}
//                   onChangeText={(value) => {
//                     setFormData({ ...formData, email: value });
//                     if (errors.email)
//                       setErrors({ ...errors, email: undefined });
//                   }}
//                   placeholder="Enter your email"
//                   keyboardType="email-address"
//                 />
//               </Input>
//               {errors.email && (
//                 <FormControlError>
//                   <FormControlErrorText>{errors.email}</FormControlErrorText>
//                 </FormControlError>
//               )}
//             </FormControl>
//           </VStack>
//         );

//       case 1:
//         return (
//           <VStack className="gap-4">
//             <FormControl isInvalid={!!errors.address}>
//               <FormControlLabel>
//                 <FormControlLabelText>Address</FormControlLabelText>
//               </FormControlLabel>
//               <Textarea>
//                 <TextareaInput
//                   value={formData.address}
//                   onChangeText={(value) => {
//                     setFormData({ ...formData, address: value });
//                     if (errors.address)
//                       setErrors({ ...errors, address: undefined });
//                   }}
//                   placeholder="Enter your address"
//                 />
//               </Textarea>
//               {errors.address && (
//                 <FormControlError>
//                   <FormControlErrorText>{errors.address}</FormControlErrorText>
//                 </FormControlError>
//               )}
//             </FormControl>

//             <FormControl isInvalid={!!errors.phoneNumber}>
//               <FormControlLabel>
//                 <FormControlLabelText>Phone Number</FormControlLabelText>
//               </FormControlLabel>
//               <Input>
//                 <InputField
//                   value={formData.phoneNumber}
//                   onChangeText={(value) => {
//                     setFormData({ ...formData, phoneNumber: value });
//                     if (errors.phoneNumber)
//                       setErrors({ ...errors, phoneNumber: undefined });
//                   }}
//                   placeholder="Enter your phone number"
//                   keyboardType="numeric"
//                   maxLength={10}
//                 />
//               </Input>
//               {errors.phoneNumber && (
//                 <FormControlError>
//                   <FormControlErrorText>
//                     {errors.phoneNumber}
//                   </FormControlErrorText>
//                 </FormControlError>
//               )}
//             </FormControl>
//           </VStack>
//         );

//       case 2:
//         return (
//           <FormControl isInvalid={!!errors.additionalInfo}>
//             <FormControlLabel>
//               <FormControlLabelText>
//                 Additional Information
//               </FormControlLabelText>
//             </FormControlLabel>
//             <Textarea>
//               <TextareaInput
//                 value={formData.additionalInfo}
//                 onChangeText={(value) => {
//                   setFormData({ ...formData, additionalInfo: value });
//                   if (errors.additionalInfo)
//                     setErrors({ ...errors, additionalInfo: undefined });
//                 }}
//                 placeholder="Enter any additional information"
//               />
//             </Textarea>
//             {errors.additionalInfo && (
//               <FormControlError>
//                 <FormControlErrorText>
//                   {errors.additionalInfo}
//                 </FormControlErrorText>
//               </FormControlError>
//             )}
//           </FormControl>
//         );
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View className="flex-1 p-4 justify-center">
//             {renderStageIndicators()}

//             {renderCurrentStage()}

//             <HStack className="mt-6 justify-between">
//               {currentStage > 0 && (
//                 <Button
//                   variant="outline"
//                   onPress={handlePrevious}
//                   className="flex-1 mr-2"
//                 >
//                   <ButtonText>Previous</ButtonText>
//                 </Button>
//               )}

//               {currentStage < STAGES.length - 1 ? (
//                 <Button
//                   action="primary"
//                   onPress={handleNext}
//                   className="flex-1 ml-2"
//                 >
//                   <ButtonText>Next</ButtonText>
//                 </Button>
//               ) : (
//                 <Button
//                   action="primary"
//                   onPress={handleSubmit}
//                   disabled={loading}
//                   className="flex-1 ml-2"
//                 >
//                   <ButtonText>
//                     {loading ? "Submitting..." : "Submit"}
//                   </ButtonText>
//                   {loading && <ButtonSpinner />}
//                 </Button>
//               )}
//             </HStack>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
