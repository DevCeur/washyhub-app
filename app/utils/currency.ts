import { Decimal } from "@prisma/client/runtime/library";

export const convertCurrencyToNumber = ({ currency }: { currency: string }) => {
  const formattedCurrency = parseInt(currency.replaceAll(".", "").replace("$", ""));

  return { formattedCurrency };
};

export const formatCurrencyToString = ({ currency }: { currency: number | Decimal }) => {
  const formatCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return { formattedCurrency: formatCurrency.format(currency as number) };
};
