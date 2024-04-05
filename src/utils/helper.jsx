import CryptoJS from "crypto-js";
import {format} from "date-fns";
import Cookies from "js-cookie";
import moment from "moment";
import {useMemo} from "react";
import {APP_NAME, IS_APP_PRODUCTION} from "../constants/app";

const characterList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CookieList = ["accessToken", "refreshToken"];

export const toAbsoluteUrl = (pathname) => process.env.PUBLIC_URL + pathname;
export const toKhNumber = (param) => {
  let chars = "";
  const type = typeof param;
  if (type === "number") {
    const str = param.toString();
    for (let i = 0; i < str.length; i++) {
      let tmp = 0x17e0 + parseInt(str.charAt(i), 16);
      chars = chars + String.fromCharCode(tmp);
    }
  } else if (type === "string") {
    for (let i = 0; i < param.length; i++) {
      let tmp = param.charAt(i);
      let hex = parseInt(tmp, 16);
      if (isNaN(hex)) {
        chars = chars + tmp;
        continue;
      }
      tmp = 0x17e0 + parseInt(param.charAt(i), 16);
      chars = chars + String.fromCharCode(tmp);
    }
  }
  return chars;
};

export const useDateRange = (formMethods, dueDate, dateFrom, dateTo) => {
  let due = formMethods.watch(dueDate, undefined);

  useMemo(() => {
    if (due === null || due === undefined) {
      formMethods.setValue("dateFrom", "");
      formMethods.setValue("dateTo", "");
    } else if (due?.value === "next_30_days") {
      const today = new Date();
      const next30Days = new Date(today);

      next30Days.setDate(today.getDate() + 30);

      formMethods.setValue("dateFrom", today);
      formMethods.setValue("dateTo", next30Days);
    } else if (due?.value === "next_365_days") {
      const today = new Date();
      const next365Days = new Date(today);

      next365Days.setDate(today.getDate() + 365);

      formMethods.setValue("dateFrom", today);
      formMethods.setValue("dateTo", next365Days);
    } else if (due?.value === "next_week") {
      const today = new Date();
      const nextMonday = new Date(today);

      // Calculate the date of the next Monday
      const daysUntilNextMonday = (7 - today.getDay() + 1) % 7;
      nextMonday.setDate(today.getDate() + daysUntilNextMonday);

      // Calculate the date of the next Sunday (end of the week)
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);

      formMethods.setValue("dateFrom", nextMonday);
      formMethods.setValue("dateTo", nextSunday);
    } else if (due?.value === "next_4_weeks") {
      const today = new Date();

      // Calculate the date of the next Monday (start of the current week)
      const daysUntilNextMonday = (7 - today.getDay() + 1) % 7;
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilNextMonday);

      // Calculate the date four weeks later (Sunday)
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 27);

      formMethods.setValue("dateFrom", nextMonday);
      formMethods.setValue("dateTo", nextSunday);
    } else if (due?.value === "next_month") {
      const today = new Date();
      const nextMonth = new Date(today);

      // Calculate the start date of the next month (first day of the next month).
      nextMonth.setMonth(today.getMonth() + 1);
      nextMonth.setDate(1);

      // Calculate the end date of the next month (last day of the next month).
      const lastDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

      // Set dateFrom to the start date of the next month and dateTo to the end date of the next month.
      formMethods.setValue("dateFrom", nextMonth);
      formMethods.setValue("dateTo", lastDayOfNextMonth);
    } else if (due?.value === "next_quarter") {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index.

      let nextQuarterStart, nextQuarterEnd;

      if (currentMonth <= 2) {
        // If current month is in Q1, calculate next quarter as Q2 of the current year.
        nextQuarterStart = new Date(today.getFullYear(), 3, 1); // Q2 starts in April (month 3).
        nextQuarterEnd = new Date(today.getFullYear(), 5, 30); // Q2 ends in June (month 5).
      } else if (currentMonth <= 5) {
        // If current month is in Q2, calculate next quarter as Q3 of the current year.
        nextQuarterStart = new Date(today.getFullYear(), 6, 1); // Q3 starts in July (month 6).
        nextQuarterEnd = new Date(today.getFullYear(), 8, 30); // Q3 ends in September (month 8).
      } else if (currentMonth <= 8) {
        // If current month is in Q3, calculate next quarter as Q4 of the current year.
        nextQuarterStart = new Date(today.getFullYear(), 9, 1); // Q4 starts in October (month 9).
        nextQuarterEnd = new Date(today.getFullYear(), 11, 31); // Q4 ends in December (month 11).
      } else {
        // If current month is in Q4, calculate next quarter as Q1 of the next year.
        nextQuarterStart = new Date(today.getFullYear() + 1, 0, 1); // Q1 starts in January (month 0) of the next year.
        nextQuarterEnd = new Date(today.getFullYear() + 1, 2, 31); // Q1 ends in March (month 2) of the next year.
      }

      // Set dateFrom and dateTo values for "Next Quarter"
      formMethods.setValue("dateFrom", nextQuarterStart);
      formMethods.setValue("dateTo", nextQuarterEnd);
    } else if (due?.value === "next_year") {
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1); // Add 1 year to the current year.

      // Calculate the start date of the next year (January 1st of the next year).
      nextYear.setMonth(0);
      nextYear.setDate(1);

      // Calculate the end date of the next year (December 31st of the next year).
      const lastDayOfNextYear = new Date(nextYear.getFullYear(), 11, 31);

      // Set dateFrom to the start date of the next year and dateTo to the end date of the next year.
      formMethods.setValue("dateFrom", nextYear);
      formMethods.setValue("dateTo", lastDayOfNextYear);
    } else if (due?.value === "this_week_to_date") {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const daysUntilMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Adjust for Sunday being 0.
      const startDate = new Date(today);

      startDate.setDate(today.getDate() - daysUntilMonday);

      // Set dateFrom to the start of the current week (Monday) and dateTo to the current date.
      formMethods.setValue("dateFrom", startDate);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "this_month_to_date") {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      const startDate = new Date(currentYear, currentMonth, 1);

      formMethods.setValue("dateFrom", startDate);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "this_quarter") {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index.
      const currentYear = today.getFullYear();

      let thisQuarterStart, thisQuarterEnd;

      if (currentMonth <= 3) {
        // If current month is in Q1, calculate this quarter as Q1 of the current year.
        thisQuarterStart = new Date(currentYear, 0, 1); // Q1 starts in January (month 0).
        thisQuarterEnd = new Date(currentYear, 2, 31); // Q1 ends in March (month 2).
      } else if (currentMonth <= 6) {
        // If current month is in Q2, calculate this quarter as Q2 of the current year.
        thisQuarterStart = new Date(currentYear, 3, 1); // Q2 starts in April (month 3).
        thisQuarterEnd = new Date(currentYear, 5, 30); // Q2 ends in June (month 5).
      } else if (currentMonth <= 9) {
        // If current month is in Q3, calculate this quarter as Q3 of the current year.
        thisQuarterStart = new Date(currentYear, 6, 1); // Q3 starts in July (month 6).
        thisQuarterEnd = new Date(currentYear, 8, 30); // Q3 ends in September (month 8).
      } else {
        // If current month is in Q4, calculate this quarter as Q4 of the current year.
        thisQuarterStart = new Date(currentYear, 9, 1); // Q4 starts in October (month 9).
        thisQuarterEnd = new Date(currentYear, 11, 31); // Q4 ends in December (month 11).
      }

      // Set dateFrom and dateTo values for "This Quarter"
      formMethods.setValue("dateFrom", thisQuarterStart);
      formMethods.setValue("dateTo", thisQuarterEnd);
    } else if (due?.value === "this_quarter_to_date") {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index.
      const currentYear = today.getFullYear();

      let thisQuarterStart, thisQuarterEnd;

      if (currentMonth <= 3) {
        // If current month is in Q1, calculate this quarter as Q1 of the current year.
        thisQuarterStart = new Date(currentYear, 0, 1); // Q1 starts in January (month 0).
        thisQuarterEnd = today; // End date is the current date.
      } else if (currentMonth <= 6) {
        // If current month is in Q2, calculate this quarter as Q2 of the current year.
        thisQuarterStart = new Date(currentYear, 3, 1); // Q2 starts in April (month 3).
        thisQuarterEnd = today; // End date is the current date.
      } else if (currentMonth <= 9) {
        // If current month is in Q3, calculate this quarter as Q3 of the current year.
        thisQuarterStart = new Date(currentYear, 6, 1); // Q3 starts in July (month 6).
        thisQuarterEnd = today; // End date is the current date.
      } else {
        // If current month is in Q4, calculate this quarter as Q4 of the current year.
        thisQuarterStart = new Date(currentYear, 9, 1); // Q4 starts in October (month 9).
        thisQuarterEnd = today; // End date is the current date.
      }

      // Set dateFrom and dateTo values for "This Quarter to Date"
      formMethods.setValue("dateFrom", thisQuarterStart);
      formMethods.setValue("dateTo", thisQuarterEnd);
    } else if (due?.value === "this_year_to_date") {
      const today = new Date();
      const currentYear = today.getFullYear();

      const startDate = new Date(currentYear, 0, 1);

      formMethods.setValue("dateFrom", startDate);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "last_year") {
      const today = new Date();
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);

      formMethods.setValue("dateFrom", lastYearStart);
      formMethods.setValue("dateTo", lastYearEnd);
    } else if (due?.value === "last_year_to_date") {
      const today = new Date();
      const currentYear = today.getFullYear();
      const lastYearStart = new Date(currentYear - 1, 0, 1);

      formMethods.setValue("dateFrom", lastYearStart);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "last_30_days") {
      const today = new Date();
      const last30DaysStart = new Date(today);

      last30DaysStart.setDate(today.getDate() - 30);

      formMethods.setValue("dateFrom", last30DaysStart);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "last_365_days") {
      const today = new Date();
      const last365DaysStart = new Date(today);

      last365DaysStart.setDate(today.getDate() - 365);

      formMethods.setValue("dateFrom", last365DaysStart);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "last_week") {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const daysUntilMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Adjust for Sunday being 0.
      const lastWeekStart = new Date(today);
      const lastWeekEnd = new Date(today);

      // Calculate the start of last week (Monday) and end of last week (Sunday).
      lastWeekStart.setDate(today.getDate() - 7 - daysUntilMonday);
      lastWeekEnd.setDate(today.getDate() - 1 - daysUntilMonday);

      formMethods.setValue("dateFrom", lastWeekStart);
      formMethods.setValue("dateTo", lastWeekEnd);
    } else if (due?.value === "last_week_to_date") {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const daysUntilMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
      const lastWeekToDateStart = new Date(today);

      lastWeekToDateStart.setDate(today.getDate() - 7 - daysUntilMonday);

      formMethods.setValue("dateFrom", lastWeekToDateStart);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "last_month") {
      const today = new Date();
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      formMethods.setValue("dateFrom", lastMonthStart);
      formMethods.setValue("dateTo", lastMonthEnd);
    } else if (due?.value === "last_month_to_date") {
      const today = new Date();
      const lastMonthToDateStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

      formMethods.setValue("dateFrom", lastMonthToDateStart);
      formMethods.setValue("dateTo", today);
    } else if (due?.value === "last_quarter") {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index.
      const currentYear = today.getFullYear();

      let lastQuarterStart, lastQuarterEnd;

      if (currentMonth <= 3) {
        // If current month is in Q1, calculate last quarter as Q4 of the previous year.
        lastQuarterStart = new Date(currentYear - 1, 9, 1); // Q4 starts in October (month 9).
        lastQuarterEnd = new Date(currentYear - 1, 11, 31); // Q4 ends in December (month 11).
      } else if (currentMonth <= 6) {
        // If current month is in Q2, calculate last quarter as Q1 of the current year.
        lastQuarterStart = new Date(currentYear, 0, 1); // Q1 starts in January (month 0).
        lastQuarterEnd = new Date(currentYear, 2, 31); // Q1 ends in March (month 2).
      } else if (currentMonth <= 9) {
        // If current month is in Q3, calculate last quarter as Q2 of the current year.
        lastQuarterStart = new Date(currentYear, 3, 1); // Q2 starts in April (month 3).
        lastQuarterEnd = new Date(currentYear, 5, 30); // Q2 ends in June (month 5).
      } else {
        // If current month is in Q4, calculate last quarter as Q3 of the current year.
        lastQuarterStart = new Date(currentYear, 6, 1); // Q3 starts in July (month 6).
        lastQuarterEnd = new Date(currentYear, 8, 30); // Q3 ends in September (month 8).
      }

      // Set dateFrom and dateTo values
      formMethods.setValue("dateFrom", lastQuarterStart);
      formMethods.setValue("dateTo", lastQuarterEnd);
    } else if (due?.value === "last_quarter_to_date") {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns a zero-based index.
      const currentYear = today.getFullYear();

      let lastQuarterStart, lastQuarterEnd;

      if (currentMonth <= 3) {
        // If current month is in Q1, calculate last quarter as Q4 of the previous year.
        lastQuarterStart = new Date(currentYear - 1, 9, 1); // Q4 starts in October (month 9).
        lastQuarterEnd = today; // End date is the current date.
      } else if (currentMonth <= 6) {
        // If current month is in Q2, calculate last quarter as Q1 of the current year.
        lastQuarterStart = new Date(currentYear, 0, 1); // Q1 starts in January (month 0).
        lastQuarterEnd = today; // End date is the current date.
      } else if (currentMonth <= 9) {
        // If current month is in Q3, calculate last quarter as Q2 of the current year.
        lastQuarterStart = new Date(currentYear, 3, 1); // Q2 starts in April (month 3).
        lastQuarterEnd = today; // End date is the current date.
      } else {
        // If current month is in Q4, calculate last quarter as Q3 of the current year.
        lastQuarterStart = new Date(currentYear, 6, 1); // Q3 starts in July (month 6).
        lastQuarterEnd = today; // End date is the current date.
      }

      // Set dateFrom and dateTo values
      formMethods.setValue("dateFrom", lastQuarterStart);
      formMethods.setValue("dateTo", lastQuarterEnd);
    } else if (due?.value === "toDate") {
      formMethods.setValue("dateFrom", new Date("2023-01-01"));
      formMethods.setValue("dateTo", new Date());
    } else if (due?.value !== "manually") {
      formMethods.setValue("dateFrom", startOf(due?.value));
      formMethods.setValue("dateTo", endOf(due?.value));
    } else {
      formMethods.setValue("dateFrom", new Date());
      formMethods.setValue("dateTo", new Date());
    }
    //eslint-disable-next-line
  }, [due, formMethods, dateFrom, dateTo]);

  return {
    due,
  };
};

