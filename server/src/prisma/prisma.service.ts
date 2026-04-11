import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // Pass the adapter instead of the 'datasources' object
    super({ adapter });
  }
  async onModuleInit() {
    // Connect to the database when the module initializes
    await this.$connect();
  }

  async onModuleDestroy() {
    // Disconnect when the module is destroyed
    await this.$disconnect();
  }
}