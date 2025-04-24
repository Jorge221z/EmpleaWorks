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
  id?: number;
  name?: string;       // Añadido para acceder a company.name
  description?: string; // Añadido para acceder a company.description
  address?: string;
  weblink?: string;    // Nota: en tu SearchBar usas web_link pero aquí está como weblink
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
    // Otros campos del usuario si los hay
}

export interface ShowOfferProps {
  offer: Offer;
}