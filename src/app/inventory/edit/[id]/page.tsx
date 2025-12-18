'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { itemService } from '@/lib/api';
import { toast } from 'react-toastify';
import { BackButton } from '@/components/ui/BackButton';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EditItem() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams() as { id?: string | string[] };
  const itemId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: 1,
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/inventory');
      return;
    }

    if (!itemId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const numericId = parseInt(itemId, 10);
        const itemResponse = await itemService.getById(numericId);
        const itemData = itemResponse.data.data || itemResponse.data;

        setItem(itemData);
        setFormData({
          name: itemData.name || '',
          type: itemData.type || '',
          quantity: itemData.quantity || 1,
        });
      } catch (error: any) {
        console.error('Error fetching item data:', error);
        toast.error(error.response?.data?.message || 'Failed to load item data');
        router.push('/inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        name: formData.name,
        type: formData.type,
        quantity: formData.quantity,
      };

      const numericId = parseInt(itemId as string, 10);
      const response = await itemService.update(numericId, payload);
      toast.success(response.data.message || 'Item updated successfully');
      router.push(`/inventory/${itemId}`);
    } catch (error: any) {
      console.error('Error updating item:', error);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(', ')
          : 'Failed to update item');
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Loading item data..." />;
  }

  if (!item) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-900">Item not found</h2>
        <BackButton href="/inventory" className="mt-4 inline-flex" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton
          href={`/inventory/${itemId}`}
          label="Back to Item Details"
          className="mb-4"
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
          <p className="mt-1 text-sm text-gray-500">Update item information and details</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="name"
                type="text"
                label="Item Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  id="type"
                  type="text"
                  label="Type"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Enter item type"
                />
              </div>

              <div>
                <Input
                  id="quantity"
                  type="number"
                  label="Quantity"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  placeholder="Enter quantity"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/inventory/${itemId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={saving}>
                Update Item
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

