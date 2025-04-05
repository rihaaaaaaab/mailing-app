import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea'; // Added for Body
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

interface Campaign {
  id: number;
  name: string;
  template_id: number | null;
  list_id: number | null;
  subject: string;
  body: string;
  start_date: string | null;
  days_active: string[];
  time_start: string | null;
  time_end: string | null;
}

interface Template {
  id: number;
  name: string;
}

interface ContactList {
  id: number;
  name: string;
}

interface Props {
  campaigns: Campaign[];
  templates: Template[];
  lists: ContactList[];
}

export default function CampaignIndex({ campaigns, templates, lists }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    template_id: null,
    list_id: null,
    subject: '',
    body: '',
    start_date: null,
    days_active: [],
    time_start: null,
    time_end: null,
  });

  const days = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];

  const handleCreate = () => {
    router.post('/campaigns', formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({
          name: '',
          template_id: null,
          list_id: null,
          subject: '',
          body: '',
          start_date: null,
          days_active: [],
          time_start: null,
          time_end: null,
        });
      },
    });
  };

  const handleUpdate = () => {
    if (editingCampaign) {
      router.put(`/campaigns/${editingCampaign.id}`, editingCampaign, {
        onSuccess: () => setEditingCampaign(null),
      });
    }
  };

  const handleDelete = (id: number) => {
    confirmDialog({
      message: 'Are you sure you want to delete this campaign?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => router.delete(`/campaigns/${id}`),
    });
  };

  const actionBodyTemplate = (rowData: Campaign) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        aria-label="Edit"
        onClick={() => setEditingCampaign(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Delete"
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  return (
    <>
      <Head title="Campaigns" />
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <Button
            icon="pi pi-plus"
            label="Create Campaign"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>

        <DataTable value={campaigns} tableStyle={{ minWidth: '50rem' }}>
          <Column field="name" header="Name" sortable />
          <Column field="subject" header="Subject" sortable />
          <Column field="start_date" header="Start Date" sortable />
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
        </DataTable>

        {/* Create Campaign Dialog */}
        <Dialog
          visible={isCreateOpen}
          onHide={() => setIsCreateOpen(false)}
          header="Create New Campaign"
          modal
          style={{ width: '60vw' }}
        >
          <div className="flex flex-col gap-4 mt-4">
            {/* Campaign Name */}
            <div>
              <label className="font-semibold mb-1 block">Campaign Name</label>
              <InputText
                placeholder="Enter Campaign Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Template and List Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold mb-1 block">Template</label>
                <Dropdown
                  value={formData.template_id}
                  options={templates.map((t) => ({ label: t.name, value: t.id }))}
                  onChange={(e) => setFormData({ ...formData, template_id: e.value })}
                  placeholder="Select Template"
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Contact List</label>
                <Dropdown
                  value={formData.list_id}
                  options={lists.map((l) => ({ label: l.name, value: l.id }))}
                  onChange={(e) => setFormData({ ...formData, list_id: e.value })}
                  placeholder="Select List"
                  className="w-full"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="font-semibold mb-1 block">Subject</label>
              <InputText
                placeholder="Enter Email Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Body */}
            <div>
              <label className="font-semibold mb-1 block">Body</label>
              <InputTextarea
                placeholder="Write your email body here..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={6}
                className="w-full"
              />
            </div>

            {/* Schedule Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold mb-1 block">Start Date</label>
                <Calendar
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.value })}
                  placeholder="Pick Start Date"
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-semibold mb-1 block">Active Days</label>
                <MultiSelect
                  value={formData.days_active}
                  options={days}
                  onChange={(e) => setFormData({ ...formData, days_active: e.value })}
                  placeholder="Select Days"
                  className="w-full"
                />
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold mb-1 block">Start Time</label>
                <InputText
                  placeholder="Start Time (e.g., 09:00)"
                  value={formData.time_start}
                  onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-semibold mb-1 block">End Time</label>
                <InputText
                  placeholder="End Time (e.g., 17:00)"
                  value={formData.time_end}
                  onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button label="Create Campaign" onClick={handleCreate} className="w-full mt-4" />
          </div>
        </Dialog>

        {/* Edit Campaign Dialog */}
        <Dialog
          visible={!!editingCampaign}
          onHide={() => setEditingCampaign(null)}
          header="Edit Campaign"
          modal
          style={{ width: '50vw' }}
        >
          {editingCampaign && (
            <div className="flex flex-col gap-4 mt-4">
              <InputText
                value={editingCampaign.name}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign, name: e.target.value })
                }
                className="w-full"
              />
              <InputText
                value={editingCampaign.subject}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign, subject: e.target.value })
                }
                className="w-full"
              />
              <InputTextarea
                value={editingCampaign.body}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign, body: e.target.value })
                }
                rows={6}
                className="w-full"
              />
              <Button label="Update" onClick={handleUpdate} className="w-full" />
            </div>
          )}
        </Dialog>

        <ConfirmDialog />
      </div>
    </>
  );
}
