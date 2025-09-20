using System;
using MySql.Data.MySqlClient;

class Program
{
    static void Main()
    {
        Console.WriteLine("Simulador de alerta FamilyCare");

        // Configuração do banco
        string connStr = "Server=localhost;Database=familycare;Uid=root;Pwd=;";

        // Simular alertas
        while (true)
        {
            Console.Write("Digite o numero do dispositivo (ou 'sair'): ");
            string numeroSerie = Console.ReadLine();
            if (numeroSerie.ToLower() == "sair") break;

            Console.Write("Digite o tipo de alerta (automatico, manual, virtual): ");
            string tipo = Console.ReadLine();

            RegistrarAlerta(numeroSerie, tipo, connStr);
        }
    }

    static void RegistrarAlerta(string numeroSerie, string tipo, string connStr)
    {
        using (var conn = new MySqlConnection(connStr))
        {
            conn.Open();

            // Buscar idoso dono do dispositivo
            string queryIdoso = "SELECT idosoId FROM dispositivos WHERE numeroSerie = @numeroSerie";
            object result;
            using (var cmd = new MySqlCommand(queryIdoso, conn))
            {
                cmd.Parameters.AddWithValue("@numeroSerie", numeroSerie);
                result = cmd.ExecuteScalar();
            }

            if (result == null)
            {
                Console.WriteLine("Dispositivo não encontrado no banco.");
                return;
            }

            int idosoId = Convert.ToInt32(result);

            // Inserir alerta
            string insert = "INSERT INTO alertas (idosoId, tipo, status) VALUES (@idosoId, @tipo, 'ativo')";
            using (var cmd = new MySqlCommand(insert, conn))
            {
                cmd.Parameters.AddWithValue("@idosoId", idosoId);
                cmd.Parameters.AddWithValue("@tipo", tipo);
                cmd.ExecuteNonQuery();
            }

            Console.WriteLine($"Alerta registrado para idoso {idosoId} ({tipo}).");
        }
    }
}
