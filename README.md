## Simple JWT Auth With TRPC prisma & next

A sample JWT authentication using prisma, @trpc/server @trpc/client @trpc/react in Next.js

### Simple Usage

copy .env.example > .env

In this case i use "pnpm" for now i'm not sure that with other package manager can work. so
install "pnpm" first

```bash
$_ npm -g i pnpm
```

Follow instruction

```bash
$_ git clone https://github.com/arisris/freegb.git
$_ cd freegb
$_ pnpm install
$_ pnpm prisma migrate dev
$_ pnpm prisma migrate reset
$_ pnpm dev
```

After this you already have some seed data in DATABASE

Test login at http://localhost:3000/login

email: admin@example.net
password: password123

Trpc server located at http://localhost:3000/api/trpc

Thats it. Thankyou

### TODO
?

### Links

[My Homepage](https://arisris.com/)