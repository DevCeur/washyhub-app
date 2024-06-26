import { LoaderFunction, MetaFunction } from "@remix-run/node";

import { withAuthLoader } from "~/utils/with-auth-loader";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({ loaderArgs });

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Account" }];
};

export default function AccountRoute() {
  return (
    <div>
      <h1>Account</h1>
    </div>
  );
}
