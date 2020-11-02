import { helpers } from "vuelidate/lib/validators";
export function isNameJoe(value) {
  return value === "Joe";
}

export function notGmail(value = "") {
  return !value.includes("gmail");
}

export function isEmailAvailable(value) {
  if (value === "") return true;

  return new Promise((resolve, reject) => {
    console.log(reject);
    setTimeout(() => {
      resolve(value.length > 10);
    }, 500);
  });
}
export function isDate(value) {
  if (!value) return true;
  var d = new Date(value)
  if (d.getTime() === d.getTime()) return true;
  return false;
}

export function isEmail(email) {
  const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  return emailRegex.test(email);
}

export function isPositiveIntegerNumber(value) {
  if (value == null || value == "" || typeof value != 'string') return true;
  var numbers = /^[+-]?\d+$/;
  if(!value.match(numbers)) {
    return false
  }
  let floatValue = parseFloat(value);
  return floatValue >= 0
}

export function isPositiveDecimalNumber(value) {
  if (value == null || value == "" || typeof value != 'string' ) return true;
  var numbers = /^[+-]?\d+(\.\d+)?$/;
  if(!value.match(numbers)) {
    return false
  }
  let floatValue = parseFloat(value);
  return floatValue >= 0
}


export const notAllowField = (key) => helpers.withParams(
  { type: 'notAllowField', key: key },
  (value, vm) => {
    if (vm[key] && value) {
      return false;
    }
     return true;
  }
)
export const matchRegex = (message, regexString) =>
  helpers.withParams({ message: message }, 
    (value) => 
    {
      return !helpers.req(value) || value.toString().match(new RegExp(regexString)) != null
    }
  )

export const max = (value) => {
  return (value <= 50000); 
}

export const isValidDocumentLabel = (value) => {
  for (var char of value) {
    if(!char.match(/^[0-9a-z-]+$/)) {
      return false
    }
  } 
  return true
}