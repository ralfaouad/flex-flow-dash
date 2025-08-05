import { Member } from "@/hooks/useMembers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, AlertTriangle, TrendingUp } from "lucide-react";

interface DashboardProps {
  members: Member[];
}

export const Dashboard = ({ members }: DashboardProps) => {
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Calculate metrics
  const renewalsToday = members.filter(member => {
    const endDate = new Date(member.subscription_end_date);
    return endDate.toDateString() === today.toDateString();
  });

  const upcomingRenewals = members.filter(member => {
    const endDate = new Date(member.subscription_end_date);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  const expiredSubscriptions = members.filter(member => {
    const endDate = new Date(member.subscription_end_date);
    return endDate < today;
  });

  const activeMembers = members.filter(member => {
    const endDate = new Date(member.subscription_end_date);
    return endDate >= today;
  });

  const renewedThisMonth = members.filter(member => {
    const startDate = new Date(member.subscription_start_date);
    return startDate >= thisMonth;
  });

  const renewalPercentage = members.length > 0 
    ? Math.round((renewedThisMonth.length / members.length) * 100) 
    : 0;

  const expiredThisWeek = expiredSubscriptions.filter(member => {
    const endDate = new Date(member.subscription_end_date);
    return endDate >= thisWeek;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {members.length} total members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewals This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renewalPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {renewedThisMonth.length} renewed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewals Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renewalsToday.length}</div>
            <p className="text-xs text-muted-foreground">
              Subscriptions ending today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired This Week</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredThisWeek.length}</div>
            <p className="text-xs text-muted-foreground">
              {expiredSubscriptions.length} total expired
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Renewals Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {renewalsToday.length === 0 ? (
                <p className="text-muted-foreground">No renewals today</p>
              ) : (
                renewalsToday.map(member => (
                  <div key={member.id} className="flex justify-between items-center">
                    <span className="font-medium">
                      {member.first_name} {member.last_name}
                    </span>
                    <Badge variant="secondary">Today</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Renewals (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingRenewals.length === 0 ? (
                <p className="text-muted-foreground">No upcoming renewals</p>
              ) : (
                upcomingRenewals.map(member => {
                  const endDate = new Date(member.subscription_end_date);
                  const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={member.id} className="flex justify-between items-center">
                      <span className="font-medium">
                        {member.first_name} {member.last_name}
                      </span>
                      <Badge variant="secondary">
                        {diffDays} day{diffDays !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Expired Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiredSubscriptions.length === 0 ? (
                <p className="text-muted-foreground">No expired subscriptions</p>
              ) : (
                expiredSubscriptions.slice(0, 5).map(member => {
                  const endDate = new Date(member.subscription_end_date);
                  const diffDays = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={member.id} className="flex justify-between items-center">
                      <span className="font-medium">
                        {member.first_name} {member.last_name}
                      </span>
                      <Badge variant="destructive">
                        {diffDays} day{diffDays !== 1 ? 's' : ''} ago
                      </Badge>
                    </div>
                  );
                })
              )}
              {expiredSubscriptions.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  +{expiredSubscriptions.length - 5} more expired
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};