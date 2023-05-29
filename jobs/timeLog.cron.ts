import { info } from '../config/logger';

class timeLog {
    static async init () {
        info(`time log cron executed ${new Date}`);
    }
}

export default timeLog