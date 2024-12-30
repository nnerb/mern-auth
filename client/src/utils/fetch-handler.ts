export const fetchHandler = async (url: string, options: RequestInit, errorMessage: string) => {
  const res = await fetch(url, options);
  const data = await res.json(); // Always parse response
  if (!res.ok) {
    throw new Error(data.message || errorMessage); // Throw for HTTP errors
  }
  return data; // Return parsed JSON if successful
}