const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-pizza-dark mb-8">Contact Now</h2>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-pizza-dark mb-4">Write Us</h3>
                <div className="flex gap-3">
                  <a href="https://api.whatsapp.com/send?phone=51123456789&text=Hello, more information!" target="_blank" rel="noopener noreferrer" className="text-green-500 text-2xl hover:text-green-600">
                    📱
                  </a>
                  <a href="https://m.me/bedimcode" target="_blank" rel="noopener noreferrer" className="text-blue-500 text-2xl hover:text-blue-600">
                    💬
                  </a>
                  <a href="https://t.me/telegram" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-2xl hover:text-blue-500">
                    ✈️
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-pizza-dark mb-4">Delivery</h3>
                <address className="text-gray-600 not-italic">
                  +00-987-7654-321 <br />
                  +11-012345
                </address>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-pizza-dark mb-4">Location</h3>
                <address className="text-gray-600 not-italic mb-3">
                  Lima - Sun City - Peru <br />
                  Av. Moon #4321
                </address>
                <a href="https://maps.app.goo.gl/MAmMDxUBFXBSUzLH7" target="_blank" rel="noopener noreferrer" className="text-pizza-orange hover:text-orange-600 flex items-center gap-2">
                  📍 <span>View On Map</span>
                </a>
              </div>
            </div>
          </div>

          <div className="relative">
            <img src="/assets/img/contact-img.png" alt="Contact" className="w-full max-w-md mx-auto" />
            
            <img src="/assets/img/sticker-tomato.svg" alt="Tomato" className="absolute top-4 left-4 w-12 h-12" />
            <img src="/assets/img/sticker-mushroom.svg" alt="Mushroom" className="absolute top-8 right-8 w-10 h-10" />
            <img src="/assets/img/sticker-onion.svg" alt="Onion" className="absolute bottom-8 left-8 w-8 h-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;