import { Head } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Contact } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    list: {
        id: number;
        name: string;
        contacts: Contact[];
    };
}

export default function Show({ list }: Props) {
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });

    const handleSubmit = () => {
        router.post(`/lists/${list.id}/contacts`, formData);
        setVisible(false);
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: ''
        });
    };

    const footer = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} autoFocus />
        </div>
    );
    return (
        <AppLayout>
            <Head title={`${list.name} - Contacts`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card 
                        title={list.name}
                        className="mb-0"
                        >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <Button
                                    label="Export"
                                    icon="pi pi-download"
                                    onClick={() => {
                                        const csv = Papa.unparse(list.contacts);
                                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                        saveAs(blob, `${list.name}-contacts.csv`);
                                    }}
                                />
                                <Button
                                    label="Import CSV"
                                    icon="pi pi-upload"
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.csv';
                                        input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) {
                                                Papa.parse(file, {
                                                    complete: (results) => {
                                                        const contacts = results.data;
                                                        router.post(`/lists/${list.id}/contacts/import`, { contacts });
                                                    },
                                                    header: true
                                                });
                                            }
                                        };
                                        input.click();
                                    }}
                                />
                                <Button 
                                    label="Add Contact" 
                                    icon="pi pi-plus" 
                                    onClick={() => setVisible(true)} 
                                />
                            </div>
                        </div>
                        <DataTable value={list.contacts} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="first_name" header="First Name" />
                            <Column field="last_name" header="Last Name" />
                            <Column field="email" header="Email" />
                            <Column field="phone" header="Phone" />
                        </DataTable>
                    </Card>

                    <Dialog 
                        header="Add New Contact" 
                        visible={visible} 
                        style={{ width: '50vw' }} 
                        onHide={() => setVisible(false)}
                        footer={footer}
                        modal
                    >
                        <div className="flex flex-col gap-4 p-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="first_name">First Name</label>
                                <InputText
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="last_name">Last Name</label>
                                <InputText
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="phone">Phone</label>
                                <InputText
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}