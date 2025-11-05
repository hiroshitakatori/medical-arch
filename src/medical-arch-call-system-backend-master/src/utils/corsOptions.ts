const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    "http://192.168.1.76:3000",
    "http://192.168.1.76:3001",
    "http://194.233.85.136:3000",
    "http://194.233.85.136:3001",
    "http://194.233.85.136:3002",
    "http://callsystem.elaunchinfotech.in",
    "https://callsystem.elaunchinfotech.in",
    "http://192.168.1.186:3000",
    "http://192.168.1.186:3001",
    "http://192.168.1.186:3002",
    "http://medical-arch.com",
    "https://medical-arch.com",
    "http://facility.medical-arch.com",
    "https://facility.medical-arch.com",
    "http://medical-arch.com/api",
    "https://medical-arch.com/api",
    "http://103.3.188.81:3000",
    "http://103.3.188.81:3001",
    "http://103.3.188.81:3002"

];

const corsOptions = {
    //origin:'*',
    origin: (origin: any, callback: Function) => {
        // console.log(allowedOrigins.indexOf(origin),origin);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // console.log('iiii');
            callback(null, true)
        } else {
            // console.log('not cors');
            callback(new Error('Not allowed by CORS'));

        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions;