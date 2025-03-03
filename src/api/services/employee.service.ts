// Juan [NOTE, 2025-02-27] Importamos el cliente tRPC
import { trpcClient } from '../trpc/client';

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
  // Juan [NOTE, 2025-02-27] Método para obtener todos los empleados usando tRPC
  static async getAllEmployees(): Promise<Employee[]> {
    try {
      // Usamos el cliente mock de tRPC
      const employees = await trpcClient.employee.getAll.query();
      // Aseguramos que el resultado cumpla con la interfaz Employee[]
      return employees as Employee[];
    } catch (error) {
      console.error('Error fetching employees with tRPC:', error);
      throw error;
    }
  }

  // Juan [NOTE, 2025-02-27] Método para obtener un empleado por ID usando tRPC
  static async getEmployeeById(id: string): Promise<Employee> {
    try {
      // Usamos el cliente mock de tRPC
      await trpcClient.employee.getById.query();
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

  // Juan [NOTE, 2025-02-27] Método para crear un empleado usando tRPC
  static async createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      // Usamos el cliente mock de tRPC
      await trpcClient.employee.create.mutate();
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

  // Juan [NOTE, 2025-02-27] Método para actualizar un empleado usando tRPC
  static async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    try {
      // Usamos el cliente mock de tRPC
      await trpcClient.employee.update.mutate();
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

  // Juan [NOTE, 2025-02-27] Método para eliminar un empleado usando tRPC
  static async deleteEmployee(id: string): Promise<void> {
    try {
      // Usamos el cliente mock de tRPC
      await trpcClient.employee.delete.mutate();
    } catch (error) {
      console.error(`Error deleting employee with ID ${id} with tRPC:`, error);
      throw error;
    }
  }
}
