import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutDashboard, Users } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { Dashboard } from "@/components/Dashboard";
import { MembersList } from "@/components/MembersList";
import { MemberForm } from "@/components/MemberForm";
import { Member } from "@/hooks/useMembers";

const Index = () => {
  const { members, loading, addMember, updateMember, deleteMember } = useMembers();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingMember) {
        await updateMember(editingMember.id, formData);
      } else {
        await addMember(formData);
      }
      setShowForm(false);
      setEditingMember(null);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      await deleteMember(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gym Management Dashboard</h1>
            <p className="text-muted-foreground">Manage your gym members and track subscriptions</p>
          </div>
        </div>

        {showForm ? (
          <div className="flex justify-center">
            <MemberForm
              member={editingMember}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members
                </TabsTrigger>
              </TabsList>
              
              <Button onClick={handleAddMember} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </div>

            <TabsContent value="dashboard">
              <Dashboard members={members} />
            </TabsContent>

            <TabsContent value="members">
              <MembersList
                members={members}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
