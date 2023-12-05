import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
/*
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'mssql',
                host: config.getOrThrow('SQL_HOST'),
                port: config.getOrThrow('SQL_PORT'),
                username: config.getOrThrow('SQL_USERNAME'),
                password: config.getOrThrow('SQL_PASSWORD'),
                database: config.getOrThrow('SQL_DATABASE'),
                synchronize: config.getOrThrow('SQL_SYNCHRONIZE'),
                autoLoadEntities: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
*/
