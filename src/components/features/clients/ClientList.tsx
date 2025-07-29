import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { ClientProfile } from '@/hooks/useClients';

interface ClientListProps {
    clients: ClientProfile[];
    onOpenAssignmentModal: (client: ClientProfile, type: 'reminder' | 'exercise') => void;
}

export function ClientList({ clients, onOpenAssignmentModal }: ClientListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
                <div
                    key={client.uid}

                    className={`p-4 rounded-lg shadow-md flex flex-col justify-between transition-opacity ${client.status === 'pending' ? 'bg-gray-200 opacity-70' : 'bg-yellow-100'
                        }`}
                >
                    <div className="flex items-center mb-4">
                        <Image
                            src={client.profileIcon || '/images/no_image.jpg'}
                            alt={client.firstName}
                            width={50}
                            height={50}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                            <p className="font-bold text-gray-800">{client.firstName} {client.lastName}</p>
                            <p className="text-sm text-gray-600">@{client.username}</p>
                        </div>
                    </div>


                    {client.status === 'pending' && (
                        <div className="text-center my-2">
                            <span className="inline-block bg-gray-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                Pending Acceptance
                            </span>
                        </div>
                    )}

                    <div className="flex gap-2 mt-2">

                        <Button size="sm" onClick={() => onOpenAssignmentModal(client, 'reminder')} disabled={client.status === 'pending'}>
                            Set Reminder
                        </Button>
                        <Button size="sm" onClick={() => onOpenAssignmentModal(client, 'exercise')} disabled={client.status === 'pending'}>
                            Assign Exercise
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}