import { CompanyInfo } from '@/types/about';
import { Partner } from '@/types/partner';

let companyInfo: CompanyInfo = {
  description: "Our company is dedicated to providing exceptional travel experiences.",
  vision: "To become the leading travel company in the region.",
  mission: "To create unforgettable journeys that inspire and connect people.",
};

export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(companyInfo), 500);
  });
};

export const updateCompanyInfo = async (data: CompanyInfo): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      companyInfo = data;
      resolve();
    }, 500);
  });
};

let partners: Partner[] = [
  { id: '1', name: 'Partner 1', image: 'https://example.com/partner1.jpg', status: 'active' },
  { id: '2', name: 'Partner 2', image: 'https://example.com/partner2.jpg', status: 'inactive' },
  { id: '3', name: 'Partner 3', image: 'https://example.com/partner3.jpg', status: 'active' },
];

export const getPartners = async (): Promise<Partner[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(partners), 500);
  });
};

export const addPartner = async (partner: Omit<Partner, 'id'>): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPartner = { ...partner, id: Date.now().toString() };
      partners.push(newPartner);
      resolve();
    }, 500);
  });
};

export const updatePartner = async (id: string, partner: Omit<Partner, 'id'>): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = partners.findIndex(p => p.id === id);
      if (index !== -1) {
        partners[index] = { ...partner, id };
        resolve();
      } else {
        reject(new Error('Partner not found'));
      }
    }, 500);
  });
};

export const deletePartner = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = partners.length;
      partners = partners.filter(p => p.id !== id);
      if (partners.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Partner not found'));
      }
    }, 500);
  });
};