export function getCurrentUrl(location) {
  return location.pathname.split(/[?#]/)[0];
}
export function checkIsActive(location, url) {
  const current = getCurrentUrl(location);
  const currentSplit = current.split("/");

  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (url.split("/").every((urlPiece) => currentSplit.includes(urlPiece))) {
    return true;
  }

  return false;
}

export function findPolygonCentroid(pts) {
  var first = pts[0],
    last = pts[pts.length - 1];
  if (first.lat !== last.lat || first.lng !== last.lng) pts.push(first);
  var twicearea = 0,
    lat = 0,
    lng = 0,
    nPts = pts.length,
    p1,
    p2,
    f;
  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = pts[i];
    p2 = pts[j];
    f = (p1.lng - first.lng) * (p2.lat - first.lat) - (p2.lng - first.lng) * (p1.lat - first.lat);
    twicearea += f;
    lat += (p1.lat + p2.lat - 2 * first.lat) * f;
    lng += (p1.lng + p2.lng - 2 * first.lng) * f;
  }
  f = twicearea * 3;
  return {lat: lat / f + first.lat, lng: lng / f + first.lng};
}

export function generateCookiesName() {
  let secretCode = 10;
  for (let i = 0; i < APP_NAME.length; i++) {
    secretCode += APP_NAME.charCodeAt(i) * APP_NAME.length;
  }

  secretCode = Math.round(secretCode / APP_NAME.length);
  let GeneratedCookiesName = {};
  CookieList.forEach((cookie) => {
    let tempCookieString = "";
    for (let j = 0; j < cookie.length; j++) {
      let charCode = Math.floor((cookie.charCodeAt(j) * characterList.length * cookie.length) / secretCode);
      charCode = charCode > characterList.length ? charCode - characterList.length : charCode;
      tempCookieString += characterList.charAt(Math.floor(charCode));
    }

    GeneratedCookiesName[cookie] = tempCookieString;
  });
  return GeneratedCookiesName;
}
export function generatePredictableUniqueKeyName(key) {
  let secretCode = 10;
  for (let i = 0; i < APP_NAME.length; i++) {
    secretCode += APP_NAME.charCodeAt(i) * APP_NAME.length;
  }

  secretCode = Math.round(secretCode / APP_NAME.length);
  let uniqueKeyString = "";
  for (let j = 0; j < key.length; j++) {
    let charCode = Math.floor((key.charCodeAt(j) * characterList.length * key.length) / secretCode);
    charCode = charCode > characterList.length ? charCode - characterList.length : charCode;
    uniqueKeyString += characterList.charAt(Math.floor(charCode));
  }
  return uniqueKeyString;
}
export const generatedCookies = generateCookiesName();
export const storage = IS_APP_PRODUCTION
  ? {
      getToken: () => Cookies.get(generatedCookies.accessToken) && CryptoJS.AES.decrypt(Cookies.get(generatedCookies.accessToken), APP_NAME).toString(CryptoJS.enc.Utf8),
      setToken: (token) => Cookies.set(generatedCookies.accessToken, CryptoJS.AES.encrypt(token, APP_NAME).toString(), {secure: true, path: IS_APP_PRODUCTION ? `/` : `/${APP_NAME}`, expires: 0.5}),
      clearToken: () => Cookies.remove(generatedCookies.accessToken, {path: IS_APP_PRODUCTION ? `/` : `/${APP_NAME}`}),
      setSessionStorage: (key, value) => window.sessionStorage.setItem(generatePredictableUniqueKeyName(key), JSON.stringify(value)),
      getSessionStorage: (key) => window.sessionStorage.getItem(generatePredictableUniqueKeyName(key)) && JSON.parse(window.sessionStorage.getItem(generatePredictableUniqueKeyName(key))),
    }
  : {
      getToken: () => window.localStorage.getItem(generatedCookies.accessToken) && CryptoJS.AES.decrypt(window.localStorage.getItem(generatedCookies.accessToken), APP_NAME).toString(CryptoJS.enc.Utf8),
      setToken: (token) => window.localStorage.setItem(generatedCookies.accessToken, CryptoJS.AES.encrypt(token, APP_NAME).toString()),
      clearToken: () => window.localStorage.removeItem(generatedCookies.accessToken),
      setSessionStorage: (key, value) => window.sessionStorage.setItem(generatePredictableUniqueKeyName(key), JSON.stringify(value)),
      getSessionStorage: (key) => window.sessionStorage.getItem(generatePredictableUniqueKeyName(key)) && JSON.parse(window.sessionStorage.getItem(generatePredictableUniqueKeyName(key))),
    };
export const toCapitalize = (word = "") => {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
};

export const toCamelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

export const formatToCurrency = (num) => {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    //These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(num);
};

export const formatToKHR = (num) => {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KHR",

    //These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(num);
};

//function get the last day of month
export function getLastDayOfMonth(date) {
  let month = format(new Date(date), "MM");
  let year = format(new Date(date), "yyyy");

  // const amountDay = new Date(year, month, 0);

  // return amountDay.getDate();
  return new Date(year, month, 0);
}

export function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export const parseKHRToNumber = (number) => {
  return parseToNumber(number.split("R")[1]);
};

export const parseKHRToNumberNegative = (number) => {
  return parseFloat("-" + parseToNumber(number.split("R")[1]));
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const parseToNumberNegative = (stringNumber) => {
  let result = parseFloat(stringNumber.split("$")[0] + parseToNumber(stringNumber.split("-")[1]));
  return result;
};

export const unFormatNumber = (formattedNumber) => {
  var thousandSeparator = (1111).toLocaleString().replace(/1/g, "");
  var decimalSeparator = (1.1).toLocaleString().replace(/1/g, "");

  return parseFloat(formattedNumber.replace(new RegExp("\\" + thousandSeparator, "g"), "").replace(new RegExp("\\" + decimalSeparator), "."));
};

export const parseToNumber = (stringNumber, locale = "en-US") => {
  let thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, "");
  let decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    stringNumber
      .substring(1)
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), "."),
  );
};

