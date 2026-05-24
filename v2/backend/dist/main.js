"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const port = process.env.PORT ?? 5000;
    await app.listen(port);
    console.log(`=========================================`);
    console.log(` Revora v2 NestJS Backend booting...`);
    console.log(` Listening on: http://localhost:${port}`);
    console.log(`=========================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map