"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loading from "./Loading";
import { ReactNode } from 'react';

const LoadingWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        setLoading(true);

        
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); 

        return () => {
            clearTimeout(timer);
            setLoading(false);
        };
    }, [pathname, searchParams]);

    return (
        <>
            {loading && <Loading />}
            {children}
        </>
    );
};

export default LoadingWrapper;