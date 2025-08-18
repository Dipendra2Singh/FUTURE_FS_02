import { ingredients } from '../data/pizzaData';

const Recipe = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-pizza-dark leading-tight text-center mb-12">
          Fresh And <br /> Natural Ingredients
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid gap-6">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-pizza-light rounded-lg">
                <img src={ingredient.image} alt={ingredient.name} className="w-16 h-16" />
                <div>
                  <h3 className="text-xl font-semibold text-pizza-dark mb-2">{ingredient.name}</h3>
                  <p className="text-gray-600">{ingredient.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <img src="/assets/img/recipe-img.png" alt="Recipe" className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recipe;