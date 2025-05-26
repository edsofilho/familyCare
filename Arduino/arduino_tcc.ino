#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

const float SVM_THRESHOLD = 1.53;
const float ANGLE_THRESHOLD = 10.0;

void softwareReset() {
  // força o reset como se apertasse o botão
  asm volatile ("jmp 0");
}

void setup() {
  Wire.begin();
  Serial.begin(9600);
  mpu.initialize();

  if (!mpu.testConnection()) {
    Serial.println("ERRO: MPU6050 não conectado.");
    while (1);
  }

  delay(1000);
}

void loop() {
  int16_t ax, ay, az;
  mpu.getAcceleration(&ax, &ay, &az);

  float accelX = ax / 16384.0;
  float accelY = ay / 16384.0;
  float accelZ = az / 16384.0;

  float SVM = sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ);
  float angle = abs(atan2(accelY, accelZ) * 180 / PI);

  // Detecta travamento (todos eixos zerados)
  if (accelX == 0.0 && accelY == 0.0 && accelZ == 0.0) {
    Serial.println("⚠️ ERRO: Dados zerados. Reiniciando em 1s...");
    delay(1000);
    softwareReset();
  }

  // Atualiza a linha no terminal
  Serial.print("\033[2J");     // limpa tela
  Serial.print("\033[H");      // cursor pro topo

  Serial.print("SVM: ");
  Serial.print(SVM, 2);
  Serial.print(" g | Ângulo: ");
  Serial.print(angle, 2);
  Serial.println(" °");

  if (SVM > SVM_THRESHOLD && angle < ANGLE_THRESHOLD) {
    Serial.println("\n💥 QUEDA DETECTADA!");
    while (1);
  }

  delay(100);
}
