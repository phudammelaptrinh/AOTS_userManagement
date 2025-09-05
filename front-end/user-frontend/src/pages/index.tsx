import Head from "next/head";
import UserHome from "../components/UserHome";


export default function Home() {
    return (
        <>
            <Head><title>Quản lý người dùng</title></Head>
            
            <UserHome />

        </>
    );
}
