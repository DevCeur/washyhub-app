import { LoaderFunction, MetaFunction } from "@remix-run/node";

import { withAuthLoader } from "~/utils/with-auth-loader";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({ loaderArgs });

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Customers" }];
};

export default function CustomersRoute() {
  return (
    <div>
      <h1>Customers</h1>
    </div>
  );
}
