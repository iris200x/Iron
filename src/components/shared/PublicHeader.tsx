import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function PublicHeader() {
	return (
		<div className="absolute top-8 right-8 flex space-x-4">
			<Link href="/auth/login">
				<Button>Login</Button>
			</Link>
			<Link href="/contact">
				<Button>Contact Us</Button>
			</Link>
		</div>
	);
}