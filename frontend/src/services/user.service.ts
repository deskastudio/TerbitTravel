import axiosInstance from "@/lib/axios";
import { 
  IUser, 
  IUserInput,
  IUserUpdate,  
  UserResponse,
} from "@/types/user.types";

const USER_BASE_URL = "/user";

export const UserService = {
  getAllUsers: async (): Promise<IUser[]> => {
    const response = await axiosInstance.get<IUser[]>(`${USER_BASE_URL}/dataUser`);
    return response.data;
  },

  getUserById: async (id: string): Promise<IUser> => {
    const response = await axiosInstance.get<IUser>(`${USER_BASE_URL}/${id}`);
    return response.data;
  },

  createUser: async (data: IUserInput): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("alamat", data.alamat);
    formData.append("noTelp", data.noTelp);
    
    if (data.instansi) {
      formData.append("instansi", data.instansi);
    }
    
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const response = await axiosInstance.post<UserResponse>(
      `${USER_BASE_URL}/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateUser: async (id: string, data: IUserUpdate): Promise<UserResponse> => {
    const formData = new FormData();
    
    if (data.nama) formData.append("nama", data.nama);
    if (data.email) formData.append("email", data.email);
    if (data.alamat) formData.append("alamat", data.alamat);
    if (data.noTelp) formData.append("noTelp", data.noTelp);
    if (data.instansi) formData.append("instansi", data.instansi);
    if (data.foto) formData.append("foto", data.foto);

    const response = await axiosInstance.put<UserResponse>(
      `${USER_BASE_URL}/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `${USER_BASE_URL}/user/${id}`
    );
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axiosInstance.post(`${USER_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  },
};