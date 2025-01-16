export interface IConsumption {
    _id: string;
    nama: string;
    harga: number;
    lauk: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface IConsumptionInput {
    nama: string;
    harga: number;
    lauk: string[];
  }
  
  export interface IConsumptionCategory {
    id: string;
    name: string;
  }
  
  export type ConsumptionResponse = {
    message: string;
    data: IConsumption;
  };
  
  export type ConsumptionsResponse = {
    data: IConsumption[];
    message?: string;
  };
  
  export type ConsumptionError = {
    message: string;
    error?: string;
  };