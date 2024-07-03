import { json } from "@remix-run/node";

import { HiOutlineHome } from "react-icons/hi2";

import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { getCurrentCarwash } from "~/services/carwash";
import { Button } from "~/components/button";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <Button hierarchy="primary" variant="accent" size="large" icon={HiOutlineHome} />

        <Button hierarchy="primary" variant="accent" size="large">
          Large Primary Brand
        </Button>

        <Button
          hierarchy="secondary"
          variant="accent"
          size="medium"
          icon={HiOutlineHome}
        />

        <Button hierarchy="secondary" variant="accent" size="medium">
          Medium Secondary Brand
        </Button>

        <Button hierarchy="tertiary" variant="accent" size="small" icon={HiOutlineHome} />

        <Button hierarchy="tertiary" variant="accent" size="small">
          Small Tertiary Brand
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <Button hierarchy="primary" variant="default" size="large" icon={HiOutlineHome} />

        <Button hierarchy="primary" variant="default" size="large">
          Large Primary Default
        </Button>

        <Button
          hierarchy="secondary"
          variant="default"
          size="medium"
          icon={HiOutlineHome}
        />

        <Button hierarchy="secondary" variant="default" size="medium">
          Medium Secondary Default
        </Button>

        <Button
          hierarchy="tertiary"
          variant="default"
          size="small"
          icon={HiOutlineHome}
        />

        <Button hierarchy="tertiary" variant="default" size="small">
          Small Tertiary Default
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
        }}
      >
        <Button hierarchy="primary" variant="danger" size="large" icon={HiOutlineHome} />

        <Button hierarchy="primary" variant="danger" size="large">
          Large Primary Danger
        </Button>

        <Button
          hierarchy="secondary"
          variant="danger"
          size="medium"
          icon={HiOutlineHome}
        />

        <Button hierarchy="secondary" variant="danger" size="medium">
          Medium Secondary Danger
        </Button>

        <Button hierarchy="tertiary" variant="danger" size="small" icon={HiOutlineHome} />

        <Button hierarchy="tertiary" variant="danger" size="small">
          Small Tertiary Danger
        </Button>
      </div>
    </div>
  );
}
