import { RedisClientType } from '@redis/client';
import {createClient} from 'redis'

let client: RedisClientType | null = null;

export async function getClient(){
  if(client == null) {
    client = createClient();
    await client.connect();

  }
  return client;
}