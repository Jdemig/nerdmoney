import Head from 'next/head'
import Footer from '../components/Footer.tsx'
import Navbar from "../components/Navbar.tsx";
import Layout from "../components/Layout.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext.tsx";
import {toast} from "react-toastify";



export default function SignIn() {
    const { onSignUpClick } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSignUpClick = () => {
        if (password !== confirmPassword) {
            toast("Passwords do not match");
            return;
        }

        onSignUpClick(email, password);
    }

    return (
        <Layout>
            <Head>
                <title>Nerdmoney - Sign Up</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main>
                <div className="text-3xl font-bold mb-5">Sign Up</div>
                <div>
                    <div className="mb-3 flex flex-col">
                        <label className="mb-1">Email</label>
                        <Input className="w-[300px]" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="mb-5 flex flex-col">
                        <label className="mb-1">Password</label>
                        <Input className="w-[300px]" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="mb-5 flex flex-col">
                        <label className="mb-1">Confirm Password</label>
                        <Input className="w-[300px]" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <Button className="w-[300px]" onClick={handleSignUpClick}>Sign Up</Button>
                </div>
            </main>

            <Footer />
        </Layout>
    )
}
