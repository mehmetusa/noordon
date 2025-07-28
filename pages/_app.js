import Layout from "../components/Layout";
import "../styles/globals.css";
import store from "../redux/store";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";

function App({ Component, pageProps }) {
  return (
<SessionProvider session={pageProps.session}>
<Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
    </SessionProvider>

  );
}

export default App;

