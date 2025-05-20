//Definimos aqui los tipos de array de objetos para ganar modularidad y reutilizar el código//

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
  id?: number;
  name?: string;
  description?: string;
  address?: string;
  web_link?: string;
  email?: string;
  logo?: string | null;
}

export interface Candidate {
    surname: string;
    cv: string | null;
}
export interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    image: string | null;
    description: string | null;
    candidate?: Candidate;
    company?: Company;
    email_verified_at: string | null;
}

export interface ShowOfferProps {
  offer: Offer;
}
