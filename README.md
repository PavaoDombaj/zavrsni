# Bookly - Web Aplikacija za Rezervaciju Termina u Salonima

## Završni rad
**Autor:** Pavao Dombaj, 4b, Tehničar za računalstvo  
**Škola:** OBSKC

## Pregled
Bookly je sveobuhvatna web aplikacija dizajnirana za rezervaciju termina u kozmetičkim i wellness salonima. Ovaj projekt je razvijen kao moj završni rad, demonstrirajući moje vještine u full-stack web razvoju.

## Funkcionalnosti
- **Korisnička autentifikacija**: Siguran sustav za prijavu i registraciju
- **Upravljanje salonima**: Kreiranje, ažuriranje i upravljanje profilima salona
- **Upravljanje uslugama**: Dodavanje, uređivanje i uklanjanje usluga koje nude saloni
- **Rezervacija termina**: Intuitivno sučelje za klijente za rezervaciju termina
- **Upravljanje djelatnicima**: Dodjeljivanje djelatnika salonima i upravljanje njihovim rasporedima
- **Admin sučelje**: Sveobuhvatna admin ploča za upravljanje sustavom
- **Responzivni dizajn**: Radi na desktop i mobilnim uređajima

## Tehnologije

### Frontend
- React.js s Vite
- Tailwind CSS za stiliziranje
- React Router za navigaciju
- Razne React biblioteke (react-calendar, react-datepicker, itd.)

### Backend
- Node.js s Express
- MongoDB s Mongoose za upravljanje bazom podataka
- JWT za autentifikaciju
- bcrypt.js za hashiranje lozinki

## Pokretanje projekta

### Preduvjeti
- Node.js (v14 ili noviji)
- MongoDB

### Instalacija

1. Klonirajte repozitorij
```
git clone https://github.com/PavaoDombaj/zavrsni.git
cd zavrsni
```

2. Instalirajte backend ovisnosti
```
cd backend
npm install
```

3. Instalirajte frontend ovisnosti
```
cd ../frontend
npm install
```

4. Kreirajte `.env` datoteku u backend direktoriju sa sljedećim varijablama:
```
MONGO_URI=vaš_mongodb_connection_string
JWT_SECRET=vaš_jwt_secret
PORT=8800
```

5. Pokrenite frontend i backend istovremeno
```
cd frontend
npm run start:both
```

## Status projekta
Ovaj projekt je razvijen kao dio mog završnog rada. Iako je funkcionalan, postoje neki poznati bugovi i područja za poboljšanje. Ponosan sam na ono što sam postigao s ovim projektom i planiram popraviti preostale probleme te potencijalno objaviti dotjeraniju verziju u budućnosti.

## Buduća poboljšanja
- Popravak poznatih bugova u sustavu rezervacija
- Poboljšanje responzivnosti za mobilne uređaje
- Dodavanje email obavijesti za rezervacije
- Implementacija sustava ocjenjivanja i recenzija
- Poboljšanje sigurnosnih značajki

## Autor
- **Pavao Dombaj** - [PavaoDombaj](https://github.com/PavaoDombaj)
