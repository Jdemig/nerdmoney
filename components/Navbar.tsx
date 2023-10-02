import {featherMenu} from '../utils/svgs.ts';
import {useContext} from "react";
import {GlobalContext} from "../context/GlobalContext.tsx";
import Link from 'next/link';
import {UserContext} from "../context/UserContext.tsx";

export default function Navbar() {
    const { isNavDropdownOpen, setIsNavDropdownOpen } = useContext(GlobalContext);
    const { isLoggedIn, onSignOutClick, user } = useContext(UserContext);

    const onNavDropdownClick = (e) => {
        e.stopPropagation();
        setIsNavDropdownOpen(!isNavDropdownOpen);
    }

    const handleSignOutClick = () => {
        onSignOutClick();
    }

    return (
        <div className="w-full h-[80px] bg-primary fixed top-0">

            <div className="w-full h-full max-w-6xl px-8 flex items-center justify-between m-auto">
                <Link href="/">
                    <a>
                        <img alt="logo" src="/logo-light.png" className="h-12" />
                    </a>
                </Link>



                <div className="relative flex">
                    <button type="button" onClick={onNavDropdownClick}>
                        <div className="[&>svg]:text-white [&>svg]:w-7 [&>svg]:h-7" dangerouslySetInnerHTML={{ __html: featherMenu }} />
                    </button>

                    {isNavDropdownOpen && (
                        <div className="absolute w-[220px] flex flex-col bg-white rounded-lg px-3 py-1 shadow-lg right-0 top-10">

                            {!isLoggedIn ? (
                                <>
                                    <Link href="/signin">
                                        <a className="py-2">Sign in</a>
                                    </Link>
                                    <Link href="/signup">
                                        <a className="py-2">Sign up</a>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="mt-2 mb-2 py-2 px-4 bg-gray-200 text-gray-600 rounded-lg overflow-hidden text-ellipsis w-full">{user.email}</div>
                                    <Link href="/account">
                                        <a className="py-2">Account</a>
                                    </Link>
                                    <button className="text-left py-2" onClick={handleSignOutClick}>
                                        Sign out
                                    </button>
                                </>
                            )}

                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}