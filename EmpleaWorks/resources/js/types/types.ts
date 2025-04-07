//definimos aqui los tipos de array de objetos para ganar modularidad y reutilizar el código//

export interface Offer {
  id: number;
  name: string;
  description: string;
  category: string;
  degree: string;
  email: string;
  contract_type: string;
  job_location: string;
  closing_date: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  company: Company;
}

export interface Company {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  logo: string;
  email: string;
  address: string;
  description: string;
  web_link: string;
}

export interface ShowOfferProps {
  offer: Offer;
}