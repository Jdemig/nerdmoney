import Head from 'next/head'
import Footer from '../components/Footer.tsx'
import Navbar from "../components/Navbar.tsx";
import Layout from "../components/Layout.tsx";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext.tsx";
import {featherCopy} from "../utils/svgs.ts";
import {toast} from "react-toastify";
import axios from "axios";

const displayAddress = (address: string) => {
    if (!address) {
        return '';
    }

    return `${address.slice(0, 3)}...${address.slice(-4)}`;
}

export default function Account() {
    const { isLoggedIn } = useContext(UserContext);

    const [transactions, setTransactions] = useState<[]>([]);
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState('');

    const onCopyClick = async () => {
        await navigator.clipboard.writeText(address);
        toast("Copied to clipboard");
    }

    const asyncUseEffect = async () => {
        try {
            const res = await axios.get('/api/bitcoin/address');
            const {address, transactions} = res.data;

            setBalance(address.balance / 100000000);
            setAddress(address.address);

            const newTransactions: any = [];
            for (const txn of transactions) {
                const txnRes = await axios.get(`/api/bitcoin/transaction?txhash=${txn.txhash}&address=${address.address}`);

                const {transaction} = txnRes.data;
                newTransactions.push(transaction);
            }

            setTransactions(newTransactions);
        } catch (e) {
            console.log(e);
            toast("Error fetching account data");
        }
    }


    useEffect(() => {
        asyncUseEffect();
    }, []);

    return (
        <Layout>
            <Head>
                <title>Nerdmoney - Account</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            {isLoggedIn ? (
                <div className="w-full max-w-5xl flex-1 py-16 px-8">
                    <div className="w-full text-5xl mb-16 text-left">Account</div>
                    <div className="flex flex-row w-full mb-16">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left text-2xl pb-2">My Account</th>
                                    <th className="text-right uppercase">Available Balance</th>
                                    <th className="text-right uppercase">Interest YTD</th>
                                    <th className="text-right uppercase">Annual Percentage Yield</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="flex">
                                            <div className="mr-4">Account Address:</div>
                                            <div className="mr-4">{displayAddress(address)}</div>
                                            <button type="button" onClick={onCopyClick}><div className="[&>svg]:text-black [&>svg]:w-5 [&>svg]:h-5" dangerouslySetInnerHTML={{ __html: featherCopy }} /></button>
                                        </div>
                                    </td>
                                    <td className="text-right">{balance} BTC</td>
                                    <td className="text-right">0.0 BTC</td>
                                    <td className="text-right">4.75%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full">
                        <div className="text-2xl font-bold mb-5">Transaction History</div>

                        <table className="w-full">
                            <thead>
                                <tr className="border-gray-300 border-b border-t">
                                    <th className="text-left text-gray-500 py-2 font-semibold">Account</th>
                                    <th className="text-left text-gray-500 py-2 font-semibold">From</th>
                                    <th className="text-left text-gray-500 py-2 font-semibold">To</th>
                                    <th className="text-left text-gray-500 py-2 font-semibold">Description</th>
                                    <th className="text-right text-gray-500 py-2 font-semibold">Date / Time</th>
                                    <th className="text-right text-gray-500 py-2 font-semibold">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn: any) => (
                                    <tr className="border-gray-300 border-b">
                                        <td className="text-left flex items-center py-2">
                                            <img className="w-6 h-6 mr-2" alt="bitcoin icon" src="/bitcoin-icon.png" />
                                            BTC
                                        </td>
                                        <td className="text-left py-2">{displayAddress(txn.fromAddress)}</td>
                                        <td className="text-left py-2">{displayAddress(txn.toAddress)}</td>
                                        <td className="text-left py-2">{txn.toAddress === address ? 'Deposit' : 'Withdrawal'}</td>
                                        <td className="text-right py-2">{new Date(txn.date).toDateString()}</td>
                                        <td className="text-right py-2">{txn.amount / 100000000} BTC</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {transactions.length === 0 && (
                            <div className="text-center mt-8 text-gray-800">
                                No transactions yet.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <main>
                    <div className="text-3xl font-bold mb-5">Account</div>
                    <div>
                        Please log in to view your account.
                    </div>
                </main>
            )}

            <Footer />
        </Layout>
    )
}
