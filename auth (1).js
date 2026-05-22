generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(CLIENT)
  createdAt    DateTime @default(now())

  professional  Professional?
  appointments  Appointment[]
  notifications Notification[]
  reviews       Review[]
}

enum Role {
  CLIENT
  PROFESSIONAL
  ADMIN
}

model Professional {
  id        String  @id @default(uuid())
  userId    String  @unique
  bio       String?
  phone     String?
  avgRating Float   @default(0)
  isActive  Boolean @default(true)

  user         User           @relation(fields: [userId], references: [id])
  services     Service[]
  availability Availability[]
  appointments Appointment[]
}

model Service {
  id             String  @id @default(uuid())
  professionalId String
  name           String
  description    String?
  durationMin    Int
  price          Float

  professional Professional  @relation(fields: [professionalId], references: [id])
  appointments Appointment[]
}

model Availability {
  id             String   @id @default(uuid())
  professionalId String
  date           DateTime
  startTime      String
  endTime        String
  isBlocked      Boolean  @default(false)

  professional Professional @relation(fields: [professionalId], references: [id])
}

model Appointment {
  id             String            @id @default(uuid())
  clientId       String
  professionalId String
  serviceId      String
  scheduledAt    DateTime
  status         AppointmentStatus @default(CONFIRMED)
  googleEventId  String?

  client       User         @relation(fields: [clientId], references: [id])
  professional Professional @relation(fields: [professionalId], references: [id])
  service      Service      @relation(fields: [serviceId], references: [id])
  payment      Payment?
  review       Review?
}

enum AppointmentStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Payment {
  id            String        @id @default(uuid())
  appointmentId String        @unique
  amount        Float
  providerRef   String?
  status        PaymentStatus @default(PENDING)
  paidAt        DateTime?

  appointment Appointment @relation(fields: [appointmentId], references: [id])
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

model Review {
  id            String   @id @default(uuid())
  appointmentId String   @unique
  clientId      String
  rating        Int
  comment       String?
  createdAt     DateTime @default(now())

  appointment Appointment @relation(fields: [appointmentId], references: [id])
  client      User        @relation(fields: [clientId], references: [id])
}

model Notification {
  id      String    @id @default(uuid())
  userId  String
  type    String
  message String
  sent    Boolean   @default(false)
  sentAt  DateTime?

  user User @relation(fields: [userId], references: [id])
}
