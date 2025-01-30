import axiosInstance from "@/lib/axios";
import { 
  IConsumption, 
  IConsumptionInput, 
  ConsumptionResponse, 
} from "@/types/consumption.types";

const CONSUMPTION_BASE_URL = "/consume";

export const ConsumptionService = {
  getAllConsumptions: async (): Promise<IConsumption[]> => {
    const response = await axiosInstance.get<IConsumption[]>(`${CONSUMPTION_BASE_URL}/get`);
    return response.data;
  },

  getConsumptionById: async (id: string): Promise<IConsumption> => {
    const response = await axiosInstance.get<IConsumption>(`${CONSUMPTION_BASE_URL}/${id}`);
    return response.data;
  },

  createConsumption: async (data: IConsumptionInput): Promise<ConsumptionResponse> => {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("harga", data.harga.toString());
    data.lauk.forEach((item) => {
      formData.append("lauk", item);
    });

    const response = await axiosInstance.post<ConsumptionResponse>(
      `${CONSUMPTION_BASE_URL}/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateConsumption: async (id: string, data: IConsumptionInput): Promise<ConsumptionResponse> => {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("harga", data.harga.toString());
    data.lauk.forEach((item) => {
      formData.append("lauk", item);
    });

    const response = await axiosInstance.put<ConsumptionResponse>(
      `${CONSUMPTION_BASE_URL}/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteConsumption: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
      `${CONSUMPTION_BASE_URL}/delete/${id}`
    );
    return response.data;
  },
};