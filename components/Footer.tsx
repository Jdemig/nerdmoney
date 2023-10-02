import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className="w-full bg-primary py-8">
                <div className="max-w-6xl px-8 flex flex-row w-full justify-between text-white m-auto flex-wrap">
                    <div className="flex flex-col mr-12">
                        <Link href="/">
                            <a>
                                <img alt="logo" src="/logo-light.png" className="h-12" />
                            </a>
                        </Link>
                        <div className="mt-5">Copyright 2023 Nerdmoney, Inc.</div>
                    </div>

                    <div className="flex flex-col justify-end mt-5">
                        <div className="flex flex-row flex-wrap">
                            <Link href="/privacy-policy">
                                <a className="mr-5">
                                    Privacy Policy
                                </a>
                            </Link>
                            <Link className="mr-5" href="/terms-and-conditions">
                                <a className="mr-5">
                                    Terms and Conditions
                                </a>
                            </Link>
                            <Link className="mr-5" href="/cookie-policy">
                                <a className="mr-5">
                                    Cookie Policy
                                </a>
                            </Link>
                            <Link href="/contact">
                                <a>
                                    Contact
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

            </footer>
        </>
    )
}
