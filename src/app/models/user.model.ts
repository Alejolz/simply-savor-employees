export interface Employee {
  userName: string;
  employeeId: number;
  employeeEmail: string;
  employeeIdentification: number;
  identificationType: string;
  employeePhone: number;
  employeeRole: string;
  recetasIds?: string[];
}

export interface LoginResponse {
  code: string;
  message: string;
  data: {
    sessionKey: string;
    employee: Employee;
  };
}