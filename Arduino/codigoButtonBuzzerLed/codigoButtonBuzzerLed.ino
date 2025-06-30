// Pinos principais
const int BUTTON_PIN = 2;
const int BUZZER_PIN = 3;

// Pinos LED RGB (cátodo comum)
const int LED_R_PIN = 4;
const int LED_G_PIN = 5;

// Estados do botão
bool buttonState = HIGH;
bool lastButtonState = HIGH;

// Estados do sistema
enum AlertState { NONE, MANUAL_ALERT, FALL_ALERT };
AlertState alertState = NONE;
bool alertEnded = false;

unsigned long alertStartTime = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);

  pinMode(LED_R_PIN, OUTPUT);
  pinMode(LED_G_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_R_PIN, LOW);
  digitalWrite(LED_G_PIN, LOW);

  Serial.begin(9600);
}

void loop() {
  // Leitura de botão com transição (detectar borda de descida)
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

  // Simulação de queda via serial
  if (Serial.available() > 0) {
    char c = Serial.read();
    if ((c == 'Q' || c == 'q') && alertState == NONE) {
      alertState = FALL_ALERT;
      alertStartTime = millis();
      alertEnded = false;
      Serial.println("[ALERTA] Queda detectada!");
    }
  }

  // Controle do buzzer com sirene (variação de tom)
  if (alertState != NONE) {
    unsigned long duration = (alertState == MANUAL_ALERT) ? 5000 : 10000;
    if (millis() - alertStartTime >= duration) {
      if (alertState == MANUAL_ALERT) {
        Serial.println("[ALERTA] Alerta manual enviado.");
      } else {
        Serial.println("[ALERTA] Alerta de queda enviado.");
      }
      alertState = NONE;
      alertEnded = true;
      noTone(BUZZER_PIN);
    } else {
      // Sirene → varia tom de 1000Hz a 2000Hz em ciclo de 1s
      unsigned long t = (millis() - alertStartTime) % 1000;
      int freq = 1000 + (t * 1000) / 1000;
      tone(BUZZER_PIN, freq);
    }
  } else {
    noTone(BUZZER_PIN);
  }

  // Atualiza LED RGB conforme estado
  updateRGBLed();

  delay(10);
}

// Função para controlar o LED RGB
void updateRGBLed() {
  if (alertState == NONE) {
    if (alertEnded) {
      // Alerta já enviado → Vermelho fixo
      digitalWrite(LED_R_PIN, HIGH);
      digitalWrite(LED_G_PIN, LOW);
    } else {
      // Normal → Verde fixo
      digitalWrite(LED_R_PIN, LOW);
      digitalWrite(LED_G_PIN, HIGH);
    }
  } else {
    // Durante alerta → Vermelho piscando
    if ((millis() / 300) % 2 == 0) {
      digitalWrite(LED_R_PIN, HIGH);
    } else {
      digitalWrite(LED_R_PIN, LOW);
    }
    digitalWrite(LED_G_PIN, LOW);
  }
}
