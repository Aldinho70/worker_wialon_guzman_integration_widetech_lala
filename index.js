import cron from 'node-cron';
import getInfoDevices from './src/api/wialon.js';
import { destructWialon } from './src/utils/utils.js';
import { APIWideTech } from './src/api/Widetech.js';

const api_widetech = new APIWideTech();

const app = async () => {
  try {

    const response_login = await api_widetech.loginUser({
      strLogin: process.env.USER_WIDETECH,
      strPassword: process.env.PWD_WIDETECH,
      intLang: 1
    })

    const data = await getInfoDevices();
    const devices = destructWialon(data);
    const response_sendLocation = await api_widetech.sendLocation( response_login.data, devices )
    console.table(response_sendLocation);

    // console.table(devices);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

app();
// Ejecutar cada minuto
cron.schedule('* * * * *', async () => {
  await app();
});