"use client";

export function DateWidget() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    return (
        <div className="col-span-1 flex h-32 items-center justify-center rounded-lg bg-yellow-500 p-4 text-center shadow-lg">
            <p className="text-xl font-bold text-gray-800">{formattedDate}</p>
        </div>
    );
}