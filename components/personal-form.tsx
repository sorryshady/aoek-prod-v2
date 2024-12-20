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
import { changeTypeToText } from "@/lib/utils";

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
      <FormControl isInvalid={!!errors.name}>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Name
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={formData.name}
            onChangeText={(value) => {
              setFormData({ ...formData, name: value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="Enter your name"
            className="font-pregular"
          />
        </Input>
        {errors.name && (
          <FormControlError>
            <FormControlErrorText className="font-pregular">
              {errors.name}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.dob}>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Date of Birth
          </FormControlLabelText>
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
            className="font-pregular"
          />
        </Input>
        {errors.dob && (
          <FormControlError>
            <FormControlErrorText className="font-pregular">
              {errors.dob}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.gender}>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Gender
          </FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={
            formData.gender ? changeTypeToText(formData.gender) : ""
          }
          onValueChange={(value) => {
            setFormData({ ...formData, gender: value as Gender });
            if (errors.gender) setErrors({ ...errors, gender: undefined });
          }}
          className="font-pregular"
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
            <FormControlErrorText className="font-pregular">
              {errors.gender}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.bloodGroup}>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Blood Group
          </FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={
            formData.bloodGroup
              ? formData.bloodGroup
                  .replace("_POS", " +ve")
                  .replace("_NEG", " -ve")
              : ""
          }
          onValueChange={(value) => {
            setFormData({ ...formData, bloodGroup: value as BloodGroup });
            if (errors.bloodGroup)
              setErrors({ ...errors, bloodGroup: undefined });
          }}
          className="font-pregular"
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
            <FormControlErrorText className="font-pregular">
              {errors.bloodGroup}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
    </VStack>
  );
};

export default PersonalForm;
