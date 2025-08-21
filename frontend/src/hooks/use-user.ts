import { useState, useEffect, useCallback } from "react";
import { UserService } from "@/services/user.service";
import { 
  IUser, 
  IUserInput, 
  IUserUpdate,
  IUserError,
  IUserState,
  IUserDetailState 
} from "@/types/user.types";
import { useToast } from "@/hooks/use-toast";

interface UseUserOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useUserDetail = (id: string): IUserDetailState => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IUserError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await UserService.getUserById(id);
        setUser(data);
        setError(null);
      } catch (err) {
        const error = err as Error;
        setError({
          message: error.message || "Gagal mengambil detail user",
          code: "FETCH_USER_DETAIL_ERROR"
        });
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Gagal mengambil detail user.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  return { user, isLoading, error };
};

export const useUser = (options: UseUserOptions = {}) => {
  const [state, setState] = useState<IUserState>({
    users: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: options.page || 1
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await UserService.getAllUsers();
      
      let filteredData = data;
      if (options.search) {
        filteredData = data.filter(user => 
          user.nama.toLowerCase().includes(options.search!.toLowerCase()) ||
          user.email.toLowerCase().includes(options.search!.toLowerCase())
        );
      }

      if (options.status) {
        filteredData = filteredData.filter(user => user.status === options.status);
      }

      const limit = options.limit || 10;
      const start = ((state.currentPage - 1) * limit);
      const end = start + limit;
      const paginatedData = filteredData.slice(start, end);
      
      setState(prev => ({
        ...prev,
        users: paginatedData,
        totalPages: Math.ceil(filteredData.length / limit),
        loading: false,
        error: null
      }));
    } catch (err) {
      const error = err as Error;
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: error.message || "Gagal mengambil data user",
          code: "FETCH_USERS_ERROR"
        }
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data user.",
      });
    }
  }, [options.search, options.status, state.currentPage, options.limit, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setCurrentPage = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const createUser = async (data: IUserInput) => {
    try {
      setIsCreating(true);
      await UserService.createUser(data);
      await fetchUsers();
      toast({
        title: "Sukses",
        description: "User berhasil ditambahkan.",
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menambahkan user.",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateUser = async (id: string, data: IUserUpdate) => {
    try {
      setIsUpdating(true);
      await UserService.updateUser(id, data);
      await fetchUsers();
      toast({
        title: "Sukses",
        description: "User berhasil diperbarui.",
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal memperbarui user.",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setIsDeleting(true);
      await UserService.deleteUser(id);
      await fetchUsers();
      toast({
        title: "Sukses",
        description: "User berhasil dihapus.",
      });
      return true;
    } catch (err) {
      const error = err as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Gagal menghapus user.",
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    ...state,
    isCreating,
    isUpdating,
    isDeleting,
    createUser,
    updateUser,
    deleteUser,
    setCurrentPage,
    refetch: fetchUsers,
  };
};