import * as Sentry from "@sentry/node";

if (process.env.REACT_APP_SENTRY_PUBLIC_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_PUBLIC_DSN,
  });
}

export default Sentry;
