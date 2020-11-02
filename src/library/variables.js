export const settings = {
  baseURL: process.env.API_ADDRESS || "http://localhost:3000",
  baseWebsiteURL:
    window.location.protocol + "//" + window.location.hostname + ":3004",
  propertyID: process.env.PROPERTY_ID || "pokergo-staging"
};
