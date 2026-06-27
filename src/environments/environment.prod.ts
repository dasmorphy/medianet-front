// Entorno de producción.
// En despliegue con Docker/Nginx las rutas se sirven detrás de un proxy reverso.
export const environment = {
  production: true,
  clientesApiUrl: '/api/clientes-service',
  cuentasApiUrl: '/api/cuentas-service'
};
