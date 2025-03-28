import { ref, watch } from "vue";
import { useStorage } from "@vueuse/core";
const user = ref(null);

const runtimeData = {
  auth: ref(),
  user: ref({} as any),
  token: ref(""),
  // tempOtp: ref(''),
};
const localStorageData = {
  auth: ref(),
  user: useStorage("user", {} as any),
  token: useStorage("token", ""),
  // tempOtp: useStorage('tempOtp', '')
};

const error = ref<string | null>(null);

// Guard against null or undefined runtimeData.user.value
watch(
  runtimeData.user,
  (val) => {
    if (val && typeof val === "object") {
      Object.keys(val).forEach((key) => {
        localStorageData.user.value[key] = val[key];
      });
    }
  },
  { deep: true }
);

(() => {
  runtimeData.auth.value = localStorageData.auth.value;
  runtimeData.user.value = localStorageData.user.value;
  runtimeData.token.value = localStorageData.token.value;
})();

export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL as string;

export const useUser = () => {
  const id = computed({
    get: () => runtimeData?.auth?.value?.id ?? "",
    set: () => {},
  });


  const isLoggedIn = computed({
    get: () => {
      if (!runtimeData.token?.value) return false;
      return (
        runtimeData?.user?.value != null &&
        typeof runtimeData.user.value === "object"
      );
    },
    set: () => {},
  });

  const isEmailVerified = computed(() => {
    return runtimeData?.user?.value.isEmailVerified;
  });

  const logOut = () => {
    localStorage.clear();
    runtimeData.user.value = null;
    location.href = '/tenant/login'
  };

  const setToken = (token: string) => {
    runtimeData.token.value = token;
    localStorageData.token.value = token;
  };
  const createUser = (user: any) => {
    localStorageData.user.value = user?.data.vendor || user?.data.customer;
    runtimeData.user.value = user?.data.vendor || user?.data.customer;

    runtimeData.token.value = user?.data.token;
    localStorageData.token.value = user?.data.token;
  };

  // const updateUser = (user: any) => {
  //   runtimeData.user.value = user;
  //   localStorage.setItem('user', JSON.stringify(user));
  //   localStorageData.user.value = user;
  // };
  const updateUser = (newUser: any) => {
    // Retrieve the existing user data from local storage
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    // Merge the existing user data with the new user data
    const updatedUser = { ...existingUser, ...newUser };
  
    // Update the runtimeData and localStorage with the new user data
    runtimeData.user.value = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorageData.user.value = updatedUser;
  };

  return {
    id,
    isLoggedIn,
    isEmailVerified,
    createUser,
    ...runtimeData,
    logOut,
    updateUser,
    setToken
  };
};
