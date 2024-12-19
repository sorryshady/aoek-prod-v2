import AsyncStorage from "@react-native-async-storage/async-storage";

interface SetToken {
  key: string;
  value: string;
}
export const setToken = async ({ key, value }: SetToken) => {
  await AsyncStorage.setItem(key, value);
};

interface GetRemoveToken {
  key: string;
}
export const getToken = async ({ key }: GetRemoveToken) => {
  return await AsyncStorage.getItem(key);
};

export const removeToken = async ({ key }: GetRemoveToken) => {
  await AsyncStorage.removeItem(key);
}
