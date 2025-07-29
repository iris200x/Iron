import Image from 'next/image';

export function HeroSection() {
    return (
        <div className="z-10 flex w-full max-w-4xl flex-col items-center justify-center md:flex-row md:justify-start">
            <div className="mb-8 flex flex-col items-center md:mb-0 md:mr-16">
                <Image
                    src="/images/logo/logo_transparent.png"
                    alt="Strong Icon"
                    width={300}
                    height={300}
                    className="h-auto w-36 md:w-48"
                />
                <h1 className="mt-4 text-6xl font-extrabold tracking-tight text-gray-900 md:text-8xl">
                    Iron
                </h1>
            </div>

            <div className="text-center md:text-left">
                <p className="text-4xl font-semibold italic leading-tight text-gray-800 md:text-5xl">
                    Your Journey to Strength
                </p>
                <p className="mt-2 text-4xl font-semibold italic leading-tight text-gray-800 md:text-5xl">
                    Starts Here
                </p>
            </div>
        </div>
    );
}