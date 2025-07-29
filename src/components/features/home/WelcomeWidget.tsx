import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface UserProfile {
    firstName?: string;
    username?: string;
}

interface WelcomeWidgetProps {
    userProfile: UserProfile | null;
}

export function WelcomeWidget({ userProfile }: WelcomeWidgetProps) {
    return (
        <div className="col-span-1 rounded-lg bg-white p-6 shadow-lg md:col-span-2 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Welcome, {userProfile?.firstName || 'User'}!</h2>
                <p className="text-gray-600">@{userProfile?.username || 'user'}</p>
            </div>
            <Link href="/profile" passHref>
                <Button size="md">
                    Edit
                </Button>
            </Link>
        </div>
    );
}