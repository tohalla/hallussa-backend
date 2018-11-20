export const formatPhone = (phone?: string) =>
  phone && phone.replace(/[ \s\(\).-]*/g, "");
