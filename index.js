import cron from 'node-cron';
import getInfoDevices from './src/api/wialon.js';
import { destructWialon } from './src/utils/utils.js';

const app = async () => {
  try {
    const data = await getInfoDevices();
    const devices = destructWialon(data);

    console.table(devices);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

app();
// Ejecutar cada minuto
cron.schedule('* * * * *', async () => {
  await app();
});