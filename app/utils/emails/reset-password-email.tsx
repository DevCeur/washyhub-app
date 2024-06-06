interface ResetPasswordEmailProps {
  redirectionUrl: string;
}

export const ResetPasswordEmail = ({ redirectionUrl }: ResetPasswordEmailProps) => {
  return (
    <div>
      <h1>Reset your WashyHub Password</h1>
      <a href={redirectionUrl}>Reset your Password</a>
    </div>
  );
};
