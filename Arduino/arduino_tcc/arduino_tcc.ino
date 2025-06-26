#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

const float SVM_THRESHOLD = 2.33;
const float ANGLE_X_THRESHOLD = 45;
const float ANGLE_Y_THRESHOLD = 45;
const float ANGLE_Z_THRESHOLD = 60;

const unsigned long IMMOBILITY_TIME = 2000;
const float SVM_MOVEMENT_TOLERANCE = 1.3;

unsigned long impactTime = 0;
bool possibleFall = false;

void softwareReset() {
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

  float angleX = abs(atan2(accelY, sqrt(accelX * accelX + accelZ * accelZ)) * 180 / PI);
  float angleY = abs(atan2(accelX, sqrt(accelY * accelY + accelZ * accelZ)) * 180 / PI);
  float angleZ = abs(atan2(sqrt(accelX * accelX + accelY * accelY), accelZ) * 180 / PI);

  if (accelX == 0.0 && accelY == 0.0 && accelZ == 0.0) {
    Serial.println("ERRO NO SENSOR. Reiniciando...");
    delay(500);
    softwareReset();
  }

  Serial.print("SVM: "); Serial.print(SVM);
  Serial.print("\tX: "); Serial.print(angleX);
  Serial.print("\tY: "); Serial.print(angleY);
  Serial.print("\tZ: "); Serial.println(angleZ);

  unsigned long currentTime = millis();

  if (!possibleFall && SVM > SVM_THRESHOLD &&
      (angleX > ANGLE_X_THRESHOLD || angleY > ANGLE_Y_THRESHOLD || angleZ > ANGLE_Z_THRESHOLD)) {
    possibleFall = true;
    impactTime = currentTime;
    Serial.println("Possível queda detectada, aguardando imobilidade...");
  }

  if (possibleFall) {
    if (currentTime - impactTime >= IMMOBILITY_TIME) {
      if (SVM < SVM_MOVEMENT_TOLERANCE) {
        Serial.println("QUEDA CONFIRMADA!");
        while (1);
      } else {
        Serial.println("Falso positivo. Movimento detectado após impacto.");
        possibleFall = false;
      }
    }
  }

  delay(100);
}

