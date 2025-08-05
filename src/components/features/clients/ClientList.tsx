import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { ClientProfile } from '@/hooks/useClients';

const RemoveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134h-3.868c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
const GoalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 21h16.5M12 3v18" />
    </svg>
);

interface ClientListProps {
    clients: ClientProfile[];
    onOpenAssignmentModal: (client: ClientProfile, type: 'reminder' | 'goal') => void;
    onRemoveClient: (client: ClientProfile) => void;
}

export function ClientList({ clients, onOpenAssignmentModal, onRemoveClient }: ClientListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
                <div
                    key={client.uid}
                    className={`relative p-5 rounded-lg shadow-lg flex flex-col transition-all duration-300 ${client.status === 'pending' ? 'bg-gray-100' : 'bg-white border'
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Image
                                src={client.profileIcon || '/images/no_image.jpg'}
                                alt={client.firstName}
                                width={60}
                                height={60}
                                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500 p-1"
                            />
                            <div>
                                <p className="font-bold text-lg text-gray-800">{client.firstName} {client.lastName}</p>
                                <p className="text-sm text-gray-500">@{client.username}</p>
                            </div>
                        </div>
                        {client.status === 'accepted' && (
                            <button
                                onClick={() => onRemoveClient(client)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded-full"
                                title="Remove Client"
                            >
                                <RemoveIcon className="h-6 w-6" />
                            </button>
                        )}
                    </div>

                    {client.status === 'pending' ? (
                        <div className="text-center my-4 py-2 bg-gray-200 rounded-md">
                            <span className="text-gray-600 text-sm font-semibold">
                                Pending Acceptance
                            </span>
                        </div>
                    ) : (
                        <div className="my-4 border-t pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <GoalIcon className="h-5 w-5 text-gray-400" />
                                <span className="font-medium">Primary Goal:</span>
                                <span>{client.goals || 'Not set'}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                        <Button size="sm" onClick={() => onOpenAssignmentModal(client, 'reminder')} disabled={client.status === 'pending'}>
                            Set Reminder
                        </Button>
                        <Button size="sm" onClick={() => onOpenAssignmentModal(client, 'goal')} disabled={client.status === 'pending'}>
                            Set Goals
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}