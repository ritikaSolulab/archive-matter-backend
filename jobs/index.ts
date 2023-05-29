import timeLog from "./timeLog.cron";
import { CronJob } from "cron";

class Jobs {
    timeCron: CronJob;
    
    constructor() {
        this.timeCron = new CronJob('* * * * *', timeLog.init);
            
        // start all cron jobs
        this.timeCron.start()
    }
}

export default Jobs;