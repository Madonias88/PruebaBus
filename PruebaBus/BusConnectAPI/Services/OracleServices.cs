using Oracle.ManagedDataAccess.Client;
using Microsoft.Extensions.Configuration;

public class OracleService
{
    private readonly string _connectionString;

    public OracleService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("OracleDb") 
            ?? throw new InvalidOperationException("Connection string 'OracleDb' not found.");
    }

    public OracleConnection GetConnection()
    {
        return new OracleConnection(_connectionString);
    }
}
