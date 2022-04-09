export const emailValidator = email => {
  const regex = /^([a-z0-9.-]+)@([a-z0-9-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  return regex.test(email);
};

export const firstNameValidator = firstName => {
  const regex = /[a-zA-Z]{5,10}/i;
  return regex.test(firstName);
};

export const phoneNumberValidator = lastName => {};

export const generalNonEmptyValidator = text => {
  const regex = /^$|\s+/;
  return !regex.test(text);
};

export const passwordValidator = password => {
  const regex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
  return regex.test(password);
};
