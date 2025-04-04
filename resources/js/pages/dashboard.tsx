import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

interface ContactList {
  id: number;
  name: string;
  contacts_count: number;
}

interface Props {
  lists: ContactList[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ lists }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [editingList, setEditingList] = useState<ContactList | null>(null);

    const handleCreate = () => {
        router.post('/lists', { name: newListName }, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setNewListName('');
            }
        });
    };

    const handleUpdate = () => {
        if (editingList) {
            router.put(`/lists/${editingList.id}`, { name: editingList.name }, {
                onSuccess: () => setEditingList(null)
            });
        }
    };



    const actionBodyTemplate = (rowData: ContactList) => {
        return (
            <div className="flex gap-2">
                <Link href={`/lists/${rowData.id}/contacts`}>
                    <Button icon="pi pi-eye" rounded outlined aria-label="View" />
                </Link>
                <Button icon="pi pi-pencil" rounded outlined aria-label="Edit" onClick={() => setEditingList(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" aria-label="Delete" onClick={() => handleDelete(rowData.id)} />
            </div>
        );
    };

    const handleDelete = (id: number) => {
        confirmDialog({
            message: 'Êtes-vous sûr de vouloir supprimer cette liste ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => router.delete(`/lists/${id}`)
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Listes de contacts</h1>
                    <Button icon="pi pi-plus" label="Créer une liste" onClick={() => setIsCreateOpen(true)} />
                </div>

                <DataTable value={lists} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Nom" sortable />
                    <Column field="contacts_count" header="Contacts" sortable />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>

                <Dialog visible={isCreateOpen} onHide={() => setIsCreateOpen(false)} header="Nouvelle liste" modal style={{ width: '50vw' }}>
                    <div className="flex flex-col gap-4 mt-4">
                        <InputText
                            placeholder="Nom de la liste"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="w-full"
                        />
                        <Button label="Créer" onClick={handleCreate} className="w-full" />
                    </div>
                </Dialog>

                <Dialog visible={!!editingList} onHide={() => setEditingList(null)} header="Modifier la liste" modal style={{ width: '50vw' }}>
                    {editingList && (
                        <div className="flex flex-col gap-4 mt-4">
                            <InputText
                                value={editingList.name}
                                onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                                className="w-full"
                            />
                            <Button label="Mettre à jour" onClick={handleUpdate} className="w-full" />
                        </div>
                    )}
                </Dialog>

                <ConfirmDialog />
            </div>
        </AppLayout>
    );
}
