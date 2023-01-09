import { useLazyQuery } from "@apollo/client";

import { LOGIN } from "../api/appUser/queries";

export function useAppUser() {
  const login = useLazyQuery(LOGIN, {
    context: { userInstance: true },
  });

  return {
    operations: {
      login,
    },
  };
}
