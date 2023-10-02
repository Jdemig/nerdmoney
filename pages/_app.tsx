import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import GlobalProvider from "../context/GlobalContext.tsx";
import UserProvider from "../context/UserContext.tsx";
import ComposeProvider from "../context/ComposeProvider.tsx";

function Application({ Component, pageProps }) {
    return (
        <ComposeProvider components={[GlobalProvider, UserProvider]}>
            <Component {...pageProps} />
        </ComposeProvider>
    );
}

export default Application
