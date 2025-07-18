"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OAuthCallback = () => {
    const router = useRouter();

    useEffect(() => {
        const fetchToken = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (token) {
                localStorage.setItem("token", token);
                router.push("/dashboard");
            } else {
                router.push("/login");
            }
        };

        fetchToken();
    }, [router]);

    return <p>Processing authentication...</p>;
};

export default OAuthCallback;