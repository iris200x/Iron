export function ContactCard() {
    return (
        <div className="flex w-full max-w-2xl flex-col items-center rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-4xl font-bold text-gray-800">Contact Us</h1>

            <p className="mb-8 text-center text-lg text-gray-700">
                We'd love to hear from you!
            </p>

            <div className="w-full text-center">
                <ul className="mt-2 list-none text-gray-700">
                    <li>
                        Email:{" "}
                        <a
                            href="mailto:202201302@iacademy.edu.ph"
                            className="text-yellow-600 hover:underline"
                        >
                            202201302@iacademy.edu.ph
                        </a>
                    </li>

                    <li>Address: iACADEMY Nexus Campus, 7434 Yakal, Makati, Metro Manila</li>
                </ul>
            </div>
        </div>
    );
}