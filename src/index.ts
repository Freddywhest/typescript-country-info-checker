import express, { Application, Request, Response, NextFunction } from 'express';
import Countries, { CountryItems } from 'countries-capitals';
import cors from 'cors';
import validateInputs from './controllers/validateInputs';


const app: Application = express();
const PORT:number = 5004


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req: Request, res:Response) => {
    
    res.render('index', { title: "Home Page" })
});

app.post('/country', validateInputs, (req: Request, res: Response) => {
    const { country } = req.body;
    const countries: Countries = new Countries();
    const result = countries.byName(country);
    res.send(result);
    
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
    
})


