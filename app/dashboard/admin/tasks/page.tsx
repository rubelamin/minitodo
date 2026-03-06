//app\dashboard\admin\tasks\page.tsx
"use client";
import { trpc } from "@/utils/trpc";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Search,
  Trash2,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ListTodo,
  Users,
  Filter,
} from "lucide-react";

function AdminTaskPage() {
  const utils = trpc.useUtils();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [taskToDelete, setTaskToDelete] = React.useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { data: tasks = [], isLoading } = trpc.admin.getAllTasks.useQuery();

  const deleteTaskById = trpc.admin.deleteTask.useMutation({
    onSuccess: async () => {
      await utils.admin.getAllTasks.invalidate();
      await utils.admin.getAllTasks.refetch();
      toast.success("Task deleted", {
        description: "The task has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to delete task",
      });
    },
  });

  const deleteTask = () => {
    if (!taskToDelete) return;
    deleteTaskById.mutate(taskToDelete);
  };

  const confirmDelete = (id: string) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "PENDING").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS" || "PENDING",
  ).length;
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;
  const uniqueUsers = new Set(tasks.map((task) => task.userId)).size;

  // Filter tasks based on search term and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.status ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.user?.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (task.user?.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-700 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "IN_PROGRESS":
        return <Clock className="h-3 w-3 mr-1" />;
      case "PENDING":
        return <Circle className="h-3 w-3 mr-1" />;
      default:
        return <AlertCircle className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8 gap-6 w-full mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ListTodo className="h-8 w-8 text-blue-600" />
            Task Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage all tasks across users
          </p>
        </div>
        <Badge variant="outline" className="w-fit px-4 py-2 text-sm">
          <Users className="h-4 w-4 mr-2" />
          {uniqueUsers} active users
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Circle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {((pendingTasks / totalTasks) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inProgressTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {((inProgressTasks / totalTasks) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {((completedTasks / totalTasks) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, status, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <Badge variant="secondary" className="px-3 py-2">
          {filteredTasks.length} tasks found
        </Badge>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            View and manage all tasks in the system across different users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Task</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[150px]">
                      User
                    </TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[150px]">
                      Created
                    </TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[150px]">
                      Updated
                    </TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No tasks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm sm:text-base">
                              {task.title}
                            </span>
                            <span className="text-xs text-gray-400">
                              v{task.version}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getInitials(task.user?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {task.user?.name || "Unknown"}
                              </span>
                              <span className="text-xs text-gray-500 truncate max-w-[120px]">
                                {task.user?.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`gap-1 ${getStatusColor(task.status)}`}
                          >
                            {getStatusIcon(task.status)}
                            {task.status.replace("_", " ")}
                          </Badge>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(task.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(task.updatedAt)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(`mailto:${task.user?.email}`)
                                }
                                className="cursor-pointer"
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Email user</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  /* View task details */
                                }}
                                className="cursor-pointer"
                              >
                                <ListTodo className="mr-2 h-4 w-4" />
                                <span>View details</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => confirmDelete(task.id)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete task</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task and remove it from the user&apos;s list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTask}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteTaskById.isPending}
            >
              {deleteTaskById.isPending ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminTaskPage;