export const toastGenerator = ({payrollConfirmAlert = false, status = "success", message = ""}) => {
  const toastTitle = {
    success: () => `Information`,
    warning: () => `Information`,
    error: () => `Something went wrong`,
  };
  const toastDescription = {
    success: () => (message ? message : `Data has been saved.`),
    warning: () => (message ? message : `Unable to save data.`),
    error: () => `Please try again.`,
  };

  return {
    title: toastTitle[status](),
    description: toastDescription[status](),
    fontSize: "sm",
    status: status,
    variant: "subtle",
    duration: payrollConfirmAlert ? 80000 : 3000,
    position: "top",
    isClosable: true,
  };
};

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const isValidDate = (value) => {
  return value && value instanceof Date && !isNaN(value) ? value : null;
};

export function exportTableToExcel(tableID, filename = "") {
  var downloadLink;
  var dataType = "data:text/csv;charset=utf-8,%EF%BB%BF";
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

  // Specify file name
  filename = filename ? filename + ".xls" : "excel_data.xls";

  // Create download link element
  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(["\ufeff", tableHTML], {
      type: dataType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = "data:" + dataType + ", " + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }
}

export const startOf = (type, date = new Date()) => {
  let result;
  switch (type) {
    case "day":
      result = new Date();
      break;
    case "week":
      let day = date.getDay();
      result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (day === 0 ? -6 : 1) - day);
      break;
    case "month":
      result = new Date(date.getFullYear(), date.getMonth(), 1);
      break;
    case "year":
      result = new Date(date.getFullYear(), 0, 1);
      break;
    default:
      result = date;
  }
  return result;
};

