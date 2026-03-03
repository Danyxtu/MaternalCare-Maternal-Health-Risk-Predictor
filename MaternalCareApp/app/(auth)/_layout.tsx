import { Stack } from "expo-router";

/**
 *  if you want to design this page make sure:
 *  1. comment out the corresponding Stack.Screen in app/_layout.tsx
 *  2. comment out the previous page:
 *      ex. if you want to design register page, comment out login page.
 *            like this:  <Stack.Screen name="login" options={{ headerShown: false }} />
 *  3. after designing the page, uncomment the corresponding Stack.Screen to make it work and push it to github.
 *
 * Note: Still dont forget the general format for git branch name: <name>/task/<task-name>
 */
const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
