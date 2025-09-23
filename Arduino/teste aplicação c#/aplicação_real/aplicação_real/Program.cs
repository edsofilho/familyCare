using System;
using System.IO.Ports;
using MySql.Data.MySqlClient;

namespace FamilyCareSerial
{
    class Program
    {
        static void Main(string[] args)
        {
            // Configura a porta serial
            SerialPort porta = new SerialPort("COM9", 9600); // Ajuste o COM e baudrate
            porta.DataReceived += Porta_DataReceived;

            try
            {
                porta.Open();
                Console.WriteLine("Escutando a porta serial... Pressione ENTER para sair.");
                Console.ReadLine();
                porta.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao abrir a porta serial: " + ex.Message);
            }
        }

        private static void Porta_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            SerialPort porta = (SerialPort)sender;
            try
            {
                string dado = porta.ReadLine().Trim();
                string[] partes = dado.Split(';');

                if (partes.Length != 2)
                {
                    Console.WriteLine("Formato inválido recebido: " + dado);
                    return;
                }

                string tipoAlerta = partes[0].ToLower();
                string numeroSerie = partes[1];

                if (tipoAlerta != "automatico" && tipoAlerta != "manual")
                {
                    Console.WriteLine("Tipo de alerta inválido: " + tipoAlerta);
                    return;
                }

                // Conectar ao MySQL
                string connStr = "Server=localhost;Database=familycare;Uid=root;Pwd=;";
                using (MySqlConnection conn = new MySqlConnection(connStr))
                {
                    conn.Open();

                    // Descobrir idoso dono do dispositivo
                    string queryIdoso = "SELECT idosoId FROM dispositivos WHERE numeroSerie=@num";
                    MySqlCommand cmdIdoso = new MySqlCommand(queryIdoso, conn);
                    cmdIdoso.Parameters.AddWithValue("@num", numeroSerie);

                    object result = cmdIdoso.ExecuteScalar();

                    if (result == null)
                    {
                        Console.WriteLine("Dispositivo não cadastrado: " + numeroSerie);
                        return;
                    }

                    int idosoId = Convert.ToInt32(result);

                    // Inserir alerta
                    string queryInsert = "INSERT INTO alertas (idosoId, tipo, status, dataAlerta) VALUES (@idosoId, @tipo, 'ativo', NOW())";
                    MySqlCommand cmdInsert = new MySqlCommand(queryInsert, conn);
                    cmdInsert.Parameters.AddWithValue("@idosoId", idosoId);
                    cmdInsert.Parameters.AddWithValue("@tipo", tipoAlerta);

                    cmdInsert.ExecuteNonQuery();

                    Console.WriteLine($"Alerta registrado para idoso {idosoId} ({tipoAlerta})");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao processar dado da serial: " + ex.Message);
            }
        }
    }
}
