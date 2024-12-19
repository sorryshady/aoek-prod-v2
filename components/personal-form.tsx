import React from "react";

import {
  FormControl,
  VStack,
  FormControlLabelText,
  FormControlLabel,
  Input,
  InputField,
  FormControlError,
  FormControlErrorText,
  Select,
  SelectTrigger,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  SelectInput,
} from "./ui";
import {
  BloodGroup,
  Gender,
  RegisterFormData,
  RegisterFormErrors,
} from "@/constants/types";

interface PersonalFormProps {
  formData: RegisterFormData;
  setFormData: (data: RegisterFormData) => void;
  errors: RegisterFormErrors;
  setErrors: (errors: RegisterFormErrors) => void;
}
const PersonalForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
}: PersonalFormProps) => {
  return (
    <VStack className="gap-4">
      <FormControl isInvalid={!!errors.fullName}>
        <FormControlLabel>
          <FormControlLabelText>Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={formData.fullName}
            onChangeText={(value) => {
              setFormData({ ...formData, fullName: value });
              if (errors.fullName)
                setErrors({ ...errors, fullName: undefined });
            }}
            placeholder="Enter your name"
          />
        </Input>
        {errors.fullName && (
          <FormControlError>
            <FormControlErrorText>{errors.fullName}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.dob}>
        <FormControlLabel>
          <FormControlLabelText>Date of Birth</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={formData.dob}
            onChangeText={(value) => {
              setFormData({ ...formData, dob: value });
              if (errors.dob) setErrors({ ...errors, dob: undefined });
            }}
            placeholder="Enter your date of birth"
            keyboardType="numeric"
          />
        </Input>
        {errors.dob && (
          <FormControlError>
            <FormControlErrorText>{errors.dob}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.gender}>
        <FormControlLabel>
          <FormControlLabelText>Gender</FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={formData.gender}
          onValueChange={(value) => {
            setFormData({ ...formData, gender: value as Gender });
            if (errors.gender) setErrors({ ...errors, gender: undefined });
          }}
        >
          <SelectTrigger>
            <SelectInput placeholder="Select gender" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Male" value="MALE" />
              <SelectItem label="Female" value="FEMALE" />
              <SelectItem label="Other" value="OTHER" />
            </SelectContent>
          </SelectPortal>
        </Select>
        {errors.gender && (
          <FormControlError>
            <FormControlErrorText>{errors.gender}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.bloodGroup}>
        <FormControlLabel>
          <FormControlLabelText>Blood Group</FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={formData.bloodGroup}
          onValueChange={(value) => {
            setFormData({ ...formData, bloodGroup: value as BloodGroup });
            if (errors.bloodGroup)
              setErrors({ ...errors, bloodGroup: undefined });
          }}
        >
          <SelectTrigger>
            <SelectInput placeholder="Select blood group" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {Object.values(BloodGroup).map((group) => (
                <SelectItem
                  key={group}
                  label={group.replace("_POS", " +ve").replace("_NEG", " -ve")}
                  value={group}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
        {errors.bloodGroup && (
          <FormControlError>
            <FormControlErrorText>{errors.bloodGroup}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
    </VStack>
  );
};

export default PersonalForm;
