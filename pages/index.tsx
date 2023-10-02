import Head from 'next/head'
import Footer from '../components/Footer.tsx'
import Navbar from "../components/Navbar.tsx";
import Layout from "../components/Layout.tsx";



export default function Home() {
    return (
        <Layout>
            <Head>
                <title>Nerdmoney</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main>


                <div className="text-3xl font-bold">Nerdmoney</div>
                <div>
                  4% yields on Bitcoin.
                </div>
                <div>
                  0% work
                </div>
            </main>

            <Footer />
        </Layout>
    )
}
