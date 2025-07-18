"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, loginWithGoogle } from "@/app/services/authService";
import styles from "@/app/ui/login/login.module.css";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

const LoginPage = () => {
    const [phoneOrEmail, setPhoneOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(phoneOrEmail, password);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to login. Please check your network or try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        try {
            await loginWithGoogle();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to login with Google. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                {/* <h1 className={styles.title}>Welcome Back</h1> */}
                <p className={styles.subtitle}>Log in to your account</p>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={phoneOrEmail}
                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                        required
                        className={styles.input}
                        disabled={isSubmitting}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                        disabled={isSubmitting}
                    />
                    <div className={styles.formOptions}>
                        <label className={styles.rememberMe}>
                            <input type="checkbox" disabled={isSubmitting} />
                            Remember me
                        </label>
                        <Link href="/login/forgot-password" className={styles.forgotPassword}>
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
                <button
                    type="button"
                    className={styles.googleButton}
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                >
                    <FaGoogle className={styles.googleIcon} /> Log in with Google
                </button>
                <div className={styles.signup}>
                    <span>Don’t have an account? </span>
                    <Link href="/login/register">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;