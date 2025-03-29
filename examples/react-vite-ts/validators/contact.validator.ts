const validators = {
  name: (value?: string) => {
    if (!value || value.length <= 1) {
      return ["Name is too short"];
    }
    return [];
  },
  email: (value?: string) => {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value || "")) {
      return ["Is not a valid email address"];
    }
    return [];
  },
  html: (value?: string) => {
    if (!value || value.length <= 5) {
      return ["Message is too short"];
    }
    return [];
  },
} as const;

export default validators;