import { PublicHeader } from '@/components/shared/PublicHeader';
import { HeroSection } from '@/components/features/landing/HeroSection';

export default function HomePage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-300 via-white to-white p-8">
            <PublicHeader />
            <HeroSection />
        </div>
    );
}