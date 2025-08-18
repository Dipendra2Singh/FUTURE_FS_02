const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-pizza-dark leading-tight">
            Learn More About <br /> Our History
          </h2>
          
          <p className="text-gray-600 text-lg">
            The secret to success is the best ingredients to make a better pizza. Today we strive for perfection, just as we have been doing for 15 years when we first opened the pizzeria in Lima - Peru.
          </p>
          
          <a 
            href="#popular" 
            className="inline-block bg-pizza-orange text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            The Best Pizzas
          </a>
          
          <img src="/assets/img/sticker-cheese.svg" alt="Cheese Sticker" className="absolute w-16 h-16 -mt-8 ml-64" />
        </div>

        <div className="relative">
          <img src="/assets/img/about-img.png" alt="About Pizza" className="w-full max-w-md mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default About;