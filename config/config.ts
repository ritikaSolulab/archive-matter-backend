class config {
  port!: number;
  host!: string;
  dbConnection!: string;
  JWT_SECRET!: string;
  IV!: string;
  AUTH_ALGO!: string;
  REDIS!: any;
  gmail?: any;;
  constructor() {
    this.port = Number(process.env.PORT) || 5000;
    this.host = process.env.HOST || "localhost";
    this.JWT_SECRET = process.env.JWT_SECRET || "secret";
    this.dbConnection = config.getDbConnectionUrl() || "";
    this.IV = process.env.IV || "5183666c72eec9e4";
    this.AUTH_ALGO = process.env.AUTH_ALGO || "aes-256-ctr";
    this.REDIS = {
      tlsFlag: false,
      urlTls: '',
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
      tls: false,
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    }
    this.gmail = {
      user: process.env.GMAIL_USER || '',
      pass: process.env.GMAIL_PASS || '',
      from: process.env.GMAIL_From || '',
    }
  }

  static getDbConnectionUrl() {
    let url = process.env.DBCONNECT_URL || "mongodb://127.0.0.1:27017/";
    if (process.env.NODE_ENV === "test") {
      return `${url}test-development`;
    }
    return `${url}${process.env.DBNAME}`;
  }
}

export default new config();
