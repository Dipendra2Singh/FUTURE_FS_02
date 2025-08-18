const Home = () => {
  return (
    <section id="home" className="pt-20 pb-16 bg-pizza-light">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-pizza-dark leading-tight">
            Crispy And <br /> Delicious Pizzas
          </h1>
          
          <p className="text-gray-600 text-lg">
            Order the best pizzas to end your hunger and make your family moments more memorable, place your order now.
          </p>
          
          <a 
            href="#products" 
            className="inline-block bg-pizza-orange text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            Order Pizza Now
          </a>
          
          <div className="relative">
            <img src="/assets/img/sticker-pizza.svg" alt="Pizza Sticker" className="absolute -top-4 -right-4 w-16 h-16" />
            <img src="/assets/img/sticker-leaf.svg" alt="Leaf Sticker" className="absolute top-8 -left-8 w-12 h-12" />
          </div>
        </div>

        <div className="relative">
          <img src="/assets/img/home-pizza.png" alt="Pizza" className="w-full max-w-md mx-auto relative z-10" />
          <img src="/assets/img/home-board.png" alt="Board" className="absolute inset-0 w-full max-w-md mx-auto" />
          
          <img src="/assets/img/home-leaf-1.png" alt="Leaf" className="absolute top-4 left-4 w-8 h-8 animate-bounce" />
          <img src="/assets/img/home-leaf-2.png" alt="Leaf" className="absolute top-8 right-8 w-6 h-6 animate-bounce delay-100" />
          <img src="/assets/img/home-pepperoni.png" alt="Pepperoni" className="absolute bottom-16 left-8 w-6 h-6 animate-bounce delay-200" />
          <img src="/assets/img/home-mushroom.png" alt="Mushroom" className="absolute bottom-8 right-16 w-8 h-8 animate-bounce delay-300" />
          <img src="/assets/img/home-olive.png" alt="Olive" className="absolute top-1/2 left-2 w-4 h-4 animate-bounce delay-400" />
          <img src="/assets/img/home-tomato.png" alt="Tomato" className="absolute top-1/3 right-4 w-6 h-6 animate-bounce delay-500" />
        </div>
      </div>
    </section>
  );
};

export default Home;