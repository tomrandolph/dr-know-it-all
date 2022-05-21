import { RedisClientType } from '@redis/client';
import {createClient} from 'redis'

let client: RedisClientType | null = null;

export async function getClient(){
  if(client == null) {
    client = createClient({password: process.env.REDIS_PW, url: process.env.REDIS_URL});
    await client.connect();

  }
  return client;
}