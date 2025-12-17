import HeroMain from '../components/Hero_main-page';
import OurButton from '../components/UniversalButton';
import "./styles/home.css";

const Home = () => {

  return (
      <>
      <HeroMain />
      <section className="how-wrapper">
        <h2 className="title">Βρες Κτηνίατρο εύκολα και γρήγορα</h2>

        <div className="steps">
          <div className="step">
            <div className="icon">🔍</div>
            <p>Βρες τον κτηνίατρο που ταιριάζει ακριβώς στις ανάγκες σου!</p>
          </div>

          <div className="step">
            <div className="icon">📅</div>
            <p>Δες τη διαθεσιμότητα του και κλείσε ραντεβού online!</p>
          </div>

          <div className="step">
            <div className="icon">👤✔️</div>
            <p>Το κατοικίδιό σου έχει άμεση φροντίδα σε κτηνίατρο!</p>
          </div>

          <div className="line" />
        </div>

        <OurButton text="Αναζήτηση Κτηνιάτρου" path="/search" bgColor="#b0c679ff" textColor='#ffffff' />
      </section>

      </>
  );
}

export default Home;

