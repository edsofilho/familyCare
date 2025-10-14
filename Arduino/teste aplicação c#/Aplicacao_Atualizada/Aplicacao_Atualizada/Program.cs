using System;
using System.IO.Ports;
using System.Threading.Tasks;
using MySqlConnector;

namespace FamilyCareSerial
{
    internal class Program
    {
        private static SerialPort? porta;

        static async Task Main(string[] args)
        {
            Console.WriteLine("=== FamilyCare Serial Listener (.NET 8) ===\n");

            try
            {
                // ⚙️ Configura a porta serial (ajuste a COM conforme seu Arduino)
                porta = new SerialPort("COM3", 9600)
                {
                    NewLine = "\n",
                    ReadTimeout = 2000
                };
                porta.DataReceived += Porta_DataReceived;
                porta.Open();

                Console.WriteLine("✔ Porta serial aberta com sucesso!");
                Console.WriteLine("Escutando dados (pressione ENTER para encerrar)...\n");
                Console.ReadLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao iniciar: {ex.Message}");
            }
            finally
            {
                porta?.Close();
            }
        }

        private static async void Porta_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            try
            {
                string? dado = porta?.ReadLine()?.Trim();
                if (string.IsNullOrWhiteSpace(dado)) return;

                string[] partes = dado.Split(';');
                if (partes.Length != 2)
                {
                    Console.WriteLine($"⚠ Dado inválido recebido: {dado}");
                    return;
                }

                string tipoAlerta = partes[0].Trim().ToLower();
                string numeroSerie = partes[1].Trim();

                if (tipoAlerta != "manual" && tipoAlerta != "automatico")
                {
                    Console.WriteLine($"⚠ Tipo de alerta inválido: {tipoAlerta}");
                    return;
                }

                Console.WriteLine($"📩 Recebido: {tipoAlerta.ToUpper()} | Dispositivo: {numeroSerie}");
                await RegistrarAlertaNoBancoAsync(numeroSerie, tipoAlerta);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro na leitura serial: {ex.Message}");
            }
        }

        private static async Task RegistrarAlertaNoBancoAsync(string numeroSerie, string tipoAlerta)
        {
            const string connStr = "Server=localhost;Database=familycare;Uid=root;Pwd=;";

            try
            {
                await using var conn = new MySqlConnection(connStr);
                await conn.OpenAsync();

                // Busca idoso vinculado ao dispositivo
                const string queryIdoso = "SELECT idosoId FROM dispositivos WHERE numeroSerie = @num";
                await using var cmdIdoso = new MySqlCommand(queryIdoso, conn);
                cmdIdoso.Parameters.AddWithValue("@num", numeroSerie);

                var result = await cmdIdoso.ExecuteScalarAsync();
                if (result == null)
                {
                    Console.WriteLine($"⚠ Dispositivo não encontrado: {numeroSerie}");
                    return;
                }

                int idosoId = Convert.ToInt32(result);

                // Insere alerta
                const string insert = "INSERT INTO alertas (idosoId, tipo, status, dataAlerta) VALUES (@id, @tipo, 'ativo', NOW())";
                await using var cmdInsert = new MySqlCommand(insert, conn);
                cmdInsert.Parameters.AddWithValue("@id", idosoId);
                cmdInsert.Parameters.AddWithValue("@tipo", tipoAlerta);

                await cmdInsert.ExecuteNonQueryAsync();
                Console.WriteLine($"✅ Alerta registrado com sucesso para idoso {idosoId} ({tipoAlerta}).\n");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao registrar no banco: {ex.Message}");
            }
        }
    }
}
