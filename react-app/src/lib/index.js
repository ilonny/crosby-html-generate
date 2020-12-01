export * from "./theme";
export * from "./routing";
export * from "./store";
export * from "./links";
export * from "./containers";
export const API_HOST =
  process.env.NODE_ENV === "production"
    ? "https://app.vegfood.delivery"
    : "http://localhost:21080";
