import {
  FormControl,
  VStack,
  FormControlLabelText,
  FormControlLabel,
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
  Textarea,
  TextareaInput,
} from "./ui";
import React from "react";
import {
  Department,
  Designation,
  District,
  RegisterFormErrors,
  UserStatus,
} from "@/constants/types";
import { RegisterFormData } from "@/constants/types";
import { changeTypeToText } from "@/lib/utils";

interface ProfessionalFormProps {
  formData: RegisterFormData;
  setFormData: (data: RegisterFormData) => void;
  errors: RegisterFormErrors;
  setErrors: (errors: RegisterFormErrors) => void;
}
const ProfessionalForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
}: ProfessionalFormProps) => {
  return (
    <VStack className="gap-4">
      <FormControl isInvalid={!!errors.userStatus}>
        <FormControlLabel>
          <FormControlLabelText>User Status</FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={
            formData.userStatus ? changeTypeToText(formData.userStatus) : ""
          }
          onValueChange={(value) => {
            setFormData({ ...formData, userStatus: value as UserStatus });
            if (errors.userStatus)
              setErrors({ ...errors, userStatus: undefined });
          }}
        >
          <SelectTrigger>
            <SelectInput placeholder="Select user status" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Working" value="WORKING" />
              <SelectItem label="Retired" value="RETIRED" />
            </SelectContent>
          </SelectPortal>
        </Select>
        {errors.userStatus && (
          <FormControlError>
            <FormControlErrorText>{errors.userStatus}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
      {formData.userStatus === "WORKING" && (
        <>
          <FormControl isInvalid={!!errors.department}>
            <FormControlLabel>
              <FormControlLabelText>Department</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={formData.department}
              onValueChange={(value) => {
                setFormData({ ...formData, department: value as Department });
                if (errors.department)
                  setErrors({ ...errors, department: undefined });
              }}
            >
              <SelectTrigger>
                <SelectInput placeholder="Select department" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {Object.values(Department).map((department) => (
                    <SelectItem
                      key={department}
                      label={department}
                      value={department}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
            {errors.department && (
              <FormControlError>
                <FormControlErrorText>{errors.department}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.designation}>
            <FormControlLabel>
              <FormControlLabelText>Designation</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={
                formData.designation
                  ? changeTypeToText(formData.designation)
                  : ""
              }
              onValueChange={(value) => {
                setFormData({ ...formData, designation: value as Designation });
                if (errors.designation)
                  setErrors({ ...errors, designation: undefined });
              }}
            >
              <SelectTrigger>
                <SelectInput placeholder="Select designation" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {Object.values(Designation).map((designation) => (
                    <SelectItem
                      key={designation}
                      label={changeTypeToText(designation)}
                      value={designation}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
            {errors.designation && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.designation}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.workDistrict}>
            <FormControlLabel>
              <FormControlLabelText>Office District</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={
                formData.workDistrict
                  ? changeTypeToText(formData.workDistrict)
                  : ""
              }
              onValueChange={(value) => {
                setFormData({ ...formData, workDistrict: value as District });
                if (errors.workDistrict)
                  setErrors({ ...errors, workDistrict: undefined });
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
            {errors.workDistrict && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.workDistrict}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.officeAddress}>
            <FormControlLabel>
              <FormControlLabelText>Office Address</FormControlLabelText>
            </FormControlLabel>
            <Textarea>
              <TextareaInput
                value={formData.officeAddress}
                onChangeText={(value) => {
                  setFormData({ ...formData, officeAddress: value });
                  if (errors.officeAddress)
                    setErrors({ ...errors, officeAddress: undefined });
                }}
                placeholder="Enter your office address"
              />
            </Textarea>
          </FormControl>
        </>
      )}
      {formData.userStatus === "RETIRED" && (
        <FormControl isInvalid={!!errors.retiredDepartment}>
          <FormControlLabel>
            <FormControlLabelText>Retired Department</FormControlLabelText>
          </FormControlLabel>
          <Select
            selectedValue={formData.retiredDepartment}
            onValueChange={(value) => {
              setFormData({
                ...formData,
                retiredDepartment: value as Department,
              });
              if (errors.retiredDepartment)
                setErrors({ ...errors, retiredDepartment: undefined });
            }}
          >
            <SelectTrigger>
              <SelectInput placeholder="Select department" />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {Object.values(Department).map((department) => (
                  <SelectItem
                    key={department}
                    label={department}
                    value={department}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
          {errors.retiredDepartment && (
            <FormControlError>
              <FormControlErrorText>
                {errors.retiredDepartment}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      )}
    </VStack>
  );
};

export default ProfessionalForm;
