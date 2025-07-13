"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '@/../lib/firebase';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');

		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push('/home');
		} catch (err: any) {
			setError("Invalid email or password. Please try again.");
			console.error(err);
		}
	};

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-white to-white p-8">
			<div className="absolute top-8 left-8">
				<Link href="/">
					<button className="flex items-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-800 shadow-md transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">
						<svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
							<path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Home
					</button>
				</Link>
			</div>

			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
				<div className="text-center">
					<h1 className="mb-6 text-4xl font-bold text-gray-800">Sign In</h1>
				</div>

				<form className="w-full space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
						<input
							type="email"
							id="email"
							name="email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
							placeholder="••••••••"
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-sm">
							<a href="#" className="font-medium text-yellow-600 hover:text-yellow-500 hover:underline">
								Forgot your password?
							</a>
						</div>
					</div>

					{error && <p className="text-red-500 text-center text-sm">{error}</p>}

					<div className="pt-6">
						<button
							type="submit"
							className="flex w-full justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
						>
							Sign In
						</button>
					</div>

					<div className="mt-6 text-sm text-center">
						<Link href="/auth/register" className="font-medium text-yellow-600 hover:text-yellow-500 hover:underline">
							Don't have an account? Sign Up
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}