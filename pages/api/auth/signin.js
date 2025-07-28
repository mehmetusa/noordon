import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn({ csrfToken }) {

  const getErrorMessage = (error) => {
    const errors = {
      CredentialsSignin: "Invalid username or password",
      default: "An unknown error occurred",
    };
    return errors[error] || errors.default;
  };

  return (
    <div>
      <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Username:
          <input name="username" type="text" />
        </label>
        <label>
          Password:
          <input name="password" type="password" />
        </label>
        <button type="submit">Sign in</button>
      </form>

  
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
