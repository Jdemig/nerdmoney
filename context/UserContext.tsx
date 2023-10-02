import {createContext, Dispatch, useEffect, useState} from 'react'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, User} from "@firebase/auth";
import {firebaseAuth} from "../lib/initFirebase.ts";
import axios from "axios";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import {useRouter} from 'next/router'

type UserModel = {
    email: string
}

type UserContextType = {
    isLoggedIn: boolean
    user: UserModel | null
    token: string
    setUser: Dispatch<any>
    setToken: Dispatch<any>
    onSignInClick: (email: string, password: string) => void
    onSignUpClick: (email: string, password: string) => void
    onSignOutClick: () => void
}

export const UserContext = createContext<UserContextType>({
    isLoggedIn: false,
    user: null,
    token: '',
    setUser: () => {},
    setToken: () => {},
    onSignInClick: () => {},
    onSignUpClick: () => {},
    onSignOutClick: () => {},
});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const cookieString = Cookies.get('session');
        const session = JSON.parse(cookieString ? cookieString : '{}');

        console.log(session);

        setUser(session.user);
        setToken(session.token);
    }, []);


    const onFirebaseAuth = async (user: User) => {
        const token = await user.getIdToken();

        console.log(token);

        const res = await axios.post('/api/onFirebaseAuth', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(res);

        return res;
    }


    const onSignInClick = (email: string, password: string) => {
        signInWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {

                const user = userCredential.user;

                onFirebaseAuth(user)
                    .then(async (res) => {
                        console.log(res);


                        setUser(res.data.user);
                        setToken(res.data.token);

                        await router.push('/account');

                        toast('You\'re signed in');
                    });
            });
    }

    const onSignUpClick = (email: string, password: string) => {
        createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
               const user = userCredential.user;

               onFirebaseAuth(user)
                   .then(async (res) => {
                       console.log(res);

                       setUser(res.data.user);
                       setToken(res.data.token);

                       await router.push('/account');

                       toast('Thanks for signing up!');
                   });
            })
            .catch((err) => {
               console.log(err);

               console.log(err.message);
               console.log(err.code);

               if (err.code === 'auth/email-already-in-use') {
                   toast('Email already in use');
               }
            });
    }

    const onSignOutClick = async () => {
        setUser(null);
        setToken(null);
        Cookies.remove('session');
        await router.push('/');
        toast('Signed out');
    }


    const isLoggedIn = !!user && !!token;


    return (
        <UserContext.Provider
            value={{
                isLoggedIn,
                user,
                token,
                setUser,
                setToken,
                onSignInClick,
                onSignUpClick,
                onSignOutClick,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
