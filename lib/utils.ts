export const changeTypeToText = (value: string) => {
    const words = value.toLowerCase().split("_").join(" ").split(" ");
    const capitalizedWords = words.map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  export const isValidDate = (dateString: string) => {
    const regex1 = /^\d{2}\/\d{2}\/\d{4}$/; // Format: DD/MM/YYYY
    const regex2 = /^\d{2}-\d{2}-\d{4}$/; // Format: DD-MM-YYYY
    if (!regex1.test(dateString) && !regex2.test(dateString)) return false;

    const separator = dateString.includes("/") ? "/" : "-";
    const [day, month, year] = dateString.split(separator).map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

export const isValidMobileNumber = (mobileNumber: string) => {
  const regex = /^[6-9]\d{9}$/; // Indian mobile numbers start with 6-9 and are 10 digits long
  return regex.test(mobileNumber);
};

export const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhoneNumber = (phoneNumber: string) => {
  const regexMobile = /^\d{10,11}$/; // Validates 10-digit mobile numbers
  const regexLandline = /^\d{3,4}-\d{7}$/; // Validates landline numbers with a 3 or 4 digit area code followed by 7 digits
  return regexMobile.test(phoneNumber) || regexLandline.test(phoneNumber);
};

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

export function formatDateRange(startDate: string, endDate?: string) {
    const start = formatDate(startDate);
    if (!endDate || startDate === endDate) {
      return start;
    }
    return `${start} - ${formatDate(endDate)}`;
  }
