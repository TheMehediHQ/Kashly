"use client";

export function HomePageClient() {
  return (
    <main className="flex-1 w-full bg-(--background) text-(--foreground) transition-colors duration-300">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-40 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8">
            Manage Your Money
          </h1>
          <p className="text-lg md:text-xl text-(--muted-foreground) mb-12 max-w-2xl mx-auto">
            Simple and effective money management - track expenses, set budgets, and achieve financial goals
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-24 px-4 border-t border-(--border)">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            {/* Money Management */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Core Financial Tracking</h3>
              <ul className="space-y-2 text-(--muted-foreground)">
                <li>Track income and expenses with accuracy</li>
                <li>Review categorized transaction history</li>
                <li>Measure monthly and yearly performance</li>
                <li>Maintain a clear financial overview</li>
              </ul>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Secure and Dependable</h3>
              <ul className="space-y-2 text-(--muted-foreground)">
                <li>Protected authentication and session handling</li>
                <li>Security-first backend architecture</li>
                <li>Straightforward interface for daily use</li>
                <li>Built for consistent long-term tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why MoneyFlow Section */}
      <section className="w-full py-20 md:py-24 px-4 border-t border-(--border)">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose MoneyFlow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-(--card-bg)">
              <h3 className="text-lg font-semibold mb-3">Simple Tracking</h3>
              <p className="text-(--muted-foreground)">
                Record daily transactions quickly and keep every financial movement visible.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-(--card-bg)">
              <h3 className="text-lg font-semibold mb-3">Budget Discipline</h3>
              <p className="text-(--muted-foreground)">
                Define spending limits and stay aligned with your monthly financial targets.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-(--card-bg)">
              <h3 className="text-lg font-semibold mb-3">Trusted Platform</h3>
              <p className="text-(--muted-foreground)">
                Your financial data remains private, protected, and managed with care.
              </p>
            </div>
          </div>
        </div>
      </section>

   
    </main>
  );
}
