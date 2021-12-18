import fetch from "node-fetch";
import type { Response } from "node-fetch";

export const getUser = async (username: string): Promise<unknown> => {
  return fetch(`https://api.github.com/users/${username}`, {
    headers: {
      "Accept": "application/json+vnd.github.v3.raw",
      "Content-type": "application/json",
    },
  })
  .then(checkErrorAndReturnJson);
};

function checkErrorAndReturnJson(response: Response) {
  return response.ok
    ? response.json()
    : Promise.reject(new Error(`Http Error: ${response.status}`));  
}
