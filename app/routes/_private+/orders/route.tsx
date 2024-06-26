import { LoaderFunction, MetaFunction } from "@remix-run/node";

import { withAuthLoader } from "~/utils/with-auth-loader";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({ loaderArgs });

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Orders" }];
};

export default function OrdersRoute() {
  return (
    <div>
      <h1>Orders</h1>
    </div>
  );
}
