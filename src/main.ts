import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);

    AppDataSource.initialize()
        .then(() => {
            // here you can start to work with your database
        })
        .catch((error) => console.log(error));
}
bootstrap();
