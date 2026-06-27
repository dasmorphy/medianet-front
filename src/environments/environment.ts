// Entorno de desarrollo.
// `ng build` reemplaza este archivo por `environment.prod.ts` (ver angular.json -> fileReplacements).
export const environment = {
  production: false,
  // Microservicio de Clientes
  clientesApiUrl: 'http://localhost:8081',
  // Microservicio de Cuentas (cuentas, movimientos y reportes)
  cuentasApiUrl: 'http://localhost:8082'
};
