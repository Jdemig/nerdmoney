import {useContext} from "react";
import {GlobalContext} from "../context/GlobalContext.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
    const { setIsNavDropdownOpen } = useContext(GlobalContext);

    return (
        <div className="flex min-h-screen flex-col justify-center items-center pt-[80px]" onClick={() => setIsNavDropdownOpen(false)}>
            <ToastContainer theme="light" hideProgressBar={true} pauseOnFocusLoss={false} />

            {children}
        </div>
    )
}
