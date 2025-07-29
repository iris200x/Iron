import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoginForm } from '@/components/features/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-white to-white p-8">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Button variant="outline" size="sm" icon="back">
                        Back to home
                    </Button>
                </Link>
            </div>

            <LoginForm />
        </div>
    );
}