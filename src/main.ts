import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DbPopulateService } from './app/providers/dbPopulate.service';
import 'reflect-metadata';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'log'],
        cors: true,
    });
    await app.listen(3000);
    const dbPopulateService = app.get(DbPopulateService);
    await dbPopulateService.populate();
    console.log('It works');

    // AppDataSource.initialize()
    //     .then(() => {
    //         // here you can start to work with your database
    //     })
    //     .catch((error) => console.log(error));
}
bootstrap();
