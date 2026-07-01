// Obstacle Avoiding Robot + LEDs
// ============================================

#define IR_LEFT   7
#define IR_RIGHT  8

#define IN1  2
#define IN2  3
#define IN3  4
#define IN4  5

// LED Pins
#define LED_GREEN   9
#define LED_YELLOW  10
#define LED_RED     11

void setup() {
  pinMode(IR_LEFT, INPUT);
  pinMode(IR_RIGHT, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  Serial.begin(9600);
  Serial.println("Robot Started!");
}

void loop() {
  //int left  = digitalRead(IR_LEFT);
  //int right = digitalRead(IR_RIGHT);
  
  int left=1;
  int right=1;
  
  //int left=0;
  //int right=1;
  
  //int left=1;
  //int right=0;
  
  if (left == 1 && right == 1) {
    moveForward();
  }
  else if (left == 0 && right == 1) {
    turnRight();
    delay(300);
  }
  else if (left == 1 && right == 0) {
    turnLeft();
    delay(300);
  }
  else {
    moveBackward();
    delay(400);
    turnRight();
    delay(400);
  }
  delay(100);
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  // Green LED on
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);
  Serial.println(">> FORWARD");
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  // Red LED on
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, HIGH);
  Serial.println(">> BACKWARD");
}

void turnLeft() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  // Yellow LED on
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, HIGH);
  digitalWrite(LED_RED, LOW);
  Serial.println(">> TURN LEFT");
}

void turnRight() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  // Yellow LED on
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, HIGH);
  digitalWrite(LED_RED, LOW);
  Serial.println(">> TURN RIGHT");
}