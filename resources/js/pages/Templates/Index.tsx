import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/Layouts/app-layout';

interface Template {
  id: number;
  name: string;
  content: string;
  preview: string;
}

interface Props {
  templates: Template[];
}

export default function TemplateIndex({ templates }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
  });

  const handleCreate = () => {
    if (!formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    router.post('/templates', formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({ name: '', content: '' });
      },
      onError: (errors) => {
        alert('Failed to create template: ' + Object.values(errors).join(', '));
      },
    });
  };

  const handleUpdate = () => {
    if (editingTemplate) {
      router.put(`/templates/${editingTemplate.id}`, editingTemplate, {
        onSuccess: () => setEditingTemplate(null),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      router.delete(`/templates/${id}`);
    }
  };

  return (
    <AppLayout>
      <Head title="Templates" />

      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Template Name *</label>
                  <Input
                    placeholder="Enter template name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Content *</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    placeholder="Enter template content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full">
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <Card key={template.id} className="w-full">
              <CardContent className="pt-6">
                <Dialog
                  open={editingTemplate?.id === template.id}
                  onOpenChange={(isOpen) => setEditingTemplate(isOpen ? template : null)}
                >
                  <DialogTrigger asChild>
                    <div className="space-y-3 mb-4 cursor-pointer">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.preview}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={editingTemplate?.name || ''}
                        onChange={(e) =>
                          setEditingTemplate({ ...editingTemplate!, name: e.target.value })
                        }
                        placeholder="Template Name"
                      />
                      <textarea
                        className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                        value={editingTemplate?.content || ''}
                        onChange={(e) =>
                          setEditingTemplate({ ...editingTemplate!, content: e.target.value })
                        }
                        placeholder="Content"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleUpdate} className="flex-1">
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingTemplate(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}