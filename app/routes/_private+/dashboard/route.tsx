import { LoaderFunction } from "@remix-run/node";

import { withAuthLoader } from "~/utils/with-auth-loader";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({ loaderArgs });

export default function DashboardRoute() {
  return (
    <div style={{ height: 2000 }}>
      <h1>Dashboard</h1>
    </div>
  );
}
