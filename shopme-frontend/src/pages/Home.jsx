import Header from '../components/Header';
import HomeSection from '../components/Home';
import About from '../components/About';
import Popular from '../components/Popular';
import Recipe from '../components/Recipe';
import Products from '../components/Products';
import Search from '../components/Search';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <HomeSection />
        <About />
        <Popular />
        <Recipe />
        <Products />
        <Search />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;