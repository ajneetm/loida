// Location section
export default function MembershipSection() {
  return (
    <section id="location" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-blue-600 text-xs tracking-[0.3em] uppercase font-semibold mb-4">Find Us</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#022269] mb-4">Our Location</h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            We are based in the heart of London, UK — with our programs reaching individuals and organisations across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Map embed */}
          <div className=" overflow-hidden shadow-md border border-gray-200 h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4267390019636!2d-0.15715!3d51.52093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761acf2e2d6e21%3A0x1d0c19cfd8c3df49!2s83%20Baker%20St%2C%20London%20W1U%206AG!5e0!3m2!1sen!2suk!4v1710000000000!5m2!1sen!2suk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info cards */}
          <div className="space-y-5">
            {[
              {
                icon: '📍',
                title: 'Address',
                lines: ['83 Baker Street', 'London, W1U 6AG', 'United Kingdom'],
              },
              {
                icon: '📞',
                title: 'Phone',
                lines: ['+44 8000 608 703'],
              },
              {
                icon: '✉️',
                title: 'Email',
                lines: ['info@loidabritish.com'],
              },
              {
                icon: '🕐',
                title: 'Office Hours',
                lines: ['Monday – Friday: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 2:00 PM'],
              },
            ].map(item => (
              <div key={item.title} className="flex gap-4 bg-white  p-5 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50  flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-[#022269] mb-1">{item.title}</p>
                  {item.lines.map(l => (
                    <p key={l} className="text-gray-500 text-sm">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
