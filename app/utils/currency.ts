export const convertCurrencyToNumber = ({ currency }: { currency: string }) => {
  const formattedCurrency = parseInt(
    currency.replaceAll(".", "").replace("$", "")
  );

  return { formattedCurrency };
};

export const formatCurrencyToString = ({
  currency,
}: {
  currency: string;
}) => {};
