import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className="w-full bg-primary py-8">
                <div className="max-w-6xl px-8 flex flex-row w-full justify-between text-white m-auto flex-wrap">
                    <div className="flex flex-col mr-12">
                        <Link href="/">
                            <img alt="logo" src="/logo-light.png" className="h-12" />
                        </Link>
                        <div className="mt-5">Copyright 2023 Nerdmoney, Inc.</div>
                    </div>

                    <div className="flex flex-col justify-end mt-5">
                        <div className="flex flex-row flex-wrap">
                            <Link href="/privacy-policy" className="mr-5">
                                Privacy Policy
                            </Link>
                            <Link className="mr-5" href="/terms-and-conditions">
                                Terms and Conditions
                            </Link>
                            <Link className="mr-5" href="/cookie-policy">
                                Cookie Policy
                            </Link>
                            <Link href="/contact">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>

            </footer>
        </>
    )
}
