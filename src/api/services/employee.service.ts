// Juan [NOTE, 2025-02-27] Importamos el cliente tRPC
import { mockTrpcClient } from '../trpc/client';

// Juan [NOTE, 2025-02-27] Interfaces para el servicio de empleados
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  hotelId?: string;
  // Añadir más propiedades según el modelo del backend
}

// Juan [NOTE, 2025-02-27] Servicio para manejar operaciones de empleados
export class EmployeeService {
  // Juan [TOIMPLE, 2025-02-27] Implementar métod0s con API real cuando se integre tRPC
  static async getAllEmployees(): Promise<Employee[]> {
    try {
      // Usamos el cliente mock de tRPC
      const employees = await mockTrpcClient.employee.getAll.query();
      // Aseguramos que el resultado cumpla con la interfaz Employee[]
      return employees as Employee[];
    } catch (error) {
      console.error('Error fetching employees with tRPC:', error);
      throw error;
    }
  }

  // Juan [NOTE, 2025-02-27] Métod0 para obtener un empleado por ID usando tRPC
  static async getEmployeeById(id: string): Promise<Employee> {
    try {
      // Usamos el cliente mock de tRPC
      await mockTrpcClient.employee.getById.query({ id });
      // Simulamos que el empleado tiene los datos correctos
      return {
        id,
        name: 'Empleado Mock',
        email: 'empleado@ejemplo.com',
        role: 'recepcion',
        hotelId: '1',
      };
    } catch (error) {
      console.error(`Error fetching employee with ID ${id} with tRPC:`, error);
      throw error;
    }
  }

  // Juan [NOTE, 2025-02-27] Métod0 para crear un empleado usando tRPC
  static async createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      // Usamos el cliente mock de tRPC
      await mockTrpcClient.employee.create.mutate(employeeData);
      // Simulamos una respuesta
      return {
        id: 'new-id',
        ...employeeData,
      };
    } catch (error) {
      console.error('Error creating employee with tRPC:', error);
      throw error;
    }
  }

  // Juan [NOTE, 2025-02-27] Métod0 para actualizar un empleado usando tRPC
  static async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    try {
      // Usamos el cliente mock de tRPC
      await mockTrpcClient.employee.update.mutate({ id, ...employeeData });
      // Simulamos una respuesta
      return {
        id,
        name: employeeData.name || 'Empleado Actualizado',
        email: employeeData.email || 'actualizado@ejemplo.com',
        role: employeeData.role || 'recepcion',
        hotelId: employeeData.hotelId || '1',
      };
    } catch (error) {
      console.error(`Error updating employee with ID ${id} with tRPC:`, error);
      throw error;
    }
  }

  // Juan [NOTE, 2025-02-27] Métod0 para eliminar un empleado usando tRPC
  static async deleteEmployee(id: string): Promise<void> {
    try {
      // Usamos el cliente mock de tRPC
      await mockTrpcClient.employee.delete.mutate({ id });
    } catch (error) {
      console.error(`Error deleting employee with ID ${id} with tRPC:`, error);
      throw error;
    }
  }

  // Juan [TOIMPLE, 2025-02-27] Implementar métod0s adicionales como activar/desactivar empleados
}
