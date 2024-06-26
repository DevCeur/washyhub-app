import { LoaderFunction, MetaFunction } from "@remix-run/node";

import { withAuthLoader } from "~/utils/with-auth-loader";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({ loaderArgs });

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Invoices" }];
};

export default function InvoicesRoute() {
  return (
    <div>
      <h1>Invoices</h1>
    </div>
  );
}
