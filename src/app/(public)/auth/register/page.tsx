import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-white to-white p-8">
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <Button variant="outline" size="sm" icon="back">
                        Back to Home
                    </Button>
                </Link>
            </div>

            <RegisterForm />
        </div>
    );
}