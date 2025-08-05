import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "@/hooks/useMembers";

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const MemberForm = ({ member, onSubmit, onCancel, isSubmitting }: MemberFormProps) => {
  const [formData, setFormData] = useState({
    first_name: member?.first_name || '',
    last_name: member?.last_name || '',
    email: member?.email || '',
    phone_number: member?.phone_number || '',
    picture_url: member?.picture_url || '',
    subscription_start_date: member?.subscription_start_date || '',
    subscription_end_date: member?.subscription_end_date || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{member ? 'Edit Member' : 'Add New Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="picture_url">Picture URL</Label>
            <Input
              id="picture_url"
              value={formData.picture_url}
              onChange={(e) => handleChange('picture_url', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subscription_start_date">Start Date</Label>
              <Input
                id="subscription_start_date"
                type="date"
                value={formData.subscription_start_date}
                onChange={(e) => handleChange('subscription_start_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="subscription_end_date">End Date</Label>
              <Input
                id="subscription_end_date"
                type="date"
                value={formData.subscription_end_date}
                onChange={(e) => handleChange('subscription_end_date', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : member ? 'Update' : 'Add Member'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};