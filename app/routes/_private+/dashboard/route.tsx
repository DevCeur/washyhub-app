import { json } from "@remix-run/node";

import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { getCurrentCarwash } from "~/services/carwash";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const { carwash } = await getCurrentCarwash({ request });

      return json({ currentCarwash: carwash });
    },
  });

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Dashboard - ${data?.currentCarwash?.name}` }];
};

export default function DashboardRoute() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
