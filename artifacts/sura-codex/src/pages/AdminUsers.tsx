import React from "react";
import { useListUsers, useUpdateUserRole, useBanUser, getListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ArrowLeft, Shield, ShieldOff, Ban, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { data: users, isLoading } = useListUsers();
  const updateRole = useUpdateUserRole();
  const banUser = useBanUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRoleToggle = (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "visitor" : "admin";
    updateRole.mutate({ id: userId, data: { role: newRole as any } }, {
      onSuccess: () => {
        toast({ title: `User role updated to ${newRole}` });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      }
    });
  };

  const handleBanToggle = (userId: number, isBanned: boolean) => {
    banUser.mutate({ id: userId, data: { banned: !isBanned } }, {
      onSuccess: () => {
        toast({ title: `User ${!isBanned ? 'banned' : 'unbanned'}` });
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>
      
      <h1 className="font-serif text-4xl mb-8">User Management</h1>

      <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading users...</TableCell>
              </TableRow>
            ) : users?.map(user => (
              <TableRow key={user.id} className={user.isBanned ? "opacity-50 bg-muted/50" : ""}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {user.profileImageUrl ? <AvatarImage src={user.profileImageUrl} /> : <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>}
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground {user.isBanned ? 'line-through' : ''}">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isBanned ? (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">Banned</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRoleToggle(user.id, user.role)}
                      className="text-xs"
                    >
                      {user.role === 'admin' ? <><ShieldOff className="w-3 h-3 mr-1" /> Make Visitor</> : <><Shield className="w-3 h-3 mr-1" /> Make Admin</>}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleBanToggle(user.id, user.isBanned)}
                      className="text-xs"
                    >
                      {user.isBanned ? <><CheckCircle className="w-3 h-3 mr-1" /> Unban</> : <><Ban className="w-3 h-3 mr-1" /> Ban</>}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}