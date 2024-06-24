import { json, type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  console.log(formData);

  return json({ formData });
};
