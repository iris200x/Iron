"use client";

import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useClients, type ClientProfile } from '@/hooks/useClients';
import { Button } from '@/components/ui/Button';
import { ClientList } from '@/components/features/clients/ClientList';
import { AssignmentModal } from '@/components/features/clients/AssignmentModal';
import { AddClientModal } from '@/components/features/clients/AddClientModal';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';

const EmptyStateIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.964A3 3 0 006 12v-1.5a3 3 0 013-3h1.5a3 3 0 013 3v1.5m-6.045-4.5A18.022 18.022 0 0112 2.25c5.182 0 9.934 2.102 13.5 5.636m-16.856 5.636l-1.815-1.815m1.815 1.815l1.815 1.815M3 12.75l1.815 1.815m-1.815-1.815l-1.815 1.815" />
    </svg>
);


type AssignmentType = 'reminder' | 'goal';

export default function ClientsPage() {
    const { currentUser } = useAuth();
    const { clients, loading } = useClients();

    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
    const [assignmentType, setAssignmentType] = useState<AssignmentType | null>(null);
    const [clientToRemove, setClientToRemove] = useState<ClientProfile | null>(null);

    const handleOpenAssignmentModal = (client: ClientProfile, type: AssignmentType) => {
        setSelectedClient(client);
        setAssignmentType(type);
        setShowAssignmentModal(true);
    };

    const handleConfirmRemove = async () => {
        if (!clientToRemove || !currentUser) return;
        const clientRef = doc(db, 'users', currentUser.uid, 'clients', clientToRemove.uid);
        try {
            await deleteDoc(clientRef);
        } catch (error) {
            console.error("Error removing client: ", error);
        } finally {
            setClientToRemove(null);
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading clients...</div>;
    }

    return (
        <div className="flex flex-col">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-5xl font-bold text-gray-800">Your Clients</h1>
                <Button onClick={() => setShowAddClientModal(true)}>Add Clients</Button>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg">
                {clients.length > 0 ? (
                    <ClientList
                        clients={clients}
                        onOpenAssignmentModal={handleOpenAssignmentModal}
                        onRemoveClient={setClientToRemove}
                    />
                ) : (
                    <div className="text-center py-16">
                        <EmptyStateIcon className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-2 text-lg font-semibold text-gray-800">You have no clients yet</h3>
                        <p className="mt-1 text-gray-500">Click the "Add Clients" button to find users and make them an offer.</p>
                    </div>
                )}
            </div>

            {showAssignmentModal && (
                <AssignmentModal
                    client={selectedClient}
                    assignmentType={assignmentType}
                    onClose={() => setShowAssignmentModal(false)}
                />
            )}

            {showAddClientModal && <AddClientModal onClose={() => setShowAddClientModal(false)} />}

            <ConfirmationModal
                isOpen={!!clientToRemove}
                onClose={() => setClientToRemove(null)}
                onConfirm={handleConfirmRemove}
                title="Remove Client"
                message={`Are you sure you want to remove ${clientToRemove?.firstName} ${clientToRemove?.lastName} from your client list? This action cannot be undone.`}
            />
        </div>
    );
}