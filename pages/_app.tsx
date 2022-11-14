import Footer from "components/footer/footer";
import type { AppProps } from "next/app";
import "styles/global.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default App;
