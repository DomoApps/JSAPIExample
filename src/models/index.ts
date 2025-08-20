export * from './page-filter';

export interface DomoMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

export const ClientsDataset: Record<string, string> = {
  clientId: 'client_id',
  clientName: 'client_name',
  clientAge: 'client_age',
  clientCountry: 'client_country',
  clientEmail: 'client_email',
  clientGender: 'client_gender',
  clientType: 'client_type',
  clientCompany: 'client_company',
};

export const DropdownOptions: Record<string, string> = {
  clientCountry: 'client_country',
  clientGender: 'client_gender',
  clientType: 'client_type',
  clientCompany: 'client_company',
};