export const endOf = (type, date = new Date()) => {
  let result;
  switch (type) {
    case "day":
      result = new Date();
      break;
    case "week":
      let day = date.getDay();
      result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (day === 0 ? 0 : 7) - day);
      break;
    case "month":
      result = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      break;
    case "year":
      result = new Date(date.getFullYear(), 11, 31);
      break;
    default:
      result = date;
  }
  return result;
};

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

//convert date from Enlish to Khmer
export function KhMonth(date, day, mm, year) {
  let Khmer = "";
  let month = format(new Date(date), "M");
  switch (month) {
    case "1":
      Khmer = "មករា";
      break;
    case "2":
      Khmer = "កុម្ភៈ";
      break;
    case "3":
      Khmer = "មិនា";
      break;
    case "4":
      Khmer = "មេសា";
      break;
    case "5":
      Khmer = "ឧសភា";
      break;
    case "6":
      Khmer = "មិថុនា";
      break;
    case "7":
      Khmer = "កក្កដា";
      break;
    case "8":
      Khmer = "សីហា";
      break;
    case "9":
      Khmer = "កញ្ញា";
      break;
    case "10":
      Khmer = "តុលា";
      break;
    case "11":
      Khmer = "វិច្ឆការ";
      break;
    case "12":
      Khmer = "ធ្នូ";
      break;
    default:
      Khmer = "";
  }
  if (day === "dd" && mm === "mm" && year === "yyyy") {
    return format(new Date(date), "dd") + " " + Khmer + " " + format(new Date(date), "yyyy");
  } else if (mm === "mm" && year === "yyyy") {
    return Khmer + " " + format(new Date(date), "yyyy");
  }
}

