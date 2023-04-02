/** Allows access to env variables on both server and client side
 * Server side code has normal access to process.env,
 * but as client side code is ran on both the server and the client,
 * client side wouldn't normally have the same access.
 * Hence, this helper function is exported
 * Any data exposed here, will be exposed to the client, so be aware not to share anything private */
export function getEnv() {
  return {
    // this is only an example, you can add any env variables you want
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
