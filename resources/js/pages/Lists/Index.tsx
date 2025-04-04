import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Pencil, Trash2, Plus, FileDown } from 'lucide-react';

interface ContactList {
  id: number;
  name: string;
  contacts_count: number;
}

interface Props {
  lists: ContactList[];
}

export default function Index({ lists }: Props) {
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

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
      router.delete(`/lists/${id}`);
    }
  };

  return (
    <>
      <Head title="Listes de contacts" />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listes de contacts</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer une liste
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle liste</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nom de la liste"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Button onClick={handleCreate} className="w-full">
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {editingList?.id === list.id ? (
                    <Input
                      value={editingList.name}
                      onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                      onBlur={handleUpdate}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                      autoFocus
                    />
                  ) : (
                    <span>{list.name}</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span>{list.contacts_count} contacts</span>
                  <div className="flex gap-2">
                    <Link href={`/lists/${list.id}/contacts`}>
                      <Button variant="outline" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingList(list)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(list.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}