const {PROTOCOL, API_PREFIX, BASE_URL, API_PORT} = process.env;

export const apiURL = `${PROTOCOL}://${BASE_URL}${
  API_PORT === "443" || API_PORT === "80" ? "" : `:${API_PORT}`
}${API_PREFIX}`;

export const cdnURL = `${PROTOCOL}://${BASE_URL}${
  API_PORT === "443" || API_PORT === "80" ? "" : `:${API_PORT}`
}/assets`;
