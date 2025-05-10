import {
  MOST_WATCHED_CATEGORY,
  LOREM_CATEGORY,
  INTERNET_VIDEOS,
  ACTUAL_CATEGORY,
  PRIVACY,
} from "../learn-page/cardsData.js";

export const SESSION_KEYS = {
  AUTHENTICATED_USER: "AUTHENTICATED_USER",
  "nCZsT1@example.com-active-filters": "nCZsT1@example.com-active-filters",
  "nCZsT2@example.com-active-filters": "nCZsT2@example.com-active-filters",
  "nCZsT3@example.com-active-filters": "nCZsT3@example.com-active-filters",
};

const USER_INFO_MAP = {
  User123: {
    birthYear: 1990,
    email: "nCZsT1@example.com",
    image: "./images/profilepic.png",
  },
  User456: {
    birthYear: 1991,
    email: "nCZsT2@example.com",
    image: "./images/user1.png",
  },
  User789: {
    birthYear: 1992,
    email: "nCZsT3@example.com",
    image: "./images/user2.png",
  },
};

export const isUserAuthenticated = () => {
  return Boolean(localStorage.getItem(SESSION_KEYS.AUTHENTICATED_USER));
};

export const getAuthenticatedUser = () => {
  return JSON.parse(localStorage.getItem(SESSION_KEYS.AUTHENTICATED_USER));
};

export const setAuthenticatedUser = (username) => {
  const userInfo = USER_INFO_MAP[username];

  localStorage.setItem(
    SESSION_KEYS.AUTHENTICATED_USER,
    JSON.stringify(userInfo)
  );

  const userEmailAddress = userInfo.email;
  const activeFiltersKey = `${userEmailAddress}-active-filters`;
  const stringArray = localStorage.getItem(activeFiltersKey);

  if (!stringArray) {
    localStorage.setItem(
      `${userEmailAddress}-active-filters`,
      JSON.stringify([
        MOST_WATCHED_CATEGORY,
        ACTUAL_CATEGORY,
        LOREM_CATEGORY,
        INTERNET_VIDEOS,
        PRIVACY,
      ])
    );
  }
};

export const getAuthenticatedUserActiveFiltersKey = () => {
  const authenticatedUser = getAuthenticatedUser();
  if (!authenticatedUser) return null;
  const userEmailAddress = authenticatedUser.email;

  return `${userEmailAddress}-active-filters`;
};

/*export const setLearnPageFilters = (filters) => {
  const activeFiltersKey = getAuthenticatedUserActiveFiltersKey();
  if (activeFiltersKey) {
    localStorage.setItem(activeFiltersKey, JSON.stringify(filters));
  }
};*/

export const getLearnPageFilters = () => {
  const activeFiltersKey = getAuthenticatedUserActiveFiltersKey();

  const stringArray = localStorage.getItem(activeFiltersKey);
  return stringArray ? JSON.parse(stringArray) : null;
};
