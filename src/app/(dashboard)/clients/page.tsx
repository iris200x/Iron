"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClients, type ClientProfile } from '@/hooks/useClients';
import { Button } from '@/components/ui/Button';
import { ClientList } from '@/components/features/clients/ClientList';
import { AssignmentModal } from '@/components/features/clients/AssignmentModal';
import { AddClientModal } from '@/components/features/clients/AddClientModal';

type AssignmentType = 'reminder' | 'exercise';

export default function ClientsPage() {
    useAuth();
    const { clients, loading } = useClients();

    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
    const [assignmentType, setAssignmentType] = useState<AssignmentType | null>(null);

    const handleOpenAssignmentModal = (client: ClientProfile, type: AssignmentType) => {
        setSelectedClient(client);
        setAssignmentType(type);
        setShowAssignmentModal(true);
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
                    <ClientList clients={clients} onOpenAssignmentModal={handleOpenAssignmentModal} />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-600 mb-4">You do not have any clients yet.</p>
                        <p className="text-sm text-gray-500">Click the "Add Clients" button to find and message potential clients.</p>
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
        </div>
    );
}