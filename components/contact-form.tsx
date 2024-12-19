import { changeTypeToText } from "@/lib/utils";
import { District } from "@/constants/types";
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
  Textarea,
  TextareaInput,
} from "./ui";
import React from "react";

interface IContactFormProps {
  formData: any;
  setFormData: any;
  errors: any;
  setErrors: any;
}

const ContactForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
}: IContactFormProps) => {
  return (
    <VStack className="gap-4">
      <FormControl isInvalid={!!errors.personalAddress}>
        <FormControlLabel>
          <FormControlLabelText>Personal Address</FormControlLabelText>
        </FormControlLabel>
        <Textarea>
          <TextareaInput
            value={formData.personalAddress}
            onChangeText={(value) => {
              setFormData({ ...formData, personalAddress: value });
              if (errors.personalAddress)
                setErrors({ ...errors, personalAddress: undefined });
            }}
            placeholder="Enter your home address"
          />
        </Textarea>
        {errors.personalAddress && (
          <FormControlError>
            <FormControlErrorText>
              {errors.personalAddress}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.homeDistrict}>
        <FormControlLabel>
          <FormControlLabelText>Home District</FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={formData.homeDistrict ? changeTypeToText(formData.homeDistrict) : ""}
          onValueChange={(value) => {
            setFormData({ ...formData, homeDistrict: value as District });
            if (errors.homeDistrict)
              setErrors({ ...errors, homeDistrict: undefined });
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
        {errors.homeDistrict && (
          <FormControlError>
            <FormControlErrorText>{errors.homeDistrict}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.email}>
        <FormControlLabel>
          <FormControlLabelText>Email</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={formData.email}
            onChangeText={(value) => {
              setFormData({ ...formData, email: value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="Enter your email address"
          />
        </Input>
        {errors.email && (
          <FormControlError>
            <FormControlErrorText>{errors.email}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <FormControl isInvalid={!!errors.phoneNumber}>
        <FormControlLabel>
          <FormControlLabelText>Phone Number</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={formData.phoneNumber}
            onChangeText={(value) => {
              setFormData({ ...formData, phoneNumber: value });
              if (errors.phoneNumber)
                setErrors({ ...errors, phoneNumber: undefined });
            }}
            placeholder="Enter your phone number"
          />
        </Input>
      </FormControl>

      <FormControl isInvalid={!!errors.mobileNumber}>
        <FormControlLabel>
          <FormControlLabelText>Mobile Number</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={formData.mobileNumber}
            onChangeText={(value) => {
              setFormData({ ...formData, mobileNumber: value });
              if (errors.mobileNumber)
                setErrors({ ...errors, mobileNumber: undefined });
            }}
            placeholder="Enter your mobile number"
          />
        </Input>
        {errors.mobileNumber && (
          <FormControlError>
            <FormControlErrorText>{errors.mobileNumber}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
    </VStack>
  );
};

export default ContactForm;
