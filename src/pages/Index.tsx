
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileUp, BarChart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-muted to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  <span className="text-primary">Optimize</span> Your Crop Yields with AI
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  YieldVision uses advanced machine learning to help farmers maximize productivity, 
                  predict crop yields, and make data-driven decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {isAuthenticated ? (
                    <Link to="/predict">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto">
                        Sign Up Now
                      </Button>
                    </Link>
                  )}
                  <Link to="#how-it-works">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:pr-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-lg overflow-hidden shadow-xl"
                >
                  <img
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                    alt="Farm field with data overlay"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <p className="font-semibold">Real-time data analysis from your fields</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-16 bg-farm-pattern">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold">How YieldVision Works</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Our platform provides powerful tools for agricultural prediction and analysis
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Data</h3>
                <p className="text-muted-foreground">
                  Upload environmental and soil datasets in CSV format to train our models for your specific land and crops.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Predictions</h3>
                <p className="text-muted-foreground">
                  Enter soil parameters and environmental factors to receive accurate crop yield predictions powered by ML.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visualize Results</h3>
                <p className="text-muted-foreground">
                  Explore interactive charts and visualizations that explain the factors affecting your crop yields.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Optimize Your Yields?</h2>
            <p className="mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Join farmers across the globe who are using data-driven insights to increase productivity and sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/predict">
                  <Button size="lg" variant="secondary">
                    Start Predicting
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" variant="secondary">
                    Create Free Account
                  </Button>
                </Link>
              )}
              <Link to="/visualize">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
                  View Demo Visualizations
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2025 YieldVision. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