//Conver second to Hour Min Second
export function convertSecondsToHMS(seconds) {
  if (seconds === undefined) {
    seconds = 0;
  }
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  var result = "";
  if (hours > 0) {
    // eslint-disable-next-line
    result += hours + "h" + ", ";
  }
  if (minutes > 0) {
    // eslint-disable-next-line
    result += minutes + "min" + ", ";
  }
  result += remainingSeconds + "s";

  return result;
}

//short sentence ...
export function shortenSentence(sentence, maxLength = 30) {
  if (sentence?.length > maxLength) {
    return sentence.slice(0, maxLength) + "...";
  }
  return sentence;
}

export const calculateDuration = (start, end) => {
  const startTime = moment(start, "HH:mm:ss");
  const endTime = moment(end, "HH:mm:ss");
  const duration = moment.duration(endTime.diff(startTime));
  const durationHours = Math.floor(duration.asHours());
  const durationMinutes = duration.minutes();
  const durationSeconds = duration.seconds();

  return `${durationHours}:${durationMinutes}:${durationSeconds}`;
};

export const isGmailEmail = (email) => {
  var gmailRegex = /@gmail\.com$/;
  var yahooRegex = /@yahoo\.com$/;
  var outlookRegex = /@(hotmail|outlook)\.(com|co\.uk|es)$/;

  if (gmailRegex.test(email) || yahooRegex.test(email) || outlookRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

export function convertToKhmerMonth(monthNumber) {
  const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
  return khmerMonths[monthNumber - 1];
}

// convert param for fetch data
export function convertDateTimeToUrlFormat(dateTime) {
  return dateTime.replace(/[- :]/g, (match) => {
    switch (match) {
      case " ":
        return "%20";
      case ":":
        return "%3A";
      default:
        return encodeURIComponent(match);
    }
  });
}
export function calculateDifferenceTime(specificTimeStr) {
  const specificTime = new Date(specificTimeStr.replace(/-/g, "/"));
  const currentTime = new Date();
  const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - specificTime.getTime()) / 1000);
  return timeDifferenceInSeconds;
}

export function formatNumberTwoDigit(number) {
  return number < 10 ? `0${number}` : number.toString();
}
