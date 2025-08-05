import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  picture_url?: string;
  subscription_start_date: string;
  subscription_end_date: string;
  created_at: string;
  updated_at: string;
}

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Member added successfully",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => prev.map(member => 
        member.id === id ? data : member
      ));
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMembers(prev => prev.filter(member => member.id !== id));
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    addMember,
    updateMember,
    deleteMember,
    refetch: fetchMembers,
  };
};