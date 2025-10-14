#include <Wire.h>
#include <MPU6050.h>

// ----------------------
// CONFIGURAÇÃO DISPOSITIVO
// ----------------------
const char* DEVICE_ID = "DISP001";  // número de série único do dispositivo

// ----------------------
// MPU6050 - VARIÁVEIS
// ----------------------
MPU6050 mpu;

const float SVM_THRESHOLD = 2.33;
const float ANGLE_X_THRESHOLD = 45;
const float ANGLE_Y_THRESHOLD = 45;
const float ANGLE_Z_THRESHOLD = 60;

const unsigned long IMMOBILITY_TIME = 2000;
const float SVM_MOVEMENT_TOLERANCE = 1.3;

unsigned long impactTime = 0;
bool possibleFall = false;

// ----------------------
// SISTEMA DE ALERTA
// ----------------------
const int BUTTON_PIN = 2;
const int BUZZER_PIN = 3;

// Estados do botão
bool buttonState = HIGH;
bool lastButtonState = HIGH;

// Estados do sistema
enum AlertState { NONE, MANUAL_ALERT, FALL_ALERT };
AlertState alertState = NONE;
bool alertEnded = false;

unsigned long alertStartTime = 0;

// ----------------------
// FUNÇÃO DE RESET
// ----------------------
void softwareReset() {
  asm volatile ("jmp 0");
}

// ----------------------
// SETUP
// ----------------------
void setup() {
  Wire.begin();
  Serial.begin(9600);

  // Inicializa MPU6050
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("ERRO: MPU6050 não conectado.");
    while (1);
  }

  // Pinos do sistema de alerta
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("Sistema iniciado. Pressione botão, digite 'Q' ou provoque queda.");
}

// ----------------------
// LOOP PRINCIPAL
// ----------------------
void loop() {
  // --- Leitura botão manual ---
  buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == LOW && lastButtonState == HIGH) {
    if (alertState == NONE) {
      alertState = MANUAL_ALERT;
      alertStartTime = millis();
      alertEnded = false;
      Serial.println("[ALERTA] Alerta manual disparado.");
    } else {
      alertState = NONE;
      alertEnded = false;
      noTone(BUZZER_PIN);
      Serial.println("[ALERTA] Alerta cancelado pelo usuário.");
    }
  }
  lastButtonState = buttonState;

  // --- Simulação de queda via serial ---
  if (Serial.available() > 0) {
    char c = Serial.read();
    if ((c == 'Q' || c == 'q') && alertState == NONE) {
      disparaQueda("[ALERTA] Queda simulada pelo terminal!");
    }
  }

  // --- Leitura MPU6050 (detecção real de queda) ---
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
        disparaQueda("[ALERTA] Queda confirmada pelo MPU6050!");
        possibleFall = false;
      } else {
        Serial.println("Falso positivo. Movimento detectado após impacto.");
        possibleFall = false;
      }
    }
  }

  // --- Controle do buzzer durante alertas ---
  gerenciarAlertas();

  delay(10);
}

// ----------------------
// FUNÇÕES AUXILIARES
// ----------------------
void disparaQueda(String mensagem) {
  if (alertState == NONE) {
    alertState = FALL_ALERT;
    alertStartTime = millis();
    alertEnded = false;
    Serial.println(mensagem);
  }
}

void gerenciarAlertas() {
  if (alertState != NONE) {
    unsigned long duration = (alertState == MANUAL_ALERT) ? 5000 : 10000;
    if (millis() - alertStartTime >= duration) {
      if (alertState == MANUAL_ALERT) {
        Serial.print("manual;");
        Serial.println(DEVICE_ID);
      } else {
        Serial.print("automatico;");
        Serial.println(DEVICE_ID);
      }
      alertState = NONE;
      alertEnded = true;
      noTone(BUZZER_PIN);
    } else {
      unsigned long t = (millis() - alertStartTime) % 1000;
      int freq = 1000 + (t * 1000) / 1000;
      tone(BUZZER_PIN, freq);
    }
  } else {
    noTone(BUZZER_PIN);
  }
}
