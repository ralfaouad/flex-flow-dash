import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Edit, Trash2 } from "lucide-react";
import { Member } from "@/hooks/useMembers";

interface MembersListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const MembersList = ({ members, onEdit, onDelete, loading }: MembersListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");

  const getSubscriptionStatus = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "expired", text: `Expired ${Math.abs(diffDays)} days ago`, variant: "destructive" as const };
    } else if (diffDays === 0) {
      return { status: "today", text: "Expires today", variant: "secondary" as const };
    } else if (diffDays <= 7) {
      return { status: "expiring", text: `Expires in ${diffDays} days`, variant: "secondary" as const };
    } else {
      return { status: "active", text: "Active", variant: "default" as const };
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    
    const { status } = getSubscriptionStatus(member.subscription_end_date);
    if (statusFilter === "active") return status === "active" || status === "today" || status === "expiring";
    if (statusFilter === "expired") return status === "expired";
    
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">Loading members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "expired")}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Members</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredMembers.map((member) => {
          const subscription = getSubscriptionStatus(member.subscription_end_date);
          
          return (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.picture_url} />
                      <AvatarFallback>
                        {member.first_name[0]}{member.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {member.first_name} {member.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      {member.phone_number && (
                        <p className="text-sm text-muted-foreground">{member.phone_number}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant={subscription.variant}>
                        {subscription.text}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ends: {new Date(member.subscription_end_date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No members found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};